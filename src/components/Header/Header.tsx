import React from "react";
import styles from "./Header.module.scss";

function Header() {
  return (
    <header className={styles.header}>
      <img src="/cosmos-atom-logo.png" alt="" />
      <h3>Interchain Cosmos data</h3>
    </header>
  );
}

export default Header;
