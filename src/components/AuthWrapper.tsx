import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";

const AuthWrapper = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(""); // Default to an empty string
  const [userId, setUserId] = useState(null); // Store the user ID
  const [userReferralCode, setUserReferralCode] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userReferrals, setUserReferrals] = useState([]);
  const [aaaBalance, setAaaBalance] = useState(0);
  const [token, setToken] = useState<string | null>(null); // Store the JWT token

  // Axios instance with interceptor for Authorization header
  const apiClient = axios.create({
    baseURL: "http://localhost:5000/api/v1", // Update with your backend URL
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
      const safeReferralCode = referralCode || ""; // Ensure referralCode is always a string
      console.log("Sign-up data:", {
        email,
        password,
        referralCode: safeReferralCode,
      });

      const response = await apiClient.post("/signup", {
        email,
        password,
        referralCode: safeReferralCode,
      });

      const {
        userId,
        referralCode: returnedReferralCode,
        aaaBalance,
        token,
      } = response.data;

      setUserLoggedIn(true);
      setUserId(userId);
      setUserReferralCode(returnedReferralCode);
      setAaaBalance(aaaBalance);
      setToken(token);
      localStorage.setItem("token", token); // Persist token in localStorage

      // Clear referral code after successful signup
      setReferralCode(""); // Reset the referral code state
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
      const { userId, referralCode, aaaBalance, referrals, token } =
        response.data;

      setUserLoggedIn(true);
      setUserId(userId);
      setUserReferralCode(referralCode);
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
    } catch (error) {}
  };

  const logout = () => {
    setUserLoggedIn(false);
    setUserId(null);
    setUserReferralCode("");
    setUserReferrals([]);
    setAaaBalance(0);
    setToken(null);
    localStorage.removeItem("token"); // Clear token from localStorage
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <div>
      {userLoggedIn ? (
        <Dashboard
          userReferralCode={userReferralCode}
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
        />
      )}
    </div>
  );
};

export default AuthWrapper;
