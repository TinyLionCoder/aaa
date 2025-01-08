import React, { useState } from "react";
import axios from "axios";
import styles from "../css_modules/CreateAirdropStyles.module.css";

export const CreateAirdrop = () => {
  const BASE_URL = "https://aaa-api.onrender.com/api/v1/airdrop";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tokenName: "",
    tokenId: "",
    tokenDecimals: "",
    amountOfTokenPerClaim: "",
    totalAmountOfTokens: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for Step 1
  const handleNext = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BASE_URL}/create-airdrop`,
        {
          userId: localStorage.getItem("userId"),
          email: localStorage.getItem("userEmail"),
          tokenName: formData.tokenName,
          tokenId: Number(formData.tokenId),
          tokenDecimals: Number(formData.tokenDecimals),
          amountOfTokenPerClaim: Number(formData.amountOfTokenPerClaim),
          totalAmountOfTokens: Number(formData.totalAmountOfTokens),
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
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Airdrop</h1>
      {/* {step === 1 && (
        <>
          <h2 className={styles.heading}>Step 1: Fill Airdrop Details</h2>
          <form className={styles.form}>
            <label className={styles.label}>Token Name</label>
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
              type="text"
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
            />
            <label className={styles.label}>Total Tokens</label>
            <input
              className={styles.input}
              type="number"
              name="totalAmountOfTokens"
              value={formData.totalAmountOfTokens}
              onChange={handleChange}
            />
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <button
            className={styles.button}
            disabled={loading}
            onClick={handleNext}
          >
            {loading ? "Creating..." : "Next"}
          </button>
        </>
      )}
      {step === 2 && (
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
            setup. Once tokens are deposited, the airdrop will become active.
          </p>
        </>
      )} */}
      <p>Coming Soon!</p>
    </div>
  );
};
