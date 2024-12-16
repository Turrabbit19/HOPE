import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
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
import chroma from "chroma-js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticalReport = () => {
  const [studentByCourseData, setStudentByCourseData] = useState(null);
  const [studentTeacherByMajorData, setStudentTeacherByMajorData] =
    useState(null);
  const [courseStats, setCourseStats] = useState({
    totalCourses: 0,
    maxStudentsCourse: null,
    minStudentsCourse: null,
  });
  const [totalStats, setTotalStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
  });
  const [extendedStudentCount, setExtendedStudentCount] = useState(0);
  const [minStudentMajors, setMinStudentMajors] = useState(0);
  const [maxStudentMajors, setMaxStudentMajors] = useState(0);
  const [subMajorStats, setSubMajorStats] = useState([]); // Thêm state để lưu thông tin thống kê chuyên ngành
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentByCourse = async () => {
      try {
        const { data } = await instance.get(`admin/statistics/studentByCourse`);
        const courses = Object.keys(data).map((courseId) => ({
          course_id: courseId,
          course_name: data[courseId].course_name,
          student_count: data[courseId].student_count,
        }));

        const totalCourses = courses.length;
        const maxStudentsCourse = courses.reduce((max, course) =>
          course.student_count > max.student_count ? course : max
        );
        const minStudentsCourse = courses.reduce((min, course) =>
          course.student_count < min.student_count ? course : min
        );

        setCourseStats({
          totalCourses,
          maxStudentsCourse,
          minStudentsCourse,
        });

        setStudentByCourseData({
          labels: courses.map((course) => course.course_name),
          datasets: [
            {
              label: "Tổng số học sinh đang học theo khóa",
              data: courses.map((course) => course.student_count),
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

    const fetchStudentTeacherByMajor = async () => {
      try {
        const { data } = await instance.get(
          `admin/statistics/studentAndTeacherByMajor`
        );

        const totalStudents = data.reduce(
          (total, item) => total + item.student_count,
          0
        );
        const totalTeachers = data.reduce(
          (total, item) => total + item.teacher_count,
          0
        );

        const basicMajor = data[0];

        const basicMajorStudentCount = basicMajor.student_count;
        const remainingMajors = data.filter(
          (item) => item.major_name !== basicMajor.major_name
        );

        const minMajor = remainingMajors.reduce((min, item) =>
          item.student_count < min.student_count ? item : min
        );
        const maxMajor = remainingMajors.reduce((max, item) =>
          item.student_count > max.student_count ? item : max
        );

        const extendedStudentCount = maxMajor.student_count;

        setTotalStats({
          totalStudents,
          totalTeachers,
          basicMajorStudentCount: basicMajor.student_count,
        });

        setExtendedStudentCount(extendedStudentCount);
        setMinStudentMajors(minMajor);
        setMaxStudentMajors(maxMajor);
        setStudentTeacherByMajorData({
          labels: data.map((item) => item.major_name),
          datasets: [
            {
              label: "Số Sinh Viên",
              data: data.map((item) => item.student_count),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              major_ids: data.map((item) => item.major_id),
            },
            {
              label: "Số Giảng Viên",
              data: data.map((item) => item.teacher_count),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchStudentByCourse();
    fetchStudentTeacherByMajor();
  }, []);

  const handleChartClick = async (event, elements) => {
    console.log(event, elements);
    if (elements.length > 0) {
      const index = elements[0].index;

      const majorId = studentTeacherByMajorData.datasets[0].major_ids[index];
      const majorName = studentTeacherByMajorData.labels[index];
      console.log("Major clicked:", majorName, "Major ID:", majorId);
      try {
        const { data } = await instance.get(
          `admin/statistics/statisticSubMajors/${majorId}`
        );
        setSubMajorStats(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching sub major statistics:", error.message);
      }
    }
  };

  const colors = chroma.scale("Set3").colors(subMajorStats.length);

  const chartData = {
    labels: subMajorStats.map((item) => item.major_name),
    datasets: [
      {
        data: subMajorStats.map((item) => item.student_count),
        backgroundColor: colors,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + " sinh viên";
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2 className="text-center font-bold text-[18px]">Biểu đồ Thống Kê</h2>

      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        <div className="col-span-2">
          <div style={{ marginBottom: "40px" }}>
            <h3>Biểu đồ Sinh Viên theo Khóa</h3>
            {studentByCourseData && (
              <Bar
                data={studentByCourseData}
                options={{
                  responsive: true,
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
            )}
          </div>
        </div>
        <div className="col-start-3 flex justify-center items-center">
          <div className="flex flex-col">
            <h3>
              <strong>Tổng số khóa đang mở:</strong> {courseStats.totalCourses}
            </h3>
            <h4>
              <strong>Khóa có nhiều sinh viên nhất:</strong>{" "}
              {courseStats.maxStudentsCourse?.course_name} (
              {courseStats.maxStudentsCourse?.student_count} sinh viên)
            </h4>
            <h4>
              <strong>Khóa có ít sinh viên nhất:</strong>{" "}
              {courseStats.minStudentsCourse?.course_name} (
              {courseStats.minStudentsCourse?.student_count} sinh viên)
            </h4>
          </div>
        </div>
        <div className="col-span-2 col-start-2 row-start-2">
          <div>
            <h3>Biểu đồ Sinh Viên và Giảng Viên theo Ngành</h3>
            {studentTeacherByMajorData && (
              <Bar
                data={studentTeacherByMajorData}
                options={{
                  onClick: (event, elements) =>
                    handleChartClick(event, elements),
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Biểu đồ cột biểu diễn số Sinh Viên và Giảng Viên theo Ngành",
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
                }}
              />
            )}
          </div>
        </div>
        <div className="col-start-1 row-start-2 flex justify-center items-center">
          <div>
            <p>
              <strong>Tổng số Sinh Viên:</strong>{" "}
              {totalStats.basicMajorStudentCount}
            </p>
            <p>
              <strong>Tổng số Giảng Viên:</strong> {totalStats.totalTeachers}
            </p>
            <p>
              <strong>Ngành có sinh viên ít nhất:</strong>{" "}
              {minStudentMajors.major_name} ({minStudentMajors.student_count}{" "}
              sinh viên)
            </p>
            <p>
              <strong>Ngành có sinh viên nhiều nhất:</strong>{" "}
              {maxStudentMajors.major_name} ({maxStudentMajors.student_count}{" "}
              sinh viên)
            </p>
          </div>
        </div>
      </div>

      {subMajorStats.length > 0 ? (
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            height: "400px",
          }}
        >
          <Doughnut data={chartData} options={options} />
        </div>
      ) : (
        <h3 className="text-center font-bold text-red-500">Chưa có sinh viên học chuyên ngành của ngành này</h3>
      )}
    </div>
  );
};

export default StatisticalReport;
