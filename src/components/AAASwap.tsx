import React, { useState } from "react";
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
import aaa from "../images/aaa.png";
import marcus from "../images/marcus.png";
import algo from "../images/algo.png";
import styles from "../css_modules/AAASwapStyles.module.css";

interface Token {
  id: string;
  name: string;
  logo: string;
}

interface AAASwapProps {
  title?: string;
  defaultAssetIn?: string;
  defaultAssetOut?: string;
  platformName?: string;
  platformFeeAccount?: string;
  platformFeePercentage?: number;
  themeVariables?: string;
  width?: string;
  height?: string;
  tokens?: Token[];
}

export const AAASwap: React.FC<AAASwapProps> = ({
  title = "AAA Swap",
  defaultAssetIn = "0",
  defaultAssetOut = "2004387843",
  platformName = "AAA App",
  platformFeeAccount = "HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E",
  platformFeePercentage = 0.1,
  themeVariables = "eyJ0aGVtZSI6ImRhcmsiLCJjb250YWluZXJCdXR0b25CZyI6IndoaXRlIiwid2lkZ2V0QmciOiJnb2xkIiwiaGVhZGVyQnV0dG9uQmciOiJnb2xkIiwiaGVhZGVyQnV0dG9uVGV4dCI6ImJsYWNrIiwiaGVhZGVyVGl0bGUiOiJibGFjayIsImNvbnRhaW5lckJ1dHRvblRleHQiOiJibGFjayIsImlmcmFtZUJnIjoiZ29sZCIsImJvcmRlclJhZGl1c1NpemUiOiJub25lIiwidGl0bGUiOiJTd2FwIiwic2hvdWxkRGlzcGxheVRpbnltYW5Mb2dvIjpmYWxzZX0%3D&assetIn=0&assetOut=2004387843&platformFeeAccount=HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E",
  width = "415px",
  height = "440px",
  tokens = [
    { id: "0", name: "ALGO", logo: algo },
    { id: "2004387843", name: "AAA", logo: aaa },
    { id: "2176744157", name: "TDLD", logo: tdld },
    { id: "2279886826", name: "NMI", logo: nmi },
    { id: "2327984798", name: "BWOM", logo: bwom },
    { id: "2342621554", name: "IPT", logo: ipt },
    { id: "2573477873", name: "WKH", logo: wkh },
    { id: "885835936", name: "MEMO", logo: memo },
    { id: "1421321088", name: "SQUAD", logo: ogs },
    { id: "1691166331", name: "CAT", logo: cat },
    { id: "987374809", name: "TLP", logo: tlp },
    { id: "2413037774", name: "REAR", logo: rear },
    { id: "1753483231", name: "REA", logo: rea },
    { id: "2466866698", name: "MARCUS", logo: marcus },
  ],
}) => {
  const [assetIn, setAssetIn] = useState(defaultAssetIn);
  const [assetOut, setAssetOut] = useState(defaultAssetOut);

  const [isDropdownInOpen, setIsDropdownInOpen] = useState(false);
  const [isDropdownOutOpen, setIsDropdownOutOpen] = useState(false);

  const widgetSrc = `https://tinymanorg.github.io/swap-widget/?platformName=${encodeURIComponent(
    platformName
  )}&network=mainnet&themeVariables=${themeVariables}&assetIn=${assetIn}&assetOut=${assetOut}&platformFeeAccount=${platformFeeAccount}&platformFeePercentage=${platformFeePercentage}`;

  const renderDropdown = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    label: string
  ) => (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>
      <div
        className={styles.dropdown}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectedItem}>
          <img
            src={tokens.find((token) => token.id === value)?.logo || ""}
            alt=""
            className={styles.tokenLogo}
          />
          {tokens.find((token) => token.id === value)?.name || "Select Token"}
        </div>
        <span>▼</span>
      </div>
      {isOpen && (
        <ul className={styles.dropdownList}>
          {tokens.map((token) => (
            <li
              key={token.id}
              className={styles.dropdownItem}
              onClick={() => {
                setValue(token.id);
                setIsOpen(false);
              }}
            >
              <img src={token.logo} alt={token.name} className={styles.tokenLogo} />
              {token.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.dropdownWrapper}>
        {renderDropdown(
          assetIn,
          setAssetIn,
          isDropdownInOpen,
          setIsDropdownInOpen,
          "Swap From"
        )}
        {renderDropdown(
          assetOut,
          setAssetOut,
          isDropdownOutOpen,
          setIsDropdownOutOpen,
          "Swap To"
        )}
      </div>
      <iframe
        title="Tinyman Swap Widget"
        src={widgetSrc}
        className={styles.iframe}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};
