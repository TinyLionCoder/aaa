import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../css_modules/TokenDetailsPageStyles.module.css";
import axios from "axios";

const TokenDetailsPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const assetId = query.get("assetId");

    const fetchTokenData = async () => {
      try {
        if (!assetId) throw new Error("Invalid asset ID");

        // Get query params (fallback if missing)
        const name = query.get("name") || "";
        const logo = query.get("logo") || "";
        const stableTVL = query.get("stableTVL") === "true";
        const totalTVL = parseFloat(query.get("totalTVL") || "0");
        const fullTVL = parseFloat(query.get("fullTVL") || "0");
        const holders = parseInt(query.get("holders") || "0");
        const price = parseFloat(query.get("price") || "0");
        const change = parseFloat(query.get("change") || "0");

        // Fetch supplemental data from Vestige
        const [tvlRes, metaRes, searchRes] = await Promise.all([
          axios.get(`https://free-api.vestige.fi/asset/${assetId}/tvl/simple/7D?currency=USD`),
          axios.get(`https://free-api.vestige.fi/asset/${assetId}`),
          axios.get(`https://free-api.vestige.fi/assets/search?query=${assetId}&page=0&page_size=1`),
        ]);

        const meta = metaRes.data;
        const search = searchRes.data?.[0] || {};
        const tvl = tvlRes.data?.[tvlRes.data.length - 1]?.tvl || 0;

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
      <p><strong>Name:</strong> {tokenData?.name}</p>
      <p><strong>Unit Name:</strong> {tokenData?.unitName}</p>
      <p><strong>Asset ID:</strong> {tokenData?.id}</p>
      <p><strong>Verified:</strong> {tokenData?.verified ? "✅" : "❌"}</p>
      <p><strong>Created at Round:</strong> {tokenData?.createdRound}</p>
      <p><strong>Has Clawback:</strong> {tokenData?.hasClawback ? "Yes" : "No"}</p>
      <p><strong>Has Freeze:</strong> {tokenData?.hasFreeze ? "Yes" : "No"}</p>
      <p><strong>Official URL:</strong> <a href={tokenData?.url} target="_blank" rel="noopener noreferrer">{tokenData?.url}</a></p>
      <p><strong>Current Price (USD):</strong> ${tokenData?.price?.toFixed(6)}</p>
      <p><strong>Price Change (24h):</strong> {tokenData?.change?.toFixed(2)}%</p>
      <p><strong>TVL (7d):</strong> ${tokenData?.tvl?.toFixed(2)}</p>
      <p><strong>Trusted TVL:</strong> ${tokenData?.totalTVL?.toFixed(2)}</p>
      <p><strong>Full TVL:</strong> ${tokenData?.fullTVL?.toFixed(2)}</p>
      <p><strong>Holders:</strong> {tokenData?.holders?.toLocaleString()}</p>
    </div>
  );
};

export default TokenDetailsPage;
