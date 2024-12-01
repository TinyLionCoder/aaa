import React from "react";
import { Link } from "react-router-dom";
import {
  FaWallet,
  FaUsers,
  FaChartBar,
  FaDonate,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa"; // Example icons
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
            {/* Dropdown: Best Algo Defi */}
            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <FaChartBar className={styles.icon} />
              <span>Best Algo Defi</span>
              <ul className={styles.dropdownMenu}>
                <li>Coming Soon</li>
              </ul>
            </li>

            {/* Dropdown: Staking and Farms */}
            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <FaCogs className={styles.icon} />
              <span>Staking and Farms</span>
              <ul className={styles.dropdownMenu}>
                <li>Coming Soon</li>
              </ul>
            </li>

            {/* Normal Link: Buy & Sell AAA */}
            <li className={styles.navItem}>
              <FaShoppingCart className={styles.icon} />
              <span>Buy & Sell AAA</span>
            </li>

            {/* Dropdown: AAA Team */}
            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <FaUsers className={styles.icon} />
              <span>AAA Team</span>
              <ul className={styles.dropdownMenu}>
                <li>Coming Soon</li>
              </ul>
            </li>

            {/* Dropdown: Donate AAA */}
            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <FaDonate className={styles.icon} />
              <span>Donate AAA</span>
              <ul className={styles.dropdownMenu}>
                <li>Coming Soon</li>
              </ul>
            </li>

            {/* Dropdown: My Wallet */}
            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <FaWallet className={styles.icon} />
              <span>My Wallet</span>
              <ul className={styles.dropdownMenu}>
                <li>Coming Soon</li>
              </ul>
            </li>

            {/* Normal Link: My Team */}
            <li className={styles.navItem}>
              <FaUsers className={styles.icon} />
              <span>My Team</span>
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
          <h2>Hi {userName}</h2>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <h3>AAA Balance</h3>
            <p>{aaaBalance} AAA</p>
          </div>
          <div className={styles.statCard}>
            <h3>Company Sponsor</h3>
            <p>Coming Soon</p>
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
            <p>Coming Soon</p>
          </div>
          <div className={styles.detailCard}>
            <h3>AAA Stats</h3>
            <p>Coming Soon</p>
            {/* <p>Team Members: 20</p>
            <p>Other Stats...</p> */}
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
          <p>Coming Soon</p>
          {/* <p>Enter the number of referrals to estimate payouts:</p>
          <input type="number" placeholder="Number of Referrals" /> */}
          {/* <button>Calculate</button> */}
        </div>

        <button onClick={onLogout} className={styles.logoutButton}>
          Log Out
        </button>
      </main>
    </div>
  );
};

export default EnhancedDashboard;
