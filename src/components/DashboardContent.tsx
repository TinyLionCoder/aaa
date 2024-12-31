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
          {verified ? (
            <p>{aaaBalance} AAA</p>
          ) : (
            <p>
              <strong>
                {aaaBalance} AAA (Pending)
              </strong>
              <br />
              <span className={styles.pendingMessage}>
                Requires verification to claim rewards.
              </span>
            </p>
          )}
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

      <div className={styles.notificatioSection}>
        <h3>Notification</h3>
        <p className={styles.content}>
          Payments will be deposited directly into your wallets the first week
          of every month
        </p>
      </div>

      {/* Referral Link */}
      {verified && (
        <div className={styles.referralSection}>
          <h3>Your Referral Link</h3>
          <a
            href={referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.referralLink}
          >
            {referralLink}
          </a>
        </div>
      )}

      {/* Calculator */}
      <div className={styles.calculator}>
        <ReferralCalculator />
      </div>
    </div>
  );
};

export default DashboardContent;
