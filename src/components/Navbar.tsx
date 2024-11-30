import React from "react";
import { Link } from "react-router-dom";
import styles from "../css_modules/NavbarStyles.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link to="/">AAA</Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/auth">Login / Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
