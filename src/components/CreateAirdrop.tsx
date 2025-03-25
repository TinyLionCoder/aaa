import React, { useState, useContext } from "react";
import axios from "axios";
import { algodClient } from "../algorand/config";
import algosdk from "algosdk";
import PeraWalletButton from "./PeraWalletButton";
import { PeraWalletContext } from "./PeraWalletContext";
import styles from "../css_modules/CreateAirdropStyles.module.css";
import {
  allMembers,
  diamondHands,
  wealthBuilders,
} from "../constants/airdrops";

export const CreateAirdrop = () => {
  const BASE_URL = "https://aaa-api.onrender.com/api/v1/airdrop";
  const AIRDROP_FEE_ADDRESS =
    "HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E";

  const peraWallet = useContext(PeraWalletContext);
  const [step, setStep] = useState(1);
  const [airdropType, setAirdropType] = useState<string | null>(null);
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

  const handleTypeSelect = (type: string) => {
    setAirdropType(type);
    setStep(2);
  };

  const handleWalletConnect = (address: string) => setWalletAddress(address);
  const handleWalletDisconnect = () => setWalletAddress(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (["amountOfTokenPerClaim", "totalAmountOfTokens"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }
    if (name === "shortDescription" && value.length > 200) return;
    setFormData({ ...formData, [name]: value });
  };

  const getAirdropRecommendation = () => {
    switch (airdropType) {
      case "all-members":
        return "Tip: Keep drop to max 0.1 ALGO per claim to attract quality collectors.";
      case "diamond-hands":
        return "Tip: Keep each claim under 1 ALGO to attract stronger holders.";
      case "wealth-builders":
        return "Tip: Keep claims around 10 ALGO to reward proven LP providers.";
      default:
        return "";
    }
  };

  const handlePayFeeAndNext = async () => {
    if (!walletAddress) return setError("Please connect your wallet first.");
    if (
      !formData.tokenName ||
      !formData.tokenId ||
      !formData.tokenDecimals ||
      !formData.amountOfTokenPerClaim ||
      !formData.totalAmountOfTokens ||
      !formData.shortDescription
    ) {
      return setError("All fields are required.");
    }

    try {
      setLoading(true);
      const suggestedParams = await algodClient.getTransactionParams().do();
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: walletAddress,
        to: AIRDROP_FEE_ADDRESS,
        amount: 10000000, // 10 ALGO in microAlgos
        note: new Uint8Array(Buffer.from("AAA APP: Airdrop Creation Fee")),
        suggestedParams,
      });

      if (!peraWallet) throw new Error("PeraWallet is not available.");
      const singleTxnGroup = [{ txn, signers: [walletAddress] }];
      if (!peraWallet) throw new Error("PeraWallet is not available.");
      const signedTxn = await peraWallet.signTransaction([singleTxnGroup]);
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

      await algosdk.waitForConfirmation(algodClient, txId, 4);
      setTransactionStatus(
        "Fee payment successful! Proceeding to airdrop setup..."
      );
      await handleCreateAirdrop(txId);
    } catch (error) {
      console.error(error);
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
          airdropType,
          txId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) setStep(3);
      else setError("Airdrop creation failed. Please try again.");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleSendTokenTransaction = async () => {
    if (!walletAddress) return setError("Please connect your wallet.");

    try {
      setLoading(true);
      const suggestedParams = await algodClient.getTransactionParams().do();
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: walletAddress,
        to: AIRDROP_FEE_ADDRESS,
        assetIndex: Number(formData.tokenId),
        amount:
          Number(formData.totalAmountOfTokens) *
          10 ** Number(formData.tokenDecimals),
        note: new Uint8Array(Buffer.from("AAA APP: Airdrop Token Deposit")),
        suggestedParams,
      });

      const singleTxnGroup = [{ txn, signers: [walletAddress] }];
      if (!peraWallet) throw new Error("PeraWallet is not available.");
      const signedTxn = await peraWallet.signTransaction([singleTxnGroup]);
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      await algosdk.waitForConfirmation(algodClient, txId, 4);

      setTransactionStatus("Token deposit successful!");
      setStep(4); // 👈 Go to Step 4
    } catch (err) {
      console.error("Token transaction failed", err);
      setError("Token transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Airdrop</h1>

      {step === 1 && (
        <>
          <h2 className={styles.subheading}>Step 1: Pick an Airdrop</h2>
          <p className={styles.description}>
            Carefully select the type of airdrop that is more beneficial for
            your project:
          </p>
          <div className={styles.airdropOptions}>
            {[
              {
                label: "All Members",
                value: allMembers,
                desc: "Fast wallet growth, low quality claims.",
              },
              {
                label: "Diamond Hands",
                value: diamondHands,
                desc: "Only proven token holders.",
              },
              {
                label: "Wealth Builders",
                value: wealthBuilders,
                desc: "Only top LP providers.",
              },
            ].map((option) => (
              <div
                key={option.value}
                className={styles.airdropCard}
                onClick={() => handleTypeSelect(option.value)}
              >
                <h3 className={styles.airdropTitle}>{option.label}</h3>
                <p className={styles.airdropText}>{option.desc}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className={styles.subheading}>Step 2: Fill Airdrop Details</h2>
          <p className={styles.tip}>{getAirdropRecommendation()}</p>
          <form className={styles.form}>
            <input
              className={styles.input}
              type="text"
              name="tokenName"
              placeholder="Token Name"
              value={formData.tokenName}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="number"
              name="tokenId"
              placeholder="Token ID"
              value={formData.tokenId}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="number"
              name="tokenDecimals"
              placeholder="Token Decimals"
              value={formData.tokenDecimals}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="number"
              name="amountOfTokenPerClaim"
              placeholder="Amount per Claim"
              value={formData.amountOfTokenPerClaim}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="number"
              name="totalAmountOfTokens"
              placeholder="Total Tokens"
              value={formData.totalAmountOfTokens}
              onChange={handleChange}
            />
            <textarea
              className={styles.textarea}
              name="shortDescription"
              placeholder="Short Description (max 200 chars)"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={3}
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
            {loading ? "Processing..." : "Pay Fee & Create Airdrop"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className={styles.subheading}>Step 3: Deposit Tokens</h2>
          <p className={styles.instructions}>
            Click below to send your tokens to the airdrop wallet:
          </p>
          <div className={styles.walletAddress}>{AIRDROP_FEE_ADDRESS}</div>
          <button
            className={styles.button}
            disabled={loading}
            onClick={handleSendTokenTransaction}
          >
            {loading ? "Sending..." : "Send Tokens"}
          </button>
          {transactionStatus && (
            <p className={styles.tip}>{transactionStatus}</p>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </>
      )}
      {step === 4 && (
        <>
          <h2 className={styles.subheading}>🎉 Congrats!</h2>
          <p className={styles.description}>
            Your airdrop is now <strong>live</strong> and ready to be claimed by
            eligible users.
          </p>
        </>
      )}
    </div>
  );
};
