import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import aaa from "../images/aaa.png";
import styles from "../css_modules/NavbarStyles.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFarmingDropdown, setShowFarmingDropdown] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleFarmingDropdown = () => setShowFarmingDropdown((prev) => !prev);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowFarmingDropdown(false);
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

        <div ref={dropdownRef} className={styles.dropdown}>
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
        <Link to="/algo-bubbles" onClick={() => setMenuOpen(false)}>
          Algo Bubbles
        </Link>
        <Link to="/token-listing" onClick={() => setMenuOpen(false)}>
          List your Tokens
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
