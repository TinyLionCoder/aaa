import React, { useState } from "react";
import styles from "../css_modules/AuthFormStyles.module.css";

interface AuthFormProps {
  onSignUp: () => void;
  onLogInWithEmail: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setReferralCode: (code: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSignUp,
  onLogInWithEmail,
  setEmail,
  setPassword,
  setReferralCode,
}) => {
  const [useWalletLogin, setUseWalletLogin] = useState(true);

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
            type="text"
            onChange={(e) => setReferralCode(e.target.value)}
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
