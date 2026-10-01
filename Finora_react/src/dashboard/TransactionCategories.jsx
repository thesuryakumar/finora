import React, { useEffect, useState } from "react";
import "./TransactionCategories.css";
import Sidebar from "./Sidebar";
import axios from "axios";

const PRIMARY_CATEGORIES = ["Food & Drink", "Transport", "Entertainment", "Shopping"];

const TransactionCategories = () => {
  const [userExpenses, setUserExpenses] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const API_URL = import.meta.env.VITE_API_URL
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/expense/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserExpenses(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };

    if (token && userId) fetchExpenses();
  }, [token, userId]);

  // Calculate total per category
  const categoryTotals = {};
  PRIMARY_CATEGORIES.forEach((cat) => {
    categoryTotals[cat] = userExpenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const maxAmount = Math.max(...Object.values(categoryTotals));
  const minAmount = Math.min(...Object.values(categoryTotals));

  return (
    <div className="transaction-categories-dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="transaction-header">
          <button className="tab ">Expense</button>
         
        </div>

        <div className="transaction-body">
          <p className="section-sub">Primary Categories</p>
          <div className="category-list">
            {PRIMARY_CATEGORIES.map((cat) => {
              const total = categoryTotals[cat];
              const percentage = maxAmount
                ? Math.round((total / maxAmount) * 100)
                : 0;

              const barColor =
                total === maxAmount
                  ? "#36A2EB"
                  : total === minAmount
                  ? "#FF6384"
                  : "#4BC0C0";

              return (
                <div key={cat} className="category-box">
                  <p>{cat}</p>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: barColor,
                      }}
                    ></div>
                  </div>
                  <span className="amount">₹ {total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionCategories;
