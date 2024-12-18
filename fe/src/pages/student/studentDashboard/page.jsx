"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// Utility Components
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <svg
        className="animate-spin h-12 w-12 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}

function ErrorMessage({ error }) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <svg
          className="w-12 h-12 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );
}

// Student Profile Component
function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudent(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={student.avatar || "/placeholder.svg?height=80&width=80"}
          alt={student.name}
          className="w-24 h-24 rounded-full border-4 border-indigo-700 shadow-sm"
        />
        <div>
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="text-indigo-300">Email: {student.email}</p>
        </div>
      </div>

      <div className="bg-indigo-800 p-5 rounded-lg shadow-inner">
        {[
          {
            icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
            label: "Kì",
            value: `${student.current_semester || "N/A"} - ${
              student.semester_name || "N/A"
            }`,
          },
          {
            icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
            label: "MSV",
            value: student.student_code,
          },
          {
            icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            label: "Ngày sinh",
            value: student.dob,
          },
          {
            icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            label: "Giới tính",
            value: student.gender,
          },
          {
            icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
            label: "Số điện thoại",
            value: student.phone,
          },
          {
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
            label: "Địa chỉ",
            value: student.address,
          },
          {
            icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            label: "Dân tộc",
            value: student.ethnicity,
          },
          {
            icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            label: "Trạng thái",
            value: student.status,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center mt-4 space-x-4 hover:bg-indigo-700 p-3 rounded-lg transition"
          >
            <svg
              className="w-6 h-6 text-indigo-300 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={item.icon}
              ></path>
            </svg>
            <div className="grid grid-cols-2 gap-x-4 flex-grow">
              <span className="text-indigo-200 font-semibold leading-none">
                {item.label}:
              </span>
              <span className="text-white break-words leading-none">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Today's Classes Component
function TodayClasses() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/student/timetable",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTimetable(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString("en-GB");
    return timetable.flatMap((subject) =>
      subject.schedule_lessons
        .filter((lesson) => lesson.date === today)
        .map((lesson) => ({
          name: subject.subject_name,
          time: subject.shift_name,
          status: lesson.status,
          room: subject.room_name,
        }))
    );
  };

  const todayClasses = getTodayClasses();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const openModal = (cls) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-400 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-bold text-white">Lớp Học Hôm Nay</h3>
        <div className="flex items-center text-indigo-200">
          <span className="mr-2 text-xl">
            {new Date().toLocaleDateString("en-GB")}
          </span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      </div>

      <ul className="space-y-6">
        {todayClasses.length > 0 ? (
          todayClasses.map((cls, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md hover:bg-indigo-50 transition transform hover:scale-105"
            >
              <div className="flex items-center space-x-6">
                <div>
                  <p className="font-semibold text-4xl text-indigo-900">
                    {cls.name}
                  </p>
                  <div className="flex items-center text-gray-600 text-2xl mt-2">
                    <svg
                      className="w-5 h-5 mr-2 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>{cls.time}</span>
                  </div>
                  <p className="text-xl text-gray-600">Room: {cls.room}</p>
                </div>
              </div>
              <div
                className="text-2xl text-blue-600 font-medium cursor-pointer hover:text-blue-800"
                onClick={() => openModal(cls)} // Mở modal khi nhấn
              >
                More Info
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-white py-6 text-2xl">
            Không có lớp học nào hôm nay
          </li>
        )}
      </ul>

      {/* Modal */}

    </div>
  );
}

// Classroom List Component
function ClassroomList() {
  const [classroomsData, setClassroomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8000/api/student/classrooms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu lớp học");
        }

        const data = await response.json();
        setClassroomsData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
      <h3 className="text-xl font-bold mb-6">Lớp Học Đang Tham Gia</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classroomsData.map((classroom) => (
          <div
            key={classroom.id}
            className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
                {classroom.subject_name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-indigo-800 text-lg">
                  {classroom.subject_name}
                </h4>
                <p className="text-sm text-gray-600">
                  Lớp: {classroom.classroom}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700">
              <p className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2l4-4"
                  ></path>
                </svg>
                Phòng: {classroom.room_name}
              </p>
              <p className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3"
                  ></path>
                </svg>
                Ca: {classroom.shift_name}
              </p>
              <p className="col-span-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12l5 5L20 7"
                  ></path>
                </svg>
                Ngày học: {classroom.days_of_week.join(", ")}
              </p>
              <p className="col-span-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3"
                  ></path>
                </svg>
                {classroom.start_date} - {classroom.end_date}
              </p>
            </div>
            <p
              className={`mt-3 text-2xl font-medium ${
                classroom.schedule_status === "Đang học"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {classroom.schedule_status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Combined Dashboard Component
export default function CombinedDashboard() {
  const [activeTab, setActiveTab] = useState("Thông tin");

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
        Quản lý Thông tin
      </h1>
      <p className="text-gray-500 text-lg mb-6">
        Xem thông tin cá nhân, lịch học hôm nay và danh sách lớp học.
      </p>

      <nav className="flex border-b border-gray-300 mb-6">
        {["Thông tin", "Hôm nay", "Các lớp hiện tại"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-6 flex items-center gap-2 rounded-t-lg text-center transition-all ${
              activeTab === tab
                ? "bg-indigo-50 border-b-4 border-indigo-500 font-medium text-indigo-600"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {/* Thêm icon cho các tab */}
            {tab === "Thông tin" && <i className="fas fa-user"></i>}
            {tab === "Hôm nay" && <i className="fas fa-calendar-day"></i>}
            {tab === "Các lớp hiện tại" && (
              <i className="fas fa-chalkboard-teacher"></i>
            )}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
        {activeTab === "Thông tin" && (
          <div className="fade-in">
            <StudentProfile />
          </div>
        )}
        {activeTab === "Hôm nay" && (
          <div className="fade-in">
            <TodayClasses />
          </div>
        )}
        {activeTab === "Các lớp hiện tại" && (
          <div className="fade-in">
            <ClassroomList />
          </div>
        )}
      </div>
    </div>
  );
}
