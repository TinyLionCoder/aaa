import React, { useState } from "react";
import styles from "../css_modules/ReferralCalculatorStyles.module.css";

export const ReferralCalculator: React.FC = () => {
  const rewardPerReferral = 5; // Tokens earned per referral at each level
  const referralLabels = [
    "Your Referrals",
    "Your Referrals' Referrals",
    "Your Referrals' Referrals' Referrals",
    "Your Referrals' Referrals' Referrals' Referrals",
    "Your Referrals' Referrals' Referrals' Referrals' Referrals",
  ];

  const [referrals, setReferrals] = useState<number[]>([0, 0, 0, 0, 0]); // Start referrals at 0

  const calculateEarnings = (): { levelEarnings: number[]; totalEarnings: number } => {
    let downstreamReferrals = 1; // Start with yourself (1 referral unit)
    const levelEarnings: number[] = [];
    let totalEarnings = 0;

    for (let level = 0; level < referrals.length; level++) {
      const earnings = downstreamReferrals * referrals[level] * rewardPerReferral;
      levelEarnings.push(earnings);

      // Update total earnings to reflect the latest non-zero value
      if (earnings > 0) {
        totalEarnings = earnings;
      }

      // Propagate referrals downstream
      downstreamReferrals *= referrals[level];
    }

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
