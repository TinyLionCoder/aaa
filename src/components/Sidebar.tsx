import React from "react";
import {
  FaWallet,
  FaUsers,
  FaChartBar,
  FaDonate,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa";
import styles from "../css_modules/SidebarStyles.module.css";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <aside className={styles.sideNav}>
      <h3 className={styles.appName}>Dashboard</h3>
      <nav>
        <ul>
          {/* Dropdown: Best Algo Defi */}
          <li className={`${styles.navItem} ${styles.dropdown}`}>
            <FaChartBar className={styles.icon} />
            <span>Best Algo Defi</span>
            <ul className={styles.dropdownMenu}>
              <li>Coming Soon</li>
            </ul>
          </li>

          {/* Dropdown: Staking and Farms */}
          <li className={`${styles.navItem} ${styles.dropdown}`}>
            <FaCogs className={styles.icon} />
            <span>Staking and Farms</span>
            <ul className={styles.dropdownMenu}>
              <li>Coming Soon</li>
            </ul>
          </li>

          {/* Normal Link: Buy & Sell AAA */}
          <li className={styles.navItem}>
            <FaShoppingCart className={styles.icon} />
            <span>Buy & Sell AAA</span>
          </li>

          {/* Dropdown: AAA Team */}
          <li className={`${styles.navItem} ${styles.dropdown}`}>
            <FaUsers className={styles.icon} />
            <span>AAA Team</span>
            <ul className={styles.dropdownMenu}>
              <li>Coming Soon</li>
            </ul>
          </li>

          {/* Dropdown: Donate AAA */}
          <li className={`${styles.navItem} ${styles.dropdown}`}>
            <FaDonate className={styles.icon} />
            <span>Donate AAA</span>
            <ul className={styles.dropdownMenu}>
              <li>Coming Soon</li>
            </ul>
          </li>

          {/* Dropdown: My Wallet */}
          <li className={`${styles.navItem} ${styles.dropdown}`}>
            <FaWallet className={styles.icon} />
            <span>My Wallet</span>
            <ul className={styles.dropdownMenu}>
              <li>Coming Soon</li>
            </ul>
          </li>

          {/* Normal Link: My Team */}
          <li className={styles.navItem}>
            <FaUsers className={styles.icon} />
            <span>My Team</span>
          </li>

          {/* Logout Button */}
          <li className={styles.navItem}>
            <button onClick={onLogout} className={styles.logoutButton}>
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
