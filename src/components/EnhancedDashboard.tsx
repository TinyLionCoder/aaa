import React, { useState } from "react";
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

// Example components for sidebar items
const BestAlgoDefi = () => <div>Best Algo Defi Coming Soon</div>;
const StakingAndFarms = () => <div>Staking and Farms Coming Soon</div>;
const BuySellAAA = () => <div>Buy & Sell AAA Coming Soon</div>;
const AAATeam = () => <div>AAA Team Coming Soon</div>;
const DonateAAA = () => <div>Donate AAA Coming Soon</div>;
const MyWallet = () => <div>My Wallet Coming Soon</div>;
const MyTeam = () => <div>My Team Coming Soon</div>;

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
          <h1>Algo Airdrop Adopt</h1>
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
