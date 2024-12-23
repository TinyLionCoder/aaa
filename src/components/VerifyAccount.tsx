import React, { useState, useContext } from "react";
import { algodClient } from "../algorand/config";
import { PeraWalletContext } from "./PeraWalletContext";
import algosdk from "algosdk";
import PeraWalletButton from "./PeraWalletButton";
import styles from "../css_modules/VerificationPageStyles.module.css";

interface VerificationPageProps {
    userId: string | null;
  }

const VerificationPage = ({ userId }: VerificationPageProps) => {
  const peraWallet = useContext(PeraWalletContext);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [processing, setProcessing] = useState(false);
  const verificationAddress = ""; // Replace with the wallet address to receive fees

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    console.log("Wallet connected:", address);
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    console.log("Wallet disconnected.");
  };

  const handleVerification = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setProcessing(true);
      // Fetch transaction parameters
      const suggestedParams = await algodClient.getTransactionParams().do();

      // Create a payment transaction for verification
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: walletAddress,
        to: verificationAddress,
        amount: 500000, // 0.5 ALGO in microAlgos
        note: new Uint8Array(Buffer.from("AAA app: Verification Fee")),
        suggestedParams,
      });

      // Sign the transaction using PeraWallet
      if (!peraWallet) {
        throw new Error("PeraWallet is not available.");
      }
      const singleTxnGroups = [{ txn, signers: [walletAddress] }];
      const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);

      // Send the signed transaction
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

      // Wait for transaction confirmation
      await algosdk.waitForConfirmation(algodClient, txId, 4);

      // call the api to update the user's verification status

      console.log("Transaction confirmed with ID:", txId);
      setTransactionStatus(`Transaction successful! ID: ${txId}`);

    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionStatus("Transaction failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Verify Your Account</h1>
      <p>
        To verify your account, please pay a verification fee of{" "}
        <strong>0.5 ALGO</strong>.
      </p>
      <PeraWalletButton
        onConnect={handleWalletConnect}
        onDisconnect={handleWalletDisconnect}
      />
      {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
      {/* <button
        onClick={handleVerification}
        disabled={!walletAddress || processing}
        className={styles.verifyButton}
      >
        {processing ? "Processing..." : "Verify Now"}
      </button> */}
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default VerificationPage;
