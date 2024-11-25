import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import PeraWalletButton from "./PeraWalletButton";
import styles from "../css_modules/AuthWrapperStyles.module.css";

const AuthWrapper = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userId, setUserId] = useState(null);
  const [userReferralCode, setUserReferralCode] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userReferrals, setUserReferrals] = useState([]);
  const [aaaBalance, setAaaBalance] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  const peraWalletRef = useRef<{ disconnectWallet: () => void } | null>(null);

  const apiClient = axios.create({
    baseURL: "https://aaa-api.onrender.com/api/v1",
    headers: { "Content-Type": "application/json" },
  });

  // Intercept requests to include token in headers
  apiClient.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Load token from localStorage on initial render
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleWalletConnect = async (connectedAddress: string | null) => {
    setWalletAddress(connectedAddress);
    if (connectedAddress) {
      // Automatically trigger login upon wallet connection
      try {
        await logInWithWallet(connectedAddress);
      } catch (error) {
        console.error("Auto-login with wallet failed:", error);
      }
    }
  };

  const signUp = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet before signing up.");
      return;
    }

    if (!email || !password) {
      alert("Please fill in your email and password.");
      return;
    }

    try {
      const safeReferralCode = referralCode || "";
      const response = await apiClient.post("/signup", {
        email,
        password,
        referralCode: safeReferralCode,
        walletAddress,
      });

      const {
        userId,
        referralCode: returnedReferralCode,
        walletAddress: returnedWalletAddress,
        aaaBalance,
        token,
      } = response.data;

      setUserLoggedIn(true);
      setUserId(userId);
      setUserReferralCode(returnedReferralCode);
      setWalletAddress(returnedWalletAddress);
      setAaaBalance(aaaBalance);
      setToken(token);
      localStorage.setItem("token", token);

      setReferralCode("");
    } catch (error) {
      console.error("Sign up failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  const logInWithEmail = async () => {
    if (!email || !password) {
      alert("Please fill in your email and password.");
      return;
    }

    try {
      const response = await apiClient.post("/login", { email, password });

      const {
        userId,
        referralCode,
        walletAddress: returnedWalletAddress,
        aaaBalance,
        referrals,
        token,
      } = response.data;

      setUserLoggedIn(true);
      setUserId(userId);
      setUserReferralCode(referralCode);
      setWalletAddress(returnedWalletAddress);
      setAaaBalance(aaaBalance);
      setUserReferrals(referrals);
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login with email failed:", error);
      alert("Login failed. Please check your email and password.");
    }
  };

  const logInWithWallet = async (connectedWallet: string) => {
    try {
      const response = await apiClient.post("/login", { walletAddress: connectedWallet });

      const {
        userId,
        referralCode,
        walletAddress: returnedWalletAddress,
        aaaBalance,
        referrals,
        token,
      } = response.data;

      setUserLoggedIn(true);
      setUserId(userId);
      setUserReferralCode(referralCode);
      setWalletAddress(returnedWalletAddress);
      setAaaBalance(aaaBalance);
      setUserReferrals(referrals);
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login with wallet failed:", error);
      throw new Error("Wallet login failed. Please sign up or try again.");
    }
  };

  const logout = () => {
    setUserLoggedIn(false);
    setUserId(null);
    setUserReferralCode("");
    setUserReferrals([]);
    setWalletAddress(null);
    setAaaBalance(0);
    setToken(null);
    setEmail("");
    setPassword("");
    setReferralCode("");
    localStorage.removeItem("token");

    // Disconnect wallet
    peraWalletRef.current?.disconnectWallet();
  };

  return (
    <div className={styles.authWrapper}>
      <PeraWalletButton ref={peraWalletRef} onConnect={handleWalletConnect} />
      <br />
      {userLoggedIn ? (
        <Dashboard
          userReferralCode={userReferralCode}
          walletAddress={walletAddress || ""}
          aaaBalance={aaaBalance}
          userReferrals={userReferrals}
          onLogout={logout}
        />
      ) : (
        <AuthForm
          onSignUp={signUp}
          onLogInWithEmail={logInWithEmail}
          setEmail={setEmail}
          setPassword={setPassword}
          setReferralCode={setReferralCode}
        />
      )}
    </div>
  );
};

export default AuthWrapper;
