import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css_modules/ClaimAirdropStyles.module.css";
import { diamondHands } from "../constants/airdrops";

export const ClaimAirdropDiamondHands = () => {
  const BASE_URL = "https://aaa-api.onrender.com/api/v1/airdrop";

  const [airdrops, setAirdrops] = useState<
    Array<{
      id: string;
      tokenName: string;
      tokenId: string;
      shortDescription: string;
      amountOfTokenPerClaim: number;
      totalAmountOfTokens: number;
      totalAmountOfTokensClaimed: number;
      airdropType: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedAirdrop, setSelectedAirdrop] = useState<{
    tokenName: string;
    shortDescription: string;
    amountOfTokenPerClaim: number;
    totalAmountOfTokens: number;
    totalAmountOfTokensClaimed: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const appWalletWallet: any = localStorage.getItem("appWallet");
    if (appWalletWallet) {
      setAddress(appWalletWallet);
    }
  }, []);

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

        setAirdrops(
          response.data.filter(
            (airdrop: any) => airdrop.airdropType === diamondHands
          )
        );
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
          tokenName: selectedAirdrop.tokenName,
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
        setSelectedAirdrop(null);
        setTimeout(() => {
          setSuccess(null);
          window.location.reload();
        }, 3000);
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
      {/* <p>Coming Soon!</p> */}
      {loading ? (
        <p className={styles.loading}>Loading available airdrops...</p>
      ) : (
        <>
          <div className={styles.form}>
            <label className={styles.label}>
              Select an Airdrop:
              <select
                className={styles.select}
                value={selectedAirdrop?.tokenName || ""}
                onChange={(e) => {
                  const selected = airdrops.find(
                    (airdrop) => airdrop.tokenName === e.target.value
                  );
                  setSelectedAirdrop(
                    selected
                      ? {
                          tokenName: selected.tokenName,
                          shortDescription: selected.shortDescription,
                          amountOfTokenPerClaim: selected.amountOfTokenPerClaim,
                          totalAmountOfTokens: selected.totalAmountOfTokens,
                          totalAmountOfTokensClaimed:
                            selected.totalAmountOfTokensClaimed,
                        }
                      : null
                  );
                }}
              >
                <option value="" disabled>
                  Choose an airdrop
                </option>
                {airdrops.map((airdrop) => (
                  <option key={airdrop.id} value={airdrop.tokenName}>
                    {`${airdrop.tokenName}`.toUpperCase()} (Asset ID:{" "}
                    {airdrop.tokenId})
                  </option>
                ))}
              </select>
            </label>

            {selectedAirdrop && (
              <div>
                <div className={styles.description}>
                  <h3>Description:</h3>
                  <p>{selectedAirdrop.shortDescription}</p>
                </div>
                {/* <div className={styles.claimInfo}>
                  <h3>Claims Remaining:</h3>
                  <p>
                    {(selectedAirdrop.totalAmountOfTokens -
                      selectedAirdrop.totalAmountOfTokensClaimed) /
                      selectedAirdrop.amountOfTokenPerClaim}
                  </p>
                </div> */}
              </div>
            )}
            <strong style={{ color: "red" }}>
              please ensure you have opted into the asset first
            </strong>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          {!address && (
            <p className={styles.warning}>
              <strong>
                Please connect wallet to claim the airdrop (Setup wallet or
                login with existing wallet)
              </strong>
            </p>
          )}
          <button
            className={styles.button}
            onClick={handleClaim}
            disabled={claiming || !selectedAirdrop || !address}
          >
            {claiming ? "Claiming..." : "Claim Airdrop"}
          </button>
        </>
      )}
    </div>
  );
};
