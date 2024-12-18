"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  addWeeks,
  subWeeks,
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  isBefore,
  isAfter,
  eachWeekOfInterval,
  getWeek,
} from "date-fns";
import { vi } from "date-fns/locale";

export default function DashboardActions() {
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semesterStartDate, setSemesterStartDate] = useState(null);
  const [semesterEndDate, setSemesterEndDate] = useState(null);
  const [notification, setNotification] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ Nhật",
  ];
  const shifts = ["Ca 1", "Ca 2", "Ca 3", "Ca 4", "Ca 5", "Ca 6"];

  useEffect(() => {
    setSelectedDay(getCurrentDay());
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      fetchSchedules();
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (semesterStartDate && semesterEndDate) {
      const weeksList = eachWeekOfInterval(
        { start: semesterStartDate, end: semesterEndDate },
        { weekStartsOn: 1 }
      );
      setWeeks(weeksList);
      setSelectedWeek(weeksList[0]);
      setCurrentWeek(weeksList[0]);
    }
  }, [semesterStartDate, semesterEndDate]);

  const fetchSemesters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(
        "http://localhost:8000/api/student/semesters",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách kỳ học");
      }

      const data = await response.json();
      setSemesters(data.data || []);
      if (data.data && data.data.length > 0) {
        const currentSemester = data.data.find(sem => {
          const startDate = new Date(sem.start_date.split('/').reverse().join('-'));
          const endDate = new Date(sem.end_date.split('/').reverse().join('-'));
          const today = new Date();
          return isBefore(today, endDate) && isAfter(today, startDate);
        });
        
        if (currentSemester) {
          setSelectedSemester(currentSemester.id.toString());
          setSemesterStartDate(new Date(currentSemester.start_date.split('/').reverse().join('-')));
          setSemesterEndDate(new Date(currentSemester.end_date.split('/').reverse().join('-')));
          setCurrentWeek(new Date());
        } else {
          setSelectedSemester(data.data[0].id.toString());
          setSemesterStartDate(new Date(data.data[0].start_date.split('/').reverse().join('-')));
          setSemesterEndDate(new Date(data.data[0].end_date.split('/').reverse().join('-')));
          setCurrentWeek(new Date(data.data[0].start_date.split('/').reverse().join('-')));
        }
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải danh sách kỳ học");
    }
  };

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      if (!selectedSemester) {
        setSchedules([]);
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/student/${selectedSemester}/timetable`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Token không hợp lệ hoặc đã hết hạn");
        }
        throw new Error("Không thể tải lịch học");
      }

      const data = await response.json();
      console.log("Dữ liệu trả về từ API:", data);
      if (data.data && Array.isArray(data.data)) {
        setSchedules(data.data);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      if (err.message.includes('Attempt to read property "user" on null')) {
        setError("Lỗi xác thực người dùng. Vui lòng đăng nhập lại.");
      } else {
        setError(err.message || "Đã xảy ra lỗi khi tải lịch học");
      }
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    return daysOfWeek[today === 0 ? 6 : today - 1];
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleNextWeek = () => {
    setSelectedWeek((prevWeek) => {
      const nextWeekIndex = weeks.findIndex(week => week === prevWeek) + 1;
      if (nextWeekIndex < weeks.length) {
        return weeks[nextWeekIndex];
      }
      setNotification("Đã đến cuối kỳ học");
      setTimeout(() => setNotification(null), 3000);
      return prevWeek;
    });
  };

  const handlePreviousWeek = () => {
    setSelectedWeek((prevWeek) => {
      const prevWeekIndex = weeks.findIndex(week => week === prevWeek) - 1;
      if (prevWeekIndex >= 0) {
        return weeks[prevWeekIndex];
      }
      setNotification("Đã đến đầu kỳ học");
      setTimeout(() => setNotification(null), 3000);
      return prevWeek;
    });
  };

  const handleGoToCurrentWeek = () => {
    const today = new Date();
    if (semesterStartDate && semesterEndDate) {
      if (isAfter(today, semesterStartDate) && isBefore(today, semesterEndDate)) {
        const currentWeekIndex = weeks.findIndex(week => isBefore(today, addWeeks(week, 1)));
        setSelectedWeek(weeks[currentWeekIndex]);
      } else if (isBefore(today, semesterStartDate)) {
        setSelectedWeek(weeks[0]);
      } else {
        setSelectedWeek(weeks[weeks.length - 1]);
      }
    }
    setSelectedDay(getCurrentDay());
  };

  const handleSemesterChange = (event) => {
    const selectedSemesterId = event.target.value;
    setSelectedSemester(selectedSemesterId);
    setSchedules([]);

    const selectedSemesterData = semesters.find(
      (sem) => sem.id.toString() === selectedSemesterId
    );
    if (selectedSemesterData) {
      const startDate = new Date(selectedSemesterData.start_date.split('/').reverse().join('-'));
      const endDate = new Date(selectedSemesterData.end_date.split('/').reverse().join('-'));
      setSemesterStartDate(startDate);
      setSemesterEndDate(endDate);
      const weeksList = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
      setWeeks(weeksList);
      setSelectedWeek(weeksList[0]);
    } else {
      setSemesterStartDate(null);
      setSemesterEndDate(null);
      setWeeks([]);
      setSelectedWeek(null);
    }
  };

  const handleWeekChange = (event) => {
    const selectedWeekIndex = parseInt(event.target.value, 10);
    setSelectedWeek(weeks[selectedWeekIndex]);
  };

  const startOfCurrentWeek = useMemo(() => startOfWeek(selectedWeek || currentWeek, { weekStartsOn: 1 }), [selectedWeek, currentWeek]);
  const endOfCurrentWeek = useMemo(() => endOfWeek(selectedWeek || currentWeek, { weekStartsOn: 1 }), [selectedWeek, currentWeek]);

  const getScheduleForDayAndShift = (day, shift) => {
    const dayDate = format(
      addDays(startOfCurrentWeek, daysOfWeek.indexOf(day)),
      "dd/MM/yyyy"
    );
    return schedules.find(
      (schedule) =>
        schedule.shift_name === shift &&
        schedule.schedule_lessons.some((lesson) => lesson.date === dayDate)
    );
  };

  const getLessonForDate = (schedule, date) => {
    return schedule.schedule_lessons.find((lesson) => lesson.date === date);
  };

  const openPopup = (schedule, lesson) => {
    setSelectedSchedule({ ...schedule, lesson });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedSchedule(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Có mặt":
        return "bg-green-100";
      case "Vắng":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  if (isLoading) {
    return <p className="text-center py-4">Đang tải lịch học...</p>;
  }

  if (error) {
    return <p className="text-center py-4 text-red-500">Lỗi: {error}</p>;
  }

  return (
    <div className="space-y-6 mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 w-full">
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
          {notification}
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <button
            onClick={handleGoToCurrentWeek}
            className="px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-200"
          >
            Tuần hiện tại
          </button>

          <select
            onChange={handleSemesterChange}
            value={selectedSemester}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-700"
          >
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>

          <select
            onChange={handleWeekChange}
            value={weeks.findIndex(week => week === selectedWeek)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-700"
          >
            {weeks.map((week, index) => (
              <option key={index} value={index}>
                Tuần {index + 1}: {format(week, "dd/MM/yyyy")} - {format(addDays(week, 6), "dd/MM/yyyy")}
              </option>
            ))}
          </select>

          <select
            onChange={handleDayChange}
            value={selectedDay}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-700"
          >
            <option value="">Tất cả các ngày</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day} {day === getCurrentDay() ? "(Hôm nay)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mb-6 bg-white shadow-sm rounded-lg p-4 bg-blue-100">
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Previous week"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 mb-1">
              {selectedSemester ? "Thời gian học kỳ" : "Tuần hiện tại"}
            </span>
            <div className="text-center font-bold text-gray-700">
              {semesterStartDate && semesterEndDate
                ? `${format(startOfCurrentWeek, "dd/MM/yyyy", { locale: vi })} - ${format(endOfCurrentWeek, "dd/MM/yyyy", { locale: vi })}`
                : `${format(startOfCurrentWeek, "dd/MM/yyyy", { locale: vi })} - ${format(endOfCurrentWeek, "dd/MM/yyyy", { locale: vi })}`}
            </div>
          </div>
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Next week"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        {selectedDay ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {shifts.map((shift) => {
              const schedule = getScheduleForDayAndShift(selectedDay, shift);
              const dayDate = format(
                addDays(startOfCurrentWeek, daysOfWeek.indexOf(selectedDay)),
                "dd/MM/yyyy"
              );
              const lesson = schedule
                ? getLessonForDate(schedule, dayDate)
                : null;
              return (
                <div
                  key={shift}
                  className={`shadow-sm rounded-lg p-6 relative border border-gray-200 ${
                    lesson ? getStatusColor(lesson.status) : "bg-white"
                  }`}
                >
                  <div className="absolute top-0 left-0 bg-blue-700 text-white px-3 py-1 font-semibold rounded-br-lg rounded-tl-lg">
                    {shift}
                  </div>
                  {schedule && lesson ? (
                    <div
                      onClick={() => openPopup(schedule, lesson)}
                      className="border border-gray-300 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 transition duration-200"
                    >
                      <p>{schedule.room_name}</p>
                      <p>{schedule.subject_name}</p>
                      <p>{schedule.classroom_code}</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center">
                      {schedules.length === 0
                        ? "Chưa có lịch học cho kỳ này"
                        : "Không có lớp"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            {schedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có lịch học cho kỳ này
              </div>
            ) : (
              <table className="w-full text-center">
                <thead>
                  <tr className="bg-blue-200">
                    <th className="p-3 font-semibold text-gray-700 border border-gray-200 text-center sticky left-0 bg-blue-200 z-10">
                      Ca học
                    </th>
                    {daysOfWeek.map((day, index) => (
                      <th
                        key={index}
                        className="p-3 text-center font-semibold text-gray-700 border border-gray-200"
                      >
                        <div className="flex flex-col">
                          <span>{day}</span>
                          <span className="text-gray-500 font-normal">
                            {format(
                              addDays(startOfCurrentWeek, index),
                              "dd/MM",
                              {
                                locale: vi,
                              }
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <tr
                      key={shift}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-3 text-gray-700 font-medium border border-gray-200">
                        {shift}
                      </td>
                      {daysOfWeek.map((day, dayIndex) => {
                        const dayDate = format(
                          addDays(startOfCurrentWeek, dayIndex),
                          "dd/MM/yyyy"
                        );
                        const schedule = getScheduleForDayAndShift(day, shift);
                        const lesson = schedule
                          ? getLessonForDate(schedule, dayDate)
                          : null;
                        return (
                          <td
                            key={day}
                            className={`p-3 text-center border border-gray-200 ${
                              lesson ? getStatusColor(lesson.status) : ""
                            }`}
                          >
                            {schedule && lesson ? (
                              <div
                                onClick={() => openPopup(schedule, lesson)}
                                className="border border-gray-300 rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 transition duration-200"
                              >
                                <p>{schedule.room_name}</p>
                                <p>{schedule.subject_name}</p>
                                <p>{schedule.classroom_code}</p>
                              </div>
                            ) : (
                              <div className="text-gray-400">Trống</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showPopup && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl transform transition-all animate-scale-in">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Chi tiết lịch học
              </h2>
              <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-semibold mr-2">Giảng viên:</span>{" "}
                  {selectedSchedule.teacher_name}
                </p>

                <p className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="font-semibold mr-2">Môn học:</span>{" "}
                  {selectedSchedule.subject_name}
                </p>
                <p className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold mr-2">Ca học:</span>{" "}
                  {selectedSchedule.shift_name}
                </p>
                <p className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="font-semibold mr-2">Tiết học:</span>{" "}
                  {selectedSchedule.lesson.name}
                </p>
                <p className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="font-semibold mr-2">Nội dung:</span>{" "}
                  {selectedSchedule.lesson.description}
                </p>
                <p className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-semibold mr-2">Ngày:</span>{" "}
                  {selectedSchedule.lesson.date}
                </p>
                <p
                  className={`flex items-center text-gray-700 ${getStatusColor(
                    selectedSchedule.lesson.status
                  )}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold mr-2">Trạng thái:</span>{" "}
                  {selectedSchedule.lesson.status}
                </p>

                {selectedSchedule.link !== "NULL" && (
                  <p className="flex items-center text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span className="font-semibold mr-2">Link:</span>
                    <a
                      href={selectedSchedule.link}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedSchedule.link}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                onClick={closePopup}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
