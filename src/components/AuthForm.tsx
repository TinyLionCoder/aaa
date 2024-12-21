import React, { useEffect, useState } from "react";
import styles from "../css_modules/AuthFormStyles.module.css";
import { useParams } from "react-router-dom";

interface AuthFormProps {
  onSignUp: () => void;
  onLogInWithEmail: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setReferralCode: (code: string) => void;
  initialReferralCode?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSignUp,
  onLogInWithEmail,
  setEmail,
  setPassword,
  setReferralCode,
  initialReferralCode = "",
}) => {
  const { referralCode: referralCodeParam } = useParams<{
    referralCode?: string;
  }>();
  const [useWalletLogin, setUseWalletLogin] = useState(true);
  const [referralCode, setLocalReferralCode] = useState(
    initialReferralCode || referralCodeParam || ""
  );

  // Update the referral code state from the route parameter
  useEffect(() => {
    if (referralCodeParam) {
      setLocalReferralCode(referralCodeParam);
      setReferralCode(referralCodeParam); // Update parent state
    }
  }, [referralCodeParam, setReferralCode]);

  const handleReferralCodeChange = (code: string) => {
    setLocalReferralCode(code);
    setReferralCode(code); // Update parent state
  };

  return (
    <div className={styles.authFormContainer}>
      {/* Sign Up Card */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Sign Up</h2>
        <div className={styles.authFormInputs}>
          <input
            className={styles.authInput}
            placeholder="Email..."
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.authInput}
            placeholder="Password..."
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className={styles.authInput}
            placeholder="Referral Code..."
            value={referralCode}
            type="text"
            onChange={(e) => handleReferralCodeChange(e.target.value)}
          />
        </div>
        <button className={styles.authButton} onClick={onSignUp}>
          Sign Up
        </button>
      </div>

      {/* Login Card */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Log In</h2>
        <div className={styles.toggleContainer}>
          {useWalletLogin ? (
            <button
              className={`${styles.toggleButton} ${
                !useWalletLogin ? styles.active : ""
              }`}
              onClick={() => setUseWalletLogin(false)}
            >
              Click here to login With Email
            </button>
          ) : (
            <></>
          )}
        </div>
        {!useWalletLogin ? (
          <div className={styles.authFormInputs}>
            <input
              className={styles.authInput}
              placeholder="Email..."
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.authInput}
              placeholder="Password..."
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.authButton} onClick={onLogInWithEmail}>
              Log In with Email
            </button>
          </div>
        ) : (
          <div className={styles.walletLogin}>
            <p className={styles.walletMessage}>
              Connect your wallet to log in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
