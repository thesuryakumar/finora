import React, { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./AccountsPage.css"
import Sidebar from "./Sidebar"
import axios from "axios"

const AccountsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  const [accounts, setAccounts] = useState([])
  const [expenses, setExpenses] = useState([])
  const [totals, setTotals] = useState({ netAssets: 0, amountRemaining: 0, assets: 0 })
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ accountName: "", type: "Asset", balance: "" })
  const [editMode, setEditMode] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState(null)

  // Fetch accounts & expenses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accRes, expRes] = await Promise.all([
          axios.get(`${API_URL}/accounts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/expense/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        const accountData = accRes.data.data || []
        const expenseData = expRes.data.data || []
        setAccounts(accountData)
        setExpenses(expenseData)
        calculateTotals(accountData, expenseData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (token && userId) fetchData()
  }, [token, userId])

  // Calculate totals by summing all account balances and subtracting total expenses
  const calculateTotals = (accountList, expenseList) => {
    const totalAssets = accountList
      .filter(acc => acc.type === "Asset")
      .reduce((sum, acc) => sum + acc.balance, 0)

    const totalExpenses = expenseList.reduce((sum, exp) => sum + exp.amount, 0)

    const amountRemaining = totalAssets - totalExpenses

    setTotals({
      assets: totalAssets,
      amountRemaining: amountRemaining,
      netAssets: amountRemaining
    })
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveAccount = async () => {
    if (!formData.accountName || !formData.type || !formData.balance) {
      alert("Please fill all required fields")
      return
    }

    try {
      if (editMode && editingAccountId) {
        const payload = {
          id: editingAccountId,
          accountName: formData.accountName,
          type: formData.type,
          balance: parseFloat(formData.balance),
          user: { id: parseInt(userId, 10) }
        }

        const response = await axios.put(
          `${API_URL}/accounts/update/${editingAccountId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const updatedAccount = response.data.data
        const updatedAccounts = accounts.map(acc =>
          acc.id === editingAccountId ? updatedAccount : acc
        )
        setAccounts(updatedAccounts)
        calculateTotals(updatedAccounts, expenses)
      } else {
        const payload = {
          accountName: formData.accountName,
          type: formData.type,
          balance: parseFloat(formData.balance),
          user: { id: parseInt(userId, 10) }
        }

        const response = await axios.post(
          `${API_URL}/accounts/add`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const newAccount = response.data.data
        const updatedAccounts = [...accounts, newAccount]
        setAccounts(updatedAccounts)
        calculateTotals(updatedAccounts, expenses)
      }

      setIsModalOpen(false)
      setFormData({ accountName: "", type: "Asset", balance: "" })
      setEditMode(false)
      setEditingAccountId(null)
    } catch (error) {
      console.error("Failed to save account:", error.response || error)
      alert("Failed to save account. Please try again")
    }
  }

  const handleEdit = account => {
    setFormData({
      accountName: account.accountName,
      type: account.type,
      balance: account.balance
    })
    setEditingAccountId(account.id)
    setEditMode(true)
    setIsModalOpen(true)
  }

  const handleDelete = async accountId => {
    if (!window.confirm("Are you sure you want to delete this account?")) return

    try {
      await axios.delete(`${API_URL}/accounts/delete/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const updatedAccounts = accounts.filter(acc => acc.id !== accountId)
      setAccounts(updatedAccounts)
      calculateTotals(updatedAccounts, expenses)
    } catch (error) {
      console.error("Failed to delete account:", error.response || error)
      alert("Failed to delete account")
    }
  }

  if (loading) return <p>Loading accounts...</p>

  return (
    <div className="d-flex app-container">
      <Sidebar />
      <main className="flex-grow-1 main-content p-4">
        {/* HEADER */}
        <header className="row text-center top-header mb-4">
          <div className="col-md-4">
            <p className="header-title">Net assets</p>
            <span className="header-value">₹ {totals.netAssets}</span>
          </div>
          <div className="col-md-4">
            <p className="header-title">Amount Remaining</p>
            <span className="header-value">₹ {totals.amountRemaining}</span>
          </div>
          <div className="col-md-4">
            <p className="header-title">Total assets</p>
            <span className="header-value">₹ {totals.assets}</span>
          </div>
        </header>

        {/* ACCOUNT LIST */}
        <section className="account-list">
          <div className="d-flex justify-content-between align-items-center account-header mb-2">
            <h3 className="m-0">Account List</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsModalOpen(true)
                setEditMode(false)
                setFormData({ accountName: "", type: "Asset", balance: "" })
              }}
            >
              Add Account
            </button>
          </div>

          {accounts.map(acc => (
            <div className="card account-card shadow-sm mb-3" key={acc.id}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title m-0">{acc.accountName}</h5>
                  <p style={{ color: '#fff', fontSize: 'small' }}>{acc.type}</p>
                  <p className="balance">Balance ₹ {acc.balance}</p>
                </div>
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(acc)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(acc.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">{editMode ? "Edit Account" : "Add Account"}</h2>

              <div className="form-group">
                <label>Account Name *</label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Enter account name"
                />
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  placeholder="Enter balance"
                />
              </div>

              <div className="modal-actions mt-3">
                <button className="btn btn-success me-2" onClick={handleSaveAccount}>
                  {editMode ? "Update" : "Add"}
                </button>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AccountsPage
