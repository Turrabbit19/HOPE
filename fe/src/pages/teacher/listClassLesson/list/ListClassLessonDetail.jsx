import React, { useState } from "react";

const ListClassLessonDetail = ({ scheduleData }) => {
  const { ScheduleInfor } = scheduleData;
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const isCurrentDate = (dateString) => {
    const today = new Date();
    const lessonDate = new Date(dateString.split("/").reverse().join("-"));
    return today.toDateString() === lessonDate.toDateString();
  };

  const handleAttendance = async (lessonId) => {
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

      if (!response.ok) throw new Error("Failed to fetch data from server");

      const data = await response.json();
      if (data.ListStudents) {
        setStudents(data.ListStudents);
        setSelectedLesson(prevSelectedLesson => prevSelectedLesson === lessonId ? null : lessonId);
        const initialStatus = {};
        data.ListStudents.forEach(student => {
          initialStatus[student.student_id] = student.status === "Có mặt" ? 1 : 0;
        });
        setAttendanceStatus(initialStatus);
      } else {
        setError("Không có dữ liệu sinh viên.");
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Không thể lấy danh sách sinh viên. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendanceStatus(prevStatus => ({
      ...prevStatus,
      [studentId]: prevStatus[studentId] === 1 ? 0 : 1,
    }));
  };

  const submitAttendance = async (lessonId) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    const attendanceData = {
      attendance: Object.entries(attendanceStatus).map(([student_id, status]) => ({
        student_id: parseInt(student_id),
        status,
      })),
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

      if (!response.ok) throw new Error("Failed to submit attendance");
      const result = await response.json();
      console.log("Attendance submitted successfully:", result);
    } catch (err) {
      console.error("Error submitting attendance:", err);
      setError("Không thể cập nhật điểm danh. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header Information */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {ScheduleInfor.subject_name}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Lớp:</span>{" "}
              {ScheduleInfor.classroom}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Ca học:</span>{" "}
              {ScheduleInfor.shift_name}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Phòng:</span>{" "}
              {ScheduleInfor.room_name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Liên kết:</span>{" "}
              {ScheduleInfor.link || "Chưa có"}
            </p>
          </div>
        </div>
        <p className="text-gray-600 mt-2 text-sm">
          <span className="font-medium">Thời gian:</span>{" "}
          {ScheduleInfor.start_date} - {ScheduleInfor.end_date}
        </p>
      </div>

      {/* Lessons Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Tiết</th>
              <th className="text-left py-3 px-4 font-medium">Nội dung</th>
              <th className="text-left py-3 px-4 font-medium w-32">Ngày</th>
              <th className="text-left py-3 px-4 font-medium w-32">Trạng thái</th>
              <th className="text-left py-3 px-4 font-medium w-24">Điểm danh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ScheduleInfor.schedule_lessons.map((lesson) => (
              <React.Fragment key={lesson.id}>
                <tr className={`${isCurrentDate(lesson.date) ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{lesson.name}</span>
                      {isCurrentDate(lesson.date) && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Hôm nay
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {lesson.description}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {lesson.date}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium
                      ${lesson.status === "Đã hoàn thành" 
                        ? "bg-green-100 text-green-700"
                        : lesson.status === "Đang dạy"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleAttendance(lesson.id)}
                      disabled={loading && selectedLesson === lesson.id}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full
                        ${selectedLesson === lesson.id
                          ? "bg-gray-100 text-gray-700"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                        } transition-colors duration-150
                        ${loading && selectedLesson === lesson.id ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {loading && selectedLesson === lesson.id ? "Đang tải..." : "Điểm danh"}
                    </button>
                  </td>
                </tr>

                {/* Attendance Panel */}
                {selectedLesson === lesson.id && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-gray-50">
                      {error ? (
                        <p className="text-red-500 text-sm">{error}</p>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900">Danh sách sinh viên</h3>
                          {students.length > 0 ? (
                            <>
                              <div className="grid gap-2">
                                {students.map((student) => (
                                  <div
                                    key={student.student_id}
                                    className="flex items-center justify-between p-2 bg-white rounded border"
                                  >
                                    <span className="text-sm text-gray-900">
                                      {student.student_name}
                                    </span>
                                    <button
                                      onClick={() => toggleAttendance(student.student_id)}
                                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors
                                        ${attendanceStatus[student.student_id] === 1
                                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                                          : "bg-red-100 text-red-700 hover:bg-red-200"
                                        }`}
                                    >
                                      {attendanceStatus[student.student_id] === 1 ? "Có mặt" : "Vắng mặt"}
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => submitAttendance(lesson.id)}
                                  disabled={loading}
                                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {loading ? "Đang cập nhật..." : "Lưu điểm danh"}
                                </button>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Không có sinh viên trong danh sách.
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListClassLessonDetail;

