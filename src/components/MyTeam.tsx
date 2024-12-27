import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css_modules/MyTeamStyles.module.css";

interface MyTeamProps {
  userId: string | null;
}

interface TeamLevelData {
  level: number;
  count: number;
}

export const MyTeam = ({ userId }: MyTeamProps) => {
  const [teamData, setTeamData] = useState<TeamLevelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "https://aaa-api.onrender.com/api/v1/my-team",
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

      // Assuming the API returns data as an array of { level, count }
      setTeamData(response.data.data);
    } catch (err) {
      console.error("Error fetching team data:", err);
      setError("Failed to load team data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTeamData();
    }
  }, [userId]);

  if (loading) {
    return <p className={styles.loading}>Loading your team data...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Team</h1>
      <div className={styles.levels}>
        {teamData.map(({ level, count }) => (
          <div key={level} className={styles.level}>
            <p>
              <strong>Level {level}:</strong> {count} referrals
            </p>
          </div>
        ))}
      </div>
      <p className={styles.info}>
        <strong>Each level earns you atleast 5 AAA tokens</strong>
      </p>
    </div>
  );
};
