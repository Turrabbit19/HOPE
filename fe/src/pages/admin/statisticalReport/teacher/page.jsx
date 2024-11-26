import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import instance from "../../../../config/axios";
const StatisticalTeacherStudent = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(
          `admin/statistics/studentAndTeacherByMajor`
        );
        setData(data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  const labels = data.map((item) => item.major_name);
  const studentCounts = data.map((item) => item.student_count);
  const teacherCounts = data.map((item) => item.teacher_count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Số Sinh Viên",
        data: studentCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Số Giảng Viên",
        data: teacherCounts,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngành",
        },
      },
      y: {
        title: {
          display: true,
          text: "Số lượng",
        },
        beginAtZero: true,
      },
    },
  };
  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2>Biểu đồ Số Sinh Viên và Giảng Viên</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StatisticalTeacherStudent;
