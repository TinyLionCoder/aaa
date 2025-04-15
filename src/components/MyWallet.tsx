import { useEffect, useState } from "react";
import { algoIndexerClient } from "../algorand/config";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";
import styles from "../css_modules/MyWalletStyles.module.css";
import { Camera, Layers, Sliders, Search, RefreshCw, Info } from "lucide-react";

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

interface Asset {
  assetId: number;
  amount: number;
  name: string;
  unitName: string;
  decimals: number;
  usdValue?: number;
  logoUrl?: string;
  isVerified?: boolean;
  changePercent?: number; // 24h price change
}

interface AssetHistory {
  timestamp: number;
  price: number;
}

interface ChartData {
  [assetId: number]: AssetHistory[];
}

export const MyWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingChart, setLoadingChart] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("usdValue");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [viewMode, setViewMode] = useState<string>("grid"); // grid or table
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [chartData, setChartData] = useState<ChartData>({});
  const [timeRange, setTimeRange] = useState<string>("7d"); // 24h, 7d, 30d
  const [chartType, setChartType] = useState<string>("portfolio"); // portfolio, asset
  const PAGE_SIZE = viewMode === "grid" ? 8 : 10;

  useEffect(() => {
    const appWalletWallet: any = localStorage.getItem("appWallet");

    if (appWalletWallet) {
      setWalletAddress(appWalletWallet);
      fetchAssets(appWalletWallet);
    }
  }, []);

  useEffect(() => {
    const lowerCaseFilter = filter.toLowerCase();
    const filtered = assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(lowerCaseFilter) ||
        asset.unitName.toLowerCase().includes(lowerCaseFilter) ||
        asset.assetId.toString().includes(lowerCaseFilter)
    );
    setFilteredAssets(filtered);
    setCurrentPage(1);
  }, [filter, assets]);

  useEffect(() => {
    sortAssets();
  }, [sortField, sortDirection, filteredAssets]);

  const sortAssets = () => {
    const sorted = [...filteredAssets].sort((a, b) => {
      // Special case for price sorting (calculated field)
      if (sortField === "price") {
        const aPrice = a.usdValue && a.amount ? a.usdValue / a.amount : 0;
        const bPrice = b.usdValue && b.amount ? b.usdValue / b.amount : 0;
        return sortDirection === "asc" ? aPrice - bPrice : bPrice - aPrice;
      }

      // Normal field sorting
      let aValue = a[sortField as keyof Asset];
      let bValue = b[sortField as keyof Asset];

      // Handle undefined values
      if (aValue === undefined) aValue = 0;
      if (bValue === undefined) bValue = 0;

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numeric comparison
      return sortDirection === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    setFilteredAssets(sorted);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending for new sort field
    }
  };

  const fetchAssetDetails = async (assetId: number) => {
    try {
      const assetInfo = await algoIndexerClient.lookupAssetByID(assetId).do();
      return {
        name: assetInfo?.asset.params?.name || "Unknown Asset",
        unitName: assetInfo?.asset.params["unit-name"] || "N/A",
        decimals: assetInfo?.asset.params?.decimals || 0,
      };
    } catch (error) {
      console.error(`Error fetching asset details for ID ${assetId}:`, error);
      return { name: "Unknown Asset", unitName: "N/A", decimals: 0 };
    }
  };

  const fetchPeraVerification = async (assetId: number) => {
    try {
      const response = await fetch(
        `https://mainnet.api.perawallet.app/v1/public/assets/${assetId}`
      );
      const data = await response.json();
      return {
        verified: data.verification_tier === "verified",
        logoUrl: data.logo || null,
      };
    } catch (error) {
      console.error(`Error verifying asset ID ${assetId}:`, error);
      return { verified: false, logoUrl: null };
    }
  };

  const fetchAssetPrice = async (assetId: number) => {
    try {
      const response = await fetch(
        `https://free-api.vestige.fi/asset/${assetId}/price?currency=usd`
      );
      const data = await response.json();
      return {
        price: data.price || 0,
        change: data.price_24h_change || 0,
      };
    } catch (error) {
      console.error(`Error fetching price for asset ID ${assetId}:`, error);
      return { price: 0, change: 0 };
    }
  };

  const fetchTinymanPrice = async (assetId: number) => {
    try {
      const response = await fetch(
        `https://mainnet.api.perawallet.app/v1/public/assets/${assetId}`
      );
      const data = await response.json();
      return {
        price: parseFloat(data.usd_value) || 0,
        change: 0, // Tinyman doesn't provide price change data
      };
    } catch (error) {
      console.error(
        `Error fetching Tinyman price for asset ID ${assetId}:`,
        error
      );
      return { price: 0, change: 0 };
    }
  };

  const fetchAssetHistory = async (assetId: number) => {
    setLoadingChart(true);
    try {
      // Determine time range for chart (in days)
      const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30;

      const response = await fetch(
        `https://free-api.vestige.fi/asset/${assetId}/chart?currency=usd&resolution=day&limit=${days}`
      );
      const data = await response.json();

      // Transform data for chart
      const history = data.map((item: any) => ({
        timestamp: item.timestamp * 1000, // Convert to milliseconds
        price: item.price,
      }));

      setChartData({
        ...chartData,
        [assetId]: history,
      });
    } catch (error) {
      console.error(`Error fetching history for asset ID ${assetId}:`, error);
      // Set empty history if error
      setChartData({
        ...chartData,
        [assetId]: [],
      });
    } finally {
      setLoadingChart(false);
    }
  };

  const formatAmount = (amount: number, decimals: number) => {
    return parseFloat((amount / Math.pow(10, decimals)).toFixed(2));
  };

  const fetchAssets = async (address: string) => {
    try {
      setLoading(true);
      const accountInfo = await algoIndexerClient
        .lookupAccountAssets(address)
        .do();

      const assetPromises = accountInfo.assets.map(async (asset: any) => {
        const { name, unitName, decimals } = await fetchAssetDetails(
          asset["asset-id"]
        );

        const { verified: isVerified, logoUrl } = await fetchPeraVerification(
          asset["asset-id"]
        );
        const isTinymanPool = name.toLowerCase().includes("tinyman");

        let usdPrice = 0;
        let priceChange = 0;

        if (isTinymanPool) {
          const { price, change } = await fetchTinymanPrice(asset["asset-id"]);
          usdPrice = price;
          priceChange = change;
        } else if (isVerified) {
          const { price, change } = await fetchAssetPrice(asset["asset-id"]);
          usdPrice = price;
          priceChange = change;
        }

        if (usdPrice > 0 && name !== "Unknown Asset" && unitName !== "N/A") {
          const amount = formatAmount(asset.amount, decimals);
          const usdValue = parseFloat((amount * usdPrice).toFixed(2));

          return {
            assetId: asset["asset-id"],
            amount,
            name,
            unitName,
            decimals,
            usdValue,
            logoUrl,
            isVerified,
            changePercent: priceChange,
          };
        }

        return null;
      });

      const resolvedAssets = (await Promise.all(assetPromises)).filter(
        (asset) => asset !== null
      ) as Asset[];

      const nonZeroAssets = resolvedAssets.filter((asset) => asset.amount > 0);
      setAssets(nonZeroAssets);
      setFilteredAssets(nonZeroAssets);

      const totalValue = nonZeroAssets.reduce(
        (total, asset) => total + (asset.usdValue || 0),
        0
      );
      setTotalPortfolioValue(totalValue);

      // If we have assets, fetch the first one's history for initial view
      if (nonZeroAssets.length > 0) {
        setSelectedAsset(nonZeroAssets[0]);
        fetchAssetHistory(nonZeroAssets[0].assetId);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshWallet = () => {
    if (walletAddress) {
      fetchAssets(walletAddress);
    }
  };

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    fetchAssetHistory(asset.assetId);
    setChartType("asset");
  };

  const totalPages = Math.ceil(filteredAssets.length / PAGE_SIZE);
  const displayedAssets = filteredAssets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.5) % 360;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  const colors = generateColors(assets.length);

  // Prepare data for portfolio distribution pie chart
  const pieData = {
    labels: assets.map((asset) => asset.name || "Unknown"),
    datasets: [
      {
        data: assets.map((asset) => asset.usdValue || 0), // Use USD value for proportion
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) => `${color}AA`),
      },
    ],
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const asset = assets[tooltipItem.dataIndex];
            const percentage = (
              ((asset.usdValue || 0) / totalPortfolioValue) *
              100
            ).toFixed(1);
            return [
              `${asset.name} (${asset.unitName})`,
              `Amount: ${asset.amount}`,
              `Value: $${asset.usdValue?.toFixed(2)}`,
              `${percentage}% of portfolio`,
            ];
          },
        },
      },
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  // Prepare data for the asset price history chart
  const prepareHistoryChartData = () => {
    if (!selectedAsset || !chartData[selectedAsset.assetId]) {
      return {
        labels: [],
        datasets: [
          {
            label: "Price (USD)",
            data: [],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            tension: 0.3,
          },
        ],
      };
    }

    const history = chartData[selectedAsset.assetId];

    return {
      labels: history.map((item) =>
        new Date(item.timestamp).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Price (USD)",
          data: history.map((item) => item.price),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.3,
        },
      ],
    };
  };

  // Prepare data for portfolio value by asset bar chart
  const barData = {
    labels: assets.map((asset) => asset.unitName),
    datasets: [
      {
        label: "USD Value",
        data: assets.map((asset) => asset.usdValue || 0),
        backgroundColor: colors,
      },
    ],
  };

  const barOptions = {
    plugins: {
      title: {
        display: true,
        text: "Asset Values",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Format for readable numbers (adds commas)
  const formatNumber = (num: number) => {
    const fixedNum = parseFloat(num.toFixed(2)); // Ensure two decimal places
    return fixedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format asset price with appropriate decimal places
  const formatAssetPrice = (usdValue?: number, amount?: number) => {
    if (!usdValue || !amount || amount === 0) return "0.0000";

    const price = usdValue / amount;

    // For very small prices (less than 0.01), show more decimal places
    if (price < 0.01) return price.toFixed(6);
    if (price < 0.1) return price.toFixed(5);
    if (price < 1) return price.toFixed(4);
    if (price < 10) return price.toFixed(3);
    return price.toFixed(2);
  };

  // Format wallet address to be more readable
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 8)}...${address.substring(
      address.length - 8
    )}`;
  };

  // Default placeholder for token logos
  const getTokenLogoUrl = (asset: Asset) => {
    return (
      asset.logoUrl ||
      `https://app.perawallet.app/assets/images/tokens/${asset.assetId}.svg`
    );
  };

  // Format percentage change with color
  const renderPriceChange = (change?: number) => {
    if (change === undefined) return "N/A";

    const color = change >= 0 ? "text-green-500" : "text-red-500";
    const sign = change >= 0 ? "+" : "";

    return (
      <span className={styles.priceChange + " " + color}>
        {sign}
        {change.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>My Wallet</h2>
        <div className={styles.refreshButton} onClick={refreshWallet}>
          <RefreshCw size={16} />
          <span>Refresh</span>
        </div>
      </div>

      {walletAddress ? (
        <>
          <div className={styles.walletInfo}>
            <div className={styles.addressSection}>
              <p className={styles.walletAddress}>
                Wallet Address: <span>{formatAddress(walletAddress)}</span>
              </p>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress);
                  // You could add a copied notification here
                }}
              >
                Copy
              </button>
            </div>
            <div className={styles.portfolioStats}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Portfolio Value</span>
                <span className={styles.statValue}>
                  ${formatNumber(totalPortfolioValue)}
                </span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Assets</span>
                <span className={styles.statValue}>{assets.length}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading your assets...</p>
            </div>
          ) : assets.length > 0 ? (
            <>
              <div className={styles.chartContainer}>
                <div className={styles.chartSelector}>
                  {/* <button 
                    onClick={() => setChartType("portfolio")}
                    className={`${styles.chartButton} ${chartType === "portfolio" ? styles.active : ""}`}
                  >
                    Portfolio
                  </button> */}
                  {/* <button 
                    onClick={() => setChartType("asset")}
                    className={`${styles.chartButton} ${chartType === "asset" ? styles.active : ""}`}
                  >
                    Asset Price
                  </button> */}
                </div>

                <div className={styles.chartsWrapper}>
                  {chartType === "portfolio" ? (
                    <div className={styles.portfolioCharts}>
                      <div className={styles.pieChartContainer}>
                        <h3>Portfolio Distribution</h3>
                        <div className={styles.pieWrapper}>
                          <Pie
                            data={pieData}
                            options={pieOptions}
                            height={220}
                          />
                        </div>
                        {/* <div className={styles.legendContainer}>
                          {assets.slice(0, 5).map((asset, index) => (
                            <div key={asset.assetId} className={styles.legendItem}>
                              <span 
                                className={styles.colorBox} 
                                style={{backgroundColor: colors[index]}}
                              ></span>
                              <span className={styles.legendText}>
                                {asset.unitName}: {((asset.usdValue || 0) / totalPortfolioValue * 100).toFixed(1)}%
                              </span>
                            </div>
                          ))}
                          {assets.length > 5 && (
                            <div className={styles.legendItem}>
                              <span className={styles.legendText}>
                                and {assets.length - 5} more...
                              </span>
                            </div>
                          )}
                        </div> */}
                      </div>

                      <div className={styles.barChartContainer}>
                        <h3>Asset Values</h3>
                        <div className={styles.barWrapper}>
                          <Bar
                            data={barData}
                            options={barOptions}
                            height={220}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.assetChart}>
                      <div className={styles.assetChartHeader}>
                        {selectedAsset && (
                          <div className={styles.selectedAssetInfo}>
                            <img
                              src={getTokenLogoUrl(selectedAsset)}
                              alt={selectedAsset.name}
                              className={styles.assetLogoLarge}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://app.perawallet.app/assets/images/tokens/unknown.svg";
                              }}
                            />
                            <div>
                              <h3>{selectedAsset.name}</h3>
                              <div className={styles.assetDetails}>
                                <span>{selectedAsset.unitName}</span>
                                <span>
                                  $
                                  {formatAssetPrice(
                                    selectedAsset.usdValue,
                                    selectedAsset.amount
                                  )}
                                </span>
                                {renderPriceChange(selectedAsset.changePercent)}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className={styles.timeRangeSelector}>
                          <button
                            onClick={() => {
                              setTimeRange("24h");
                              if (selectedAsset)
                                fetchAssetHistory(selectedAsset.assetId);
                            }}
                            className={`${styles.timeButton} ${
                              timeRange === "24h" ? styles.active : ""
                            }`}
                          >
                            24h
                          </button>
                          <button
                            onClick={() => {
                              setTimeRange("7d");
                              if (selectedAsset)
                                fetchAssetHistory(selectedAsset.assetId);
                            }}
                            className={`${styles.timeButton} ${
                              timeRange === "7d" ? styles.active : ""
                            }`}
                          >
                            7d
                          </button>
                          <button
                            onClick={() => {
                              setTimeRange("30d");
                              if (selectedAsset)
                                fetchAssetHistory(selectedAsset.assetId);
                            }}
                            className={`${styles.timeButton} ${
                              timeRange === "30d" ? styles.active : ""
                            }`}
                          >
                            30d
                          </button>
                        </div>
                      </div>

                      {loadingChart ? (
                        <div className={styles.chartLoading}>
                          <div className={styles.spinner}></div>
                          <p>Loading chart data...</p>
                        </div>
                      ) : (
                        <div className={styles.lineChartWrapper}>
                          <Line data={prepareHistoryChartData()} height={250} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.controlsContainer}>
                <div className={styles.filterContainer}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search by name, symbol or ID..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={styles.filterInput}
                  />
                </div>

                {/* <div className={styles.viewToggle}>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`${styles.viewButton} ${
                      viewMode === "grid" ? styles.active : ""
                    }`}
                  >
                    <Layers size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`${styles.viewButton} ${
                      viewMode === "table" ? styles.active : ""
                    }`}
                  >
                    <Sliders size={16} />
                  </button>
                </div> */}
              </div>

              {viewMode === "grid" ? (
                <div className={styles.assetGrid}>
                  {displayedAssets.map((asset) => (
                    <div
                      key={asset.assetId}
                      className={styles.assetCard}
                      // onClick={() => handleAssetClick(asset)}
                    >
                      <div className={styles.assetCardHeader}>
                        <img
                          src={getTokenLogoUrl(asset)}
                          alt={asset.name}
                          className={styles.assetLogo}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://app.perawallet.app/assets/images/tokens/unknown.svg";
                          }}
                        />
                        <div className={styles.assetCardHeaderInfo}>
                          <div className={styles.assetSymbol}>
                            {asset.unitName}
                          </div>
                          {asset.isVerified && (
                            <div
                              className={styles.verifiedBadge}
                              title="Verified Asset"
                            >
                              ✓
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={styles.assetCardBody}>
                        <div className={styles.assetName}>{asset.name}</div>
                        <div className={styles.assetAmount}>
                          {formatNumber(asset.amount)} {asset.unitName}
                        </div>
                        <div className={styles.assetValue}>
                          ${formatNumber(asset.usdValue || 0)}
                        </div>
                        <div className={styles.assetPrice}>
                          ${formatAssetPrice(asset.usdValue, asset.amount)} per{" "}
                          {asset.unitName}
                        </div>
                        {/* {renderPriceChange(asset.changePercent)} */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <table className={styles.assetTable}>
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSort("name")}
                        className={styles.sortableHeader}
                      >
                        Asset{" "}
                        {sortField === "name" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort("amount")}
                        className={styles.sortableHeader}
                      >
                        Amount{" "}
                        {sortField === "amount" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort("usdValue")}
                        className={styles.sortableHeader}
                      >
                        Value (USD){" "}
                        {sortField === "usdValue" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className={`${styles.priceHeader} ${styles.sortableHeader}`}
                        onClick={() => handleSort("price")}
                      >
                        Price{" "}
                        {sortField === "price" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort("changePercent")}
                        className={styles.sortableHeader}
                      >
                        24h Change{" "}
                        {sortField === "changePercent" && (
                          <span className={styles.sortIndicator}>
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedAssets.map((asset) => (
                      <tr
                        key={asset.assetId}
                        className={styles.assetRow}
                        onClick={() => handleAssetClick(asset)}
                      >
                        <td className={styles.assetNameCell}>
                          <img
                            src={getTokenLogoUrl(asset)}
                            alt={asset.name}
                            className={styles.assetLogo}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://app.perawallet.app/assets/images/tokens/unknown.svg";
                            }}
                          />
                          <div>
                            <span className={styles.assetSymbol}>
                              {asset.unitName}
                              {asset.isVerified && (
                                <span
                                  className={styles.verifiedBadge}
                                  title="Verified Asset"
                                >
                                  ✓
                                </span>
                              )}
                            </span>
                            <div className={styles.assetName}>{asset.name}</div>
                          </div>
                        </td>
                        <td>{formatNumber(asset.amount)}</td>
                        <td>${formatNumber(asset.usdValue || 0)}</td>
                        <td>
                          ${formatAssetPrice(asset.usdValue, asset.amount)}
                        </td>
                        <td>{renderPriceChange(asset.changePercent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

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
          ) : (
            <div className={styles.emptyState}>
              <img
                src="https://app.perawallet.app/assets/images/tokens/unknown.svg"
                alt="No assets"
                className={styles.emptyStateIcon}
              />
              <p className={styles.noAssets}>
                No verified assets found in this wallet.
              </p>
              <button className={styles.refreshButton} onClick={refreshWallet}>
                <RefreshCw size={16} />
                <span>Refresh Wallet</span>
              </button>
            </div>
          )}

          <div className={styles.dataAttribution}>
            <Info size={14} />
            <span>Price data provided by Vestige and Pera</span>
          </div>
        </>
      ) : (
        <div className={styles.connectWalletPrompt}>
          <Camera size={48} className={styles.walletIcon} />
          <p className={styles.noWallet}>
            No wallet connected. Please connect your wallet.
          </p>
          <button className={styles.connectButton}>Connect Wallet</button>
        </div>
      )}
    </div>
  );
};
