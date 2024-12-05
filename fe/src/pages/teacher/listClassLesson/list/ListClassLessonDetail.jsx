import React, { useState } from "react";

const ListClassLessonDetail = ({ scheduleData }) => {
  const { ScheduleInfor } = scheduleData;
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [successMessage, setSuccessMessage] = useState(""); // To show success message

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

      if (!response.ok) {
        if (response.status === 400) {
          setError("Đã quá giờ điểm danh.");
        } else {
          setError("Failed to fetch data from server");
        }
        throw new Error("Failed to fetch data from server");
      }

      const data = await response.json();

      if (data.ListStudents) {
        setStudents(data.ListStudents);
        setSelectedLesson((prevSelectedLesson) =>
          prevSelectedLesson === lessonId ? null : lessonId
        );
        const initialStatus = {};
        data.ListStudents.forEach((student) => {
          initialStatus[student.student_id] =
            student.status === "Có mặt" ? 1 : 0;
        });
        setAttendanceStatus(initialStatus);
        setIsModalOpen(true); // Open the modal when students data is fetched
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
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: prevStatus[studentId] === 1 ? 0 : 1,
    }));
  };

  const submitAttendance = async (lessonId) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(""); // Reset success message

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
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
        throw new Error("Không thể tải danh sách sinh viên");
      }

      const result = await response.json();
      console.log("Attendance submitted successfully:", result);
      setSuccessMessage("Điểm danh thành công!");
    } catch (err) {
      console.error("Error submitting attendance:", err);
      setError("Không thể cập nhật điểm danh. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setStudents([]);
    setAttendanceStatus({});
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {ScheduleInfor.subject_name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <p className="text-xl text-gray-700">
            <span className="font-semibold">Lớp học:</span>{" "}
            {ScheduleInfor.classroom}
          </p>
          <p className="text-xl text-gray-700">
            <span className="font-semibold">Ca học:</span>{" "}
            {ScheduleInfor.shift_name}
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-xl text-gray-700">
            <span className="font-semibold">Phòng:</span>{" "}
            {ScheduleInfor.room_name}
          </p>
          <p className="text-xl text-gray-700">
            <span className="font-semibold">Liên kết:</span>{" "}
            <a href={ScheduleInfor.link} className="text-blue-600 hover:underline">
              {ScheduleInfor.link}
            </a>
          </p>
        </div>
      </div>
      <p className="text-xl text-gray-700 mb-8">
        <span className="font-semibold">Thời gian:</span>{" "}
        {ScheduleInfor.start_date} - {ScheduleInfor.end_date}
      </p>

      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Danh sách buổi học:
      </h3>
      <div className="space-y-6">
        {ScheduleInfor.schedule_lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              isCurrentDate(lesson.date) ? "border-l-4 border-blue-500" : ""
            }`}
          >
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-gray-800">
                {lesson.name}
                {isCurrentDate(lesson.date) && (
                  <span className="ml-2 px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    Hôm nay
                  </span>
                )}
              </h4>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  lesson.status === "Đã hoàn thành"
                    ? "bg-green-100 text-green-800"
                    : lesson.status === "Đang dạy"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {lesson.status}
              </span>
            </div>
            <p className="text-lg text-gray-600 mb-4">{lesson.description}</p>
            <p className="text-lg text-gray-600 mb-4">
              <span className="font-semibold">Ngày:</span> {lesson.date}
            </p>
            <button
              onClick={() => handleAttendance(lesson.id)}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
                loading && selectedLesson === lesson.id
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={loading && selectedLesson === lesson.id}
            >
              {loading && selectedLesson === lesson.id
                ? "Đang tải..."
                : "Điểm danh"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal to show student list */}
      {isModalOpen && (
  <div
    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    onClick={closeModal} // Đóng modal khi nhấn ra ngoài
  >
    <div
      className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative"
      onClick={(e) => e.stopPropagation()} // Ngăn không đóng khi nhấn vào bên trong modal
    >
      <button
        onClick={closeModal}
        className="absolute top-0 right-0 p-4 text-lg font-bold text-gray-500"
      >
        &times;
      </button>
      <h5 className="text-xl font-semibold mb-4 text-gray-700">
        Danh sách sinh viên:
      </h5>
      {Array.isArray(students) && students.length > 0 ? (
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student.student_id}
              className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm"
            >
              <span className="text-lg text-gray-700">
                {student.student_name}
              </span>
              <button
                onClick={() => toggleAttendance(student.student_id)}
                className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
                  attendanceStatus[student.student_id] === 1
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {attendanceStatus[student.student_id] === 1
                  ? "Có mặt"
                  : "Vắng mặt"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg text-gray-500">
          Không có sinh viên trong danh sách.
        </p>
      )}
      {students.length > 0 && (
        <button
          onClick={() => submitAttendance(selectedLesson)}
          className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out text-lg"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật điểm danh"}
        </button>
      )}
      {successMessage && (
        <p className="mt-4 text-green-500 font-semibold">{successMessage}</p>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ListClassLessonDetail;
