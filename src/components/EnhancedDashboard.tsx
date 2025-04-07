import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar"; // Import the new Sidebar component
import DashboardContent from "./DashboardContent";
import styles from "../css_modules/EnhancedDashboardStyles.module.css";
import BestAlgoDefi from "./BestAlgoDefi";
import { StakingAndFarms } from "./StakingAndFarms";
import BuySellAAA from "./BuySellAAA";
import { AAATeam } from "./AAATeam";
import { DonateAAA } from "./DonateAAA";
import { MyWallet } from "./MyWallet";
import { MyTeam } from "./MyTeam";
import axios from "axios";
import { AAASwap } from "./AAASwap";
import { CreateAirdrop } from "./CreateAirdrop";
import { ClaimAirdrop } from "./ClaimAirdrop";
import SetupAndVerify from "./SetupAndVerify";
import { ClaimAirdropDiamondHands } from "./ClaimAirdropDiamondHands";
import { ClaimAirdropWealthBuilders } from "./ClaimAirdropWealthBuilders";
import VotingAndReviews from "./VotingAndReviews";

interface EnhancedDashboardProps {
  userName: string;
  userImage: string;
  aaaBalance: number;
  referrals: number;
  verified: boolean;
  referralLink: string;
  userId: string | null;
  onLogout: () => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  userName,
  userImage,
  aaaBalance,
  referrals,
  verified,
  referralLink,
  userId,
  onLogout,
}) => {
  const [activeComponent, setActiveComponent] =
    useState<string>("bestAlgoDefi"); // Default to dashboard content
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalVerifiedMembers, setTotalVerifiedMembers] = useState<number>(0);
  const [loadingTotalMembers, setLoadingTotalMembers] = useState<boolean>(true);
  const [loadingTotalVerifiedMembers, setLoadingTotalVerifiedMembers] =
    useState<boolean>(true);

  const apiClient = axios.create({
    baseURL: "https://aaa-api.onrender.com/api/v1/members",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    getTotalMembers();
    getTotalVerifiedMembers();
  }, []);

  const getTotalMembers = async () => {
    try {
      setLoadingTotalMembers(true);
      const response = await apiClient.post("/get-total-members");
      if (response.data && typeof response.data.totalMembers === "number") {
        setTotalMembers(response.data.totalMembers);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      console.error("Failed to fetch total members:", error);
      setTotalMembers(0); // Fallback to 0 if the API fails
    } finally {
      setLoadingTotalMembers(false);
    }
  };
  const getTotalVerifiedMembers = async () => {
    try {
      setLoadingTotalVerifiedMembers(true);
      const response = await apiClient.post("/get-total-Verified-members");
      if (
        response.data &&
        typeof response.data.totalVerifiedMembers === "number"
      ) {
        setTotalVerifiedMembers(response.data.totalVerifiedMembers);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      console.error("Failed to fetch total Verified members:", error);
      setTotalVerifiedMembers(0); // Fallback to 0 if the API fails
    } finally {
      setLoadingTotalVerifiedMembers(false);
    }
  };

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
      case "AAASwap":
        return <AAASwap />;
      case "myTeam":
        return <MyTeam userId={userId} />;
      case "createAirdrop":
        return <CreateAirdrop />;
      case "claimAirdrop":
        return <ClaimAirdrop />;
      case "setupAndVerify":
        return <SetupAndVerify userId={userId} />;
      case "diamondHands":
        return <ClaimAirdropDiamondHands />;
      case "wealthBuilders":
        return <ClaimAirdropWealthBuilders />;
      case "votingForAAA":
        return <VotingAndReviews />;
      case "dashboard":
        return (
          <DashboardContent
            aaaBalance={aaaBalance}
            referrals={referrals}
            verified={verified}
            userName={userName}
            referralLink={referralLink}
            userId={userId}
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
            userId={userId}
          />
        );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Load Sidebar Component */}
      <Sidebar
        verfied={verified}
        onLogout={onLogout}
        setActiveComponent={setActiveComponent} // Pass setActiveComponent to Sidebar
      />

      {/* Main Dashboard Content */}
      <main className={styles.dashboardContent}>
        <header className={styles.dashboardHeader}>
          <h1>Algo Adopt Airdrop</h1>
          <h2 className={styles.totalMembers}>
            {loadingTotalVerifiedMembers
              ? ""
              : `Total Verified Members / Total Members: ${totalVerifiedMembers} / ${totalMembers}`}
          </h2>
          {/* <h2 className={styles.totalMembers}>
            {loadingTotalMembers ? "" : `Total Members: ${totalMembers}`}
          </h2> */}
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
