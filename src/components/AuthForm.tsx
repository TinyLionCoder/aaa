import React, { useState } from "react";

interface AuthFormProps {
  onSignUp: () => void;
  onLogIn: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setReferralCode: (code: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSignUp, onLogIn, setEmail, setPassword, setReferralCode }) => {
  return (
    <div>
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
      <input
        placeholder="Referral Code..."
        onChange={(e) => setReferralCode(e.target.value)}
      />
      <button onClick={onSignUp}>Sign Up</button>
      <button onClick={onLogIn}>Log In</button>
    </div>
  );
};

export default AuthForm;
