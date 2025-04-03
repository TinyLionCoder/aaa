import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Use axios for API calls
import { FaTruckLoading } from "react-icons/fa";
import tokenData from "../constants/tokenData";
import styles from "../css_modules/TokenBubblesStyles.module.css";

const TokenBubbles = ({ initialTokens = tokenData, priceChangeIntervalProp = "1D" }) => {
  const [bubbleTokens, setBubbleTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(initialTokens === null);
  const [priceChangeInterval, setPriceChangeInterval] = useState(priceChangeIntervalProp);
  const [error, setError] = useState<string | null>(null);

  // If initialTokens is provided, use it; otherwise, fetch the data
  useEffect(() => {
    setIsLoading(true);
    
    // Use initialTokens which is either initialTokens or tokenData
    if (initialTokens && initialTokens.length > 0) {
      console.log("Using provided tokens:", initialTokens);
      
      // If the tokens already have price data, use them directly
      if ("priceChange24H" in initialTokens[0] && initialTokens[0].priceChange24H !== undefined) {
        setIsLoading(false);
        processBubbleTokens(initialTokens);
      } else {
        // Otherwise fetch the price data for these tokens
        fetchPriceDataForTokens(initialTokens);
      }
    } else {
      console.log("No tokens available, fetching all data...");
      fetchTokenData();
    }
  }, [initialTokens]);

  // When priceChangeInterval changes, refetch price data
  useEffect(() => {
    if (initialTokens && initialTokens.length > 0) {
      fetchPriceDataForTokens(initialTokens);
    } else {
      fetchTokenData();
    }
  }, [priceChangeInterval]);

  // If priceChangeIntervalProp changes, update our local state
  useEffect(() => {
    setPriceChangeInterval(priceChangeIntervalProp);
  }, [priceChangeIntervalProp]);

  const processBubbleTokens = (tokens: any) => {
    // Add default price change values if missing
    const tokensWithDefaults = tokens.map((token: { priceChange24H: any; fullTVL: any; totalTVL: any; latestPrice: any; holders: any; }) => ({
      ...token,
      priceChange24H: token.priceChange24H || 0,
      fullTVL: token.fullTVL || token.totalTVL || 0,
      totalTVL: token.totalTVL || 0,
      latestPrice: token.latestPrice || 0,
      holders: token.holders || 0
    }));
    
    // Sort tokens by absolute price change (to show the most volatile ones more prominently)
    const sortedTokens = [...tokensWithDefaults].sort((a, b) => 
      Math.abs(b.priceChange24H) - Math.abs(a.priceChange24H)
    );
    
    console.log("Processed tokens:", sortedTokens);
    setBubbleTokens(sortedTokens);
  };

  // New function to fetch price data for existing tokens
  const fetchPriceDataForTokens = async (tokens: any[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch price data for each token
      const tokenPromises = tokens.map(async (token: { assetID: any; name: any; }) => {
        try {
          // Fetch price change data
          const priceChangeResponse = await fetch(
            `https://free-api.vestige.fi/asset/${token.assetID}/prices/simple/${priceChangeInterval}`
          );
          const priceChangeData = await priceChangeResponse.json();
          
          let priceChange = 0;
          if (priceChangeData && priceChangeData.length > 0) {
            const startPrice = priceChangeData[0]?.price || 0;
            const endPrice = priceChangeData[priceChangeData.length - 1]?.price || 0;
            priceChange = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
          }
          
          // Only update price change data, keep other properties as is
          return {
            ...token,
            priceChange24H: priceChange
          };
        } catch (error) {
          console.error(`Error fetching price data for token ${token.name}:`, error);
          return {
            ...token,
            priceChange24H: 0
          };
        }
      });
      
      const processedTokens = await Promise.all(tokenPromises);
      processBubbleTokens(processedTokens);
    } catch (error) {
      console.error("Error fetching price data:", error);
      setError("Failed to load price data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch all token data when no initial tokens are provided
  const fetchTokenData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the imported tokenData as the base data source if no API endpoint
      let baseTokens = tokenData;
      
      try {
        // Try to fetch from API if available
        const tokenDataResponse = await axios.get("/api/token-data");
        baseTokens = tokenDataResponse.data;
      } catch (apiError) {
        console.log("Using local token data fallback");
      }
      
      // Fetch TVL and price data for each token
      const tokenPromises = baseTokens.map(async (token) => {
        try {
          // Fetch TVL data
          const tvlResponse = await fetch(
            `https://free-api.vestige.fi/asset/${token.assetID}/tvl/simple/7D?currency=USD`
          );
          const tvlData = await tvlResponse.json();
          const fullTVL = parseFloat(tvlData[tvlData.length - 1]?.tvl || 0);
          
          // Fetch price data
          const priceResponse = await fetch(
            `https://free-api.vestige.fi/asset/${token.assetID}/price?currency=usd`
          );
          const priceData = await priceResponse.json();
          const latestPrice = parseFloat(priceData.price || 0);
          
          // Fetch price change data
          const priceChangeResponse = await fetch(
            `https://free-api.vestige.fi/asset/${token.assetID}/prices/simple/${priceChangeInterval}`
          );
          const priceChangeData = await priceChangeResponse.json();
          
          let priceChange = 0;
          if (priceChangeData && priceChangeData.length > 0) {
            const startPrice = priceChangeData[0]?.price || 0;
            const endPrice = priceChangeData[priceChangeData.length - 1]?.price || 0;
            priceChange = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
          }
          
          // Fetch holders data
          const holdersResponse = await fetch(
            `https://free-api.vestige.fi/asset/${token.assetID}/holders?limit=10000000`
          );
          const holdersData = await holdersResponse.json();
          const holders = holdersData.length || 0;
          
          return {
            ...token,
            fullTVL,
            latestPrice,
            priceChange24H: priceChange,
            holders
          };
        } catch (error) {
          console.error(`Error fetching data for token ${token.name}:`, error);
          return {
            ...token,
            fullTVL: 0,
            latestPrice: 0,
            priceChange24H: 0,
            holders: 0
          };
        }
      });
      
      const processedTokens = await Promise.all(tokenPromises);
      processBubbleTokens(processedTokens);
    } catch (error) {
      console.error("Error fetching token data:", error);
      setError("Failed to load token data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to determine bubble size based on market cap or TVL
  const getBubbleSize = (token: { fullTVL?: number; totalTVL?: number }) => {
    // Use fullTVL as a measure of importance/size
    const baseSize = 60; // minimum size
    const tvl = token.fullTVL || token.totalTVL || 0;
    
    if (tvl <= 1000) return baseSize;
    if (tvl <= 10000) return baseSize + 15;
    if (tvl <= 100000) return baseSize + 30;
    if (tvl <= 1000000) return baseSize + 45;
    return baseSize + 60; // for tvl > 1,000,000
  };

  const handleIntervalChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setPriceChangeInterval(e.target.value);
  };

  // Generate keyframe animations for floating bubbles
  const generateBubbleKeyframes = (index: number) => {
    const randomAmplitude = Math.random() * 10 + 5; // 5-15px movement
    return `
      @keyframes float${index} {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-${randomAmplitude}px); }
      }
    `;
  };

  return (
    <div 
      className={`token-bubbles-container ${styles['mobile-container']}`}
      style={{
        position: "relative",
        width: "100%",
        height: "500px",
        marginTop: "20px",
        marginBottom: "20px",
        border: "1px solid #eaeaea",
        borderRadius: "8px",
        padding: "10px",
        overflow: "hidden",
        background: "#f8f9fa",
        display: "flex"
      }}
    >
      {/* Left sidebar for title and interval selection */}
      <div 
        className={styles['mobile-sidebar']}
        style={{ 
          width: "200px", 
          padding: "20px", 
          borderRight: "1px solid #eaeaea",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        <h2 style={{ 
          textAlign: "left", 
          marginBottom: "20px",
          fontSize: "1.5rem"
        }}>
          Token Price Changes
        </h2>
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "flex-start", 
          width: "100%" 
        }}>
          <label htmlFor="interval-selector" style={{ 
            marginBottom: "10px", 
            fontWeight: "bold" 
          }}>
            Select Interval:
          </label>
          <select
            id="interval-selector"
            value={priceChangeInterval}
            onChange={handleIntervalChange}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%"
            }}
          >
            <option value="1H">1 Hour</option>
            <option value="1D">1 Day</option>
            <option value="7D">7 Days</option>
          </select>
          <div style={{ 
            marginTop: "10px", 
            fontSize: "0.8rem", 
            color: "#666" 
          }}>
            Current: {priceChangeInterval}
          </div>
        </div>
      </div>

      {/* Bubbles container */}
      <div 
        className={styles['mobile-bubbles-container']}
        style={{ 
          position: "relative", 
          flex: 1, 
          overflow: "hidden" 
        }}
      >
        {/* Keyframe styles */}
        <style>{
          bubbleTokens.map((token, index) => generateBubbleKeyframes(index)).join('\n')
        }</style>

        {isLoading ? (
          <div 
            className={styles['mobile-loading']}
            style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: "80%" 
            }}
          >
            <FaTruckLoading style={{ fontSize: "2rem", marginRight: "10px" }} />
            <span>Loading token data...</span>
          </div>
        ) : error ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "80%",
            color: "red" 
          }}>
            {error}
          </div>
        ) : (
          bubbleTokens.map((token, index) => {
            const isPositive = token.priceChange24H > 0;
            const size = getBubbleSize(token);
            
            // Random position with some constraints to avoid too many overlaps
            const left = 10 + (index % 5) * 18 + Math.random() * 5;
            const top = 10 + Math.floor(index / 5) * 18 + Math.random() * 5;
            
            // Darker shade for bigger changes
            const intensity = Math.min(Math.abs(token.priceChange24H || 0) * 3, 100);
            // Make sure we have a default color if priceChange24H is undefined
            const color = (token.priceChange24H === undefined || token.priceChange24H === null) 
              ? "rgba(128, 128, 128, 0.85)" // Gray for undefined price changes
              : isPositive 
                ? `rgba(0, ${128 + intensity}, 0, 0.85)` // Green for positive
                : `rgba(${128 + intensity}, 0, 0, 0.85)`; // Red for negative
            
            return (
              <Link
                key={token.assetID}
                to={`/token-details?assetId=${token.assetID}&name=${token.name}&logo=${token.logo}&price=${token.latestPrice}&change=${token.priceChange24H}&holders=${token.holders}&totalTVL=${token.totalTVL || 0}&fullTVL=${token.fullTVL || 0}&stableTVL=${token.stableTVL || false}`}
                style={{ textDecoration: "none" }}
              >
                <div 
                  className={`token-bubble ${styles['mobile-bubble']}`}
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: "50%",
                    backgroundColor: color,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: size > 90 ? "14px" : size > 70 ? "12px" : "10px",
                    fontWeight: "bold",
                    padding: "5px",
                    textAlign: "center",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease",
                    zIndex: Math.round(Math.abs(token.priceChange24H)),
                    cursor: "pointer",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    animation: `float${index} ${Math.random() * 2 + 3}s ease-in-out infinite`,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.zIndex = "1000";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.zIndex = Math.round(Math.abs(token.priceChange24H)).toString();
                  }}
                >
                  <img 
                    src={token.logo} 
                    alt={token.name}
                    style={{
                      width: `${size * 0.4}px`,
                      height: `${size * 0.4}px`,
                      borderRadius: "50%",
                      marginBottom: "2px",
                      backgroundColor: "white",
                      padding: "2px"
                    }}
                  />
                  <div style={{ 
                    fontSize: size > 90 ? "12px" : size > 70 ? "10px" : "8px",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {token.name}
                  </div>
                  <div style={{ 
                    fontSize: size > 90 ? "14px" : size > 70 ? "12px" : "10px",
                    fontWeight: "bold"
                  }}>
                    {token.priceChange24H > 0 ? "+" : ""}{token.priceChange24H?.toFixed(2)}%
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TokenBubbles;