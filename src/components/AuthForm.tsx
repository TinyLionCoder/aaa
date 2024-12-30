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
  const [password, setLocalPassword] = useState(""); // Local password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm Password
  const [passwordStrength, setPasswordStrength] = useState(""); // Password Strength Feedback
  const [passwordError, setPasswordError] = useState(""); // Confirm Password Error
  const [email, setLocalEmail] = useState(""); // Local email state

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

  const handleEmailChange = (emailInput: string) => {
    setLocalEmail(emailInput);
    setEmail(emailInput); // Update parent state
  };

  // Check Password Strength
  const handlePasswordChange = (password: string) => {
    setLocalPassword(password);

    // Password strength logic
    if (password.length < 8) {
      setPasswordStrength("Password must be at least 8 characters long.");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordStrength(
        "Password must include at least one uppercase letter."
      );
    } else if (!/[0-9]/.test(password)) {
      setPasswordStrength("Password must include at least one number.");
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordStrength(
        "Password must include at least one special character."
      );
    } else {
      setPasswordStrength("Strong password!");
    }
  };

  // Validate Confirm Password
  const handleConfirmPasswordChange = (confirmPasswordInput: string) => {
    setConfirmPassword(confirmPasswordInput);
    setPassword(password); // Ensure the parent state gets the final password
    if (confirmPasswordInput !== password) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  };

  // Check if all fields are valid
  const isSignUpDisabled = !(
    email &&
    password &&
    confirmPassword &&
    passwordStrength === "Strong password!" &&
    passwordError === ""
  );

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
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          <input
            className={styles.authInput}
            placeholder="Password..."
            type="password"
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          <input
            className={styles.authInput}
            placeholder="Confirm Password..."
            type="password"
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          />
          <input
            className={styles.authInput}
            placeholder="Referral Code..."
            value={referralCode}
            type="text"
            onChange={(e) => handleReferralCodeChange(e.target.value)}
          />
          <p className={styles.passwordFeedback}>{passwordStrength}</p>
          <p className={styles.errorFeedback}>{passwordError}</p>
        </div>
        <button
          className={styles.authButton}
          onClick={onSignUp}
          disabled={isSignUpDisabled}
        >
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
