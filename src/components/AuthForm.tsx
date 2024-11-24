import React from "react";
import styles from "../css_modules/AuthFormStyles.module.css";

interface AuthFormProps {
  onSignUp: () => void;
  onLogIn: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setReferralCode: (code: string) => void;
  setWalletAddress: (wallet: string) => void; // Add walletAddress setter
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSignUp,
  onLogIn,
  setEmail,
  setPassword,
  setReferralCode,
  setWalletAddress,
}) => {
  return (
    <div className={styles.authForm}>
      <h1 className={styles.authFormTitle}>Welcome</h1>
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
          onChange={(e) => setReferralCode(e.target.value)}
        />
        <input
          className={styles.authInput}
          placeholder="Wallet Address..."
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      </div>
      <div className={styles.authFormButtons}>
        <button className={styles.authButton} onClick={onSignUp}>
          Sign Up
        </button>
        <button className={styles.authButton} onClick={onLogIn}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
