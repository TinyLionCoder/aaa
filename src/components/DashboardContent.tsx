import React from "react";
import {
  FaCoins,
  FaBuilding,
  FaUserFriends,
  FaShieldAlt,
  FaInfoCircle,
  FaWallet,
  FaChartLine,
} from "react-icons/fa";
import styles from "../css_modules/DashboardContentStyles.module.css";
import { AccountBalance } from "./AccountBalance";
import { ReferralCalculator } from "./ReferralCalculator";
import { AaaStats } from "./AaaStats";

interface DashboardContentProps {
  aaaBalance: number;
  referrals: number;
  verified: boolean;
  userName: string;
  referralLink: string;
  userId: string | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  aaaBalance,
  referrals,
  verified,
  userName,
  referralLink,
  userId,
}) => {
  return (
    <div>
      {/* Stats Cards */}
      <div className={styles.statsCards}>
        <div className={`${styles.statCard} ${styles["statCard-balance"]}`}>
          <h3>
            <FaCoins className={styles.icon} /> AAA Balance
          </h3>
          <p>{aaaBalance} AAA</p>
        </div>
        <div className={`${styles.statCard} ${styles["statCard-sponsor"]}`}>
          <h3>
            <FaBuilding className={styles.icon} /> Company Sponsor
          </h3>
          <p>Coming Soon</p>
        </div>
        <div className={`${styles.statCard} ${styles["statCard-referrals"]}`}>
          <h3>
            <FaUserFriends className={styles.icon} /> Referrals
          </h3>
          <p>{referrals}</p>
        </div>
        <div className={`${styles.statCard} ${styles["statCard-status"]}`}>
          <h3>
            <FaShieldAlt className={styles.icon} /> Status
          </h3>
          <p>{verified ? "Verified" : "Not Verified"}</p>
        </div>
      </div>

      {/* Detailed Cards */}
      <div className={styles.detailCards}>
        <div className={styles.detailCard}>
          <FaInfoCircle className={styles.icon} />
          <h3>Account Info</h3>
          <p>Name: {userName}</p>
          <p>Status: {verified ? "Verified" : "Not Verified"}</p>
        </div>
        <div className={styles.detailCard}>
          <FaWallet className={styles.icon} />
          <AccountBalance userId={userId} />
        </div>
        <div className={styles.detailCard}>
          <FaChartLine className={styles.icon} />
          <AaaStats />
        </div>
      </div>

      {/* Referral Link */}
      <div className={styles.referralSection}>
        <h3>Your Referral Code</h3>
        <a
          href={referralLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.referralLink}
        >
          {referralLink}
        </a>
      </div>

      {/* Calculator */}
      <div className={styles.calculator}>
        <ReferralCalculator />
        {/* <p>Enter the number of referrals to estimate payouts:</p>
        <input type="number" placeholder="Number of Referrals" /> */}
        {/* <button>Calculate</button> */}
      </div>
    </div>
  );
};

export default DashboardContent;
