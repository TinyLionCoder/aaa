import React, { useState } from "react";
import styles from "../css_modules/ContestNotificationStyles.module.css";

interface ContestNotificationProps {
  title?: string;
  description?: string;
  platform?: string;
  instructions?: string;
  reward?: number;
  contactHandle?: string;
  expiryDate?: string;
}

const ContestNotification: React.FC<ContestNotificationProps> = ({
  title = "AAA Community Contest",
  description = "Hey AAA family! Join our latest contest and earn AAA tokens for your participation.",
  platform = "Twitter",
  instructions = "Follow @TinyLionCoder @TLPCoin @ConnectionMach then, create a post on X saying: 'Just discovered Algo Adopt Airdrop - a platform where you earn 5 AAA tokens just for joining, plus 5 AAA tokens for each person you refer! Check it out at algoadoptairdrop.com #Algorand #Crypto #Airdrop'",
  reward = 350,
  contactHandle = "@TinyLionCoder",
  expiryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // Default 7 days from now
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric", 
      year: "numeric"
    });
  };

  return (
    <div className={styles.contestsContainer}>
      <h2 className={styles.contestsHeader}>
        <span className={styles.contestsIcon}>🏆</span> 
        Active Contest
      </h2>
      
      <div className={`${styles.contestCard} ${isExpanded ? styles.expanded : ''}`}>
        <div 
          className={styles.contestHeader} 
          onClick={toggleExpand}
        >
          <h3 className={styles.contestTitle}>{title}</h3>
          <div className={styles.contestMeta}>
            <span className={styles.contestReward}>{reward} AAA</span>
            <span className={styles.contestExpiry}>Ends: {formatDate(expiryDate)}</span>
            <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
              ▼
            </span>
          </div>
        </div>
        
        {isExpanded && (
          <div className={styles.contestDetails}>
            <p className={styles.contestDescription}>{description}</p>
            
            <div className={styles.contestInstructions}>
              <h4>How to participate:</h4>
              <ol>
                <li>Go to <span className={styles.platformName}>{platform}</span></li>
                <li>{instructions}</li>
                <li>DM <span className={styles.contactHandle}>{contactHandle}</span> to claim your reward</li>
              </ol>
            </div>
            
            <a 
              href={`https://${platform.toLowerCase()}.com`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.participateButton}
            >
              Go to {platform}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestNotification;