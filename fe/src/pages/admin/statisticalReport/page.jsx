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
  const [studentByCourseData, setStudentByCourseData] = useState(null);
  const [studentTeacherByMajorData, setStudentTeacherByMajorData] =
    useState(null);
  const [courseStats, setCourseStats] = useState({
    totalCourses: 0,
    maxStudentsCourse: null,
    minStudentsCourse: null,
  });
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

        // Tính toán thông tin khóa học
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

        setStudentTeacherByMajorData({
          labels: data.map((item) => item.major_name),
          datasets: [
            {
              label: "Số Sinh Viên",
              data: data.map((item) => item.student_count),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
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

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const courseId = studentByCourseData.datasets[0].data[index];
      navigate(`/admin/statistical-report/${courseId}/major`);
    }
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
            )}
          </div>
        </div>
        <div className="col-start-3">
          <div>
            <h3>Tổng số khóa đang mở: {courseStats.totalCourses}</h3>
            <h4>
              Khóa có nhiều sinh viên nhất: {courseStats.maxStudentsCourse?.course_name} ({courseStats.maxStudentsCourse?.student_count} sinh viên)
            </h4>
            <h4>
              Khóa có ít sinh viên nhất: {courseStats.minStudentsCourse?.course_name} ({courseStats.minStudentsCourse?.student_count} sinh viên)
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
        <div className="col-start-1 row-start-2">4</div>
      </div>
    </div>
  );
};

export default StatisticalReport;
