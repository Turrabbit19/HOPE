"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  Briefcase,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tokenDebugInfo, setTokenDebugInfo] = useState('');
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // October 2024

  const checkAndRetrieveToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTokenDebugInfo("No token found in localStorage");
      return null;
    }
    setTokenDebugInfo(`Token found: ${token.substring(0, 10)}...`);
    return token;
  };

  const fetchStudentInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const token = checkAndRetrieveToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://127.0.0.1:8000/api/student', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch student information: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      setStudentInfo(data);
    } catch (err) {
      console.error('Error fetching student info:', err);
      setError(err.message || 'Failed to load student information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRetry = () => {
    fetchStudentInfo();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading student information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Error Loading Data</h2>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2">Token Debug Info:</h3>
            <p className="text-sm">{tokenDebugInfo}</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
            >
              Retry
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 min-h-screen w-full">
      {/* Left Column */}
      <div className="w-full lg:w-1/4 space-y-6">
        {/* User Profile Card */}
        <div className="bg-indigo-900 text-white p-6 rounded-lg">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={studentInfo.avatar || "/placeholder.svg?height=80&width=80"}
              alt={studentInfo.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">
                {studentInfo.name}
              </h2>
              <p className="text-indigo-300">MSV: {studentInfo.student_id}</p>
            </div>
          </div>
          <button
            className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 px-4 rounded flex justify-between items-center"
            onClick={() => setShowPersonalInfo(!showPersonalInfo)}
          >
            <span>Thông tin cá nhân</span>
            {showPersonalInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showPersonalInfo && (
            <div className="mt-4 bg-indigo-800 p-4 rounded-lg">
              {[
                { icon: Calendar, label: "Ngày sinh", value: studentInfo.date_of_birth },
                { icon: User, label: "Giới tính", value: studentInfo.gender },
                { icon: Mail, label: "Email", value: studentInfo.email },
                { icon: Phone, label: "Số điện thoại", value: studentInfo.phone },
                { icon: MapPin, label: "Địa chỉ", value: studentInfo.address },
                { icon: User, label: "Dân tộc", value: studentInfo.ethnicity },
                { icon: Briefcase, label: "Trạng thái", value: studentInfo.status },
              ].map((item, index) => (
                <div key={index} className="flex items-start mt-2 space-x-3">
                  <item.icon className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-1" />
                  <div className="flex-grow grid grid-cols-2 gap-x-2">
                    <span className="text-indigo-200 font-medium">{item.label}:</span>
                    <span className="text-white break-all">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Classes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Lớp Học Hôm Nay</h3>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">16 May 2024</span>
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <ul className="space-y-4">
            {[
              { name: "PHP3", time: "09:00 - 09:45 AM", status: "Hoàn Thành" },
              { name: "PTCN2", time: "10:45 - 11:30 AM", status: "Hoàn Thành" },
              { name: "JS Nâng Cao", time: "11:30 - 12:15 AM", status: "Sắp Tới" },
            ].map((cls, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex items-center space-x-3">
                  <img src="/placeholder.svg?height=40&width=40" alt={cls.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {cls.time}
                    </p>
                  </div>
                </div>
                <span className={`text-sm ${cls.status === "Hoàn Thành" ? "text-green-500" : "text-yellow-500"}`}>
                  {cls.status}
                </span>
              </li>
            ))}
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
            {["M", "T", "W", "T",
              "F", "S", "S"].map(
                (day, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-medium ${index === 4
                      ? "bg-red-500"
                      : index < 4
                        ? "bg-green-500"
                        : "bg-gray-300"
                      }`}
                  >
                    {day}
                  </div>
                )
              )}
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
                <Calendar className="w-5 h-5" />
              </button>
              <h4 className="text-lg font-medium">
                {MONTHS[currentDate.getMonth()]}{" "}
                {currentDate.getFullYear()}
              </h4>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map(
                (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="text-sm p-2"
                  ></div>
                )
              )}
              {Array.from({ length: daysInMonth }).map(
                (_, index) => {
                  const day = index + 1;
                  const isToday = day === 10; // Assuming 10th is the current day as shown in the image
                  return (
                    <div
                      key={day}
                      className={`text-sm p-2 rounded-full ${isToday
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200"
                        }`}
                    >
                      {day}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Bài tập</h3>
          <ul className="space-y-4">
            {[
              {
                name: "1st Quarterly",
                subject: "Mathematics",
                date: "06 May 2024",
                time: "01:30 - 02:15 PM",
                room: "15",
                daysLeft: 19,
              },
              { name: "2nd Quarterly", daysLeft: 20 },
            ].map((assignment, index) => (
              <li
                key={index}
                className="border-b pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {assignment.name}
                    </p>
                    {assignment.subject && (
                      <p className="text-sm text-gray-500">
                        {assignment.subject}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-red-500 font-medium">
                    {assignment.daysLeft} Days More
                  </span>
                </div>
                {assignment.date && (
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {assignment.date}
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    {assignment.time}
                    <span className="mx-2">•</span>
                    Room No : {assignment.room}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}