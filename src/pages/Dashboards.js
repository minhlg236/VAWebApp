import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";

// Đăng ký các thành phần của biểu đồ
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const Dashboards = () => {
  const barData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
    datasets: [
      {
        label: "Doanh thu",
        data: [12000, 19000, 3000, 5000, 2000],
        backgroundColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const lineData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
    datasets: [
      {
        label: "Số lượng người dùng",
        data: [50, 60, 70, 80, 90],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div>
      <h2>Thống kê</h2>
      <div className="chart-container">
        <h3>Biểu đồ Doanh thu</h3>
        <Bar data={barData} />

        <h3>Biểu đồ Người dùng</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default Dashboards;
