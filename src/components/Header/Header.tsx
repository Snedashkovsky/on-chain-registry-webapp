import React from "react";
import styles from "./Header.module.scss";

function Header() {
  return (
    <header className={styles.header}>
      <img src="/ocr-logo.png" alt="" />
      <h3>On-Chain Registry</h3>
    </header>
  );
}

export default Header;
