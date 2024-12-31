import React, { useEffect, useState } from "react";
import styles from "../css_modules/BestAlgoDefiStyles.module.css";
import tokenData from "../constants/tokenData";
import { FaPlane, FaTruckLoading } from "react-icons/fa";

const stableTVLAssetIDs = tokenData
  .filter((token) => token.stableTVL)
  .map((token) => token.assetID);

const BestAlgoDefi: React.FC = () => {
  const [sortedTokens, setSortedTokens] = useState<
    Array<{
      name: string;
      assetID: string;
      logo: string;
      vestigeLink: string;
      xLink: string;
      stableTVL: boolean;
      totalTVL: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStableTVL = async () => {
      const poolAddresses: { [key: string]: string[] } = {}; // Store multiple addresses per pair
      const poolUSDValues: { [key: string]: number } = {};
      const tokenTVL: { [key: string]: number } = {};
      const processedPairs = new Set(); // Track processed pairKeys to avoid duplicates

      try {
        const assetIDSet = new Set(tokenData.map((t) => t.assetID)); // Efficient assetID lookup

        // Fetch Tinyman and PactFi pools in parallel
        const [tinymanPoolResponses, pactFiPoolResponses] = await Promise.all([
          Promise.all(
            tokenData.map((token) =>
              fetch(
                `https://free-api.vestige.fi/asset/${token.assetID}/pools?include_all=true`
              ).then((res) => res.json())
            )
          ),
          Promise.all(
            tokenData.map((token) =>
              fetch(
                `https://api.pact.fi/api/internal/pools?limit=50&offset=0&search=${token.name}`
              ).then((res) => res.json())
            )
          ),
        ]);

        // Process Tinyman pools
        tokenData.forEach((token, index) => {
          const pools = tinymanPoolResponses[index];

          stableTVLAssetIDs.forEach((stableID) => {
            const pairKey = [token.assetID.toString(), stableID.toString()]
              .sort()
              .join("/");

            const relevantPools = pools.filter(
              (pool: any) =>
                ["T3", "T2", "TM"].includes(pool.provider) &&
                ((pool.asset_1_id === parseInt(token.assetID) &&
                  pool.asset_2_id === parseInt(stableID)) ||
                  (pool.asset_2_id === parseInt(token.assetID) &&
                    pool.asset_1_id === parseInt(stableID)))
            );

            // Collect all addresses for the pair
            if (relevantPools.length > 0) {
              poolAddresses[pairKey] = relevantPools.map(
                (pool: any) => pool.address
              );
            }
          });
        });

        // Process PactFi pools
        tokenData.forEach((token, index) => {
          const pools = pactFiPoolResponses[index]?.results || [];

          pools.forEach((pool: any) => {
            const [asset1, asset2] = pool.assets;
            if (assetIDSet.has(asset1.id) && assetIDSet.has(asset2.id)) {
              const pairKey = [asset1.id.toString(), asset2.id.toString()]
                .sort()
                .join("/");

              if (!processedPairs.has(pairKey)) {
                processedPairs.add(pairKey);
                poolUSDValues[pairKey] =
                  (poolUSDValues[pairKey] || 0) + parseFloat(pool.tvl_usd);
              }
            }
          });
        });

        // Fetch Tinyman USD values
        const usdValuePromises = Object.entries(poolAddresses).map(
          ([pairKey, addresses]) =>
            Promise.all(
              addresses.map((address) =>
                fetch(
                  `https://mainnet.analytics.tinyman.org/api/v1/pools/${address}`
                )
                  .then((res) => res.json())
                  .then((data) => parseFloat(data.liquidity_in_usd) || 0)
                  .catch(() => 0)
              )
            ).then((values) => {
              poolUSDValues[pairKey] =
                (poolUSDValues[pairKey] || 0) +
                values.reduce((sum, value) => sum + value, 0);
            })
        );

        await Promise.all(usdValuePromises);

        // Calculate total TVL for each token
        tokenData.forEach((token) => {
          const tokenPairs = Object.keys(poolUSDValues).filter((pairKey) => {
            const [id1, id2] = pairKey.split("/");
            return (
              id1 === token.assetID.toString() ||
              id2 === token.assetID.toString()
            );
          });

          const totalTVL = tokenPairs.reduce(
            (sum, pairKey) => sum + (poolUSDValues[pairKey] || 0),
            0
          );
          tokenTVL[token.name] = totalTVL;
        });

        // Sort tokens by stable TVL first, then by total TVL
        const sorted = tokenData
          .map((token) => ({
            ...token,
            totalTVL: tokenTVL[token.name] || 0,
          }))
          .sort((a, b) => {
            if (a.stableTVL !== b.stableTVL) {
              return a.stableTVL ? -1 : 1;
            }
            return b.totalTVL - a.totalTVL;
          });

        setSortedTokens(sorted);
      } catch (error) {
        console.error("Error fetching TVL data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStableTVL();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Best AlgoDefi Tokens</h1>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <FaTruckLoading className={styles.loadingIcon} />
          <span className={styles.loadingText}>
            Loading<span className={styles.dots}>..</span>
          </span>
        </div>
      ) : (
        <div className={styles.tokenGrid}>
          {sortedTokens.map((token: any) => (
            <div key={token.name} className={styles.tokenCard}>
              <img
                src={token.logo}
                alt={`${token.name} logo`}
                className={styles.tokenLogo}
              />
              <h3 className={styles.tokenName}>{token.name}</h3>
              <p className={styles.tokenTVL}>
                ASA Thrust TVL ${token.totalTVL.toFixed(2)}
              </p>
              <div className={styles.tokenActions}>
                <a
                  href={`https://vestige.fi/asset/${token.assetID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.vestigeButton}
                >
                  Vestige
                </a>
                <a
                  href={token.xLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.xButton}
                >
                  Follow on X
                </a>
              </div>
              {token.stableTVL && (
                <div className={styles.stableTVL}>
                  <div className={styles.tooltipWrapper}>
                    <FaPlane className={styles.stableTVLIcon} />
                    <span className={styles.tooltipText}>
                      Build LP with this token to rank higher
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestAlgoDefi;
