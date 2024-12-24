import React, { useState, useEffect } from "react";
import { algoIndexerClient } from "../algorand/config";
import styles from "../css_modules/DonateAAAStyles.module.css";

export const DonateAAA = () => {
  const [aaaBalance, setAaaBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const aaaPaymentAddress =
    "HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E";
  const donationAddress =
    "HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E";

  useEffect(() => {
    const fetchAaaBalance = async () => {
      try {
        const accountInfo = await algoIndexerClient
          .lookupAccountByID(aaaPaymentAddress)
          .do();

        const aaaAsset = accountInfo.account.assets.find(
          (asset: any) => asset["asset-id"] === 2004387843 // Replace with your AAA token asset ID
        );

        setAaaBalance(aaaAsset ? aaaAsset.amount / 1e6 : 0); // Assuming AAA has 6 decimal places
      } catch (error) {
        console.error("Error fetching AAA balance:", error);
        setAaaBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAaaBalance();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Support AAA Tokens</h1>
      <p className={styles.description}>
        Your contributions help maintain and grow the AAA platform. You can
        donate ALGO or AAA tokens to the address below.
      </p>

      <div className={styles.balanceSection}>
        <h2 className={styles.subtitle}>Remaining AAA Tokens</h2>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : aaaBalance !== null ? (
          <p className={styles.balance}>{aaaBalance.toLocaleString()} AAA</p>
        ) : (
          <p className={styles.error}>
            Error fetching balance. Please try again later.
          </p>
        )}
      </div>

      <div className={styles.donationSection}>
        <h2 className={styles.subtitle}>Donation Address</h2>
        <div className={styles.addressContainer}>
          <h3 className={styles.addressLabel}>
            For ALGO Donations / For AAA Token Donations:
          </h3>
          <p className={styles.address}>{aaaPaymentAddress}</p>
        </div>
      </div>

      <div className={styles.instructionsSection}>
        <h2 className={styles.subtitle}>How to Donate</h2>
        <ol className={styles.instructionsList}>
          <li>Copy the address above.</li>
          <li>
            Use your Algorand wallet to send the desired amount to the copied
            address.
          </li>
          <li>
            Make sure to confirm the transaction and keep the receipt for your
            records.
          </li>
        </ol>
      </div>

      <footer className={styles.footer}>
        <p>
          Thank you for supporting the AAA community! Your contributions make a
          difference.
        </p>
      </footer>
    </div>
  );
};

export default DonateAAA;
