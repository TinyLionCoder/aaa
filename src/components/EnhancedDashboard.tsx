import React from "react";
import Sidebar from "./Sidebar"; // Import the new Sidebar component
import DashboardContent from "./DashboardContent";
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
      {/* Load Sidebar Component */}
      <Sidebar onLogout={onLogout} />

      {/* Main Dashboard Content */}
      <main className={styles.dashboardContent}>
        <header className={styles.dashboardHeader}>
          <h1>Algo Airdrop Adopt</h1>
        </header>

        {/* User Info */}
        <div className={styles.userInfo}>
          <img src={userImage} alt="User" className={styles.userImage} />
          <h2>Hi {userName}</h2>
        </div>

        {/* Load DashboardContent Component */}
        <DashboardContent
          aaaBalance={aaaBalance}
          referrals={referrals}
          verified={verified}
          userName={userName}
          referralLink={referralLink}
        />
      </main>
    </div>
  );
};

export default EnhancedDashboard;
