import { useEffect, useState } from "react";
import { algoIndexerClient } from "../algorand/config";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import styles from "../css_modules/MyWalletStyles.module.css";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Asset {
  assetId: number;
  amount: number;
  name: string;
  unitName: string;
  decimals: number;
  usdValue?: number; // Optional USD value
  logoUrl?: string; // Added logo URL property
}

export const MyWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;

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
        asset.unitName.toLowerCase().includes(lowerCaseFilter)
    );
    setFilteredAssets(filtered);
    setCurrentPage(1); // Reset to the first page when filter changes
  }, [filter, assets]);

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
      // Return both verification and logo URL
      return {
        verified: data.verification_tier === "verified",
        logoUrl: data.logo || null // Extract logo URL
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
      return data.price || 0;
    } catch (error) {
      console.error(`Error fetching price for asset ID ${assetId}:`, error);
      return 0;
    }
  };

  const fetchTinymanPrice = async (assetId: number) => {
    try {
      const response = await fetch(
        `https://mainnet.api.perawallet.app/v1/public/assets/${assetId}`
      );
      const data = await response.json();
      return parseFloat(data.usd_value) || 0;
    } catch (error) {
      console.error(
        `Error fetching Tinyman price for asset ID ${assetId}:`,
        error
      );
      return 0;
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
        
        // Get verification status and logo URL from Pera
        const { verified: isVerified, logoUrl } = await fetchPeraVerification(asset["asset-id"]);
        const isTinymanPool = name.toLowerCase().includes("tinyman");

        let usdPrice = 0;

        // Fetch USD price from the appropriate API
        if (isTinymanPool) {
          // Use Tinyman API for pool tokens
          const tinymanPrice = await fetchTinymanPrice(asset["asset-id"]);
          usdPrice = tinymanPrice;
        } else if (isVerified) {
          // Use Vestige API for verified assets
          usdPrice = await fetchAssetPrice(asset["asset-id"]);
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
            logoUrl // Include logo URL in the asset data
          };
        }

        return null;
      });

      const resolvedAssets = (await Promise.all(assetPromises)).filter(
        (asset) => asset !== null
      ) as Asset[];

      // Filter out assets with zero amounts
      const nonZeroAssets = resolvedAssets.filter((asset) => asset.amount > 0);
      setAssets(nonZeroAssets);
      setFilteredAssets(nonZeroAssets);

      // Calculate total portfolio value
      const totalValue = nonZeroAssets.reduce(
        (total, asset) => total + (asset.usdValue || 0),
        0
      );
      setTotalPortfolioValue(totalValue);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
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
      const hue = (i * 137.5) % 360; // Distribute colors evenly across the hue spectrum
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  const colors = generateColors(assets.length);

  const pieData = {
    labels: assets.map(
      (asset) => `${asset.name} (${asset.unitName})` || "Unknown"
    ),
    datasets: [
      {
        data: assets.map(() => 1), // Equal value for each asset
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) => `${color}AA`), // Add transparency for hover
      },
    ],
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const asset = assets[tooltipItem.dataIndex];
            return `Asset ID: ${asset.assetId}\nUnit: ${asset.unitName}\nAmount: ${asset.amount}`;
          },
        },
      },
    },
  };

  // Default placeholder for token logos
  const getTokenLogoUrl = (asset: Asset) => {
    return asset.logoUrl || `https://app.perawallet.app/assets/images/tokens/${asset.assetId}.svg`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Wallet</h2>
      {walletAddress ? (
        <>
          <p className={styles.walletAddress}>
            Wallet Address: <span>{walletAddress}</span>
          </p>
          <p className={styles.totalPortfolioValue}>
            Total Portfolio Value: <span>${totalPortfolioValue.toFixed(2)}</span>
          </p>
          {loading ? (
            <p className={styles.loading}>Loading assets...</p>
          ) : assets.length > 0 ? (
            <>
              <div className={styles.chartWrapper}>
                <Pie data={pieData} options={pieOptions} />
                <p>Data provided by Pera</p>
              </div>
              <div className={styles.filterContainer}>
                <input
                  type="text"
                  placeholder="Filter token..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={styles.filterInput}
                />
              </div>
              <table className={styles.assetTable}>
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Unit Name</th>
                    <th>Amount</th>
                    <th>Value (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAssets.map((asset) => (
                    <tr key={asset.assetId}>
                      <td className={styles.assetNameCell}>
                        {asset.logoUrl && (
                          <img 
                            src={getTokenLogoUrl(asset)} 
                            alt={asset.name} 
                            className={styles.assetLogo} 
                            onError={(e) => {
                              // If logo fails to load, replace with a default
                              (e.target as HTMLImageElement).src = "https://app.perawallet.app/assets/images/tokens/unknown.svg";
                            }}
                          />
                        )}
                        <div>
                          <span className={styles.assetSymbol}>{asset.unitName}</span>
                          <div className={styles.assetName}>{asset.name}</div>
                        </div>
                      </td>
                      <td>{asset.unitName}</td>
                      <td>{asset.amount}</td>
                      <td>{asset.usdValue?.toFixed(2) || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <p className={styles.noAssets}>
              No verified assets found in this wallet.
            </p>
          )}
        </>
      ) : (
        <p className={styles.noWallet}>
          No wallet connected. Please connect your wallet.
        </p>
      )}
    </div>
  );
};
