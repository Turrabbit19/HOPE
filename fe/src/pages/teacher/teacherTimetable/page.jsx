import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Book, Info, AlertCircle, ChevronDown, RotateCcw  } from 'lucide-react';

const TeacherTimetable = () => {
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState("");
  const [timetableData, setTimetableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);

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
      fetchTimetableData(selectedSemester.id);
    }
  }, [selectedSemester]);

  const fetchSemesters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/teacher/semesters",
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
      console.log("Fetched semesters:", data);
      setSemesters(data.data || []);
      if (data.data && data.data.length > 0) {
        setSelectedSemester(data.data[0]);
      }
    } catch (err) {
      console.error("Error fetching semesters:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải danh sách kỳ học");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimetableData = async (semesterId) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!semesterId) {
        setError("Không có kỳ học được chọn");
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/teacher/${semesterId}/timetable`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải lịch dạy");
      }

      const data = await response.json();
      console.log("Fetched timetable data:", data);
      setTimetableData(data.data || []);
    } catch (err) {
      console.error("Error fetching timetable data:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải lịch dạy");
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
    setCurrentWeek((prevWeek) => {
      const nextWeek = new Date(prevWeek);
      nextWeek.setDate(prevWeek.getDate() + 7);
      return nextWeek;
    });
  };

  const handlePreviousWeek = () => {
    setCurrentWeek((prevWeek) => {
      const previousWeek = new Date(prevWeek);
      previousWeek.setDate(prevWeek.getDate() - 7);
      return previousWeek;
    });
  };

  const handleGoToCurrentWeek = () => {
    const today = new Date();
    setCurrentWeek(today);
    setSelectedDay(getCurrentDay());
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  const getScheduleForDayAndShift = (day, shift) => {
    if (!Array.isArray(timetableData)) {
      console.error("timetableData is not an array:", timetableData);
      return undefined;
    }

    const dayDate = new Date(currentWeek);
    dayDate.setDate(
      currentWeek.getDate() - currentWeek.getDay() + daysOfWeek.indexOf(day) + 1
    );
    const formattedDate = formatDate(dayDate);

    // console.log("Looking for schedule:", { day, shift, formattedDate });

    const schedule = timetableData.find(item => {
      return item.shift_name === shift;
    });

    if (schedule) {
      const hasLessonOnDate = schedule.schedule_lessons.some(
        lesson => lesson.date === formattedDate
      );
      if (hasLessonOnDate) {
        return {
          ...schedule,
          subject_name: schedule.subject_name,
          room_name: schedule.room_name,
          classroom_code: schedule.classroom_code
        };
      }
    }

    return undefined;
  };

  const getLessonForDate = (schedule, date) => {
    if (!schedule || !schedule.schedule_lessons) return null;
    return schedule.schedule_lessons.find(lesson => lesson.date === date);
  };

  const openPopup = (schedule, lesson) => {
    setSelectedSchedule({ ...schedule, lesson });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedSchedule(null);
  };

  const handleSemesterChange = (event) => {
    const semesterId = event.target.value;
    const semester = semesters.find((sem) => sem.id === parseInt(semesterId));
    setSelectedSemester(semester);
    setCurrentWeek(new Date(semester.start_date));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã kết thúc":
        return "bg-green-100";
      case "Đang dạy":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50/50 w-full min-h-screen">
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <button
            onClick={handleGoToCurrentWeek}
            className="flex items-center gap-2 px-4 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#4285F4]/90 transition-all duration-200 group shadow-sm shadow-blue-500/20"
          >
            <Clock className="w-4 h-4 group-hover:animate-spin" />
            <span>Tuần hiện tại</span>
          </button>

          <div className="flex-1 flex items-center justify-center gap-3 min-w-[200px]">
            <div className="relative flex-1">
              <select
                onChange={handleSemesterChange}
                value={selectedSemester ? selectedSemester.id : ""}
                className="w-full appearance-none bg-white px-4 py-2 pr-10 rounded-lg border border-gray-200 text-gray-700 cursor-pointer hover:border-[#4285F4]/30 focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all duration-200"
              >
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <div className="relative flex-1">
              <select
                onChange={handleDayChange}
                value={selectedDay}
                className="w-full appearance-none bg-white px-4 py-2 pr-10 rounded-lg border border-gray-200 text-gray-700 cursor-pointer hover:border-[#4285F4]/30 focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all duration-200"
              >
                <option value="">Tất cả các ngày</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day} {day === getCurrentDay() ? "(Hôm nay)" : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-50 to-white rounded-lg p-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-full hover:bg-white/80 transition duration-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-2xl mb-1">Tuần hiện tại</span>
            <div className="text-center font-medium text-gray-700">
              {getWeekDates()}
            </div>
          </div>
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full hover:bg-white/80 transition duration-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Empty State */}
        {Array.isArray(timetableData) && timetableData.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có dữ liệu lịch dạy
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Không có lịch dạy nào được tìm thấy cho kỳ học này.
            </p>
          </div>
        ) : selectedDay ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shifts.map((shift) => {
              const schedule = getScheduleForDayAndShift(selectedDay, shift);
              const dayDate = new Date(currentWeek);
              dayDate.setDate(
                currentWeek.getDate() -
                  currentWeek.getDay() +
                  daysOfWeek.indexOf(selectedDay) +
                  1
              );
              const formattedDate = formatDate(dayDate);
              const lesson = schedule
                ? getLessonForDate(schedule, formattedDate)
                : null;
              return (
                <div
                  key={shift}
                  className={`rounded-lg p-6 relative border transition-all duration-200 hover:shadow-md ${
                    lesson ? getStatusColor(lesson.status) : "bg-white border-gray-100"
                  }`}
                >
                  <div className="absolute top-0 left-0 bg-[#4285F4] text-white px-3 py-1 text-2xl font-medium rounded-tl-lg rounded-br-lg">
                    {shift}
                  </div>
                  {schedule && lesson ? (
                    <div className="pt-6">
                      <p className="font-medium text-gray-900 mb-1">{schedule.subject_name}</p>
                      <p className="text-gray-600 text-2xl mb-3">{schedule.room_name}</p>
                      <button
                        onClick={() => openPopup(schedule, lesson)}
                        className="text-2xl px-4 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#4285F4]/90 transition-all duration-200 shadow-sm shadow-blue-500/20"
                      >
                        Chi tiết
                      </button>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center pt-6">
                      <span className="text-gray-400">Không có lớp</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Table View
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-2xl">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-white">
                  <th className="py-4 px-3 font-medium text-gray-700 border-b border-r border-gray-100 text-center sticky left-0 bg-blue-50 z-10">
                    Ca học
                  </th>
                  {daysOfWeek.map((day, index) => {
                    const date = new Date(currentWeek);
                    date.setDate(
                      currentWeek.getDate() - currentWeek.getDay() + index + 1
                    );
                    return (
                      <th
                        key={index}
                        className="py-4 px-3 text-center font-medium text-gray-700 border-b border-r border-gray-100"
                      >
                        <div className="flex flex-col">
                          <span>{day}</span>
                          <span className="text-gray-400 font-normal text-2xl mt-1">
                            {formatDate(date)}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, shiftIndex) => (
                  <tr
                    key={shift}
                    className="hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-gray-700 font-medium border-r border-gray-100 text-center bg-blue-50/50">
                      {shift}
                    </td>
                    {daysOfWeek.map((day, dayIndex) => {
                      const dayDate = new Date(currentWeek);
                      dayDate.setDate(
                        currentWeek.getDate() -
                          currentWeek.getDay() +
                          dayIndex +
                          1
                      );
                      const formattedDate = formatDate(dayDate);
                      const schedule = getScheduleForDayAndShift(day, shift);
                      const lesson = schedule
                        ? getLessonForDate(schedule, formattedDate)
                        : null;
                      return (
                        <td
                          key={day}
                          className={`p-3 text-center border-b border-r border-gray-100 ${
                            lesson ? getStatusColor(lesson.status) : ""
                          }`}
                        >
                          {schedule && lesson ? (
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {schedule.subject_name}
                              </p>
                              <p className="text-gray-600 text-2xl">{schedule.room_name}</p>
                              <p className="text-gray-500 text-2xl">{schedule.classroom_code}</p>
                              <button
                                onClick={() => openPopup(schedule, lesson)}
                                className="mt-2 px-3 py-1 text-2xl bg-[#4285F4] text-white rounded-lg hover:bg-[#4285F4]/90 transition-all duration-200 shadow-sm shadow-blue-500/20"
                              >
                                Chi tiết
                              </button>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-2xl">Trống</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Popup */}
      {showPopup && selectedSchedule && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 shadow-xl transform transition-all animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <Info className="h-5 w-5 mr-2 text-[#4285F4]" />
                Chi tiết lịch dạy
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <Book className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <span className="block text-2xl font-medium text-gray-700">Môn học</span>
                    <span className="text-gray-600">{selectedSchedule.subject_name}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <span className="block text-2xl font-medium text-gray-700">Ca học</span>
                    <span className="text-gray-600">{selectedSchedule.shift_name}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <span className="block text-2xl font-medium text-gray-700">Phòng học</span>
                    <span className="text-gray-600">{selectedSchedule.room_name}</span>
                  </div>
                </div>

                {selectedSchedule.lesson && (
                  <>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <Book className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-2xl font-medium text-gray-700">Tiết học</span>
                        <span className="text-gray-600">{selectedSchedule.lesson.name}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <Info className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-2xl font-medium text-gray-700">Nội dung</span>
                        <span className="text-gray-600">{selectedSchedule.lesson.description}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-2xl font-medium text-gray-700">Ngày</span>
                        <span className="text-gray-600">{selectedSchedule.lesson.date}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#4285F4]/90 transition-all duration-200 text-2xl font-medium shadow-sm shadow-blue-500/20"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;

