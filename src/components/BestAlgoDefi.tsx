import React from "react";
import styles from "../css_modules/BestAlgoDefiStyles.module.css";
import tdld from "../images/tdld.png";
import nmi from "../images/nmi.png";
import tlp from "../images/tlp.png";
import rea from "../images/rea.png";
import rear from "../images/rear.png";
import bwom from "../images/bwom.png";

const tokenData = [
  {
    name: "TDLD",
    logo: tdld, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2176744157",
    buyLink: "https://example.com/buy-tdld", // Replace with actual buy link
    xLink: "https://x.com/TinyDickLion",
  },
  {
    name: "NMI",
    logo: nmi, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2279886826",
    buyLink: "https://example.com/buy-nmi", // Replace with actual buy link
    xLink: "https://x.com/ConnectionMach",
  },
  {
    name: "BWOM",
    logo: bwom, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2327984798",
    buyLink: "https://example.com/buy-nmi", // Replace with actual buy link
    xLink: "https://x.com/bwombus",
  },
  {
    name: "TLP",
    logo: tlp, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/987374809",
    buyLink: "https://example.com/buy-tlp", // Replace with actual buy link
    xLink: "https://x.com/TLPCoin",
  },
  {
    name: "REAR",
    logo: rear, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2413037774",
    buyLink: "https://example.com/buy-rear", // Replace with actual buy link
    xLink: "https://x.com/TLPCoin",
  },
  {
    name: "REA",
    logo: rea, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/1753483231",
    buyLink: "https://example.com/buy-rea", // Replace with actual buy link
    xLink: "https://x.com/TLPCoin",
  },
];

const BestAlgoDefi: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Best AlgoDefi Tokens</h1>
      <div className={styles.tokenGrid}>
        {tokenData.map((token) => (
          <div key={token.name} className={styles.tokenCard}>
            <img
              src={token.logo}
              alt={`${token.name} logo`}
              className={styles.tokenLogo}
            />
            <h3 className={styles.tokenName}>{token.name}</h3>
            <div className={styles.tokenActions}>
              <a
                href={token.vestigeLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.vestigeButton}
              >
                Vestige
              </a>
              {/* <a
                href={token.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buyButton}
              >
                Buy {token.name}
              </a> */}
              <a
                href={token.xLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.xButton}
              >
                Follow on X
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestAlgoDefi;
