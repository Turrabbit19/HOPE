import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";

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
  const [classroomStats, setClassroomStats] = useState({
    latestSemester: "",
    totalClassrooms: 0,
  });

  const [extendedStudentCount, setExtendedStudentCount] = useState(0);
  const [minStudentMajors, setMinStudentMajors] = useState(0);
  const [maxStudentMajors, setMaxStudentMajors] = useState(0);
  const [subMajorStats, setSubMajorStats] = useState([]);
  const navigate = useNavigate();

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClassroomStats = async () => {
      try {
        const response = await instance.get("admin/statistics/classrooms");
        setClassroomStats({
          latestSemester: response.data.latest_semester,
          totalClassrooms: response.data.total_classrooms,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lớp học:", error);
      }
    };

    fetchClassroomStats();
  }, []);

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

        setCourseStats({ totalCourses, maxStudentsCourse, minStudentsCourse });

        setStudentByCourseData({
          labels: courses.map((course) => course.course_name),
          datasets: [
            {
              label: "Tổng số Sinh Viên",
              data: courses.map((course) => course.student_count),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
          course_ids: courses.map((course) => course.course_id),
        });
      } catch (error) {
        console.error("Lỗi khi lấy data khóa học:", error.message);
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

  const fetchMajorsByCourse = async (courseId) => {
    try {
      setIsLoading(true);
      const { data } = await instance.get(
        `admin/statistics/majorsByCourse/${courseId}`
      );
      setSubMajorStats(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê ngành:", error.message);
      setIsLoading(false);
      if (error.response) {
        console.error("Error response:", error.response);
      } else {
        console.error("Other error:", error);
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

  const handleChartClick = async (event, elements) => {
    if (!elements.length) return;
    const { index } = elements[0];
    const courseId = studentByCourseData.course_ids[index];
    setSelectedCourseId(courseId);

    await fetchMajorsByCourse(courseId);

    setIsModalOpen(true);
  };

  return (
    <div className=" mx-auto py-8 px-6 bg-gray-50">
      {/* Tiêu đề chính */}
      <h1 className="text-center text-4xl font-extrabold text-blue-600 mb-10">
        Báo Cáo Thống Kê Sinh Viên
      </h1>

      <div className="grid grid-cols-12 gap-6 mb-10">
        {/* 4 Ô Thống kê tổng quan */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
          {/* Tổng số Sinh Viên */}
          <div className="bg-blue-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-blue-600 mb-2">
              Tổng số Sinh Viên
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              <CountUp
                end={totalStats.basicMajorStudentCount || 0}
                duration={2}
                separator=","
              />
            </p>
          </div>

          {/* Tổng số Khóa */}
          <div className="bg-green-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-green-600 mb-2">
              Tổng số Khóa
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              <CountUp
                end={courseStats.totalCourses || 0}
                duration={2}
                separator=","
              />
            </p>
          </div>

          {/* Tổng số Ngành */}
          <div className="bg-yellow-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-yellow-600 mb-2">
              Tổng số Ngành
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              <CountUp
                end={studentTeacherByMajorData?.labels.length || 0}
                duration={2}
                separator=","
              />
            </p>
          </div>

          {/* Tổng số lớp */}
          <div className="bg-red-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-red-600 mb-2">
              Tổng số lớp (Kì {classroomStats.latestSemester})
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              <CountUp
                end={classroomStats.totalClassrooms || 0}
                duration={2}
                separator=","
              />
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Biểu đồ 1: Sinh viên theo khóa */}
        <div className="col-span-8 bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Biểu đồ Sinh Viên theo Khóa
          </h3>

          {studentByCourseData ? (
            <div className="w-full p-2 bg-gray-50 rounded-lg shadow-sm">
              <Bar
                data={studentByCourseData} // Dữ liệu biểu đồ
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: "Tương quan Khóa học và Số Sinh viên",
                      font: { size: 16, weight: "bold" },
                      color: "#4A4A4A",
                    },
                    legend: {
                      position: "top",
                      labels: { boxWidth: 15, padding: 20 },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Khóa học",
                        font: { size: 14 },
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Số lượng Sinh viên",
                        font: { size: 14 },
                      },
                      beginAtZero: true,
                    },
                  },
                  onClick: handleChartClick, // Gọi hàm khi click vào biểu đồ
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
          )}

          {/* Modal hiển thị thống kê chuyên ngành */}
          <Modal
            title={`Thống kê Sinh Viên theo Ngành học`}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            className="modal-custom"
            width={600}
            style={{
              zIndex: 1050,
              opacity: isModalOpen ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center py-5">
                <div className="spinner-border text-blue-500 w-12 h-12 animate-spin"></div>
              </div>
            ) : subMajorStats.length > 0 ? (
              <ul className="list-disc ml-5 space-y-2">
                {subMajorStats.map((major) => (
                  <li key={major.id} className="text-gray-700">
                    <span className="font-medium">{major.name}:</span>{" "}
                    {major.students_count} sinh viên
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                Chưa có dữ liệu ngành học
              </p>
            )}

            <Button
              type="primary"
              onClick={() => setIsModalOpen(false)} // Đóng modal khi bấm nút
              className="mt-6 w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
              loading={isLoading}
            >
              Đóng
            </Button>
          </Modal>
        </div>

        {/* Card Thông tin tổng quan */}
        <div className="col-span-4 flex flex-col space-y-4">
          <div className="bg-blue-100 shadow-sm p-5 rounded-lg">
            <h4 className="text-2xl font-bold text-blue-600">
              Tổng số khóa đang mở
            </h4>
            <p className="text-gray-800 text-2xl">{courseStats.totalCourses}</p>
          </div>

          <div className="bg-green-100 shadow-sm p-5 rounded-lg">
            <h4 className="text-2xl font-bold text-green-600">
              Khóa đông nhất
            </h4>
            <p className="text-gray-800">
              {courseStats.maxStudentsCourse?.course_name} (
              {courseStats.maxStudentsCourse?.student_count} sinh viên)
            </p>
          </div>

          <div className="bg-red-100 shadow-sm p-5 rounded-lg">
            <h4 className="text-2xl font-bold text-red-600">Khóa ít nhất</h4>
            <p className="text-gray-800">
              {courseStats.minStudentsCourse?.course_name} (
              {courseStats.minStudentsCourse?.student_count} sinh viên)
            </p>
          </div>
        </div>

        {/* Biểu đồ 2: Sinh viên và giảng viên */}
        <div className="col-span-8 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Sinh viên & Giảng viên theo Ngành
          </h3>
          {studentTeacherByMajorData ? (
            <Bar
              data={studentTeacherByMajorData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Sinh viên và Giảng viên theo ngành",
                    font: {
                      size: 16,
                      weight: "bold",
                    },
                  },
                  legend: { position: "top" },
                },
                scales: {
                  x: { title: { display: true, text: "Ngành" } },
                  y: {
                    title: { display: true, text: "Số lượng" },
                    beginAtZero: true,
                  },
                },
              }}
            />
          ) : (
            <p className="text-gray-500 text-sm">Dữ liệu không khả dụng</p>
          )}
        </div>

        {/* Card: Tổng sinh viên và thông tin khác */}
        <div className="col-span-4 bg-gradient-to-r from-blue-100 to-blue-100 shadow-lg p-6 rounded-lg text-gray-700">
          <h2 className="text-3xl text-center font-bold text-blue-800 mb-4">
            Thống kê chung
          </h2>
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-blue-500 text-xl">
              <i className="fas fa-users"></i>
            </span>
            <p>
              <strong className="text-blue-700">Tổng số Sinh Viên:</strong>{" "}
              {totalStats.basicMajorStudentCount}
            </p>
          </div>
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-green-500 text-xl">
              <i className="fas fa-chalkboard-teacher"></i>
            </span>
            <p>
              <strong className="text-green-700">Tổng số Giảng Viên:</strong>{" "}
              {totalStats.totalTeachers}
            </p>
          </div>
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-red-500 text-xl">
              <i className="fas fa-chart-line"></i>
            </span>
            <p>
              <strong className="text-red-700">Ngành ít Sinh viên nhất:</strong>{" "}
              {minStudentMajors.major_name} ({minStudentMajors.student_count}{" "}
              sinh viên)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-500 text-xl">
              <i className="fas fa-crown"></i>
            </span>
            <p>
              <strong className="text-yellow-700">
                Ngành đông Sinh viên nhất:
              </strong>{" "}
              {maxStudentMajors.major_name} ({maxStudentMajors.student_count}{" "}
              sinh viên)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalReport;
