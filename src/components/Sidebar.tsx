import React, { useState } from "react";
import {
  FaWallet,
  FaUsers,
  FaChartBar,
  FaDonate,
  FaCogs,
  FaShoppingCart,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaExchangeAlt,
  FaFaucet,
  FaCashRegister,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import styles from "../css_modules/SidebarStyles.module.css";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  verfied: boolean;
  onLogout: () => void;
  setActiveComponent: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  verfied,
  onLogout,
  setActiveComponent,
}) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>("bestAlgoDefi");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleItemClick = (component: string) => {
    if (component === "AAASwap") {
      navigate("/swap-tokens");
    }
    setActiveItem(component);
    setActiveComponent(component);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <aside
      className={`${styles.sideNav} ${isOpen ? styles.open : styles.closed}`}
    >
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>
      <h3
        onClick={() => handleItemClick("dashboard")}
        className={`${styles.appName} ${
          activeItem === "dashboard" ? styles.activeNavItem : ""
        }`}
      >
        Dashboard
      </h3>
      <nav>
        <ul>
          <li
            className={`${styles.navItem} ${
              activeItem === "bestAlgoDefi" ? styles.activeNavItem : ""
            }`}
            onClick={() => handleItemClick("bestAlgoDefi")}
          >
            <FaChartBar className={styles.icon} />
            <span>Best Algo Defi</span>
          </li>
          <li className={styles.navItemDropdown}>
            <div
              onClick={() => toggleDropdown("training")}
              className={styles.navItem}
            >
              <FaCogs className={styles.icon} />
              <span>Training</span>
              {openDropdown === "training" ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </div>
            {openDropdown === "training" && (
              <ul className={styles.dropdown}>
                <li
                  className={`${styles.navItem} ${
                    activeItem === "buySellAAA" ? styles.activeNavItem : ""
                  }`}
                  onClick={() => handleItemClick("buySellAAA")}
                >
                  <FaShoppingCart className={styles.icon} />
                  <span>Buy & Sell</span>
                </li>
                <li
                  className={`${styles.navItem} ${
                    activeItem === "stakingAndFarms" ? styles.activeNavItem : ""
                  }`}
                  onClick={() => handleItemClick("stakingAndFarms")}
                >
                  <FaCogs className={styles.icon} />
                  <span>Staking and Farms</span>
                </li>
              </ul>
            )}
          </li>
          <li
            className={`${styles.navItem} ${
              activeItem === "AAASwap" ? styles.activeNavItem : ""
            }`}
            onClick={() => handleItemClick("AAASwap")}
          >
            <FaExchangeAlt className={styles.icon} />
            <span>Swap Tokens</span>
          </li>
          <li className={styles.navItemDropdown}>
            <div
              onClick={() => toggleDropdown("team")}
              className={styles.navItem}
            >
              <FaUsers className={styles.icon} />
              <span>Team</span>
              {openDropdown === "team" ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {openDropdown === "team" && (
              <ul className={styles.dropdown}>
                <li
                  className={`${styles.navItem} ${
                    activeItem === "aaaTeam" ? styles.activeNavItem : ""
                  }`}
                  onClick={() => handleItemClick("aaaTeam")}
                >
                  <FaUsers className={styles.icon} />
                  <span>AAA Team</span>
                </li>
                <li
                  className={`${styles.navItem} ${
                    activeItem === "myTeam" ? styles.activeNavItem : ""
                  }`}
                  onClick={() => handleItemClick("myTeam")}
                >
                  <FaUsers className={styles.icon} />
                  <span>My Team</span>
                </li>
              </ul>
            )}
          </li>
          <li
            className={`${styles.navItem} ${
              activeItem === "donateAAA" ? styles.activeNavItem : ""
            }`}
            onClick={() => handleItemClick("donateAAA")}
          >
            <FaDonate className={styles.icon} />
            <span>Donate AAA</span>
          </li>
          <li className={styles.navItemDropdown}>
            <div
              onClick={() => toggleDropdown("wallet")}
              className={styles.navItem}
            >
              <FaWallet className={styles.icon} />
              <span>Wallet</span>
              {openDropdown === "wallet" ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
            </div>
            {openDropdown === "wallet" && (
              <ul className={styles.dropdown}>
                <li
                  className={`${styles.navItem} ${
                    activeItem === "setupWallet" ? styles.activeNavItem : ""
                  }`}
                  onClick={() => handleItemClick("setupWallet")}
                >
                  <FaCogs className={styles.icon} />
                  <span>Setup Wallet</span>
                </li>
                <li
                  className={`${styles.navItem} ${
                    activeItem === "verifyAccount" ? styles.activeNavItem : ""
                  }`}
                  onClick={() => handleItemClick("verifyAccount")}
                >
                  <FaCheck className={styles.icon} />
                  <span>Verify Account</span>
                </li>
                <li
                  className={`${styles.navItem} ${
                    activeItem === "myWallet" ? styles.activeNavItem : ""
                  }`}
                  onClick={() => handleItemClick("myWallet")}
                >
                  <FaWallet className={styles.icon} />
                  <span>My Wallet</span>
                </li>
              </ul>
            )}
          </li>
          {verfied && (
            <li className={styles.navItemDropdown}>
              <div
                onClick={() => toggleDropdown("airdrop")}
                className={styles.navItem}
              >
                <FaShoppingCart className={styles.icon} />
                <span>Free Airdrop</span>
                {openDropdown === "airdrop" ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </div>
              {openDropdown === "airdrop" && (
                <ul className={styles.dropdown}>
                  <li
                    className={`${styles.navItem} ${
                      activeItem === "createAirdrop" ? styles.activeNavItem : ""
                    }`}
                    onClick={() => handleItemClick("createAirdrop")}
                  >
                    <FaFaucet className={styles.icon} />
                    <span>Create Airdrop</span>
                  </li>
                  <li
                    className={`${styles.navItem} ${
                      activeItem === "claimAirdrop" ? styles.activeNavItem : ""
                    }`}
                    onClick={() => handleItemClick("claimAirdrop")}
                  >
                    <FaCashRegister className={styles.icon} />
                    <span>Claim Airdrop</span>
                  </li>
                </ul>
              )}
            </li>
          )}

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
