import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import styles from "../css_modules/AuthWrapperStyles.module.css";

const AuthWrapper = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [walletAddress, setWalletAddress] = useState(""); // New state for wallet address
  const [userId, setUserId] = useState(null);
  const [userReferralCode, setUserReferralCode] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userReferrals, setUserReferrals] = useState([]);
  const [aaaBalance, setAaaBalance] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  const apiClient = axios.create({
    baseURL: "https://aaa-api.onrender.com/api/v1",
    headers: { "Content-Type": "application/json" },
  });

  apiClient.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const signUp = async () => {
    try {
      const safeReferralCode = referralCode || "";
      console.log("Sign-up data:", {
        email,
        password,
        referralCode: safeReferralCode,
        walletAddress, // Include walletAddress in logs
      });

      const response = await apiClient.post("/signup", {
        email,
        password,
        referralCode: safeReferralCode,
        walletAddress, // Include walletAddress in request
      });

      const {
        userId,
        referralCode: returnedReferralCode,
        walletAddress: returnedWalletAddress, // Get walletAddress from response
        aaaBalance,
        token,
      } = response.data;

      setUserLoggedIn(true);
      setUserId(userId);
      setUserReferralCode(returnedReferralCode);
      setWalletAddress(returnedWalletAddress); // Set walletAddress state
      setAaaBalance(aaaBalance);
      setToken(token);
      localStorage.setItem("token", token);

      setReferralCode("");
      setWalletAddress(""); // Reset walletAddress after successful signup
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Sign up failed:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Sign up failed:", (error as Error).message);
      }
    }
  };

  const logIn = async () => {
    try {
      const response = await apiClient.post("/login", { email, password });
      const {
        userId,
        referralCode,
        walletAddress: returnedWalletAddress, // Get walletAddress from response
        aaaBalance,
        referrals,
        token,
      } = response.data;

      setUserLoggedIn(true);
      setUserId(userId);
      setUserReferralCode(referralCode);
      setWalletAddress(returnedWalletAddress); // Set walletAddress state
      setAaaBalance(aaaBalance);
      setUserReferrals(referrals);
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Login failed:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Login failed:", (error as Error).message);
      }
      alert("Login failed. Please check your credentials.");
    }
  };

  const withdrawTokens = async () => {
    try {
      const response = await apiClient.post("/withdraw");
      setAaaBalance(response.data.aaaBalance);
      alert("Withdrawal successful!");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  const logout = () => {
    setUserLoggedIn(false);
    setUserId(null);
    setUserReferralCode("");
    setUserReferrals([]);
    setWalletAddress("");
    setAaaBalance(0);
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <div className={styles.authWrapper}>
      {userLoggedIn ? (
        <Dashboard
          userReferralCode={userReferralCode}
          walletAddress={walletAddress}
          aaaBalance={aaaBalance}
          userReferrals={userReferrals}
          onWithdrawTokens={withdrawTokens}
          onLogout={logout}
        />
      ) : (
        <AuthForm
          onSignUp={signUp}
          onLogIn={logIn}
          setEmail={setEmail}
          setPassword={setPassword}
          setReferralCode={setReferralCode}
          setWalletAddress={setWalletAddress}
        />
      )}
    </div>
  );
};

export default AuthWrapper;
