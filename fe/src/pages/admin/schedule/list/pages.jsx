import React, { useEffect, useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../../config/axios"; // Giả sử instance là axios của bạn
import moment from "moment";

const ScheduleList = () => {
  const [expandedCourse, setExpandedCourse] = useState(null); // Khóa học đang được mở
  const [expandedSemester, setExpandedSemester] = useState(null); // Kỳ học đang được mở
  const [courses, setCourses] = useState([]); // Các khóa học
  const [semestersByCourse, setSemestersByCourse] = useState({}); // Lưu các kỳ học theo khóa học
  const [loading, setLoading] = useState(false); // Trạng thái đang tải dữ liệu
  const [error, setError] = useState(null); // Thông báo lỗi
  const navigate = useNavigate();

  // Lấy danh sách khóa học từ API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get("admin/courses");
        setCourses(response.data.data); // Lưu khóa học
      } catch (err) {
        setError("Không thể lấy dữ liệu khóa học.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []); // Chạy lần đầu khi component mount

  const fetchSemestersForCourse = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(`admin/course/${courseId}/semesters`);
      setSemestersByCourse((prev) => ({
        ...prev,
        [courseId]: response.data.semesters, // Lưu các kỳ học của khóa học này
      }));
    } catch (err) {
      setError("Không thể lấy dữ liệu kỳ học cho khóa học này.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    setExpandedSemester(null); // Reset kỳ học khi mở khóa học
    if (expandedCourse !== courseId) {
      fetchSemestersForCourse(courseId); // Gọi API để lấy kỳ học khi mở khóa học
    }
  };

  const toggleSemester = (semesterId) => {
    setExpandedSemester(expandedSemester === semesterId ? null : semesterId);
  };

  return (
    <div className="mx-auto p-10 bg-blue-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-10">
        Quản lý lịch học
      </h2>

      {loading && <p>Đang tải dữ liệu...</p>}

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-8">
        {courses.length > 0 ? (
          courses.map((course) => {
            // Xử lý trạng thái của khóa học

            let statusColor = "";
            switch (course.status) {
              case "Đang diễn ra":
                statusColor = "text-green-600";
                break;
              case "Chờ diễn ra":
                statusColor = "text-yellow-600";
                break;
              case "Kết thúc":
                statusColor = "text-red-600";
                break;
              default:
                statusColor = "text-gray-600";
            }

            return (
              <div
                key={course.id}
                className="p-8 bg-white rounded-lg shadow-lg space-y-6"
              >
                <div
                  onClick={() => toggleCourse(course.id)}
                  className="cursor-pointer space-y-2"
                >
                  <h3 className="text-4xl mb-3 font-bold text-blue-600 flex items-center justify-between">
                    {course.name}
                    {expandedCourse === course.id ? (
                      <DownOutlined className="ml-2 text-2xl" />
                    ) : (
                      <RightOutlined className="ml-2 text-2xl" />
                    )}
                  </h3>
                  {/* Hiển thị trạng thái khóa học */}

                  <div className="text-xl text-gray-700">
                    <p className="mb-2">
                      <span className="font-semibold">Ngày bắt đầu:</span>{" "}
                      {moment(course.start_date).format("DD/MM/YYYY")}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">Ngày kết thúc:</span>{" "}
                      {moment(course.end_date).format("DD/MM/YYYY")}
                    </p>
                    <p className={`text-xl text-gray-700`}>
                        Trạng thái: {  }
                        <span className={`text-xl ${statusColor}`}>
                          {course.status}
                        </span>
                    </p>
                  </div>
                </div>

                {expandedCourse === course.id && (
                  <div className="mt-6 space-y-6">
                    {semestersByCourse[course.id] ? (
                      semestersByCourse[course.id].map((semester) => (
                        <div
                          key={semester.id}
                          className="bg-gray-50 rounded-lg p-6"
                        >
                          <div
                            onClick={() => toggleSemester(semester.id)}
                            className="cursor-pointer"
                          >
                            <h4 className="text-3xl font-semibold text-blue-500">
                              {semester.name}
                            </h4>
                          </div>
                          {expandedSemester === semester.id && (
                            <div className="mt-4 space-y-4">
                              <p>Thông tin chi tiết kỳ học: {semester.name}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Chưa có kỳ học cho khóa học này.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>Chưa có khóa học nào.</p>
        )}
      </div>
    </div>
  );
};

export default ScheduleList;
