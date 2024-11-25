import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Import for Pie chart
} from "chart.js";
import { LeftCircleOutlined } from "@ant-design/icons"; // Correctly import LeftCircleOutlined
import { Button } from "antd";
import { Link, useParams } from "react-router-dom";
import instance from "../../../../config/axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Register ArcElement for Pie chart
);

const StatisticalMajorReport = () => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar"); // Track chart type (bar or pie)
  const { id } = useParams(); // Get the course ID from URL parameters

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(
          `admin/statistics/${id}/studentByMajor`
        );
        console.log(response.data); // Log data for debugging
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(); // Call the fetch function
  }, [id]); // Re-fetch data when the `id` changes

  const chartData = {
    labels: data.map((item) => item.major_name), // Names of the majors
    datasets: [
      {
        label: "Số lượng sinh viên", // Label for the chart
        data: data.map((item) => item.student_count), // Student count for each major
        // For Bar chart, use a single color
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Single color for bar chart
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: data.map((item) => item.major_name),
    datasets: [
      {
        label: "Số lượng sinh viên",
        data: data.map((item) => item.student_count),
        backgroundColor: data.map(
          (_, index) => `hsl(${(index * 360) / data.length}, 70%, 50%)`
        ),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Số lượng sinh viên theo ngành",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start the Y-axis from 0 (only for Bar chart)
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Số lượng sinh viên theo ngành",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    // No Y-axis for Pie chart
    scales: {},
  };

  const toggleChartType = () => {
    setChartType((prev) => (prev === "bar" ? "pie" : "bar")); // Toggle between bar and pie
  };

  return (
    <div>
      <Link to="/admin/statistical-report">
        <Button className="rounded-full">
          <LeftCircleOutlined />
          Back
        </Button>
      </Link>

      <div className="chart-container" style={{ marginTop: "20px" }}>
        {chartType === "bar" ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div style={{ width: "50%", margin: "0 auto" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        )}
      </div>

      <Button
        onClick={toggleChartType}
      >
        {chartType === "pie" ? "Biểu đồ cột" : "Biểu đồ tròn"}
      </Button>
    </div>
  );
};

export default StatisticalMajorReport;
