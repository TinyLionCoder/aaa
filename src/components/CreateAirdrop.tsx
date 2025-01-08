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
    shortDescription: "", // New field
  });

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Prevent decimal values for specific fields
    if (["amountOfTokenPerClaim", "totalAmountOfTokens"].includes(name)) {
      if (!/^\d*$/.test(value)) return; // Allow only digits
    }

    // Restrict `shortDescription` to a maximum of 100 characters
    if (name === "shortDescription" && value.length > 100) return;

    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for Step 1
  const handleNext = async () => {
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
          shortDescription: formData.shortDescription,
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
              step="1" // Prevents decimal input for these fields
            />
            <label className={styles.label}>Total Tokens</label>
            <input
              className={styles.input}
              type="number"
              name="totalAmountOfTokens"
              value={formData.totalAmountOfTokens}
              onChange={handleChange}
              step="1" // Prevents decimal input for these fields
            />
            <label className={styles.label}>Short Description</label>
            <input
              className={styles.input}
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief description (max 100 chars)"
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
            setup.
          </p>
        </>
      )} */}
      <p>Coming Soon!</p>
    </div>
  );
};
