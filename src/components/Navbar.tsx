import React, { useState } from "react";
import { Link } from "react-router-dom";
import aaa from "../images/aaa.png";
import styles from "../css_modules/NavbarStyles.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
        <a
          href="https://app.gainify.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navLink} // Apply same styles as other links
          onClick={() => setMenuOpen(false)}
        >
          Farming
        </a>
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
