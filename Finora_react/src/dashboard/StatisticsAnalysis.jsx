import React, { useState, useEffect } from "react"
import "./StatisticsAnalysis.css"
import Sidebar from "./Sidebar"
import { Pie, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js"
import axios from "axios"

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)

const StatisticsAnalysis = () => {
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")
  const API_URL = import.meta.env.VITE_API_URL
  const [chartType, setChartType] = useState("Pie Chart")
  const [sortOrder, setSortOrder] = useState("Amount")
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/expense/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = (response.data.data || []).map(txn => ({
          ...txn,
          amount: txn.type === "Expense" ? -txn.amount : txn.amount
        }))
        setTransactions(data)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      }
    }
    if (token && userId) fetchTransactions()
  }, [token, userId])

  const filteredTransactions = transactions.filter(txn => txn.date?.slice(0, 7) === selectedMonth)

  const categories = ["Food & Drink", "Transport", "Entertainment", "Shopping"]
  const categoryMap = {}

  categories.forEach(cat => {
    const total = filteredTransactions
      .filter(txn => txn.category === cat)
      .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)
    if (total > 0) categoryMap[cat] = total
  })

  let chartDataArray = Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }))

  chartDataArray =
    sortOrder === "Amount"
      ? chartDataArray.sort((a, b) => b.amount - a.amount)
      : chartDataArray.sort((a, b) => a.category.localeCompare(b.category))

  const chartData = {
    labels: chartDataArray.map(d => d.category),
    datasets: [
      {
        label: "Expenses",
        data: chartDataArray.map(d => d.amount),
        backgroundColor: ["#4BC0C0", "#36A2EB", "#FF6384", "#FFCE56"],
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#fff" } },
      title: { display: true, text: `Expense Breakdown - ${selectedMonth}`, color: "#fff" },
      tooltip: { callbacks: { label: context => `¥ ${context.raw}` } }
    },
    scales:
      chartType === "Bar Chart"
        ? {
            x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
            y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } }
          }
        : {}
  }

  return (
    <div className="statistics-analysis">
      <Sidebar />
      <main className="main">
        <div className="header">
          <h3>Statistics & Analysis</h3>
          <div className="header-controls">
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="month-input"
            />
          </div>
        </div>

        <div className="tabs">
          <button className="tab active">Categorical Analysis</button>
        </div>

        <div className="card large">
          <div className="chart-options">
            <label>Chart Type:</label>
            <select value={chartType} onChange={e => setChartType(e.target.value)}>
              <option>Pie Chart</option>
              <option>Bar Chart</option>
            </select>

            <label>Sort Order:</label>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option>Amount</option>
              <option>Category</option>
            </select>
          </div>

          <div className="chart-container">
            {chartType === "Pie Chart" ? <Pie data={chartData} options={chartOptions} /> : <Bar data={chartData} options={chartOptions} />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default StatisticsAnalysis
