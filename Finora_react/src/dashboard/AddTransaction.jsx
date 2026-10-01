import React, { useState, useRef } from "react"
import "./AddTransaction.css"
import axios from "axios"

const AddTransaction = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: "Expense",
    amount: "",
    category: "",
    account: "",
    time: "",
    description: ""
  })
  const API_URL = import.meta.env.VITE_API_URL
  const modalRef = useRef(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      const storedUserId = localStorage.getItem("userId")
      const token = localStorage.getItem("token")

      if (!storedUserId || !token) {
        alert("User not logged in. Please login first")
        return
      }

      const userId = parseInt(storedUserId, 10)
      if (isNaN(userId)) {
        alert("Invalid userId. Please login again")
        return
      }

      if (!formData.amount || !formData.category || !formData.account) {
        alert("Please fill all required fields")
        return
      }

      const accountMap = {
        "Cash": "CASH",
        "Credit Card": "CREDIT_CARD",
        "Bank": "BANK"
      }
      const accountValue = accountMap[formData.account] || formData.account

      const date = formData.time || new Date().toISOString().split("T")[0]

      const payload = {
        userId,
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        account: accountValue,
        description: formData.description || "",
        date
      }

      console.log("Sending payload", payload)

      const response = await axios.post(
        `${API_URL}/expense/add`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      console.log("Expense added successfully", response.data)

      if (onSubmit) onSubmit(response.data.data || payload)
      onClose()
    } catch (error) {
      console.error("Failed to add expense", error.response ? error.response.data : error)
      alert(error.response?.data?.message || "Failed to add expense. Please check your login and try again")
    }
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

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef} onScroll={handleScroll}>
        <h2 className="modal-title">Add Transaction</h2>

        <div className="transaction-type">
          {["Expense"].map(t => (
            <button
              key={t}
              className={`type-btn ${formData.type === t ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, type: t })}
            >
              {t}
            </button>
          ))}
        </div>

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
          <button className="btn add" onClick={handleSubmit}>Add</button>
          <button className="btn cancel" onClick={onClose}>Cancel</button>
        </div>

        {showScrollBtn && (
          <button className="scroll-btn" onClick={scrollToBottom}>↓</button>
        )}
      </div>
    </div>
  )
}

export default AddTransaction
