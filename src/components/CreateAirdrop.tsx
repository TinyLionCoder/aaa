import React, { useState, useContext } from "react";
import axios from "axios";
import { algodClient } from "../algorand/config";
import algosdk from "algosdk";
import PeraWalletButton from "./PeraWalletButton";
import { PeraWalletContext } from "./PeraWalletContext";
import styles from "../css_modules/CreateAirdropStyles.module.css";

export const CreateAirdrop = () => {
  const BASE_URL = "https://aaa-api.onrender.com/api/v1/airdrop";
  const AIRDROP_FEE_ADDRESS =
    "HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E";

  const peraWallet = useContext(PeraWalletContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );

  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tokenName: "",
    tokenId: "",
    tokenDecimals: "",
    amountOfTokenPerClaim: "",
    totalAmountOfTokens: "",
    shortDescription: "",
  });

  // Handle wallet connect/disconnect
  const handleWalletConnect = (address: string) => setWalletAddress(address);
  const handleWalletDisconnect = () => setWalletAddress(null);

  // Handle input changes with validation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Prevent decimal values for specific fields
    if (["amountOfTokenPerClaim", "totalAmountOfTokens"].includes(name)) {
      if (!/^\d*$/.test(value)) return; // Allow only digits
    }

    // Restrict `shortDescription` to a maximum of 200 characters
    if (name === "shortDescription" && value.length > 200) return;

    setFormData({ ...formData, [name]: value });
  };

  const handlePayFeeAndNext = async () => {
    if (!walletAddress) {
      setError("Please connect your wallet first.");
      return;
    }

    if (
      !formData.tokenName ||
      !formData.tokenId ||
      !formData.tokenDecimals ||
      !formData.amountOfTokenPerClaim ||
      !formData.totalAmountOfTokens ||
      !formData.shortDescription
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Fetch transaction parameters
      const suggestedParams = await algodClient.getTransactionParams().do();

      // Create a payment transaction for the fee
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: walletAddress,
        to: AIRDROP_FEE_ADDRESS,
        amount: 1000000, // 10 ALGO in microAlgos
        note: new Uint8Array(Buffer.from("AAA APP: Airdrop Creation Fee")),
        suggestedParams,
      });

      // Sign and send transaction
      if (!peraWallet) throw new Error("PeraWallet is not available.");
      const singleTxnGroup = [{ txn, signers: [walletAddress] }];
      const signedTxn = await peraWallet.signTransaction([singleTxnGroup]);
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      await algosdk.waitForConfirmation(algodClient, txId, 4);

      setTransactionStatus(
        "Fee payment successful! Proceeding to airdrop setup..."
      );

      // Proceed to create airdrop
      await handleCreateAirdrop(txId);
    } catch (error) {
      console.error("Fee payment failed:", error);
      setError("Fee payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAirdrop = async (txId: any) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/create-airdrop`,
        {
          userId: localStorage.getItem("userId"),
          email: localStorage.getItem("userEmail"),
          tokenName: formData.tokenName.toUpperCase(),
          tokenId: Number(formData.tokenId),
          tokenDecimals: Number(formData.tokenDecimals),
          amountOfTokenPerClaim: Number(formData.amountOfTokenPerClaim),
          totalAmountOfTokens: Number(formData.totalAmountOfTokens),
          shortDescription: formData.shortDescription,
          txId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setStep(2);
      } else {
        setError("Airdrop creation failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Error creating airdrop:", err);
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Airdrop</h1>
      {/* {step === 1 && (
        <>
          <h2 className={styles.heading}>Step 1: Fill Airdrop Details</h2>
          <form className={styles.form}>
            <label className={styles.label}>Unit Name</label>
            <input
              className={styles.input}
              type="text"
              name="tokenName"
              value={formData.tokenName}
              onChange={handleChange}
            />
            <label className={styles.label}>Token ID</label>
            <input
              className={styles.input}
              type="number"
              name="tokenId"
              value={formData.tokenId}
              onChange={handleChange}
            />
            <label className={styles.label}>Token Decimals</label>
            <input
              className={styles.input}
              type="number"
              name="tokenDecimals"
              value={formData.tokenDecimals}
              onChange={handleChange}
            />
            <label className={styles.label}>Amount Per Claim</label>
            <input
              className={styles.input}
              type="number"
              name="amountOfTokenPerClaim"
              value={formData.amountOfTokenPerClaim}
              onChange={handleChange}
              step="1"
            />
            <label className={styles.label}>Total Tokens For the Airdrop</label>
            <input
              className={styles.input}
              type="number"
              name="totalAmountOfTokens"
              value={formData.totalAmountOfTokens}
              onChange={handleChange}
              step="1"
            />
            <label className={styles.label}>Short Description</label>
            <textarea
              className={styles.textarea}
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief description (max 200 characters)"
              rows={4}
            />
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <PeraWalletButton
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />
          <button
            className={styles.button}
            disabled={loading}
            onClick={handlePayFeeAndNext}
          >
            {loading ? "Processing..." : "Create Airdrop"}
          </button>
        </>
      )} */}
      {/* {step === 2 && (
        <>
          <h2 className={styles.heading}>Step 2: Deposit Tokens</h2>
          <p className={styles.instructions}>
            Please deposit the required tokens to the following wallet address:
          </p>
          <div className={styles.walletAddress}>
            HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E
          </div>
          <p>
            Make sure the total tokens match the amount specified during the
            setup.
          </p>
        </>
      )} */}
      <p>Coming Soon!</p>
    </div>
  );
};
