import React, { useState } from "react";

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
    <div>
      <br></br>
      <input
        placeholder="Email..."
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password..."
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br></br>
      <br></br>
      <input
        placeholder="Referral Code..."
        onChange={(e) => setReferralCode(e.target.value)}
      />
      <input
        placeholder="Wallet Address..."
        onChange={(e) => setWalletAddress(e.target.value)} // New field for wallet address
      />
      <br></br>
      <br></br>
      <button onClick={onSignUp}>Sign Up</button>
      <button onClick={onLogIn}>Log In</button>
    </div>
  );
};

export default AuthForm;
