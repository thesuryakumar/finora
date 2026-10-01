import React from "react"
import { Link } from "react-router-dom"
import logo from "../assets/logo.png"

const Sidebar = () => {
  // inline styles
  const styles = {
    sidebar: {
      width: "260px",
      background: "linear-gradient(180deg, #1E2A38, #0D1B2A)",
      color: "#fff",
      minHeight: "100vh",
      padding: "20px",
      boxSizing: "border-box",
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      marginBottom: "30px",
    },
    logoImg: {
      width: "45px",
      height: "45px",
      marginRight: "12px",
      borderRadius:"50%"
    },
    logoText: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#f4b41a", // golden tone from logo
    },
    nav: {
      fontSize: "14px",
      fontWeight: "500",
    },
    ul: {
      listStyle: "none",
      padding: 0,
      marginBottom: "20px",
    },
    li: {
      margin: "10px 0",
    },
    link: {
      textDecoration: "none",
      color: "#e0e0e0",
      padding: "8px 12px",
      borderRadius: "6px",
      display: "block",
      transition: "0.3s",
    },
    active: {
      background: "linear-gradient(90deg, #f4b41a, #0077b6)", // gold to blue
      color: "#fff",
      fontWeight: "600",
    },
    sectionTitle: {
      fontSize: "12px",
      color: "#9aa0a6",
      textTransform: "uppercase",
      margin: "15px 0 8px",
    },
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoSection}>
        <img src={logo} alt="Finora Logo" style={styles.logoImg} />
        <h2 style={styles.logoText}>Finora</h2>
      </div>
      <nav style={styles.nav}>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <Link to="/dashboard" style={styles.link}>
              Overview
            </Link>
          </li>
          <h4 style={styles.sectionTitle}>Transaction Data</h4>
          <li style={styles.li}>
            <Link to="/transactions" style={styles.link}>
              Transaction Details
            </Link>
          </li>
          <li style={styles.li}>
            <Link to="/StatisticsAnalysis" style={styles.link}>
              Statistics & Analysis
            </Link>
          </li>
        </ul>

        <h4 style={styles.sectionTitle}>Basic Data</h4>
        <ul style={styles.ul}>
          <li style={styles.li}><Link to="/AccountsPage" style={styles.link}>Accounts</Link></li>
          <li style={styles.li}><Link to="/TransactionCategories" style={styles.link}>Transaction Categories</Link></li>
        </ul>

        <h4 style={styles.sectionTitle}>Miscellaneous</h4>
        <ul style={styles.ul}>
          <li style={styles.li}><Link to="/About" style={styles.link}>About</Link></li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
