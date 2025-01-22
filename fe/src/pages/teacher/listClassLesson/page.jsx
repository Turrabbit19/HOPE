import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import ListClassLessonPopup from "./list/ListClassLessonPopup";

export default function ScheduleTable() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isStudentPopupOpen, setIsStudentPopupOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "http://127.0.0.1:8000/api/teacher/schedules",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Không thể lấy dữ liệu lịch học");
        const result = await response.json();

        let schedulesData;
        if (Array.isArray(result)) {
          schedulesData = result;
        } else if (result && typeof result === "object") {
          if (Array.isArray(result.data)) {
            schedulesData = result.data;
          } else if (typeof result.data === "object") {
            schedulesData = Object.values(result.data);
          } else {
            throw new Error("Cấu trúc dữ liệu không hợp lệ");
          }
        } else {
          throw new Error("Dữ liệu không đúng định dạng");
        }

        if (!Array.isArray(schedulesData) || schedulesData.length === 0) {
          throw new Error("Không có dữ liệu lịch học");
        }

        setSchedules(schedulesData);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token]);

  const handleDetailClick = (schedule) => {
    setSelectedSchedule(schedule);
    setIsPopupOpen(true);
  };

  const handleStudentStatsClick = async (scheduleId) => {
    setStudentLoading(true);
    setStudentError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/teacher/schedule/${scheduleId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Không thể lấy dữ liệu sinh viên");
      const result = await response.json();
      console.log("Student data response:", JSON.stringify(result, null, 2));

      if (result && result.ListStudents && Array.isArray(result.ListStudents)) {
        setStudentData(result.ListStudents);
        setIsStudentPopupOpen(true);
      } else {
        throw new Error("Cấu trúc dữ liệu sinh viên không hợp lệ");
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setStudentError(err.message);
    } finally {
      setStudentLoading(false);
    }
  };

  const getDayOfWeek = (day) => {
    const days = {
      Monday: "Thứ 2",
      Tuesday: "Thứ 3",
      Wednesday: "Thứ 4",
      Thursday: "Thứ 5",
      Friday: "Thứ 6",
      Saturday: "Thứ 7",
      Sunday: "Chủ nhật",
    };
    return days[day] || day;
  };

  const StudentStatsPopup = ({ data, onClose }) => {
    console.log("StudentStatsPopup data:", JSON.stringify(data, null, 2));

    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-xl py-8 max-w-4xl  max-h-[90vh] overflow-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Thống kê điểm danh sinh viên
            </h2>
            <p className="text-center text-red-600 text-xl">
              {!data
                ? "Không thể tải danh sách sinh viên. Vui lòng thử lại sau."
                : "Lớp học này không có sinh viên."}
            </p>
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentDate = new Date();

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 md:p-10 max-w-8xl w-full mx-5  max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
            📊 Thống kê điểm danh sinh viên
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300 text-center text-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="border border-gray-400 px-6 py-4">STT</th>
                  <th className="border border-gray-400 px-6 py-4">Họ tên</th>
                  <th className="border border-gray-400 px-6 py-4">Mã SV</th>
                  <th className="border border-gray-400 px-6 py-4">
                    Tổng số buổi
                  </th>
                  <th className="border border-gray-400 px-6 py-4">
                    Số buổi có mặt
                  </th>
                  <th className="border border-gray-400 px-6 py-4">
                    Số buổi vắng
                  </th>
                  <th className="border border-gray-400 px-6 py-4">
                    Tỷ lệ điểm danh
                  </th>
                  {data[0].absent_details.map((_, index) => (
                    <th
                      key={index}
                      className="border border-gray-400 px-4 py-4"
                    >
                      Tiết {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((student, index) => {
                  const attendanceRate =
                    student.total_lessons > 0
                      ? (
                          (student.attended_lessons / student.total_lessons) *
                          100
                        ).toFixed(2)
                      : "0.00";

                  return (
                    <tr
                      key={student.student_id}
                      className="odd:bg-white even:bg-gray-100 hover:bg-gray-200"
                    >
                      <td className="border-b border-gray-300 px-6 py-3">
                        {index + 1}
                      </td>
                      <td className="border-b border-gray-300 px-6 py-3">
                        {student.student_name}
                      </td>
                      <td className="border-b border-gray-300 px-6 py-3">
                        {student.student_code}
                      </td>
                      <td className="border-b border-gray-300 px-6 py-3">
                        {student.total_lessons}
                      </td>
                      <td className="border-b border-gray-300 px-6 py-3">
                        {student.attended_lessons}
                      </td>
                      <td className="border-b border-gray-300 px-6 py-3">
                        {student.absent_lessons}
                      </td>
                      <td className="border-b border-gray-300 px-6 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-lg font-semibold">
                            {attendanceRate}%
                          </span>
                          <div className="w-40 h-4 bg-gray-300 rounded-full overflow-hidden">
                            <div
                              className={`h-4 ${
                                attendanceRate >= 75
                                  ? "bg-green-500"
                                  : attendanceRate >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${attendanceRate}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      {student.absent_details.map((lesson, lessonIndex) => {
                        const lessonDate = lesson
                          ? new Date(
                              lesson.study_date.split("/").reverse().join("-")
                            )
                          : null; // Parse "DD/MM/YYYY"
                        const hasOccurred =
                          lessonDate && lessonDate <= currentDate; // Check if the lesson date has passed
                        const status = lesson ? lesson.status : "Chưa rõ"; // Default to "Chưa rõ" if status is missing

                        return (
                          <td
                            key={lessonIndex}
                            className="border-b border-gray-300 px-4 py-3"
                          >
                            <span
                              className={`text-2xl ${
                                status === "Chưa rõ"
                                  ? "text-gray-400" // Pending lesson
                                  : status === "Vắng"
                                  ? "text-red-600" // Absent
                                  : status === "Có mặt"
                                  ? "text-green-600" // Present
                                  : ""
                              }`}
                              title={`Tiết ${lessonIndex + 1}: ${
                                lesson ? lesson.study_date : "N/A"
                              }`}
                            >
                              {status === "Chưa rõ"
                                ? "-"
                                : status === "Vắng"
                                ? "✖"
                                : status === "Có mặt"
                                ? "✔"
                                : ""}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-6 text-red-600 text-2xl">Lỗi: {error}</div>
    );
  if (!schedules.length)
    return (
      <div className="text-center py-6 text-gray-600 text-2xl">
        Không có dữ liệu lịch học
      </div>
    );

  return (
    <div className="p-8">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-300 via-teal-300 to-blue-300 p-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            📅 Danh sách lớp học
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 ">
              <tr>
                <th className="text-2xl px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                  Lớp học
                </th>
                <th className="text-2xl px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="text-2xl px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                  Phòng
                </th>
                <th className="text-2xl px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="text-2xl px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                  Các buổi
                </th>
                <th className="text-2xl px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-2xl px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                  Điểm danh{" "}
                </th>
                <th className="text-2xl px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
                  Thống kê
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              {schedules.map((schedule, index) => (
                <tr
                  key={schedule.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border-b border-gray-300 px-6 py-4">
                    <div className="text-2xl font-bold text-gray-800">
                      {schedule.classroom || "N/A"}
                    </div>
                    <div className="text-xl text-gray-500">
                      {schedule.course_name || "N/A"}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-6 py-4">
                    <div className="text-2xl font-bold text-gray-800">
                      {schedule.subject_name || "N/A"}
                    </div>
                    <div className="text-xl text-gray-500">
                      {schedule.major_name || "N/A"}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-6 py-4">
                    <div className="text-2xl font-bold text-gray-800">
                      {schedule.room_name || "N/A"}
                    </div>
                    <div className="text-xl text-gray-500">
                      {schedule.shift_name || "N/A"}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-6 py-4">
                    <div className="text-xl text-gray-500">
                      {schedule.start_date || "N/A"} -{" "}
                      {schedule.end_date || "N/A"}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-6 py-4">
                    <div className="flex flex-wrap gap-3">
                      {Array.isArray(schedule.days_of_week) &&
                      schedule.days_of_week.length > 0 ? (
                        schedule.days_of_week.map((day, dayIndex) => {
                          if (typeof day === "object") {
                            const [dayName, shift] =
                              Object.entries(day)[0] || [];
                            return dayName ? (
                              <span
                                key={dayIndex}
                                className="inline-flex items-center px-4 py-2 text-lg font-medium bg-green-200 text-green-800 rounded-full"
                              >
                                {getDayOfWeek(dayName)} ({shift})
                              </span>
                            ) : null;
                          }
                          return null;
                        })
                      ) : (
                        <span className="text-xl text-gray-500">
                          Không có dữ liệu
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-6 py-4">
                    <div
                      className={`text-2xl font-bold ${
                        schedule.schedule_status === "Active"
                          ? "text-green-600"
                          : schedule.schedule_status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {schedule.schedule_status || "N/A"}
                    </div>
                  </td>
                  <td className="border-b  border-gray-300 ">
                    {schedule.schedule_status != "Đang chờ xếp lớp" ? (
                      <button
                        onClick={() => handleDetailClick(schedule)}
                        className="inline-flex items-center px-6 py-3 bg-teal-500 text-white text-lg font-semibold rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        Điểm danh{" "}
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="border-b border-gray-300 ">
                    {schedule.schedule_status != "Đang chờ xếp lớp" ? (
                      <button
                        onClick={() => handleStudentStatsClick(schedule.id)}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Thống kê
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isPopupOpen && (
        <ListClassLessonPopup
          schedule={selectedSchedule}
          onClose={() => setIsPopupOpen(false)}
          token={token}
        />
      )}
      {isStudentPopupOpen && (
        <StudentStatsPopup
          data={studentData}
          onClose={() => setIsStudentPopupOpen(false)}
        />
      )}
      {studentLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-xl text-gray-700">
              Đang tải dữ liệu sinh viên...
            </p>
          </div>
        </div>
      )}
      {studentError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-red-600 text-2xl mb-4">{studentError}</p>
            <button
              onClick={() => setStudentError(null)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
