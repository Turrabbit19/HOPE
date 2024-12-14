import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, Phone, Mail, MapPin, User, Briefcase, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Code, AlignEndHorizontal } from 'lucide-react';

export default function Component() {
  const [student, setStudent] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [studentResponse, timetableResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/student", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/student/timetable", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setStudent(studentResponse.data.data);
        setTimetable(timetableResponse.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchData();
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="font-semibold text-gray-700">
            Loading student information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-bold text-center text-gray-800 mb-4">
            Error Loading Data
          </h2>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 w-full">
      {/* Left Column */}
      <div className="w-full lg:w-1/2 space-y-8">
        {/* User Profile Card */}
        <div className="bg-indigo-900 text-white p-6 rounded-lg">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={student.avatar || "/placeholder.svg?height=80&width=80"}
              alt={student.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="font-bold">{student.name}</h2>
              <p className="text-indigo-300">Email: {student.email}</p>
            </div>
          </div>
          <div className="mt-4 bg-indigo-800 p-4 rounded-lg">
            {[
              { icon: AlignEndHorizontal, label: "Kì", value: student.current_semester },
              { icon: Code, label: "MSV", value: student.student_code },
              { icon: Calendar, label: "Ngày sinh", value: student.dob },
              { icon: User, label: "Giới tính", value: student.gender },
              { icon: Phone, label: "Số điện thoại", value: student.phone },
              { icon: MapPin, label: "Địa chỉ", value: student.address },
              { icon: User, label: "Dân tộc", value: student.ethnicity },
              { icon: Briefcase, label: "Trạng thái", value: student.status },
            ].map((item, index) => (
              <div key={index} className="flex items-start mt-2 space-x-3">
                <item.icon className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-1" />
                <div className="flex-grow grid grid-cols-2 gap-x-2">
                  <span className="text-indigo-200 font-medium">
                    {item.label}:
                  </span>
                  <span className="text-white break-all">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Classes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Lớp Học Hôm Nay</h3>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">
                {new Date().toLocaleDateString("en-GB")}
              </span>
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <ul className="space-y-4">
            {todayClasses.length > 0 ? (
              todayClasses.map((cls, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt={cls.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{cls.name}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {cls.time}
                      </p>
                      <p className="text-sm text-gray-500">Room: {cls.room}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500">No classes today</li>
            )}
          </ul>
        </div>
      </div>

      {/* Middle Column */}
      <div className="w-full lg:w-1/2 space-y-6">
        {/* Score Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Điểm Danh</h3>
            <select className="border rounded px-2 py-1">
              <option>Tuần này</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            No of total working days 28 Days
          </p>
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">25</p>
              <p className="text-sm text-gray-500">Present</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-gray-500">Absent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Halfday</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-gray-500">Late</p>
            </div>
          </div>
          {/* Attendance Chart */}
          <div className="w-48 h-48 mx-auto relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#22c55e"
                strokeWidth="10"
                strokeDasharray="220 283"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#ef4444"
                strokeWidth="10"
                strokeDasharray="20 283"
                strokeDashoffset="-220"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="10"
                strokeDasharray="10 283"
                strokeDashoffset="-240"
              />
              <circle cx="50" cy="50" r="38" fill="white" />
            </svg>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-sm">Half Day</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm">Late</span>
            </div>
          </div>
        </div>

        {/* Last 7 Days */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Last 7 Days</h3>
          <p className="text-sm text-gray-500 mb-4">
            14 May 2024 - 21 May 2024
          </p>
          <div className="flex justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div
                key={index}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-medium ${
                  index === 4
                    ? "bg-red-500"
                    : index < 4
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/3 space-y-6">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Lịch</h3>
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h4 className="text-lg font-medium">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h4>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {DAYS.map((day) => (
                <div key={day} className="text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="text-sm p-2"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                );
                const isToday =
                  date.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={day}
                    className={`text-sm p-2 rounded-full ${
                      isToday ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

