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
  ArcElement,
} from "chart.js";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link, useParams } from "react-router-dom";
import instance from "../../../../config/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatisticalMajorReport = () => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(
          `admin/statistics/${id}/studentByMajor`
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const chartData = {
    labels: data.map((item) => item.major_name),
    datasets: [
      {
        label: "Số lượng sinh viên",
        data: data.map((item) => item.student_count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
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
