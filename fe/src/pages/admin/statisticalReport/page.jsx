import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Select, Spin } from "antd";

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
    maxStudentsCourseName: "", // Thêm trường lưu tên khóa học có số sinh viên tối đa
    minStudentsCourseName: "", // Thêm trường lưu tên khóa học có số sinh viên tối thiểu
  });
  const [totalStats, setTotalStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
  });
  const [classroomStats, setClassroomStats] = useState({
    latestSemester: "",
    totalClassrooms: 0,
  });

  const [statistics, setStatistics] = useState({
    studentCount: 0,
    teacherCount: 0,
    courseCount: 0,
    majorCount: 0,
    semesterCount: 0,
  });

  const [minStudentMajors, setMinStudentMajors] = useState(0);
  const [maxStudentMajors, setMaxStudentMajors] = useState(0);
  const [subMajorStats, setSubMajorStats] = useState([]);
  const navigate = useNavigate();

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { Option } = Select;

  const [selectedYear, setSelectedYear] = useState("all");
  const [years, setYears] = useState([]);

  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("all");

  const cacheData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getCacheData = (key) => {
    const cache = localStorage.getItem(key);
    return cache ? JSON.parse(cache) : null;
  };

  const fetchTerms = async () => {
    const cacheSemesters = getCacheData("semesters");
    if (cacheSemesters) {
      setTerms(cacheSemesters);
      return;
    }
    try {
      const response = await instance.get("admin/semesters");
      const semesterData = response.data.data;
      cacheData("semesters", semesterData);
      setTerms(semesterData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu kỳ học:", error);
    }
  };

  const fetchYears = async () => {
    const cacheCourses = getCacheData("courses");
    if (cacheCourses) {
      const currentDate = new Date();
      const activeCourses = cacheCourses.filter((course) => {
        const endDate = new Date(course.end_date);
        return currentDate < endDate;
      });

      const activeYears = activeCourses.map((course) =>
        new Date(course.start_date).getFullYear()
      );
      const uniqueYears = [...new Set(activeYears)];
      setYears(uniqueYears);
      return;
    }
    try {
      const response = await instance.get("admin/courses");
      const courses = response.data.data;
      cacheData("courses", courses);

      const currentDate = new Date();
      const activeCourses = courses.filter((course) => {
        const endDate = new Date(course.end_date);
        return currentDate < endDate;
      });

      const activeYears = activeCourses.map((course) =>
        new Date(course.start_date).getFullYear()
      );
      const uniqueYears = [...new Set(activeYears)];
      setYears(uniqueYears);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khóa học:", error);
    }
  };

  useEffect(() => {
    fetchTerms();
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchClassroomStats = async () => {
      try {
        const response = await instance.get("admin/statistics/classrooms", {
          params: {
            year: selectedYear !== "all" ? selectedYear : "",
            semester_id: selectedTerm !== "all" ? selectedTerm : "",
          },
        });

        setClassroomStats({
          semester:
            selectedTerm !== "all"
              ? terms.find((term) => term.id === selectedTerm)?.name ||
                "Kỳ học không xác định"
              : "Tất cả các kỳ học",
          totalClassrooms: response.data.total_classrooms,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lớp học:", error);
      }
    };

    fetchClassroomStats();
  }, [selectedYear, selectedTerm]);

  useEffect(() => {
    const fetchStudentByCourse = async () => {
      try {
        const { data } = await instance.get(
          "admin/statistics/studentByCourse",
          {
            params: {
              year: selectedYear !== "all" ? selectedYear : "",
            },
          }
        );

        const courses = Object.entries(data).map(([courseId, courseData]) => ({
          course_id: courseId,
          course_name: courseData.course_name,
          student_count: courseData.student_count,
        }));

        const totalCourses = courses.length;

        const maxCourse = courses.reduce(
          (max, course) =>
            course.student_count > max.student_count ? course : max,
          { student_count: 0 }
        );
        const minCourse = courses.reduce(
          (min, course) =>
            course.student_count < min.student_count ? course : min,
          { student_count: Number.MAX_SAFE_INTEGER }
        );

        setCourseStats({
          totalCourses,
          maxStudentsCourse: maxCourse.student_count,
          minStudentsCourse: minCourse.student_count,
          maxStudentsCourseName: maxCourse.course_name,
          minStudentsCourseName: minCourse.course_name,
        });

        setStudentByCourseData({
          labels: courses.map((course) => course.course_name),
          datasets: [
            {
              label: "Tổng số Sinh Viên",
              data: courses.map((course) => course.student_count),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              course_ids: courses.map((course) => course.course_id),
            },
          ],
        });

        console.log("Student By Course Data:", {
          labels: courses.map((course) => course.course_name),
          datasets: [
            {
              data: courses.map((course) => course.student_count),
              course_ids: courses.map((course) => course.course_id),
            },
          ],
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error.message);
      }
    };

    const fetchStudentTeacherByMajor = async () => {
      try {
        const { data } = await instance.get(
          "admin/statistics/studentAndTeacherByMajor",
          {
            params: {
              year: selectedYear !== "all" ? selectedYear : "",
            },
          }
        );

        // Tính tổng số sinh viên và giảng viên
        const totalStudents = data
          .slice(1)
          .reduce((total, item) => total + item.student_count, 0);

        const totalTeachers = data.reduce(
          (total, item) => total + item.teacher_count,
          0
        );

        setTotalStats({
          totalStudents,
          totalTeachers,
        });

        const basicMajor = data[0];

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
  }, [selectedYear, selectedTerm]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data } = await instance.get(
          "admin/statistics/countStatistics",
          {
            params: {
              year: selectedYear !== "all" ? selectedYear : "",
            },
          }
        );

        const {
          student_count,
          teacher_count,
          course_count,
          major_count,
          semester_count,
        } = data;

        setStatistics({
          studentCount: student_count,
          teacherCount: teacher_count,
          courseCount: course_count,
          majorCount: major_count,
          semesterCount: semester_count,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error.message);
      }
    };

    fetchStatistics();
  }, [selectedYear]);

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
    try {
      if (!elements.length) {
        alert("Vui lòng chọn một khóa học.");
        return;
      }

      const { index } = elements[0];
      const courseIds = studentByCourseData?.datasets[0]?.course_ids;

      if (!courseIds || !courseIds[index]) {
        alert("Không tìm thấy thông tin khóa học.");
        return;
      }

      const courseId = courseIds[index];
      console.log("Selected Course ID:", courseId);

      setSelectedCourseId(courseId);
      setIsLoading(true);

      await fetchMajorsByCourse(courseId);
      setIsLoading(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      alert("Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại.");
    }
  };

  return (
    <div className=" mx-auto py-8 px-6 bg-gray-50">
      <div className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* 1. Tổng số Sinh viên */}
          <div className="bg-blue-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-blue-600 mb-2">
              Tổng số Sinh viên
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              {isLoading ? (
                <span className="animate-pulse text-gray-400">Loading...</span>
              ) : (
                <CountUp
                  end={statistics.studentCount || 0}
                  duration={2}
                  separator=","
                />
              )}
            </p>
          </div>

          {/* 2. Tổng số Giảng viên */}
          <div className="bg-orange-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-orange-600 mb-2">
              Tổng số Giảng viên
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              {isLoading ? (
                <span className="animate-pulse text-gray-400">Loading...</span>
              ) : (
                <CountUp
                  end={statistics.teacherCount || 0}
                  duration={2}
                  separator=","
                />
              )}
            </p>
          </div>

          {/* 3. Tổng số Khóa */}
          <div className="bg-green-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-green-600 mb-2">
              Tổng số Khóa sinh viên
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              {isLoading ? (
                <span className="animate-pulse text-gray-400">Loading...</span>
              ) : (
                <CountUp
                  end={statistics.courseCount || 0}
                  duration={2}
                  separator=","
                />
              )}
            </p>
          </div>

          {/* 4. Tổng số Ngành */}
          <div className="bg-yellow-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-yellow-600 mb-2">
              Tổng số Ngành học
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              {isLoading ? (
                <span className="animate-pulse text-gray-400">Loading...</span>
              ) : (
                <CountUp
                  end={statistics.majorCount || 0}
                  duration={2}
                  separator=","
                />
              )}
            </p>
          </div>

          {/* 5. Tổng số Lớp */}
          <div className="bg-red-100 shadow-md p-5 rounded-lg flex flex-col items-center">
            <h4 className="text-xl font-bold text-red-600 mb-2">
              {classroomStats.semester === "Tất cả các kỳ học"
                ? "Tổng số lớp"
                : `Tổng số lớp (Kì ${classroomStats.semester})`}
            </h4>
            <p className="text-3xl font-semibold text-gray-800">
              {isLoading ? (
                <span className="animate-pulse text-gray-400">Loading...</span>
              ) : (
                <CountUp
                  end={classroomStats.totalClassrooms || 0}
                  duration={2}
                  separator=","
                />
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-12 flex justify-start items-center space-x-4 mb-4">
        <div>
          <label className="font-semibold text-gray-800 mr-2">Chọn Năm:</label>
          <Select
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
            className="w-48 border-gray-300"
            placeholder="Chọn năm"
            allowClear
          >
            <Option value="all">Tất cả</Option> {/* Tùy chọn "Tất cả" */}
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="font-semibold text-gray-800 mr-2">Chọn Kỳ:</label>
          <Select
            value={selectedTerm}
            onChange={(value) => setSelectedTerm(value)}
            className="w-48 border-gray-300"
            placeholder="Chọn kỳ"
          >
            <Option value="all">Tất cả</Option> {/* Tùy chọn "Tất cả" */}
            {terms.map((term) => (
              <Option key={term.id} value={term.id}>
                {term.name}
              </Option>
            ))}
          </Select>
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
                data={studentByCourseData}
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
                  onClick: handleChartClick, // Sử dụng hàm onClick mới
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
          )}

          {/* Modal hiển thị thống kê chuyên ngành */}
          <Modal
            title={`Thông tin ngành học`}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
              <Button key="back" onClick={() => setIsModalOpen(false)}>
                Đóng
              </Button>,
            ]}
          >
            <div>
              {isLoading ? (
                <Spin size="large" tip="Đang tải..." />
              ) : (
                <ul>
                  {subMajorStats.length > 0 ? (
                    subMajorStats.map((item, index) => (
                      <li key={index}>
                        {item.name}: {item.students_count} sinh viên
                      </li>
                    ))
                  ) : (
                    <p>Không có dữ liệu ngành học.</p>
                  )}
                </ul>
              )}
            </div>
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
              {courseStats.maxStudentsCourseName} {""}(
              {courseStats.maxStudentsCourse} sinh viên)
            </p>
          </div>

          <div className="bg-red-100 shadow-sm p-5 rounded-lg">
            <h4 className="text-2xl font-bold text-red-600">Khóa ít nhất</h4>
            <p className="text-gray-800">
              {courseStats.minStudentsCourseName}(
              {courseStats.minStudentsCourse} sinh viên)
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
              {totalStats.totalStudents}
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
