import React, { useState } from "react";
import { Link } from "react-router-dom";
import aaa from "../images/aaa.png";
import styles from "../css_modules/NavbarStyles.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFarmingDropdown, setShowFarmingDropdown] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleFarmingDropdown = () => setShowFarmingDropdown((prev) => !prev);

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
      <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
        {/* <Link to="/current-airdrops" onClick={() => setMenuOpen(false)}>
          Current Airdrops
        </Link> */}
        <Link to="/swap-tokens" onClick={() => setMenuOpen(false)}>
          Swap Tokens
        </Link>
        <div className={styles.dropdown}>
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
        <Link to="/best-algo-defi" onClick={() => setMenuOpen(false)}>
          Best Algo Defi Tokens
        </Link>
        <Link to="/token-listing" onClick={() => setMenuOpen(false)}>
          List your Tokens
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
