import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { algoIndexerClient } from "../algorand/config";
import styles from "../css_modules/BuySellStyles.module.css";
import Chart from "./Chart";

const BuySell: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();

  const [currentAssetId, setCurrentAssetId] = useState<number>(Number(assetId));
  const [searchInput, setSearchInput] = useState<string>("");
  const [assetName, setAssetName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"ALGO" | "USD">("ALGO");

  useEffect(() => {
    const fetchAssetInfo = async () => {
      if (!currentAssetId) return;

      setLoading(true);
      try {
        const response = await algoIndexerClient.lookupAssetByID(currentAssetId).do();
        const name =
          response.asset?.params?.unitName ||
          response.asset?.params?.name ||
          `Asset ${currentAssetId}`;
        setAssetName(name);
        setError(null);
      } catch (err) {
        console.error("Error fetching asset info:", err);
        setError("Failed to fetch asset info.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssetInfo();
  }, [currentAssetId]);

  const handleSearch = () => {
    const parsed = Number(searchInput);
    if (!isNaN(parsed)) {
      setCurrentAssetId(parsed);
      navigate(`/best-algo-defi/${parsed}`);
    } else {
      setError("Invalid Asset ID entered.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Token {assetName} (ID: {currentAssetId})
      </h2>

      <div className={styles.searchSection}>
        <input
          type="number"
          placeholder="Enter another Asset ID"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Load Chart
        </button>
      </div>

      <div className={styles.currencyToggle}>
        <button
          className={`${styles.toggleButton} ${currency === "ALGO" ? styles.active : ""}`}
          onClick={() => setCurrency("ALGO")}
        >
          ALGO
        </button>
        <button
          className={`${styles.toggleButton} ${currency === "USD" ? styles.active : ""}`}
          onClick={() => setCurrency("USD")}
        >
          USD
        </button>
      </div>

      {loading ? (
        <p className={styles.status}>Loading asset info...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.chartWrapper}>
          <Chart assetId={currentAssetId} currency={currency} tools />
        </div>
      )}
    </div>
  );
};

export default BuySell;
