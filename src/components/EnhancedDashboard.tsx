import React from "react";
import { Link } from "react-router-dom";
import styles from "../css_modules/EnhancedDashboardStyles.module.css";

interface EnhancedDashboardProps {
  userName: string;
  userImage: string;
  aaaBalance: number;
  referrals: number;
  verified: boolean;
  referralLink: string;
  onLogout: () => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  userName,
  userImage,
  aaaBalance,
  referrals,
  verified,
  referralLink,
  onLogout,
}) => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Side Navigation */}
      <aside className={styles.sideNav}>
        <h3 className={styles.appName}>Dashboard</h3>
        <nav>
          <ul>
            <li className={styles.navItem}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Dashboard Content */}
      <main className={styles.dashboardContent}>
        {/* Header */}
        <header className={styles.dashboardHeader}>
          <h1>Algo Airdrop Adopt</h1>
        </header>

        {/* User Info */}
        <div className={styles.userInfo}>
          <img src={userImage} alt="User" className={styles.userImage} />
          <h2>{userName}</h2>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <h3>AAA Balance</h3>
            <p>{aaaBalance} AAA</p>
          </div>
          <div className={styles.statCard}>
            <h3>Company Sponsor</h3>
            <p>Example Sponsor</p>
          </div>
          <div className={styles.statCard}>
            <h3>Referrals</h3>
            <p>{referrals}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Status</h3>
            <p>{verified ? "Verified" : "Not Verified"}</p>
          </div>
        </div>

        {/* Detailed Cards */}
        <div className={styles.detailCards}>
          <div className={styles.detailCard}>
            <h3>Account Info</h3>
            <p>Name: {userName}</p>
            <p>Status: {verified ? "Verified" : "Not Verified"}</p>
          </div>
          <div className={styles.detailCard}>
            <h3>Account Balance</h3>
            <p>Total Payouts: $500</p>
            <p>AAA Balance: {aaaBalance}</p>
          </div>
          <div className={styles.detailCard}>
            <h3>AAA Stats</h3>
            <p>Team Members: 20</p>
            <p>Other Stats...</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className={styles.referralSection}>
          <h3>Your Referral Code</h3>
          <p>{referralLink}</p>
        </div>

        {/* Calculator */}
        <div className={styles.calculator}>
          <h3>Referral Calculator</h3>
          <p>Enter the number of referrals to estimate payouts:</p>
          <input type="number" placeholder="Number of Referrals" />
          <button>Calculate</button>
        </div>

        <button onClick={onLogout} className={styles.logoutButton}>
          Log Out
        </button>
      </main>
    </div>
  );
};

export default EnhancedDashboard;
