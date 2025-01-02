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
  platformName = "AAA Swap",
  platformFeeAccount = "HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E",
  platformFeePercentage = 0.1,
  themeVariables = "eyJ0aGVtZSI6ImRhcmsiLCJjb250YWluZXJCdXR0b25CZyI6ImJsYWNrIiwid2lkZ2V0QmciOiJnb2xkIiwiaGVhZGVyQnV0dG9uQmciOiIjODM0NmQxIiwiaGVhZGVyQnV0dG9uVGV4dCI6IiNmZmZmZmYiLCJoZWFkZXJUaXRsZSI6ImJsYWNrIiwiY29udGFpbmVyQnV0dG9uVGV4dCI6IiNmZmZmZmYiLCJpZnJhbWVCZyI6IiNGOEY4RjgiLCJib3JkZXJSYWRpdXNTaXplIjoibm9uZSIsInRpdGxlIjoiQUFBIFN3YXAiLCJzaG91bGREaXNwbGF5VGlueW1hbkxvZ28iOmZhbHNlfQ%3D%3D",
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
    { id: "2200000000", name: "TINY", logo: "" },
    { id: "388592191", name: "CHIPS", logo: "" },
    { id: "700965019", name: "VEST", logo: "" },
    { id: "1237529510", name: "PGOLD", logo: "" },
    { id: "470842789", name: "DEFLY", logo: "" },
    { id: "2494786278", name: "MONKO", logo: "" },
    { id: "2494786278", name: "MONKO", logo: "" },
    { id: "452399768", name: "VOTE", logo: "" },
    { id: "287867876", name: "OPUL", logo: "" },
    { id: "1138500612", name: "GORA", logo: "" },
    { id: "523683256", name: "AKTA", logo: "" },
    { id: "1096015467", name: "PEPE", logo: "" },
    { id: "1268830233", name: "DAFFIR", logo: "" },
    { id: "796425061", name: "COOP", logo: "" },
    { id: "1732165149", name: "COMPX", logo: "" },
    { id: "400593267", name: "FINITE", logo: "" },
    { id: "1284444444", name: "ORA", logo: "" },
    { id: "2154668640", name: "MOOJ", logo: "" },
    { id: "1265975021", name: "NIKO", logo: "" },
    { id: "1065092715", name: "COSG", logo: "" },
    { id: "2637100337", name: "BRO", logo: "" },
    { id: "2627778168", name: "DUGLY", logo: "" },
    { id: "1888888888", name: "EXA", logo: "" },
    { id: "559219992", name: "OCTO", logo: "" },
    { id: "137594422", name: "HDL", logo: "" },
    { id: "712012773", name: "META", logo: "" },
    { id: "393537671", name: "ASASTATS", logo: "" },
    { id: "230946361", name: "GEMS", logo: "" },
    { id: "1053260256", name: "GLIZZY", logo: "" },
    { id: "2155690250", name: "JAWS", logo: "" },
    { id: "2637649940", name: "HODL", logo: "" },
    { id: "1088771340", name: "DARKCOIN", logo: "" },
    { id: "2155688884", name: "BASED", logo: "" },
    { id: "1285225688", name: "BARB", logo: "" },
    { id: "1699699699", name: "OTSDGFKD", logo: "" },
    { id: "1294383366", name: "OUTSYDE", logo: "" },
    { id: "408898501", name: "LTBX", logo: "" },
    { id: "2619875248", name: "BUMR", logo: "" },
    { id: "940424110", name: "GMT", logo: "" },
    { id: "137020565", name: "BUY", logo: "" },
    { id: "1249581181", name: "WBNB", logo: "" },
    { id: "2211824164", name: "TINA", logo: "" },
    { id: "569120128", name: "SCOUT", logo: "" },
    { id: "435335235", name: "CRSD", logo: "" },
    { id: "2595619475", name: "STEAK", logo: "" },
    { id: "2592364447", name: "MEW", logo: "" },
    { id: "2645395515", name: "REM", logo: "" },
    { id: "2614577662", name: "ATARD", logo: "" },
    { id: "818432243", name: "DHARM", logo: "" },
    { id: "1285492943", name: "ARBZ", logo: "" },
    { id: "1447774422", name: "SAT", logo: "" },
    { id: "1748330503", name: "GAIN", logo: "" },
    { id: "1889681715", name: "FLOKI", logo: "" },
    { id: "2582590415", name: "MEEP", logo: "" },
    { id: "2636889771", name: "BASILK", logo: "" },
    { id: "1387238831", name: "GOAN", logo: "" },
    { id: "2652191787", name: "AKEKIUS", logo: "" },
    { id: "412056867", name: "SHSA", logo: "" },
    { id: "2485314946", name: "FRY", logo: "" },
    { id: "2634315632", name: "PAUL", logo: "" },
    { id: "226701642", name: "YLDY", logo: "" },
    { id: "2155418402", name: "RUGNINJA", logo: "" },
    { id: "266846137", name: "SIGN", logo: "" },
    { id: "1642742254", name: "PIPHIN", logo: "" },
    { id: "753137719", name: "BUTTS", logo: "" },
    { id: "2495113411", name: "PANDA", logo: "" },
    { id: "226265212", name: "ACORN", logo: "" },
    { id: "2160577481", name: "FINU", logo: "" },
    { id: "393498731", name: "GRAMO", logo: "" },
    { id: "507472097", name: "INUMOO", logo: "" },
    { id: "1459508661", name: "TRUMP", logo: "" },
    { id: "1775410837", name: "BOBO", logo: "" },
    { id: "2643186677", name: "SANDMAN", logo: "" },
    { id: "2485202024", name: "FNODE", logo: "" },
    { id: "2350716919", name: "BOOBS", logo: "" },
    { id: "558978094", name: "VYBE", logo: "" },
    { id: "251014570", name: "BLOCK", logo: "" },
    { id: "2582294183", name: "GONNA", logo: "" },
    { id: "445905873", name: "ALC", logo: "" },
    { id: "2637111113", name: "FROGGO", logo: "" },
    { id: "1682662165", name: "A200", logo: "" },
    { id: "1241945177", name: "GOLDDAO", logo: "" },
    { id: "2175930910", name: "MUSTARD", logo: "" },
    { id: "2630817821", name: "NTS", logo: "" },
    { id: "409604194", name: "AO", logo: "" },
    { id: "2171798010", name: "SHINO", logo: "" },
    { id: "1691271561", name: "CYCLE", logo: "" },
    { id: "1134696561", name: "XALGO", logo: "" },
    { id: "2604087587", name: "OGLA", logo: "" },
    { id: "924268058", name: "FRY", logo: "" },
    { id: "2320775407", name: "AVOI", logo: "" },
    { id: "1076768277", name: "SKYNET", logo: "" },
    { id: "511028589", name: "JIMMY", logo: "" },
  ],
}) => {
  const [assetIn, setAssetIn] = useState(defaultAssetIn);
  const [assetOut, setAssetOut] = useState(defaultAssetOut);
  const [filterTextIn, setFilterTextIn] = useState("");
  const [filterTextOut, setFilterTextOut] = useState("");
  const [isDropdownInOpen, setIsDropdownInOpen] = useState(false);
  const [isDropdownOutOpen, setIsDropdownOutOpen] = useState(false);

  const widgetSrc = `https://tinymanorg.github.io/swap-widget/?platformName=${encodeURIComponent(
    platformName
  )}&network=mainnet&themeVariables=${themeVariables}&assetIn=${assetIn}&assetOut=${assetOut}&platformFeeAccount=${platformFeeAccount}&platformFeePercentage=${platformFeePercentage}`;

  const uniqueTokens = Array.from(
    new Map(tokens.map((token) => [token.id, token])).values()
  );
  
  const filteredTokensIn = uniqueTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(filterTextIn.toLowerCase()) ||
      token.id.includes(filterTextIn)
  );
  
  const filteredTokensOut = uniqueTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(filterTextOut.toLowerCase()) ||
      token.id.includes(filterTextOut)
  );
  
  const renderDropdown = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    filterText: string,
    setFilterText: React.Dispatch<React.SetStateAction<string>>,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    label: string,
    tokens: Token[]
  ) => (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>
      <div className={styles.dropdown} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.selectedItem}>
          <img
            src={tokens.find((token) => token.id === value)?.logo || ""}
            alt="Token Logo"
            className={styles.tokenLogo}
          />
          {tokens.find((token) => token.id === value)?.name || "Select Token"}
        </div>
        <span>▼</span>
      </div>
      {isOpen && (
        <ul className={styles.dropdownList}>
          <li className={styles.dropdownItem}>
            <input
              type="text"
              placeholder="Filter by name or Asset ID"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={styles.customInput}
            />
          </li>
          {tokens.map((token) => (
            <li
              key={token.id}
              className={styles.dropdownItem}
              onClick={() => {
                setValue(token.id);
                setIsOpen(false);
                setFilterText(""); // Clear the filter text on selection
              }}
            >
              <img
                src={token.logo}
                alt={token.name}
                className={styles.tokenLogo}
              />
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
          filterTextIn,
          setFilterTextIn,
          isDropdownInOpen,
          setIsDropdownInOpen,
          "Swap From",
          filteredTokensIn
        )}
        {renderDropdown(
          assetOut,
          setAssetOut,
          filterTextOut,
          setFilterTextOut,
          isDropdownOutOpen,
          setIsDropdownOutOpen,
          "Swap To",
          filteredTokensOut
        )}
      </div>
      <iframe
        key={`${assetIn}-${assetOut}`}
        title="Tinyman Swap Widget"
        src={widgetSrc}
        className={styles.iframe}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};
