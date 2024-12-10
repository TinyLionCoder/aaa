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

  const fetchPeraVerification = async (assetId: number) => {
    try {
      const response = await fetch(
        `https://mainnet.api.perawallet.app/v1/public/assets/${assetId}`
      );
      const data = await response.json();
      return data.verification_tier === "verified";
    } catch (error) {
      console.error(`Error verifying asset ID ${assetId}:`, error);
      return false;
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
        const isVerified = await fetchPeraVerification(asset["asset-id"]);

        if (isVerified) {
          return {
            assetId: asset["asset-id"],
            amount: formatAmount(asset.amount, decimals),
            name,
            unitName,
            decimals,
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
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate distinct colors for each asset
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
              <p>Data provided by Pera</p>
            </div>
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
