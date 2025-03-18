import React, { useEffect, useState } from "react";
import {
  FaCoins,
  FaUserFriends,
  FaShieldAlt,
  FaInfoCircle,
  FaWallet,
  FaChartLine,
  FaRegIdBadge,
  FaCheck,
} from "react-icons/fa";
import axios from "axios";
import styles from "../css_modules/DashboardContentStyles.module.css";
import { AccountBalance } from "./AccountBalance";
import { ReferralCalculator } from "./ReferralCalculator";
import { AaaStats } from "./AaaStats";
import { learner, wealthBuilder } from "../helpers/setBadgeStatus";
import learn from "../images/learner.png";
import wealthBuilderBadge from "../images/Wealthbuilder.png";
import diamondHandsBadge from "../images/diamonhands.png";

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
  const [verifiedCount, setVerifiedCount] = useState<number | null>(null);

  useEffect(() => {
    if (userId) {
      fetchVerifiedCount();
    }
  }, [userId]);

  const fetchVerifiedCount = async () => {
    try {
      const verifiedResponse = await axios.post(
        "https://aaa-api.onrender.com/api/v1/pay/get-ready-for-payout",
        {
          userId,
          email: localStorage.getItem("email"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setVerifiedCount(verifiedResponse.data.verifiedCount);
    } catch (err) {
      console.error("Error fetching verified team members:", err);
      setVerifiedCount(null); // Ensure it does not display incorrect info
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className={styles.statsCards}>
        <div className={`${styles.statCard} ${styles["statCard-balance"]}`}>
          <h4>
            <FaCoins className={styles.icon} /> Pending Verification Balance
          </h4>
          {verified ? (
            <p>{aaaBalance} AAA</p>
          ) : (
            <p>
              <strong>{aaaBalance} AAA (Pending)</strong>
              <br />
              <span className={styles.pendingMessage}>
                Requires verification to claim rewards.
              </span>
            </p>
          )}
          <div>
            <h4>
              <FaCheck className={styles.eligibleForPayout} /> Ready for payout
            </h4>
            {verifiedCount ? <p>{verifiedCount * 5 + 5} AAA</p> : <p>0 AAA</p>}
          </div>
        </div>
        <div className={`${styles.statCard} ${styles["statCard-sponsor"]}`}>
          <h3>
            <FaRegIdBadge className={styles.icon} /> Ranking and Badges
          </h3>
          <div className={`${styles.badgesAndRanking}`}>
            <p>
              {localStorage.getItem("badgeRanking") === learner ? (
                <img src={learn} alt="badge" style={{ maxWidth: "60px" }} />
              ) : localStorage.getItem("badgeRanking") === wealthBuilder ? (
                <img
                  src={wealthBuilderBadge}
                  alt="badge"
                  style={{ maxWidth: "60px" }}
                />
              ) : (
                <img
                  src={diamondHandsBadge}
                  alt="badge"
                  style={{ maxWidth: "60px" }}
                />
              )}
            </p>
            <h4>{localStorage.getItem("badgeRanking")}</h4>
          </div>
          <a
            href="https://www.algoadoptairdrop.com/badges"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.badgesAndRankingLink}
          >
            View Rank Details
          </a>
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
          {/* Payments will be deposited directly into your wallets the first week
          of every month */}
          We are working on security and efficiency, Once ready, all aaa tokens
          from verified members will be deposited directly into your wallets
        </p>
      </div>

      {/* Referral Link */}
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

      {/* Calculator */}
      <div className={styles.calculator}>
        <ReferralCalculator />
      </div>
    </div>
  );
};

export default DashboardContent;
