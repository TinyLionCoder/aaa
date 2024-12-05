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
  setActiveComponent: (component: string) => void; // Add prop for setting the active component
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, setActiveComponent }) => {
  return (
    <aside className={styles.sideNav}>
      <h3
        onClick={() => setActiveComponent("dashboard")}
        className={styles.appName}
      >
        Dashboard
      </h3>
      <nav>
        <ul>
          <li
            className={`${styles.navItem} ${styles.dropdown}`}
            onClick={() => setActiveComponent("bestAlgoDefi")}
          >
            <FaChartBar className={styles.icon} />
            <span>Best Algo Defi</span>
          </li>
          <li
            className={`${styles.navItem} ${styles.dropdown}`}
            onClick={() => setActiveComponent("stakingAndFarms")}
          >
            <FaCogs className={styles.icon} />
            <span>Staking and Farms</span>
          </li>
          <li
            className={styles.navItem}
            onClick={() => setActiveComponent("buySellAAA")}
          >
            <FaShoppingCart className={styles.icon} />
            <span>Buy & Sell AAA</span>
          </li>
          <li
            className={`${styles.navItem} ${styles.dropdown}`}
            onClick={() => setActiveComponent("aaaTeam")}
          >
            <FaUsers className={styles.icon} />
            <span>AAA Team</span>
          </li>
          <li
            className={`${styles.navItem} ${styles.dropdown}`}
            onClick={() => setActiveComponent("donateAAA")}
          >
            <FaDonate className={styles.icon} />
            <span>Donate AAA</span>
          </li>
          <li
            className={`${styles.navItem} ${styles.dropdown}`}
            style={{ backgroundColor: "aquamarine" }}
            onClick={() => setActiveComponent("setupWallet")}
          >
            <FaCogs className={styles.icon} />
            <span>Setup Wallet</span>
          </li>
          <li
            className={`${styles.navItem} ${styles.dropdown}`}
            onClick={() => setActiveComponent("myWallet")}
          >
            <FaWallet className={styles.icon} />
            <span>My Wallet</span>
          </li>
          <li
            className={styles.navItem}
            onClick={() => setActiveComponent("myTeam")}
          >
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
