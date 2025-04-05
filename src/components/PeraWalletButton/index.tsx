import {
  useEffect,
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { PeraWalletContext } from "../PeraWalletContext";

const PeraWalletButton = forwardRef(({ onConnect, onDisconnect }: any, ref) => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const isConnectedToPeraWallet = !!accountAddress;

  const peraWallet = useContext(PeraWalletContext);

  useImperativeHandle(ref, () => ({
    disconnectWallet: handleDisconnectWalletClick, // Expose the disconnect function
  }));

  useEffect(() => {
    if (peraWallet) {
      peraWallet
        .reconnectSession()
        .then((accounts) => {
          peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

          if (accounts.length) {
            const address = accounts[0];
            setAccountAddress(address);
            onConnect(address);
          }
        })
        .catch((e: any) => console.error(e));
    }
  }, []);

  function handleConnectWalletClick() {
    if (peraWallet) {
      peraWallet
        .connect()
        .then((newAccounts: any) => {
          peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
          const address = newAccounts[0];
          setAccountAddress(address);
          onConnect(address);
        })
        .catch((error: any) => {
          if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
            console.error(error);
          }
        });
    }
  }

  function handleDisconnectWalletClick() {
    if (peraWallet) {
      peraWallet.disconnect();
    }
    setAccountAddress(null);
    onDisconnect(); // Notify AuthWrapper of the disconnection
  }

  return (
    <button
      style={{
        width: "45%",
        padding: "18px",
        backgroundColor: isConnectedToPeraWallet ? "#9333EA" : "#2563EB",
        borderRadius: "8px",
        cursor: "pointer",
        border: "none",
        marginBottom: "1.25em",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = isConnectedToPeraWallet ? "#9333EA" : "#2563EB";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = isConnectedToPeraWallet ? "#8A2BE2" : "#3B82F6";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onClick={
        isConnectedToPeraWallet
          ? handleDisconnectWalletClick
          : handleConnectWalletClick
      }
    >
      <h2
        style={{
          color: "white",
          fontSize: "16px",
          margin: "0",
          textAlign: "center",
        }}
      >
        {isConnectedToPeraWallet
          ? "Disconnect Wallet"
          : "Connect Wallet"}
      </h2>
    </button>
  );
});

export default PeraWalletButton;
