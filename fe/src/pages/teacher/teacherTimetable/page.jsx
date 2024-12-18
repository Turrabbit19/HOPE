import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, Book, Info, AlertCircle } from 'lucide-react';

const TeacherTimetable = () => {
  const [currentWeek, setCurrentWeek] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState('');
  const [timetableData, setTimetableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const shifts = ['Ca 1', 'Ca 2', 'Ca 3', 'Ca 4', 'Ca 5', 'Ca 6'];

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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch('http://127.0.0.1:8000/api/teacher/semesters', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách kỳ học');
      }

      const data = await response.json();
      setSemesters(data.data || []);
      if (data.data && data.data.length > 0) {
        setSelectedSemester(data.data[0]);
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách kỳ học');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimetableData = async (semesterId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/teacher/${semesterId}/timetable`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải lịch dạy');
      }

      const data = await response.json();
      setTimetableData(data.data || []);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải lịch dạy');
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
      if (selectedSemester && nextWeek <= new Date(selectedSemester.end_date)) {
        return nextWeek;
      }
      return prevWeek;
    });
  };

  const handlePreviousWeek = () => {
    setCurrentWeek((prevWeek) => {
      const previousWeek = new Date(prevWeek);
      previousWeek.setDate(prevWeek.getDate() - 7);
      if (selectedSemester && previousWeek >= new Date(selectedSemester.start_date)) {
        return previousWeek;
      }
      return prevWeek;
    });
  };

  const handleGoToCurrentWeek = () => {
    const today = new Date();
    if (selectedSemester &&
        today >= new Date(selectedSemester.start_date) &&
        today <= new Date(selectedSemester.end_date)) {
      setCurrentWeek(today);
      setSelectedDay(getCurrentDay());
    }
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('vi-VN')} - ${endOfWeek.toLocaleDateString('vi-VN')}`;
  };

  const getScheduleForDayAndShift = (day, shift) => {
    const dayDate = new Date(currentWeek);
    dayDate.setDate(currentWeek.getDate() - currentWeek.getDay() + daysOfWeek.indexOf(day) + 1);
    const formattedDate = dayDate.toLocaleDateString('vi-VN');
    return timetableData.find(
      (schedule) =>
        schedule.shift_name === shift &&
        schedule.schedule_lessons.some((lesson) => lesson.date === formattedDate)
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

  const handleSemesterChange = (event) => {
    const semesterId = event.target.value;
    const semester = semesters.find(sem => sem.id === parseInt(semesterId));
    setSelectedSemester(semester);
    setCurrentWeek(new Date(semester.start_date));
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 w-full">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGoToCurrentWeek}
              className="px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-200"
            >
              Tuần hiện tại
            </button>
          </div>

          <select
            onChange={handleSemesterChange}
            value={selectedSemester ? selectedSemester.id : ''}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-700"
          >
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
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
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 mb-1">Tuần hiện tại</span>
            <div className="text-center font-bold text-gray-700">
              {getWeekDates()}
            </div>
          </div>
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Next week"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {timetableData.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có dữ liệu lịch dạy</h3>
            <p className="text-gray-500">Không có lịch dạy nào được tìm thấy cho kỳ học này.</p>
          </div>
        ) : selectedDay ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {shifts.map((shift) => {
              const schedule = getScheduleForDayAndShift(selectedDay, shift);
              const dayDate = new Date(currentWeek);
              dayDate.setDate(currentWeek.getDate() - currentWeek.getDay() + daysOfWeek.indexOf(selectedDay) + 1);
              const formattedDate = dayDate.toLocaleDateString('vi-VN');
              const lesson = schedule ? getLessonForDate(schedule, formattedDate) : null;
              return (
                <div
                  key={shift}
                  className="bg-white shadow-sm rounded-lg p-6 relative border border-gray-200"
                >
                  <div className="absolute top-0 left-0 bg-blue-700 text-white px-3 py-1 font-semibold rounded-br-lg rounded-tl-lg">
                    {shift}
                  </div>
                  {schedule && lesson ? (
                    <div>
                      <p>{schedule.room_name}</p>
                      <p>{schedule.subject_name}</p>
                      <button
                        onClick={() => openPopup(schedule, lesson)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                      >
                        Chi tiết
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center">
                      Không có lớp
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-blue-200">
                  <th className="p-3 font-semibold text-gray-700 border border-gray-200 text-center sticky left-0 bg-blue-200 z-10">
                    Ca học
                  </th>
                  {daysOfWeek.map((day, index) => {
                    const date = new Date(currentWeek);
                    date.setDate(currentWeek.getDate() - currentWeek.getDay() + index + 1);
                    return (
                      <th
                        key={index}
                        className="p-3 text-center font-semibold text-gray-700 border border-gray-200"
                      >
                        <div className="flex flex-col">
                          <span>{day}</span>
                          <span className="text-gray-500 font-normal">
                            {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
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
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-3 text-gray-700 font-medium border border-gray-200">
                      {shift}
                    </td>
                    {daysOfWeek.map((day, dayIndex) => {
                      const dayDate = new Date(currentWeek);
                      dayDate.setDate(currentWeek.getDate() - currentWeek.getDay() + dayIndex + 1);
                      const formattedDate = dayDate.toLocaleDateString('vi-VN');
                      const schedule = getScheduleForDayAndShift(day, shift);
                      const lesson = schedule ? getLessonForDate(schedule, formattedDate) : null;
                      return (
                        <td
                          key={day}
                          className="p-3 text-center border border-gray-200"
                        >
                          {schedule && lesson ? (
                            <div>
                              <p className="font-semibold">
                                {schedule.subject_name}
                              </p>
                              <p>{schedule.room_name}</p>
                              <p>{schedule.classroom_code}</p>
                              <button
                                onClick={() => openPopup(schedule, lesson)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                              >
                                Chi tiết
                              </button>
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
          </div>
        )}
      </div>

      {showPopup && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl transform transition-all animate-scale-in">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <Info className="h-6 w-6 mr-2 text-blue-500" />
                Chi tiết lịch dạy
              </h2>
              <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                  <Book className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-semibold mr-2">Môn học:</span>
                  {selectedSchedule.subject_name}
                </p>
                <p className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-semibold mr-2">Ca học:</span>
                  {selectedSchedule.shift_name}
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-semibold mr-2">Phòng học:</span>
                  {selectedSchedule.room_name}
                </p>
                <p className="flex items-center text-gray-700">
                  <Book className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-semibold mr-2">Tiết học:</span>
                  {selectedSchedule.lesson.name}
                </p>
                <p className="flex items-center text-gray-700">
                  <Info className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-semibold mr-2">Nội dung:</span>
                  {selectedSchedule.lesson.description}
                </p>
                <p className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-semibold mr-2">Ngày:</span>
                  {selectedSchedule.lesson.date}
                </p>
                <p className="flex items-center text-gray-700">
                  <Info className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-semibold mr-2">Trạng thái:</span>
                  {selectedSchedule.lesson.status}
                </p>
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
};

export default TeacherTimetable;

