import { useState } from "react";
import axios from "axios";
import PeraWalletButton from "./PeraWalletButton";

interface SetupWalletProps {
  userId: string | null;
}

export const SetupWallet = ({ userId }: SetupWalletProps) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const BASE_URL = "https://aaa-api.onrender.com/api/v1";

  const handleConnect = async (address: string) => {
    setWalletAddress(address);
    setMessage(null); // Clear any previous messages

    try {
      if (!userId) {
        setMessage("User ID not found. Please log in.");
        return;
      }

      // Call the setup-wallet API to update the wallet address
      const response = await axios.post(`${BASE_URL}/setup-wallet`, {
        userId,
        walletAddress: address,
      });

      setMessage(
        response.data.message || "Wallet address updated successfully."
      );
    } catch (error: any) {
      console.error("Error updating wallet address:", error);
      setMessage(
        error.response?.data?.message || "Failed to update wallet address."
      );
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setMessage("Wallet disconnected.");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Setup Wallet</h1>
      <p>
        Connect your wallet to add / update your wallet address to your account.
      </p>

      <PeraWalletButton
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {walletAddress && (
        <div>
          <p>
            Connected Wallet Address: <strong>{walletAddress}</strong>
          </p>
        </div>
      )}

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #ced4da",
            borderRadius: "5px",
          }}
        >
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default SetupWallet;
