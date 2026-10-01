import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./login/LoginPage"
import RegisterPage from "./login/RegisterPage"
import TransactionDetails from "./Dashboard/TransactionDetails"
import Dashboard from "./Dashboard/Dashboard"
import StatisticsAnalysis from "./dashboard/StatisticsAnalysis"
import AccountsPage from "./dashboard/AccountsPage"
import TransactionCategories from "./dashboard/TransactionCategories"
import About from "./dashboard/About"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/transactions" element={<TransactionDetails />} /> 
        <Route path="/StatisticsAnalysis" element={<StatisticsAnalysis />} />
         <Route path="/AccountsPage" element={<AccountsPage />} />  
         <Route path="/TransactionCategories" element={<TransactionCategories />} />  
         <Route path="/About" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
