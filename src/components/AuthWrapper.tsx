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
  const [isEmailVerified, setIsEmailVerified] = useState(false); // New state for email verification
  const [userReferrals, setUserReferrals] = useState([]);
  const [aaaBalance, setAaaBalance] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  const peraWalletRef = useRef<{ disconnectWallet: () => void } | null>(null);
  const [disconnecting, setDisconnecting] = useState(false); // New state to handle recursion

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

  const handleWalletDisconnect = () => {
    if (!disconnecting) {
      logout(false); // Pass `false` to avoid triggering wallet disconnect again
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

      alert("Signup successful! Please check your email to verify your account.");
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
        emailVerified, // Add email verification status from the backend
      } = response.data;

      if (emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }

      setUserLoggedIn(true);
      setIsEmailVerified(true); // Set email verification status
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
        emailVerified, // Add email verification status from the backend
      } = response.data;

      if (!emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }

      setUserLoggedIn(true);
      setIsEmailVerified(true); // Set email verification status
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

  const logout = (triggerWalletDisconnect = true) => {
    setDisconnecting(true); // Prevent recursive calls
    setUserLoggedIn(false);
    setIsEmailVerified(false); // Reset email verification status
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

    if (triggerWalletDisconnect) {
      peraWalletRef.current?.disconnectWallet();
    }

    setTimeout(() => setDisconnecting(false), 100); // Reset disconnecting guard after a short delay
  };

  return (
    <div className={styles.authWrapper}>
      <PeraWalletButton
        ref={peraWalletRef}
        onConnect={handleWalletConnect}
        onDisconnect={handleWalletDisconnect}
      />
      {userLoggedIn && isEmailVerified ? ( // Check email verification status
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
