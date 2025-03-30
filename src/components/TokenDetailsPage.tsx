import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../css_modules/TokenDetailsPageStyles.module.css";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const TokenDetailsPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<
    { timestamp: number; price: number }[]
  >([]);
  const [assetID, setAssetID] = useState<string>("");
  const [priceInterval, setPriceInterval] = useState("7D");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const assetId = query.get("assetId");
    setAssetID(assetId || "");

    const fetchTokenData = async () => {
      try {
        if (!assetId) throw new Error("Invalid asset ID");

        const name = query.get("name") || "";
        const logo = query.get("logo") || "";
        const stableTVL = query.get("stableTVL") === "true";
        const totalTVL = parseFloat(query.get("totalTVL") || "0");
        const fullTVL = parseFloat(query.get("fullTVL") || "0");
        const holders = parseInt(query.get("holders") || "0");
        const price = parseFloat(query.get("price") || "0");
        const change = parseFloat(query.get("change") || "0");

        const [tvlRes, metaRes, searchRes] = await Promise.all([
          axios.get(
            `https://free-api.vestige.fi/asset/${assetId}/tvl/simple/7D?currency=USD`
          ),
          axios.get(`https://free-api.vestige.fi/asset/${assetId}`),
          axios.get(
            `https://free-api.vestige.fi/assets/search?query=${assetId}&page=0&page_size=1`
          ),
        ]);

        const meta = metaRes.data;
        const search = searchRes.data?.[0] || {};
        const tvl = tvlRes.data?.[tvlRes.data.length - 1]?.tvl || 0;

        const circulatingPercent =
          (parseFloat(search.circulating_supply) / parseFloat(search.supply)) *
          100;
        const burnedPercent =
          (parseFloat(search.burned_supply) / parseFloat(search.supply)) * 100;

        setTokenData({
          name: name || meta.name,
          unitName: meta.unit_name,
          id: meta.asset_id,
          verified: meta.verified,
          logo,
          price,
          change,
          holders,
          stableTVL,
          totalTVL,
          fullTVL,
          tvl,
          creator: search.creator,
          reserve: search.reserve,
          url: search.url,
          hasClawback: search.has_clawback,
          hasFreeze: search.has_freeze,
          createdRound: search.created_round,
          totalSupply: search.supply,
          circulatingSupply: search.circulating_supply,
          burnedSupply: search.burned_supply,
          circulatingPercent,
          burnedPercent,
          tags: meta.tags || [],
        });
      } catch (err: any) {
        console.error(err);
        setError("Failed to load token stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [location.search]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        if (!assetID) return;
        const res = await axios.get(
          `https://free-api.vestige.fi/asset/${assetID}/prices/simple/${priceInterval}`
        );
        setPriceHistory(res.data || []);
      } catch (err) {
        console.error("Failed to fetch price history", err);
      }
    };

    fetchPriceHistory();
  }, [assetID, priceInterval]);

  const priceChartData = {
    labels: priceHistory.map((p) =>
      new Date(p.timestamp * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: `Price (${priceInterval})`,
        data: priceHistory.map((p) => p.price),
        borderColor: "#0077cc",
        backgroundColor: "rgba(0, 119, 204, 0.1)",
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const priceChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: function (this: any, tickValue: string | number) {
            return `$${tickValue}`;
          },
        },
      },
    },
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Token Details</h1>
      {tokenData?.logo && (
        <img
          src={tokenData.logo}
          alt={`${tokenData.name} logo`}
          className={styles.tokenLogo}
        />
      )}
      <div style={{ marginTop: "2rem" }}>
        <label htmlFor="priceInterval">
          <strong>Price Chart Interval: </strong>
        </label>
        <select
          id="priceInterval"
          value={priceInterval}
          onChange={(e) => setPriceInterval(e.target.value)}
        >
          <option value="1H">1 Hour</option>
          <option value="1D">1 Day</option>
          <option value="7D">7 Days</option>
        </select>
      </div>
      <Line data={priceChartData} options={priceChartOptions} />
      <p className={styles.tokenAttribute}>
        <strong>Name:</strong> {tokenData?.name}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Unit Name:</strong> {tokenData?.unitName}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Asset ID:</strong> {assetID}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Verified:</strong> {tokenData?.verified ? "✅" : "❌"}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Created at Round:</strong> {tokenData?.createdRound}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Has Clawback:</strong> {tokenData?.hasClawback ? "Yes" : "No"}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Has Freeze:</strong> {tokenData?.hasFreeze ? "Yes" : "No"}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Official URL:</strong>{" "}
        <a href={tokenData?.url} target="_blank" rel="noopener noreferrer">
          {tokenData?.url}
        </a>
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Current Price (USD):</strong> ${tokenData?.price?.toFixed(6)}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Price Change (24h):</strong> {tokenData?.change?.toFixed(2)}%
      </p>
      <p className={styles.tokenAttribute}>
        <strong>TVL (7d):</strong> ${tokenData?.tvl?.toFixed(2)}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Trusted TVL:</strong> ${tokenData?.totalTVL?.toFixed(2)}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Full TVL:</strong> ${tokenData?.fullTVL?.toFixed(2)}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Holders:</strong> {tokenData?.holders?.toLocaleString()}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Total Supply:</strong>{" "}
        {Number(tokenData?.totalSupply).toLocaleString()}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Circulating Supply:</strong>{" "}
        {/* {Number(tokenData?.circulatingSupply).toLocaleString()} ( */}
        {tokenData?.circulatingPercent?.toFixed(2)}%{/* ) */}
      </p>
      <p className={styles.tokenAttribute}>
        <strong>Burned Supply:</strong>{" "}
        {/* {Number(tokenData?.burnedSupply).toLocaleString()} ( */}
        {tokenData?.burnedPercent?.toFixed(2)}%{/* ) */}
      </p>
    </div>
  );
};

export default TokenDetailsPage;
