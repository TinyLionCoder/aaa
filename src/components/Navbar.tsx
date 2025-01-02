import React from "react";
import { Link } from "react-router-dom";
import styles from "../css_modules/NavbarStyles.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/swap-tokens">Swap Tokens</Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/token-listing">List your Tokens</Link>
      </div>
    </nav>
  );
};

export default Navbar;
