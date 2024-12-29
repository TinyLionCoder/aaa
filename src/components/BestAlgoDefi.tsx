import React from "react";
import styles from "../css_modules/BestAlgoDefiStyles.module.css";
import tdld from "../images/tdld.png";
import nmi from "../images/nmi.png";
import tlp from "../images/tlp.png";
import rea from "../images/rea.png";
import rear from "../images/rear.png";
import bwom from "../images/bwom.png";
import ipt from "../images/ipt.png";
import wkh from "../images/wkh.png";
import memo from "../images/memo.png";
import ogs from "../images/ogs.png";
import cat from "../images/cat.png";
import { FaStamp } from "react-icons/fa";

const tokenData = [
  {
    name: "TDLD",
    logo: tdld, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2176744157",
    xLink: "https://x.com/TinyDickLion",
    stableTVL: true,
  },
  {
    name: "NMI",
    logo: nmi, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2279886826",
    xLink: "https://x.com/ConnectionMach",
    stableTVL: true,
  },
  {
    name: "BWOM",
    logo: bwom, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2327984798",
    xLink: "https://x.com/bwombus",
    stableTVL: true,
  },
  {
    name: "IPT",
    logo: ipt, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2342621554",
    xLink: "https://x.com/1nfinite0ne",
    stableTVL: true,
  },
  {
    name: "WKH",
    logo: wkh, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2573477873",
    xLink: "https://x.com/HODL_TLP",
    stableTVL: true,
  },
  {
    name: "MEMO",
    logo: memo, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/885835936",
    xLink: "https://x.com/AlgoMembers",
    stableTVL: true,
  },
  {
    name: "SQUAD",
    logo: ogs, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/1421321088",
    xLink: "https://x.com/OG_Squad_ALGO",
    stableTVL: true,
  },
  {
    name: "CAT",
    logo: cat, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/1691166331",
    xLink: "https://x.com/algo_cats",
    stableTVL: true,
  },
  {
    name: "TLP",
    logo: tlp, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/987374809",
    xLink: "https://x.com/TLPCoin",
    stableTVL: true,
  },
  {
    name: "REAR",
    logo: rear, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/2413037774",
    xLink: "https://x.com/TLPCoin",
    stableTVL: true,
  },
  {
    name: "REA",
    logo: rea, // Replace with actual logo path
    vestigeLink: "https://vestige.fi/asset/1753483231",
    xLink: "https://x.com/TLPCoin",
    stableTVL: true,
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
              <a
                href={token.xLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.xButton}
              >
                Follow on X
              </a>
            </div>
            {token.stableTVL && (
              <div className={styles.stableTVL}>
                <div className={styles.tooltipWrapper}>
                  <FaStamp className={styles.stableTVLIcon} />
                  <span className={styles.tooltipText}>
                    Build LP with this token to rank higher
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestAlgoDefi;
