import React, { useState } from "react";
import axios from "axios";

const DailyCheckIn = ({ userId }: { userId: string }) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    const BASE_URL = "https://aaa-api.onrender.com/api/v1/checkIn";
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/daily-checkin`,
        {
          userId: localStorage.getItem("userId"),
          email: localStorage.getItem("userEmail"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStatus(res.data.message);
      window.location.reload(); // Reload the page to reflect the updated status
    } catch (err: any) {
      setStatus(err.response?.data?.message || "Error checking in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Daily Check-In</h3>
      <button onClick={handleCheckIn} disabled={loading}>
        {loading ? "Checking in..." : "Check In Today"}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default DailyCheckIn;
