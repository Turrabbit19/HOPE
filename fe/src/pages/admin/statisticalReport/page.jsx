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
  const [courseData, setCourseData] = useState([]); // Store the structured course data
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await instance.get(`admin/statistics/studentByCourse`);

        // Create structured course data
        const courses = Object.keys(data).map((courseId) => ({
          course_id: courseId,
          course_name: data[courseId].course_name,
          student_count: data[courseId].student_count,
        }));

        // Set chart data
        setCourseData(courses);

        setChartData({
          labels: courses.map((course) => course.course_name), // Use course_name as labels
          datasets: [
            {
              label: "Tổng số học sinh đang học theo khóa",
              data: courses.map((course) => course.student_count), // Use student_count for data
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
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
      const index = elements[0].index; // Get the index of the clicked element
      const courseId = courseData[index].course_id; // Get the course_id from the structured data

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
