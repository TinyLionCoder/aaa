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
}

export const MyWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const PeraWalletWallet: any = localStorage.getItem("PeraWallet.Wallet");
    const SelectedAccount = JSON.parse(PeraWalletWallet)?.selectedAccount;
    if (SelectedAccount) {
      setWalletAddress(SelectedAccount);
      fetchAssets(SelectedAccount);
    }
  }, []);

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
        const { name, unitName, decimals } = await fetchAssetDetails(asset["asset-id"]);
        return {
          assetId: asset["asset-id"],
          amount: formatAmount(asset.amount, decimals),
          name,
          unitName,
          decimals,
        };
      });

      const resolvedAssets: Asset[] = await Promise.all(assetPromises);

      // Filter out assets with zero amounts
      const nonZeroAssets = resolvedAssets.filter((asset) => asset.amount > 0);
      setAssets(nonZeroAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const pieData = {
    labels: assets.map(
      (asset) => `${asset.name} (${asset.unitName})` || "Unknown"
    ),
    datasets: [
      {
        data: assets.map(() => 1), // Equal value for each asset
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384AA",
          "#36A2EBAA",
          "#FFCE56AA",
          "#4BC0C0AA",
          "#9966FFAA",
          "#FF9F40AA",
        ],
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

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Wallet</h2>
      {walletAddress ? (
        <>
          <p className={styles.walletAddress}>
            Wallet Address: <span>{walletAddress}</span>
          </p>
          {loading ? (
            <p className={styles.loading}>Loading assets...</p>
          ) : assets.length > 0 ? (
            <div className={styles.chartWrapper}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          ) : (
            <p className={styles.noAssets}>No assets found in this wallet.</p>
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
