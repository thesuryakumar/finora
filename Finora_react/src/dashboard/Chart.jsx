import React from "react"
import { Bar } from "react-chartjs-2"

const Chart = ({ data }) => {
  const chartData = {
    labels: data.map(exp => exp.category),
    datasets: [
      {
        label: "Expenses",
        data: data.map(exp => exp.amount),
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  }

  return <Bar data={chartData} />
}

export default Chart
