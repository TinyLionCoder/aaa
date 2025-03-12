import axios from "axios";
import { algoIndexerClient } from "../algorand/config";

const assetId = "2004387843"; // AAA Token Asset ID
const vestigeApiUrl = `https://free-api.vestige.fi/asset/${assetId}/price?currency=usd`;

export const setBadgeStatus = async (walletAddress: string | null) => {
  if (!walletAddress) {
    localStorage.setItem(
      "badgeRanking",
      "Connect wallet to see badge / ranking status"
    );
    return;
  }

  try {
    // Fetch current AAA price in USD
    const priceResponse = await axios.get(vestigeApiUrl);
    const currentPrice = priceResponse.data?.price || 0;

    // Fetch wallet balances from Algorand indexer
    const accountInfo = await algoIndexerClient
      .lookupAccountByID(walletAddress)
      .do();

    const algoBalance = (accountInfo.account.amount || 0) / 1e6; // Convert microAlgos to ALGO
    const aaaBalance =
      (accountInfo.account.assets?.find(
        (asset: any) => asset["asset-id"] === parseInt(assetId)
      )?.amount || 0) / 1e10; // Convert microTokens to tokens

    const aaaUsdValue = aaaBalance * currentPrice; // Convert AAA balance to USD value

    let badge = "Learner"; // Default status

    if (algoBalance >= 200 || aaaUsdValue >= 200) {
      badge = "Wealth Builder";
    } else if (algoBalance >= 100 || aaaUsdValue >= 100) {
      badge = "Investor";
    }

    localStorage.setItem("badgeRanking", badge);
    return;
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return;
  }
};
