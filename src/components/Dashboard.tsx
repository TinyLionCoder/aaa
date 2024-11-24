import React from "react";

interface DashboardProps {
  userReferralCode: string;
  walletAddress: string; // Add walletAddress to props
  aaaBalance: number;
  userReferrals: string[];
  onWithdrawTokens: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userReferralCode,
  walletAddress, // Destructure walletAddress
  aaaBalance,
  userReferrals,
  onWithdrawTokens,
  onLogout,
}) => {
  return (
    <div>
      <h2>Welcome back!</h2>
      <p>
        Your Referral Code: <strong>{userReferralCode}</strong>
      </p>
      <p>
        Your Wallet Address: <strong>{walletAddress}</strong>
      </p>
      <p>
        Your Balance: <strong>{aaaBalance} AAA Tokens</strong>
      </p>
      <h3>Your Referrals:</h3>
      {userReferrals.length > 0 ? (
        <ul>
          {userReferrals.map((referralId) => (
            <li key={referralId}>{referralId}</li>
          ))}
        </ul>
      ) : (
        <p>No referrals yet. Share your code to start earning rewards!</p>
      )}
      <button onClick={onWithdrawTokens}>Withdraw Tokens</button>
      <button onClick={onLogout}>Log Out</button>
    </div>
  );
};

export default Dashboard;
