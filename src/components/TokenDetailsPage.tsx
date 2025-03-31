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

import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  zoomPlugin
);

const TokenDetailsPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<
    { timestamp: number; price: number }[]
  >([]);
  const [alloMetadata, setAlloMetadata] = useState<any>(null);
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

        const [tvlRes, metaRes, searchRes, alloRes] = await Promise.all([
          axios.get(
            `https://free-api.vestige.fi/asset/${assetId}/tvl/simple/7D?currency=USD`
          ),
          axios.get(`https://free-api.vestige.fi/asset/${assetId}`),
          axios.get(
            `https://free-api.vestige.fi/assets/search?query=${assetId}&page=0&page_size=1`
          ),
          axios.get("https://commons.allo.info/api/v1/datasets/metadata"),
        ]);

        const meta = metaRes.data;
        const search = searchRes.data?.[0] || {};
        const tvl = tvlRes.data?.[tvlRes.data.length - 1]?.tvl || 0;

        const circulatingPercent =
          (parseFloat(search.circulating_supply) / parseFloat(search.supply)) *
          100;
        const burnedPercent =
          (parseFloat(search.burned_supply) / parseFloat(search.supply)) * 100;

        const matchedEntry = alloRes.data.entries.find(
          (entry: any) => entry.entry.id.toString() === assetId
        );

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

        setAlloMetadata(matchedEntry?.data || null);
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
    interaction: {
      mode: "index" as
        | "x"
        | "index"
        | "dataset"
        | "point"
        | "nearest"
        | "y"
        | undefined,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: function (context: any) {
            const date = new Date(
              priceHistory[context[0].dataIndex]?.timestamp * 1000
            );
            return date.toLocaleString(); // Full timestamp
          },
          label: function (context: any) {
            return `Price: ${context.parsed.y.toFixed(6)} A`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as "x" | "y" | "xy",
        },
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        limits: {
          x: { min: undefined, max: undefined },
          y: { min: undefined, max: undefined },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 12,
          autoSkip: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: function (tickValue: number | string) {
            const value =
              typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return `${value.toFixed(6)} A`;
          },
        },
        grid: {
          color: "#f3f4f6",
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

      <div className={styles.section}>
        <div className={styles.chartHeader}>
          <label htmlFor="priceInterval">
            <strong>Price Chart Interval:</strong>
          </label>
          <select
            id="priceInterval"
            value={priceInterval}
            onChange={(e) => setPriceInterval(e.target.value)}
            className={styles.chartSelect}
          >
            <option value="1H">1 Hour</option>
            <option value="1D">1 Day</option>
            <option value="7D">7 Days</option>
          </select>
        </div>
        <Line data={priceChartData} options={priceChartOptions} />
      </div>

      {alloMetadata?.pera && (
        <div className={styles.section}>
          <h2 className={styles.subTitle}>Project Info</h2>
          {alloMetadata.pera.icon && (
            <img
              src={alloMetadata.pera.icon}
              alt="Project Icon"
              width={64}
              className={styles.projectIcon}
            />
          )}
          <p>
            <strong>Project:</strong> {alloMetadata.pera.projectName}
          </p>
          <p>
            <strong>Description:</strong> {alloMetadata.pera.projectDescription}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={alloMetadata.pera.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {alloMetadata.pera.projectUrl}
            </a>
          </p>
          {alloMetadata.pera.twitterUsername && (
            <p>
              <strong>Twitter:</strong> @{alloMetadata.pera.twitterUsername}
            </p>
          )}
          {alloMetadata.pera.discordUrl && (
            <p>
              <strong>Discord:</strong>{" "}
              <a
                href={alloMetadata.pera.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join
              </a>
            </p>
          )}
          {alloMetadata.pera.telegramUrl && (
            <p>
              <strong>Telegram:</strong>{" "}
              <a
                href={alloMetadata.pera.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat
              </a>
            </p>
          )}
          {alloMetadata.pera.verificationTier && (
            <p>
              <strong>Tier:</strong> {alloMetadata.pera.verificationTier}
            </p>
          )}
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.subTitle}>Token Stats</h2>
        <div className={styles.statsGrid}>
          <p>
            <strong>Name:</strong> {tokenData?.name}
          </p>
          <p>
            <strong>Asset ID:</strong> {assetID}
          </p>
          <p>
            <strong>Unit Name:</strong> {tokenData?.unitName}
          </p>
          <p>
            <strong>Verified:</strong> {tokenData?.verified ? "✅" : "❌"}
          </p>
          <p>
            <strong>Created at Round:</strong> {tokenData?.createdRound}
          </p>
          <p>
            <strong>Has Clawback:</strong>{" "}
            {tokenData?.hasClawback ? "Yes" : "No"}
          </p>
          <p>
            <strong>Has Freeze:</strong> {tokenData?.hasFreeze ? "Yes" : "No"}
          </p>
          <p>
            <strong>Official URL:</strong>{" "}
            <a href={tokenData?.url} target="_blank" rel="noopener noreferrer">
              {tokenData?.url}
            </a>
          </p>
          <p>
            <strong>Current Price (USD):</strong> $
            {tokenData?.price?.toFixed(6)}
          </p>
          <p>
            <strong>Price Change (24h):</strong> {tokenData?.change?.toFixed(2)}
            %
          </p>
          <p>
            <strong>TVL (7d):</strong> ${tokenData?.tvl?.toFixed(2)}
          </p>
          <p>
            <strong>Trusted TVL:</strong> ${tokenData?.totalTVL?.toFixed(2)}
          </p>
          <p>
            <strong>Full TVL:</strong> ${tokenData?.fullTVL?.toFixed(2)}
          </p>
          <p>
            <strong>Holders:</strong> {tokenData?.holders?.toLocaleString()}
          </p>
          <p>
            <strong>Circulating Supply:</strong>{" "}
            {tokenData?.circulatingPercent?.toFixed(2)}%
          </p>
          <p>
            <strong>Burned Supply:</strong>{" "}
            {tokenData?.burnedPercent?.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailsPage;
