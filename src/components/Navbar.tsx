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
        {/* <Link to="/current-airdrops" onClick={() => setMenuOpen(false)}>
          Current Airdrops
        </Link> */}
        <Link to="/swap-tokens" onClick={() => setMenuOpen(false)}>
          Swap Tokens
        </Link>
        <div ref={dropdownRefFarming} className={styles.dropdown}>
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
        <div ref={dropdownRefExchanges} className={styles.dropdown}>
          <div
            className={styles.dropdownToggle}
            onClick={toggleExchangesDropdown}
          >
            Exchanges ▾
          </div>
          {showExchangesDropdown && (
            <div className={styles.dropdownMenu}>
              <a
                href="https://www.binance.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExchangesDropdown(false);
                }}
              >
                Binance
              </a>
              <a
                href="https://www.coinbase.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExchangesDropdown(false);
                }}
              >
                Coinbase
              </a>
              <a
                href="https://www.kraken.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExchangesDropdown(false);
                }}
              >
                Kraken
              </a>
              <a
                href="https://www.kucoin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExchangesDropdown(false);
                }}
              >
                KuCoin
              </a>
              <a
                href="https://www.okx.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExchangesDropdown(false);
                }}
              >
                OKX
              </a>
              <a
                href="https://www.gate.io"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExchangesDropdown(false);
                }}
              >
                Gate.io
              </a>
              <a
                href="https://www.bybit.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExchangesDropdown(false);
                }}
              >
                Bybit
              </a>
              <a
                href="https://www.huobi.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowExchangesDropdown(false);
                }}
              >
                Huobi
              </a>
            </div>
          )}
        </div>
        <div ref={dropdownRefDexes} className={styles.dropdown}>
          <div className={styles.dropdownToggle} onClick={toggleDexesDropdown}>
            DEXes ▾
          </div>
          {showDexesDropdown && (
            <div className={styles.dropdownMenu}>
              <a
                href="https://app.tinyman.org"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowDexesDropdown(false);
                }}
              >
                Tinyman
              </a>
              <a
                href="https://app.compx.io"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowDexesDropdown(false);
                }}
              >
                CompX
              </a>
              <a
                href="https://app.pact.fi"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowDexesDropdown(false);
                }}
              >
                Pactfi
              </a>
              <a
                href="https://vestige.fi"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowDexesDropdown(false);
                }}
              >
                Vestige
              </a>
            </div>
          )}
        </div>
        <Link to="/best-algo-defi" onClick={() => setMenuOpen(false)}>
          Best Algo Defi Tokens
        </Link>
        <Link to="/algo-bubbles" onClick={() => setMenuOpen(false)}>
          Algo Bubbles
        </Link>
        <div ref={dropdownRefGaming} className={styles.dropdown}>
          <div className={styles.dropdownToggle} onClick={toggleGamingDropdown}>
            Algo Games ▾
          </div>
          {showGamingDropdown && (
            <div className={styles.dropdownMenu}>
              <a
                href="https://astroexplorer.co"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowGamingDropdown(false);
                }}
              >
                Astro Explorer
              </a>
              <a
                href="https://algoseas.io/play"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowGamingDropdown(false);
                }}
              >
                AlgoSeas
              </a>
              <a
                href="https://www.ghettopigeon.com/game.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowGamingDropdown(false);
                }}
              >
                Ghetto Warzones
              </a>
              <a
                href="https://fracctalmonstersnft.com/play"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowGamingDropdown(false);
                }}
              >
                Fracctal Monsters
              </a>
              <a
                href="https://rxelms.com/games"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowGamingDropdown(false);
                }}
              >
                Rxelms Games
              </a>
              <a
                href="https://3dlifestudio.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMenuOpen(false);
                  setShowGamingDropdown(false);
                }}
              >
                SuperMeow
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
