import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrencyRates } from "../../features/currency/currencyOperations.js";
import styles from "./CurrencyTab.module.css";
import { MOCK_RATES } from "../../features/currency/currencySlice.js";

const CurrencyTab = () => {
  const dispatch = useDispatch();

  const currencyData = useSelector((state) => state.currency.rates);
  const isLoading = useSelector((state) => state.currency.isLoading);

  useEffect(() => {
    dispatch(fetchCurrencyRates());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className={styles.currencyTab}>
        <div className={styles.currencyLoading}>Yükleniyor...</div>
      </div>
    );
  }

  const displayData =
    currencyData && currencyData.length > 0 ? currencyData : MOCK_RATES;

  return (
    <div className={styles.currencyTab}>
      <div className={styles.tableHeader}>
        <span style={{ gridColumn: "1 / 2" }}>Currency</span>
        <span style={{ gridColumn: "2 / 3" }}>Purchase</span>
        <span style={{ gridColumn: "3 / 4" }}>Sale</span>
      </div>

      <div>
        {displayData.map((rate) => (
          <div key={rate.currencyCodeA} className={styles.currencyRow}>
            <span style={{ gridColumn: "1 / 2" }}>
              {rate.currencyCodeA === 840
                ? "USD"
                : rate.currencyCodeA === 978
                ? "EUR"
                : rate.currencyCodeA}
            </span>
            <span style={{ gridColumn: "2 / 3" }}>{rate.rateBuy}</span>
            <span style={{ gridColumn: "3 / 4" }}>{rate.rateSell}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencyTab;
