import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Import the new Sidebar component
import DashboardContent from "./DashboardContent";
import styles from "../css_modules/EnhancedDashboardStyles.module.css";
import BestAlgoDefi from "./BestAlgoDefi";
import { StakingAndFarms } from "./StakingAndFarms";
import { BuySellAAA } from "./BuySellAAA";
import { AAATeam } from "./AAATeam";
import { DonateAAA } from "./DonateAAA";
import { MyWallet } from "./MyWallet";
import { MyTeam } from "./MyTeam";

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
  const [activeComponent, setActiveComponent] = useState<string>("dashboard"); // Default to dashboard content

  // Map active component to corresponding JSX
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "bestAlgoDefi":
        return <BestAlgoDefi />;
      case "stakingAndFarms":
        return <StakingAndFarms />;
      case "buySellAAA":
        return <BuySellAAA />;
      case "aaaTeam":
        return <AAATeam />;
      case "donateAAA":
        return <DonateAAA />;
      case "myWallet":
        return <MyWallet />;
      case "myTeam":
        return <MyTeam />;
      case "dashboard":
        return (
          <DashboardContent
            aaaBalance={aaaBalance}
            referrals={referrals}
            verified={verified}
            userName={userName}
            referralLink={referralLink}
          />
        );
      default:
        return (
          <DashboardContent
            aaaBalance={aaaBalance}
            referrals={referrals}
            verified={verified}
            userName={userName}
            referralLink={referralLink}
          />
        );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Load Sidebar Component */}
      <Sidebar
        onLogout={onLogout}
        setActiveComponent={setActiveComponent} // Pass setActiveComponent to Sidebar
      />

      {/* Main Dashboard Content */}
      <main className={styles.dashboardContent}>
        <header className={styles.dashboardHeader}>
          <h1>Algo Adopt Airdrop</h1>
        </header>

        {/* User Info */}
        <div className={styles.userInfo}>
          <img src={userImage} alt="User" className={styles.userImage} />
          <h2>Hi {userName}</h2>
        </div>

        {/* Render Active Component */}
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default EnhancedDashboard;
