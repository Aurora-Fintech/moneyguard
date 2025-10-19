import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import styles from "./CurrencyTab.module.css";
import { fetchCurrencyRates } from "../../features/currency/currencyOperations.js";

const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

const selectCurrencyRates = (state) => state.currency.rates;
const selectIsLoading = (state) => state.currency.isLoading;


const CurrencyTab = () => {
  const dispatch = useDispatch();
  const rates = useSelector(selectCurrencyRates);
  const isLoading = useSelector(selectIsLoading);


  const isAuthenticated = useSelector(selectIsAuthenticated); 


  useEffect(() => {
    if (isAuthenticated) { 
      dispatch(fetchCurrencyRates());
    }
  }, [dispatch, isAuthenticated]);

  const filteredRates = (rates || []).filter(
    (rate) =>
      (rate.currencyCodeA === 840 || rate.currencyCodeA === 978) &&
      rate.currencyCodeB === 980
  );

  const formatRate = (rate) => {
    return rate !== null && rate !== undefined && !isNaN(rate)
      ? Number(rate).toFixed(2)
      : "N/A";
  };


  if (isLoading && filteredRates.length === 0) {
    return (
      <div className={styles.currencyLoading}>
        <RefreshCw size={32} className={styles.loadingIcon} />
        <span>Loading currency rates...</span>
      </div>
    );
  }

  return (
    <div className={styles.currencyTab}>
      <div className={styles.currencyCards}>
        {filteredRates.length > 0 ? (
          <>
            <div className={`${styles.tableHeader} dashboard-txt`}>
              <span className={styles.headerCurrency}>Currency</span>
              <span className={styles.headerPurchase}>Purchase</span>
              <span className={styles.headerSale}>Sale</span>
            </div>
            {filteredRates.map((rate) => (
              <div key={rate.currencyCodeA} className={styles.currencyRow}>
                {/* 1. Sütun: Para Birimi (USD / US Dollar) */}
                <div className={styles.currencyNameContainer}>
                  <span className={styles.currencyCodeRow}>
                    {rate.currencyCodeA === 840 ? "USD" : "EUR"}
                  </span>
                </div>
                <span className={styles.rateValueRow}>
                  {formatRate(rate.rateBuy)}
                </span>
                <span className={styles.rateValueRow}>
                  {formatRate(rate.rateSell)}
                </span>
              </div>
            ))}
          </>
        ) : (
          <div className={styles.currencyLoading}>
            <span>No rates available. Data should load automatically.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyTab;