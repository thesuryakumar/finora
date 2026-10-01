import React, { useState, useEffect, useRef } from "react"
import "./TransactionDetails.css"
import Sidebar from "./Sidebar"
import axios from "axios"

const TransactionDetails = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingTxnId, setEditingTxnId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL
  const modalRef = useRef(null)

  // Form data for Add/Edit
  const [formData, setFormData] = useState({
    type: "Expense",
    amount: "",
    category: "",
    account: "",
    time: "",
    description: ""
  })

  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  // ---------------- Fetch transactions ----------------
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/expense/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const txns = Array.isArray(response.data)
          ? response.data
          : response.data.data || []

        const data = txns.map((txn) => ({
          id: txn.id,
          time: txn.date,
          category: txn.category,
          amount: txn.amount,
          account: txn.account || txn.Account || "Unknown",
          description: txn.description,
          type: txn.type || "Expense"
        }))

        setTransactions(data)
        setFilteredTransactions(data)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      }
    }

    if (token && userId) fetchTransactions()
  }, [token, userId])

  // ---------------- Dynamic Search ----------------
  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const filtered = transactions.filter(
      (txn) =>
        txn.description?.toLowerCase().includes(query) ||
        txn.category?.toLowerCase().includes(query) ||
        txn.account?.toLowerCase().includes(query) ||
        txn.type?.toLowerCase().includes(query)
    )
    setFilteredTransactions(filtered)
  }, [searchQuery, transactions])

  // ---------------- Handle form change ----------------
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleScroll = () => {
    setShowScrollBtn(modalRef.current.scrollTop > 100)
  }

  const scrollToBottom = () => {
    modalRef.current.scrollTo({
      top: modalRef.current.scrollHeight,
      behavior: "smooth"
    })
  }

  // ---------------- Open Add/Edit Modal ----------------
  const openModal = (txn = null) => {
    if (txn) {
      setEditMode(true)
      setEditingTxnId(txn.id)
      setFormData({
        type: txn.type,
        amount: txn.amount,
        category: txn.category,
        account: txn.account,
        time: txn.time,
        description: txn.description
      })
    } else {
      setEditMode(false)
      setEditingTxnId(null)
      setFormData({
        type: "Expense",
        amount: "",
        category: "",
        account: "",
        time: "",
        description: ""
      })
    }
    setIsModalOpen(true)
  }

  // ---------------- Save transaction ----------------
  const handleSaveTransaction = async () => {
    try {
      if (!formData.amount || !formData.category || !formData.account) {
        alert("Please fill all required fields")
        return
      }

      const accountMap = {
        Cash: "CASH",
        "Credit Card": "CREDIT_CARD",
        Bank: "BANK"
      }
      const accountValue = accountMap[formData.account] || formData.account
      const date = formData.time || new Date().toISOString().split("T")[0]

      const payload = {
        id: editingTxnId,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || "",
        date,
        account: accountValue,
        userId: parseInt(userId, 10),
        type: formData.type
      }

      if (editMode) {
        const response = await axios.put(
          `${API_URL}/expense/update`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const updatedTxn = response.data.data
        const updatedList = transactions.map((t) =>
          t.id === editingTxnId ? updatedTxn : t
        )
        setTransactions(updatedList)
        setFilteredTransactions(updatedList)
      } else {
        const response = await axios.post(
          `${API_URL}/expense/add`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const newTxn = response.data.data || payload
        const updatedList = [...transactions, newTxn]
        setTransactions(updatedList)
        setFilteredTransactions(updatedList)
      }

      setIsModalOpen(false)
      setEditMode(false)
      setEditingTxnId(null)
    } catch (error) {
      console.error("Failed to save transaction:", error)
      alert("Failed to save transaction. Try again")
    }
  }

  // ---------------- Delete transaction ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return

    try {
      await axios.delete(`${API_URL}/expense/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const updatedList = transactions.filter((t) => t.id !== id)
      setTransactions(updatedList)
      setFilteredTransactions(updatedList)
    } catch (error) {
      console.error("Failed to delete transaction:", error)
      alert("Failed to delete transaction")
    }
  }

  return (
    <div className="app-wrapper">
      <Sidebar />

      <main className="txn-main">
        <header className="txn-header">
          <h2>Transaction List</h2>
          <div className="header-actions">
            <button className="btn" onClick={() => openModal()}>Add Transaction</button>
            <input
              type="text"
              placeholder="Search transactions..."
              className="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Filters */}
        <div className="filters">
          <div>
            <label>Date Range</label>
            <span>Aug 1, 2025 – Aug 31, 2025</span>
          </div>
          <div>
            <label>Transaction Type</label>
            <select>
              <option>All Types</option>
            </select>
          </div>
          <div>
            <label>Transactions Per Page</label>
            <select>
              <option>15</option>
              <option>30</option>
              <option>50</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Account</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.time}</td>
                <td>{txn.category}</td>
                <td className={txn.type === "Expense" && "expense" }>
                  {txn.type === "Expense" ? "- " : "+ "}₹{txn.amount}
                </td>
                <td>{txn.account}</td>
                <td>{txn.description}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => openModal(txn)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(txn.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" ref={modalRef} onScroll={handleScroll}>
              <h3>{editMode ? "Edit Transaction" : "Add Transaction"}</h3>

              {/* Transaction Type Tabs */}
              <div className="transaction-type">
                {["Expense", "Income", "Transfer"].map((t) => (
                  <button
                    key={t}
                    className={`type-btn ${formData.type === t ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, type: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  <option>Food & Drink</option>
                  <option>Transport</option>
                  <option>Entertainment</option>
                  <option>Shopping</option>
                </select>
              </div>

              <div className="form-group">
                <label>Account *</label>
                <select name="account" value={formData.account} onChange={handleChange}>
                  <option value="">Select account</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>

              <div className="form-group">
                <label>Transaction Date</label>
                <input type="date" name="time" value={formData.time} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Optional" />
              </div>

              <div className="modal-actions">
                <button className="btn btn-success me-2" onClick={handleSaveTransaction}>
                  {editMode ? "Update" : "Add"}
                </button>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>

              {showScrollBtn && (
                <button className="scroll-btn" onClick={scrollToBottom}>↓</button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default TransactionDetails
