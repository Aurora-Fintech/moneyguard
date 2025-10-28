import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Balance.module.css";
import { fetchTryTimeseries } from "../../api/fiatApi.js";
import { fetchKlines } from "../../api/cryptoApi.js";

const selectTotalBalance = (state) => state.transactions?.balance;

// para birimi için
const formatBalance = (amount) => {
  const validAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(validAmount);
};

const Balance = () => {
  const totalBalance = Number(useSelector(selectTotalBalance)) || 0;

  const [rates, setRates] = useState({
    usdTry: null,
    eurTry: null,
    btcUsd: null,
    goldUsd: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Fetch USD/TRY and EUR/TRY (daily)
        const rows = await fetchTryTimeseries(2);
        const last = rows[rows.length - 1] || {};
        const usdTry = typeof last.USDTRY === "number" ? last.USDTRY : null;
        const eurTry = typeof last.EURTRY === "number" ? last.EURTRY : null;

        // Fetch BTC/USDT last close (approx USD)
        let btcUsd = null;
        try {
          const btc = await fetchKlines("BTCUSDT", "1h", 1);
          btcUsd = btc?.[0]?.close ?? null;
        } catch (_) {}

        // Fetch Gold via PAXGUSDT (1 oz ~ gold)
        let goldUsd = null;
        try {
          const paxg = await fetchKlines("PAXGUSDT", "1h", 1);
          goldUsd = paxg?.[0]?.close ?? null;
          if (!goldUsd) {
            const xaut = await fetchKlines("XAUTUSDT", "1h", 1);
            goldUsd = xaut?.[0]?.close ?? null;
          }
        } catch (_) {}

        if (mounted) setRates({ usdTry, eurTry, btcUsd, goldUsd, loading: false });
      } catch (e) {
        if (mounted) setRates((s) => ({ ...s, loading: false }));
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const fmt = (n, opts = { digits: 2 }) => {
    if (!Number.isFinite(n)) return "-";
    return n.toLocaleString(undefined, { minimumFractionDigits: opts.digits, maximumFractionDigits: opts.digits });
  };

  const usdAmount = rates.usdTry ? totalBalance / rates.usdTry : null;
  const eurAmount = rates.eurTry ? totalBalance / rates.eurTry : null;
  const btcAmount = rates.usdTry && rates.btcUsd ? (totalBalance / rates.usdTry) / rates.btcUsd : null;
  const goldAmount = rates.usdTry && rates.goldUsd ? (totalBalance / rates.usdTry) / rates.goldUsd : null; // oz

  return (
    <div className={styles.balanceContainer}>
      <p className={styles.dashboardBalanceTxt}>YOUR BALANCE</p>
      <div className="dashboard-value">{formatBalance(totalBalance)}</div>

      <div className={styles.subRates} aria-label="Converted balances">
        <span className={`${styles.rateItem} ${styles.rateUSD}`}>
          <span className={styles.rateLabel}>USD</span>
          <span className={styles.rateValue}>{fmt(usdAmount, { digits: 2 })}</span>
        </span>
        <span className={styles.sep}>/</span>
        <span className={`${styles.rateItem} ${styles.rateEUR}`}>
          <span className={styles.rateLabel}>EUR</span>
          <span className={styles.rateValue}>{fmt(eurAmount, { digits: 2 })}</span>
        </span>
        <span className={styles.sep}>/</span>
        <span className={`${styles.rateItem} ${styles.rateGOLD}`}>
          <span className={styles.rateLabel}>Gold</span>
          <span className={styles.rateValue}>{fmt(goldAmount, { digits: 4 })}</span>
        </span>
        <span className={styles.sep}>/</span>
        <span className={`${styles.rateItem} ${styles.rateBTC}`}>
          <span className={styles.rateLabel}>BTC</span>
          <span className={styles.rateValue}>{fmt(btcAmount, { digits: 6 })}</span>
        </span>
      </div>
    </div>
  );
};

export default Balance;
