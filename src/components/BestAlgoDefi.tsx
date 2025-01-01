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
      latestPrice?: number; // New field for latest price
      priceChange24H?: number; // 24-hour price change percentage
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [priceChangeInterval, setPriceChangeInterval] = useState("1D");
  const PAGE_SIZE = 10; // Define the page size

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

        const fetchLatestPrices = await Promise.all(
          tokenData.map((token) =>
            fetch(
              `https://free-api.vestige.fi/asset/${token.assetID}/price?currency=usd`
            )
              .then((res) => res.json())
              .then((data) => ({
                assetID: token.assetID,
                price: parseFloat(data.price || 0),
              }))
              .catch(() => ({ assetID: token.assetID, price: 0 }))
          )
        );

        const fetchPriceChangePromises = tokenData.map((token) => {
          return fetch(
            `https://free-api.vestige.fi/asset/${token.assetID}/prices/simple/${priceChangeInterval}`
          )
            .then((res) => res.json())
            .then((priceData: Array<{ timestamp: number; price: number }>) => {
              if (!priceData || priceData.length === 0) {
                return { assetID: token.assetID, change: 0 };
              }

              // Find the earliest and latest prices in the response
              const startPrice = priceData[0]?.price || 0; // First price (earliest timestamp)
              const endPrice = priceData[priceData.length - 1]?.price || 0; // Last price (latest timestamp)

              // Calculate percentage change
              const change =
                startPrice > 0
                  ? ((endPrice - startPrice) / startPrice) * 100
                  : 0;

              return { assetID: token.assetID, change };
            })
            .catch(() => ({ assetID: token.assetID, change: 0 })); // Fallback in case of errors
        });

        const priceChanges = await Promise.all(fetchPriceChangePromises);

        const latestPrices = fetchLatestPrices.reduce(
          (acc: { [key: string]: number }, curr) => {
            acc[curr.assetID] = curr.price;
            return acc;
          },
          {}
        );

        const priceChangesMap = priceChanges.reduce(
          (acc: { [key: string]: number }, curr) => {
            acc[curr.assetID] = curr.change;
            return acc;
          },
          {}
        );

        const sorted = tokenData
          .map((token) => ({
            ...token,
            totalTVL: tokenTVL[token.name] || 0,
            latestPrice: latestPrices[token.assetID] || 0,
            priceChange24H: priceChangesMap[token.assetID] || 0,
          }))
          .sort((a, b) => {
            if (a.stableTVL !== b.stableTVL) {
              return a.stableTVL ? -1 : 1;
            }
            return b.totalTVL - a.totalTVL;
          });

        setSortedTokens(sorted);
      } catch (error) {
        console.error("Error fetching TVL and price data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStableTVL();
  }, [priceChangeInterval]);

  const totalPages = Math.ceil(sortedTokens.length / PAGE_SIZE);

  const displayedTokens = sortedTokens.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Best AlgoDefi Tokens</h1>
      <div className={styles.intervalFilterContainer}>
        <label htmlFor="intervalSelector">Select Price Change Interval:</label>
        <select
          id="intervalSelector"
          value={priceChangeInterval}
          onChange={(e) => setPriceChangeInterval(e.target.value)}
          className={styles.intervalSelector}
        >
          <option value="1H">1 Hour</option>
          <option value="1D">1 Day</option>
          <option value="7D">7 Day</option>
        </select>
      </div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <FaTruckLoading className={styles.loadingIcon} />
          <span className={styles.loadingText}>
            Loading<span className={styles.dots}>....</span>
          </span>
        </div>
      ) : (
        <>
          <div className={styles.tokenTable}>
            <div className={styles.tokenRowHeader}>
              <div className={styles.tokenCell}>Logo</div>
              <div className={styles.tokenCell}>Name</div>
              <div className={styles.tokenCell}>ASA Thrust TVL</div>
              <div className={styles.tokenCell}>Latest Price</div>
              <div className={styles.tokenCell}> {priceChangeInterval} Change</div>
              <div className={styles.tokenCell}>Links</div>
            </div>
            {displayedTokens.map((token: any) => (
              <div key={token.name} className={styles.tokenRow}>
                <div className={styles.tokenCell}>
                  <img
                    src={token.logo}
                    alt={`${token.name} logo`}
                    className={styles.tokenLogo}
                  />
                </div>
                <div className={styles.tokenCell}>
                  {token.name}
                  <div className={styles.tokenNameLogo}>
                    <FaPlane />
                  </div>
                </div>
                <div className={styles.tokenCell}>
                  ${token.totalTVL.toFixed(2)}
                </div>
                <div className={styles.tokenCell}>
                  ${token.latestPrice.toFixed(6)}
                </div>
                <div className={styles.tokenCell}>
                  <div
                    style={{
                      color:
                        token.priceChange24H > 0
                          ? "green"
                          : token.priceChange24H < 0
                          ? "red"
                          : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {token.priceChange24H > 0 ? "+" : ""}
                    {token.priceChange24H?.toFixed(2)}%
                  </div>
                </div>

                <div className={styles.tokenCell}>
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
                </div>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BestAlgoDefi;
