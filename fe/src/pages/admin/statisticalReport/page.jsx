import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import instance from "../../../config/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticalReport = () => {
  const [chartData, setChartData] = useState(null);
  const [links, setLinks] = useState([]); // Store the links
  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await instance.get(`admin/statistics/studentByCourse`);

        const courseIds = Object.keys(data);
        const courseNames = courseIds.map(id => data[id].course_name);
        const studentCounts = courseIds.map(id => data[id].student_count);

        setChartData({
          labels: courseNames,
          datasets: [
            {
              label: "Tổng số học sinh đang học theo khóa",
              data: studentCounts,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });

        const generatedLinks = courseIds.map((id) => `/admin/statistical-report/${id}`);
        setLinks(generatedLinks);

      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const courseId = Object.keys(chartData.datasets[0].data)[index];

      navigate(`/admin/statistical-report/${courseId}/major`);
    }
  };

  return (
    <div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          onClick: handleChartClick,
          plugins: {
            title: {
              display: true,
              text: "Biểu đồ cột biểu diễn tương quan khóa học và số sinh viên",
            },
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Khóa học",
              },
            },
            y: {
              title: {
                display: true,
                text: "Tổng số sinh viên",
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default StatisticalReport;
