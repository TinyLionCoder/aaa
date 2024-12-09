import { useEffect, useState } from "react";
import { algoIndexerClient } from "../algorand/config";
import styles from "../css_modules/MyWalletStyles.module.css";

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
    return (amount / Math.pow(10, decimals)).toFixed(2);
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
      setAssets(resolvedAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
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
            <table className={styles.assetTable}>
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Asset Name</th>
                  <th>Unit Name</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.assetId}>
                    <td>{asset.assetId}</td>
                    <td>{asset.name}</td>
                    <td>{asset.unitName}</td>
                    <td>{asset.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
