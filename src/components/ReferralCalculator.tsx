import React, { useState } from "react";
import styles from "../css_modules/ReferralCalculatorStyles.module.css";

export const ReferralCalculator: React.FC = () => {
  const rewardPerReferral = 5; // Tokens earned per referral at each level
  const referralLabels = [
    "Your Friends",
    "Your Friends' Friends",
    "Your Friends' Friends' Friends",
    "Your Friends' Friends' Friends' Friends",
    "Your Friends' Friends' Friends' Friends' Friends",
  ];

  const [referrals, setReferrals] = useState<number[]>([0, 0, 0, 0, 0]); // Start referrals at 0

  const calculateEarnings = (): { levelEarnings: number[]; totalEarnings: number } => {
    // Calculate rewards per level based on fixed referral counts
    const levelEarnings = referrals.map((count) => count * rewardPerReferral);

    // Calculate total earnings
    const totalEarnings = levelEarnings.reduce((acc, curr) => acc + curr, 0);

    return { levelEarnings, totalEarnings };
  };
  

  const { levelEarnings, totalEarnings } = calculateEarnings();

  const handleReferralChange = (level: number, value: number) => {
    const updatedReferrals = [...referrals];
    updatedReferrals[level] = value;
    setReferrals(updatedReferrals);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Referral Calculator</h3>
      <p className={styles.description}>
        Customize the number of referrals at each level to estimate your potential AAA token earnings.
      </p>
      <div className={styles.levelInputs}>
        {referralLabels.map((label, level) => (
          <div key={level} className={styles.levelRow}>
            <label htmlFor={`level-${level}`} className={styles.label}>
              {label} (Referrals):
            </label>
            <input
              id={`level-${level}`}
              type="number"
              min={0}
              value={referrals[level]}
              onChange={(e) => handleReferralChange(level, Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.earnings}>
              Earn: {levelEarnings[level]} AAA Tokens
            </span>
          </div>
        ))}
      </div>
      <div className={styles.totalEarningsContainer}>
        <h4 className={styles.totalHeading}>Total Earnings</h4>
        <p className={styles.totalAmount}>{totalEarnings} AAA Tokens</p>
      </div>
    </div>
  );
};
