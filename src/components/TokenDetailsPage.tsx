import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../css_modules/TokenDetailsPageStyles.module.css";
import axios from "axios";
import { algoIndexerClient } from "../algorand/config";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ArcElement,
  BarElement,
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  zoomPlugin,
  ArcElement,
  BarElement
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
  const [liquidityPools, setLiquidityPools] = useState<any[]>([]);
  const [txCounts, setTxCounts] = useState<number[]>([]);
  const [txDates, setTxDates] = useState<string[]>([]);
  const [tvlHistory, setTvlHistory] = useState<
    { timestamp: number; tvl: number }[]
  >([]);

  useEffect(() => {
    const generateMockTxData = () => {
      const today = new Date();
      const txs: number[] = [];
      const labels: string[] = [];

      for (let i = 29; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        labels.push(day.toISOString().split("T")[0]);
        txs.push(Math.floor(Math.random() * 1000) + 200); // Random tx count
      }

      setTxDates(labels);
      setTxCounts(txs);
    };

    generateMockTxData();
  }, []);

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

  useEffect(() => {
    const fetchLiquidityPools = async () => {
      if (!assetID) return;

      const poolProviders = ["T2", "T3", "TM"];
      const poolAddresses: string[] = [];
      const enrichedPools: any[] = [];

      try {
        // Step 1: Fetch pools for each provider from Vestige
        const poolData = await Promise.all(
          poolProviders.map(async (provider) => {
            const res = await axios.get(
              `https://free-api.vestige.fi/asset/${assetID}/pools/${provider}`
            );
            return res.data || [];
          })
        );

        const allPools = poolData.flat();

        // Step 2: Filter Tinyman pools with address
        allPools.forEach((pool) => {
          if (pool.address) {
            poolAddresses.push(pool.address);
            enrichedPools.push({
              ...pool,
              provider: `Tinyman ${
                pool.provider === "T2"
                  ? "V1"
                  : pool.provider === "T3"
                  ? "V2"
                  : pool.provider
              }`, // Adjust provider name for V1 and V2
            });
          }
        });

        // Step 3: Fetch USD TVL for Tinyman pools
        const usdLiquidityData = await Promise.all(
          poolAddresses.map((address) =>
            axios
              .get(
                `https://mainnet.analytics.tinyman.org/api/v1/pools/${address}`
              )
              .then((res) => ({
                address,
                usd: parseFloat(res.data?.liquidity_in_usd || "0"),
              }))
              .catch(() => ({ address, usd: 0 }))
          )
        );

        // Step 4: Merge Tinyman TVL
        const poolsWithTVL = enrichedPools.map((pool) => {
          const usdMatch = usdLiquidityData.find(
            (p) => p.address === pool.address
          );
          return {
            ...pool,
            tvl_usd: usdMatch?.usd || 0,
          };
        });

        // Step 5: Fetch PactFi pools separately
        const pactRes = await axios.get(
          `https://api.pact.fi/api/internal/pools?limit=50&offset=0&search=${assetID}`
        );
        const pactPoolsRaw = pactRes.data.results || [];

        const filteredPactPools = pactPoolsRaw
          .filter((pool: any) =>
            pool.assets.some((a: any) => a.id.toString() === assetID)
          )
          .map((pool: any) => ({
            provider: "PactFi",
            address: pool.address,
            asset_1_id: pool.assets[0].id,
            asset_2_id: pool.assets[1].id,
            tvl_usd: parseFloat(pool.tvl_usd || "0"),
          }))
          .filter((pool: any) => pool.tvl_usd > 0);

        // Step 6: Fetch unit names from indexer
        const assetIdsToFetch = new Set<number>();
        poolsWithTVL.forEach((p) => {
          assetIdsToFetch.add(p.asset_1_id);
          assetIdsToFetch.add(p.asset_2_id);
        });
        filteredPactPools.forEach((p: any) => {
          assetIdsToFetch.add(p.asset_1_id);
          assetIdsToFetch.add(p.asset_2_id);
        });

        const assetIdArray = Array.from(assetIdsToFetch);
        const assetNameMap: Record<number, string> = {};

        await Promise.all(
          assetIdArray.map(async (id) => {
            try {
              const res = await algoIndexerClient.lookupAssetByID(id).do();
              assetNameMap[id] =
                res.asset.params["unit-name"] || id?.toString();
            } catch {
              assetNameMap[id] = id?.toString();
            }
          })
        );

        // Step 7: Add unit names to pools
        const poolsWithNames = [...poolsWithTVL, ...filteredPactPools].map(
          (pool) => ({
            ...pool,
            asset_1_unit_name: assetNameMap[pool.asset_1_id] || pool.asset_1_id,
            asset_2_unit_name: assetNameMap[pool.asset_2_id] || pool.asset_2_id,
          })
        );

        // Step 8: Filter and set
        const nonZeroPools = poolsWithNames.filter((p) => p.tvl_usd > 0);
        setLiquidityPools(nonZeroPools);
      } catch (err) {
        console.error("Failed to fetch enriched liquidity pool data", err);
      }
    };

    fetchLiquidityPools();
  }, [assetID]);

  useEffect(() => {
    const fetchTvlHistory = async () => {
      try {
        if (!assetID) return;
        const res = await axios.get(
          `https://free-api.vestige.fi/asset/${assetID}/tvl/simple/30D?currency=usd`
        );
        setTvlHistory(res.data || []);
      } catch (err) {
        console.error("Failed to fetch TVL history", err);
      }
    };

    fetchTvlHistory();
  }, [assetID]);

  const tvlChartData = {
    labels: tvlHistory.map((entry) =>
      new Date(entry.timestamp * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: "TVL (30D)",
        data: tvlHistory.map((entry) => entry.tvl.toFixed(2)), // Ensure 2 decimal places
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.3,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const tvlChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `TVL: $${context.parsed.y.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const txChartData = {
    labels: txDates,
    datasets: [
      {
        label: "Transactions per Day",
        data: txCounts,
        borderColor: "#9333ea",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const txChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Txs: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

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

  const holdersBarData = {
    labels: ["Holders"],
    datasets: [
      {
        label: "Number of Holders",
        data: [tokenData?.holders || 0],
        backgroundColor: ["#3b82f6"],
      },
    ],
  };

  const supplyPieData = {
    labels: ["Circulating %", "Burned %"],
    datasets: [
      {
        data: [
          tokenData?.circulatingPercent || 0,
          tokenData?.burnedPercent || 0,
        ],
        backgroundColor: ["#10b981", "#ef4444"],
        hoverOffset: 6,
      },
    ],
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
        <div className={styles.statsGrid} style={{ marginBottom: "1rem" }}>
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
        </div>
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
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.subTitle}>Token Distribution</h2>
        <div className={styles.statsGrid} style={{ gap: "1rem" }}>
          <div>
            <h3>Holders</h3>
            <Bar data={holdersBarData} />
          </div>
          <div>
            <h3>Supply Breakdown</h3>
            <Pie data={supplyPieData} />
          </div>
          <div>
            <h3>30-Day Transaction Count</h3>
            <Line data={txChartData} options={txChartOptions} />
          </div>
          <div>
            <h3>30-Day TVL History</h3>
            <Line data={tvlChartData} options={tvlChartOptions} />
          </div>
        </div>
      </div>
      {liquidityPools.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.subTitle}>Liquidity Pools</h2>
          <div className={styles.lpScrollBox}>
            <div className={styles.statsGrid}>
              {liquidityPools.map((pool, index) => (
                <div
                  key={index}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    padding: "0.75rem 0",
                  }}
                >
                  <p>
                    <strong>Provider:</strong> {pool.provider}
                  </p>
                  <p>
                    <strong>Asset 1:</strong>{" "}
                    {pool.asset_1_unit_name || pool.asset_1_id}
                  </p>
                  <p>
                    <strong>Asset 2:</strong>{" "}
                    {pool.asset_2_unit_name || pool.asset_2_id}
                  </p>
                  <p>
                    <strong>TVL (USD):</strong> $
                    {parseFloat(pool.tvl_usd || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDetailsPage;
