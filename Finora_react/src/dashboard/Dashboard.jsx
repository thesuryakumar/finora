import React, { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./Dashboard.css"
import Chart from "./Chart"
import Sidebar from "./Sidebar"
import axios from "axios"

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  const [accounts, setAccounts] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const [totals, setTotals] = useState({
    totalAssets: 0,
    totalExpenses: 0,
    amountRemaining: 0,
    totalThisMonth: 0,
    totalToday: 0,
    totalThisYear: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accRes, expRes] = await Promise.all([
          axios.get(`${API_URL}/accounts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/expense/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const accountData = accRes.data.data || []
        const expenseData = expRes.data.data || []

        setAccounts(accountData)
        setExpenses(expenseData)
        calculateTotals(accountData, expenseData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (token && userId) fetchData()
  }, [token, userId])

  const calculateTotals = (accountList, expenseList) => {
    const totalAssets = accountList
      .filter(acc => acc.type === "Asset")
      .reduce((sum, acc) => sum + acc.balance, 0)

    const totalExpenses = expenseList.reduce((sum, exp) => sum + exp.amount, 0)
    const amountRemaining = totalAssets - totalExpenses

    const totalThisMonth = expenseList
      .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
      .reduce((sum, exp) => sum + exp.amount, 0)

    const totalToday = expenseList
      .filter(exp => new Date(exp.date).toDateString() === new Date().toDateString())
      .reduce((sum, exp) => sum + exp.amount, 0)

    const totalThisYear = expenseList
      .filter(exp => new Date(exp.date).getFullYear() === new Date().getFullYear())
      .reduce((sum, exp) => sum + exp.amount, 0)

    setTotals({
      totalAssets,
      totalExpenses,
      amountRemaining,
      totalThisMonth,
      totalToday,
      totalThisYear,
    })
  }

  if (loading) return <p>Loading dashboard...</p>

  return (
    <div className="d-flex dashboard">
      <Sidebar />

      <main className="flex-grow-1 main-content p-4">
        <header className="row text-center top-header mb-4">
          <div className="col-md-4">
            <p className="header-title">Total Assets</p>
            <span className="header-value">₹ {totals.totalAssets}</span>
          </div>
          <div className="col-md-4">
            <p className="header-title">Total Expenses</p>
            <span className="header-value">₹ {totals.totalExpenses}</span>
          </div>
          <div className="col-md-4">
            <p className="header-title">Amount Remaining</p>
            <span className="header-value">₹ {totals.amountRemaining}</span>
          </div>
        </header>

        <section className="row g-3">
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>This Month's Expenses</h5>
              <p className="fs-5">₹ {totals.totalThisMonth}</p>
              <button className="btn btn-outline-primary btn-sm" onClick={() => setShowModal(true)}>
                View Details
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>Today</h5>
              <p className="fs-5">₹ {totals.totalToday}</p>
              <small>{new Date().toDateString()}</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>This Year</h5>
              <p className="fs-5">₹ {totals.totalThisYear}</p>
              <small>{new Date().getFullYear()}</small>
            </div>
          </div>

          <div className="col-12">
            <div className="card shadow-sm p-3">
              <h5>Expense Trends</h5>
              <div className="chart-placeholder">
                <Chart data={expenses} />
              </div>
            </div>
          </div>
        </section>

        {showModal && (
          <div className="modal-backdrop d-flex align-items-center justify-content-center">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">All Expenses</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Account</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((exp, index) => (
                          <tr key={index}>
                            <td>₹ {exp.amount}</td>
                            <td>{exp.category}</td>
                            <td>{new Date(exp.date).toLocaleDateString()}</td>
                            <td>{exp.description}</td>
                            <td>{exp.account}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
