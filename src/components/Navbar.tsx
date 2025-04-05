import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import aaa from "../images/aaa.png";
import styles from "../css_modules/NavbarStyles.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFarmingDropdown, setShowFarmingDropdown] = useState(false);
  const [showGamingDropdown, setShowGamingDropdown] = useState(false);
  const [showExchangesDropdown, setShowExchangesDropdown] = useState(false);
  const [showDexesDropdown, setShowDexesDropdown] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRefFarming = useRef<HTMLDivElement>(null);
  const dropdownRefGaming = useRef<HTMLDivElement>(null);
  const dropdownRefExchanges = useRef<HTMLDivElement>(null);
  const dropdownRefDexes = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleFarmingDropdown = () => setShowFarmingDropdown((prev) => !prev);
  const toggleGamingDropdown = () => setShowGamingDropdown((prev) => !prev);
  const toggleExchangesDropdown = () =>
    setShowExchangesDropdown((prev) => !prev);
  const toggleDexesDropdown = () => setShowDexesDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }

      if (
        dropdownRefFarming.current &&
        !dropdownRefFarming.current.contains(target)
      ) {
        setShowFarmingDropdown(false);
      }

      if (
        dropdownRefGaming.current &&
        !dropdownRefGaming.current.contains(target)
      ) {
        setShowGamingDropdown(false);
      }

      if (
        dropdownRefExchanges.current &&
        !dropdownRefExchanges.current.contains(target)
      ) {
        setShowExchangesDropdown(false);
      }

      if (
        dropdownRefDexes.current &&
        !dropdownRefDexes.current.contains(target)
      ) {
        setShowDexesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={aaa} alt="AAA APP" className={styles.tokenLogo} />
        </Link>
      </div>

      <div className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </div>

      <div
        ref={menuRef}
        className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}
      >
        <Link to="/swap-tokens" onClick={() => setMenuOpen(false)}>
          Swap Tokens
        </Link>

        <div
          ref={dropdownRefFarming}
          className={`${styles.dropdown} ${
            showFarmingDropdown ? styles.open : ""
          }`}
        >
          <div
            className={styles.dropdownToggle}
            onClick={toggleFarmingDropdown}
          >
            Farming ▾
          </div>
          {showFarmingDropdown && (
            <div className={styles.dropdownMenu}>
              <a
                href="https://app.gainify.xyz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowFarmingDropdown(false);
                }}
              >
                Gainify
              </a>
              <a
                href="https://app.cometa.farm"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowFarmingDropdown(false);
                }}
              >
                Cometa Hub
              </a>
            </div>
          )}
        </div>

        <div
          ref={dropdownRefExchanges}
          className={`${styles.dropdown} ${
            showExchangesDropdown ? styles.open : ""
          }`}
        >
          <div
            className={styles.dropdownToggle}
            onClick={toggleExchangesDropdown}
          >
            Exchanges ▾
          </div>
          {showExchangesDropdown && (
            <div className={styles.dropdownMenu}>
              {[
                { name: "Binance", url: "https://www.binance.com" },
                { name: "Coinbase", url: "https://www.coinbase.com" },
                { name: "Kraken", url: "https://www.kraken.com" },
                { name: "KuCoin", url: "https://www.kucoin.com" },
                { name: "OKX", url: "https://www.okx.com" },
                { name: "Gate.io", url: "https://www.gate.io" },
                { name: "Bybit", url: "https://www.bybit.com" },
                { name: "Huobi", url: "https://www.huobi.com" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowExchangesDropdown(false);
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>

        <div
          ref={dropdownRefDexes}
          className={`${styles.dropdown} ${
            showDexesDropdown ? styles.open : ""
          }`}
        >
          <div className={styles.dropdownToggle} onClick={toggleDexesDropdown}>
            DEXes ▾
          </div>
          {showDexesDropdown && (
            <div className={styles.dropdownMenu}>
              {[
                { name: "Tinyman", url: "https://app.tinyman.org" },
                { name: "CompX", url: "https://app.compx.io" },
                { name: "Pactfi", url: "https://app.pact.fi" },
                { name: "Vestige", url: "https://vestige.fi" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowDexesDropdown(false);
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>

        <Link to="/best-algo-defi" onClick={() => setMenuOpen(false)}>
          Best Algo Defi Tokens
        </Link>

        <Link to="/algo-bubbles" onClick={() => setMenuOpen(false)}>
          Algo Bubbles
        </Link>

        <div
          ref={dropdownRefGaming}
          className={`${styles.dropdown} ${
            showGamingDropdown ? styles.open : ""
          }`}
        >
          <div className={styles.dropdownToggle} onClick={toggleGamingDropdown}>
            Algo Games ▾
          </div>
          {showGamingDropdown && (
            <div className={styles.dropdownMenu}>
              {[
                { name: "Astro Explorer", url: "https://astroexplorer.co" },
                { name: "AlgoSeas", url: "https://algoseas.io/play" },
                { name: "Cosmic Champs", url: "https://cosmicchamps.com" },
                {
                  name: "Ghetto Warzones",
                  url: "https://www.ghettopigeon.com/game.html",
                },
                {
                  name: "Fracctal Monsters",
                  url: "https://fracctalmonstersnft.com/play",
                },
                { name: "Rxelms Games", url: "https://rxelms.com/games" },
                { name: "SuperMeow", url: "https://3dlifestudio.com" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowGamingDropdown(false);
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
