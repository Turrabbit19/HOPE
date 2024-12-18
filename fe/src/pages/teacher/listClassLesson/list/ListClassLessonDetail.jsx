import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, BookOpen, Users, Clock, AlertCircle, LinkIcon, CheckCircle } from 'lucide-react';
import moment from "moment";

const ListClassLessonDetail = ({ scheduleData }) => {
  const { ScheduleInfor } = scheduleData;
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isAttendanceSubmitted, setIsAttendanceSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const isCurrentDate = (dateString) => {
    const today = new Date();
    const lessonDate = new Date(dateString.split("/").reverse().join("-"));
    return today.toDateString() === lessonDate.toDateString();
  };

  const checkLessonStatus = (lessonDate, lessonTime, lessonStatus) => {
    if (lessonStatus === "Đã hoàn thành") return "Xem điểm danh";

    const now = moment();
    const lessonStart = moment(
      `${lessonDate} ${lessonTime}`,
      "DD/MM/YYYY HH:mm"
    );
    const lessonEnd = lessonStart.clone().add(15, "minutes");

    if (lessonStatus === "Đang dạy") {
      if (now.isAfter(lessonStart) && now.isBefore(lessonEnd)) {
        return "Điểm danh";
      }
    }

    if (now.isBefore(lessonStart)) return "Chưa đến giờ";
    if (now.isAfter(lessonEnd)) return "Quá giờ";

    return "";
  };

  const handleAttendance = async (
    lessonId,
    lessonDate,
    lessonTime,
    lessonStatus
  ) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/teacher/schedule/${ScheduleInfor.id}/${lessonId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from server");
      }

      const data = await response.json();

      if (data.ListStudents && Array.isArray(data.ListStudents)) {
        setStudents(data.ListStudents);
        setSelectedLesson(lessonId);
        const initialStatus = {};
        data.ListStudents.forEach((student) => {
          initialStatus[student.student_id] =
            student.status === "Có mặt" ? 1 : 0;
        });
        setAttendanceStatus(initialStatus);
        setIsAttendanceSubmitted(lessonStatus === "Đã hoàn thành");
        setCurrentPage(1);
      } else {
        setStudents([]);
        setError("Lớp học này hiện chưa có sinh viên nào.");
      }
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Không thể lấy danh sách sinh viên. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId) => {
    const lesson = ScheduleInfor.schedule_lessons.find(
      (lesson) => lesson.id === selectedLesson
    );
    if (lesson?.status === "Đã hoàn thành") {
      return; // Do nothing if the lesson is completed
    }
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: prevStatus[studentId] === 1 ? 0 : 1,
    }));
  };

  const submitAttendance = async (lessonId) => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    // Kiểm tra trạng thái tiết học
    const lesson = ScheduleInfor.schedule_lessons.find(
      (lesson) => lesson.id === lessonId
    );

    if (lesson?.status === "Đã hoàn thành" || lesson?.status === "Xem điểm danh") {
      setError("Không thể cập nhật điểm danh cho tiết học này.");
      setLoading(false);
      return;
    }

    const attendanceData = {
      attendance: Object.entries(attendanceStatus).map(
        ([student_id, status]) => ({
          student_id: parseInt(student_id),
          status,
        })
      ),
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/teacher/attendance/${ScheduleInfor.id}/${lessonId}/mark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(attendanceData),
        }
      );

      if (response.status === 400) {
        throw new Error("Chỉ có thể điểm danh trong 15 phút đầu buổi học.");
      }

      if (!response.ok) {
        throw new Error("Không thể tải danh sách sinh viên.");
      }

      const result = await response.json();
      console.log("Attendance submitted successfully:", result);
      setSuccessMessage("Điểm danh thành công!");
      setIsAttendanceSubmitted(true);
    } catch (err) {
      console.error("Error submitting attendance:", err);
      setError("Không thể cập nhật điểm danh. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setStudents([]);
    setAttendanceStatus({});
    setSuccessMessage("");
    setIsAttendanceSubmitted(false);
    setCurrentPage(1);
    setError(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              {ScheduleInfor.subject_name}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <p className="text-xl text-gray-700 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-500" />
                <span className="font-semibold">Lớp học:</span>{" "}
                <span className="ml-2">{ScheduleInfor.classroom}</span>
              </p>
              <p className="text-xl text-gray-700 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-500" />
                <span className="font-semibold">Ca học:</span>{" "}
                <span className="ml-2">{ScheduleInfor.shift_name}</span>
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-xl text-gray-700 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
                <span className="font-semibold">Phòng:</span>{" "}
                <span className="ml-2">{ScheduleInfor.room_name}</span>
              </p>
              <p className="text-xl text-gray-700 flex items-center">
                <LinkIcon className="w-6 h-6 mr-2 text-blue-500" />
                <span className="font-semibold">Liên kết:</span>{" "}
                <a
                  href={ScheduleInfor.link}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {ScheduleInfor.link}
                </a>
              </p>
            </div>
          </div>
          <p className="text-xl text-gray-700 mb-8 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-500" />
            <span className="font-semibold">Thời gian:</span>{" "}
            <span className="ml-2">
              {ScheduleInfor.start_date} - {ScheduleInfor.end_date}
            </span>
          </p>

          <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
            Danh sách buổi học
          </h3>
          <div className="space-y-6">
            {ScheduleInfor.schedule_lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg ${isCurrentDate(lesson.date) ? "border-l-4 border-blue-500" : ""
                  }`}
              >
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    {lesson.name}
                    {isCurrentDate(lesson.date) && (
                      <span className="ml-2 px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        Hôm nay
                      </span>
                    )}
                  </h4>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${lesson.status === "Đã hoàn thành"
                      ? "bg-green-100 text-green-800"
                      : lesson.status === "Đang dạy"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {lesson.status}
                  </span>
                </div>
                <p className="text-lg text-gray-600 mb-4">
                  {lesson.description}
                </p>
                <p className="text-lg text-gray-600 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-semibold">Ngày:</span>{" "}
                  <span className="ml-2">{lesson.date}</span>
                </p>
                <button
                  onClick={() => handleAttendance(lesson.id)}
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out ${checkLessonStatus(
                    lesson.date,
                    ScheduleInfor.shift_start_time,
                    lesson.status
                  ) === "Chưa đến giờ" ||
                    checkLessonStatus(
                      lesson.date,
                      ScheduleInfor.shift_start_time,
                      lesson.status
                    ) === "Quá giờ"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                  disabled={
                    checkLessonStatus(
                      lesson.date,
                      ScheduleInfor.shift_start_time,
                      lesson.status
                    ) === "Chưa đến giờ" ||
                    checkLessonStatus(
                      lesson.date,
                      ScheduleInfor.shift_start_time,
                      lesson.status
                    ) === "Quá giờ"
                  }
                >
                  {loading && selectedLesson === lesson.id
                    ? "Đang tải..."
                    : checkLessonStatus(
                      lesson.date,
                      ScheduleInfor.shift_start_time,
                      lesson.status
                    )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-lg p-8 max-w-6xl w-full shadow-2xl transform transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <h5 className="text-2xl font-bold text-gray-800">
                Danh sách sinh viên
              </h5>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Đang tải dữ liệu
                </h3>
                <p className="text-gray-500">Vui lòng đợi trong giây lát...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có sinh viên
                </h3>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : students.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-6 text-left text-xl font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Mã SV
                        </th>
                        <th className="py-3 px-6 text-left text-xl font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Ảnh
                        </th>
                        <th className="py-3 px-6 text-left text-xl font-medium text-gray-500 uppercase tracking-wider w-2/6">
                          Tên
                        </th>
                        <th className="py-3 px-6 text-left text-xl font-medium text-gray-500 uppercase tracking-wider w-2/6">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students
                        .slice(
                          (currentPage - 1) * studentsPerPage,
                          currentPage * studentsPerPage
                        )
                        .map((student) => (
                          <tr
                            key={student.student_id}
                            className="hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            <td className="py-4 px-6 whitespace-nowrap  text-gray-900 text-xl">
                              {student.student_code || "N/A"}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              {student.student_avatar ? (
                                <img
                                  src={student.student_avatar}
                                  alt={student.student_name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-500 font-semibold text-lg">
                                    {student.student_name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap  text-gray-900">
                              {student.student_name}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              {isAttendanceSubmitted || ScheduleInfor.schedule_lessons.find(lesson => lesson.id === selectedLesson)?.status === "Đã hoàn thành" ? (
                                <span
                                  className={`px-4 py-2 inline-flex  leading-5 font-semibold rounded-full ${attendanceStatus[student.student_id] === 1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}
                                >
                                  {attendanceStatus[student.student_id] === 1
                                    ? "Có mặt"
                                    : "Vắng mặt"}
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    toggleAttendance(student.student_id)
                                  }
                                  className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full transition-colors duration-200 ${attendanceStatus[student.student_id] === 1
                                    ? "bg-green-100 hover:bg-green-200 text-green-800"
                                    : "bg-red-100 hover:bg-red-200 text-red-800"
                                    }`}
                                >
                                  {attendanceStatus[student.student_id] === 1
                                    ? "Có mặt"
                                    : "Vắng mặt"}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex items-center justify-between bg-gray-50 px-4 py-3 sm:px-6 rounded-b-lg">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="w-5 h-5 mr-2" />
                      Trước
                    </button>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-300 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-500 animate-bounce"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 12a4 4 0 100-8 4 4 0 000 8z" />
                        <path
                          fillRule="evenodd"
                          d="M2 9a7 7 0 1114 0 7 7 0 01-14 0zm7-4a4 4 0 100 8 4 4 0 000-8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-800">
                        Hiển thị{" "}
                        <span className="font-bold text-blue-700 text-xl">
                          {(currentPage - 1) * studentsPerPage + 1}
                        </span>{" "}
                        đến{" "}
                        <span className="font-bold text-blue-700 text-xl">
                          {Math.min(currentPage * studentsPerPage, students.length)}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-bold text-blue-700 text-xl">
                          {students.length}
                        </span>{" "}
                        sinh viên
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(students.length / studentsPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(students.length / studentsPerPage)
                      }
                      className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tiếp
                      <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có sinh viên
                </h3>
                <p className="text-gray-500">
                  Lớp học này hiện chưa có sinh viên nào được thêm vào.
                </p>
              </div>
            )}
            {!isAttendanceSubmitted &&
              selectedLesson &&
              ScheduleInfor.schedule_lessons.find((lesson) => lesson.id === selectedLesson)?.status !== "Đã hoàn thành" && (
                <button
                  onClick={() => submitAttendance(selectedLesson)}
                  className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out text-lg w-full"
                  disabled={loading}
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật điểm danh"}
                </button>
              )}

            {successMessage && (
              <p className="mt-4 text-green-500 font-semibold text-center">
                {successMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListClassLessonDetail;

