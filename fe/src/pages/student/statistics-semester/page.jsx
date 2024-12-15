import React, { useEffect, useState } from "react";
import instance from "../../../config/axios";
import { Select } from "antd";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticSemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [chartData, setChartData] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const semesterResponse = await instance.get(`student/all/semesters`);
        const fetchedSemesters = semesterResponse.data.data;
        setSemesters(fetchedSemesters);

        if (fetchedSemesters.length > 0) {
          const maxIdSemester = fetchedSemesters.reduce((max, semester) =>
            semester.id > max.id ? semester : max
          );
          setSelectedSemester(maxIdSemester.id);
          handleChange(maxIdSemester.id);
        }
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  const handleChange = async (value) => {
    setSelectedSemester(value);
    try {
      const { data } = await instance.get(`student/statistics/${value}`);
      const subjects = data.data;
      setSubjects(subjects);
      setErrorMessage("")
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Chưa có dữ liệu cho kỳ học này.");
        setSubjects([]);
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
      console.log("Error fetching statistics:", error.message);
    }
  };

  const createChartData = (subject) => {
    const attendedLessons = subject.attended_lessons;
    const missedLessons = subject.missed_lessons;
    const remainingLessons = subject.remaining_lessons;

    return {
      labels: ["Buổi học đã tham gia", "Buổi học đã vắng", "Buổi học còn lại"],
      datasets: [
        {
          data: [attendedLessons, missedLessons, remainingLessons],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)", 
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      <h2 className="font-bold text-[22px] mb-2">Học kỳ</h2>
      <Select
        placeholder="Vui lòng chọn kỳ học"
        value={selectedSemester}
        onChange={handleChange}
        style={{
          width: "100%",
        }}
        options={semesters.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
      />
      <span className="mt-2">Vui lòng chọn kỳ học</span>

      {errorMessage && <div style={{ color: "red", marginTop: "20px" }}>{errorMessage}</div>}

      {subjects.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {subjects.map((subject, index) => (
            <div
              key={index}
              style={{
                maxWidth: "400px",
                margin: "0 auto",
                height: "400px",
              }}
            >
              <h3 className="font-bold text-center text-[22px]">
                {subject.subject_name}
              </h3>
              <Doughnut
                data={createChartData(subject)}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          return `${tooltipItem.label}: ${tooltipItem.raw} buổi`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatisticSemester;
