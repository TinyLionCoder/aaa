import React, { useEffect, useState } from "react";
import axios from "axios";

interface AccountBalanceProps {
  userId: string | null;
}

export const AccountBalance = ({ userId }: AccountBalanceProps) => {
  const [totalPayout, setTotalPayout] = useState<number | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<
    { payoutAmount: number; txId: string; timestamp: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://aaa-api.onrender.com/api/v1";

  useEffect(() => {
    if (userId) {
      const fetchPayouts = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}/payouts/total/${userId}`
          );
          setTotalPayout(response.data.totalPayout);
          setPayoutHistory(response.data.payouts);
        } catch (err: any) {
          setError("An error occurred while fetching payouts.");
        } finally {
          setLoading(false);
        }
      };

      fetchPayouts();
    }
  }, [userId]);

  return (
    <div>
      <h2>Payments Received</h2>
      {loading && <p>Loading...</p>}
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
      {/* {!loading && !error && totalPayout !== null && ( */}
        <div>
          <p>Coming Soon</p>
          {/* <p>Total Payout: {totalPayout} AAA Tokens</p> */}
        </div>
      {/* )} */}
    </div>
  );
};
