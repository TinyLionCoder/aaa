import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css_modules/ClaimAirdropStyles.module.css";

export const ClaimAirdrop = () => {
  const BASE_URL = "https://aaa-api.onrender.com/api/v1/airdrop";

  const [airdrops, setAirdrops] = useState<
    Array<{ id: string; tokenName: string; tokenId: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedAirdrop, setSelectedAirdrop] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirdrops = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          `${BASE_URL}/get-airdrops`,
          {
            userId: localStorage.getItem("userId"),
            email: localStorage.getItem("userEmail"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setAirdrops(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch airdrops");
      } finally {
        setLoading(false);
      }
    };

    fetchAirdrops();
  }, []);

  const handleClaim = async () => {
    if (!selectedAirdrop || !address) {
      setError("Please select an airdrop and provide a valid address");
      return;
    }

    setClaiming(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${BASE_URL}/update-claimed-address`,
        {
          userId: localStorage.getItem("userId"),
          email: localStorage.getItem("userEmail"),
          tokenName: selectedAirdrop,
          address,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Airdrop claimed successfully!");
        setAddress("");
        setSelectedAirdrop(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to claim airdrop");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Claim Airdrop</h1>
        <p>Coming Soon!</p>
      {/* {loading ? (
        <p className={styles.loading}>Loading available airdrops...</p>
      ) : (
        <>
          <div className={styles.form}>
            <label className={styles.label}>
              Select an Airdrop:
              <select
                className={styles.select}
                value={selectedAirdrop || ""}
                onChange={(e) => setSelectedAirdrop(e.target.value)}
              >
                <option value="" disabled>
                  Choose an airdrop
                </option>
                {airdrops.map((airdrop) => (
                  <option key={airdrop.id} value={airdrop.tokenName}>
                    {`${airdrop.tokenName}`.toUpperCase()} (Token ID: {airdrop.tokenId})
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Your Wallet Address:
              <input
                className={styles.input}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your wallet address"
              />
            </label>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            className={styles.button}
            onClick={handleClaim}
            disabled={claiming || !selectedAirdrop || !address}
          >
            {claiming ? "Claiming..." : "Claim Airdrop"}
          </button>
        </>
      )} */}
    </div>
  );
};
