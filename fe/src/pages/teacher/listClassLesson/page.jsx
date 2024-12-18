import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ListClassLessonPopup from './list/ListClassLessonPopup';

export default function ScheduleTable() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isStudentPopupOpen, setIsStudentPopupOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
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
        const response = await fetch('http://127.0.0.1:8000/api/teacher/schedules', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Không thể lấy dữ liệu lịch học');
        const result = await response.json();
        console.log('API Response:', JSON.stringify(result, null, 2));

        let schedulesData;
        if (Array.isArray(result)) {
          schedulesData = result;
        } else if (result && typeof result === 'object') {
          if (Array.isArray(result.data)) {
            schedulesData = result.data;
          } else if (typeof result.data === 'object') {
            schedulesData = Object.values(result.data);
          } else {
            throw new Error('Cấu trúc dữ liệu không hợp lệ');
          }
        } else {
          throw new Error('Dữ liệu không đúng định dạng');
        }

        if (!Array.isArray(schedulesData) || schedulesData.length === 0) {
          throw new Error('Không có dữ liệu lịch học');
        }

        setSchedules(schedulesData);
      } catch (err) {
        console.error('Error fetching schedules:', err);
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
      const response = await fetch(`http://127.0.0.1:8000/api/teacher/schedule/${scheduleId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Không thể lấy dữ liệu sinh viên');
      const result = await response.json();
      console.log('Student data response:', JSON.stringify(result, null, 2));

      if (result && result.ListStudents && Array.isArray(result.ListStudents)) {
        setStudentData(result.ListStudents);
        setIsStudentPopupOpen(true);
      } else {
        throw new Error('Cấu trúc dữ liệu sinh viên không hợp lệ');
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      setStudentError(err.message);
    } finally {
      setStudentLoading(false);
    }
  };

  const getDayOfWeek = (day) => {
    const days = {
      'Monday': 'Thứ 2',
      'Tuesday': 'Thứ 3',
      'Wednesday': 'Thứ 4',
      'Thursday': 'Thứ 5',
      'Friday': 'Thứ 6',
      'Saturday': 'Thứ 7',
      'Sunday': 'Chủ nhật'
    };
    return days[day] || day;
  };

  const StudentStatsPopup = ({ data, onClose }) => {
    console.log('StudentStatsPopup data:', JSON.stringify(data, null, 2));

    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Thống kê điểm danh sinh viên</h2>
            <p className="text-center text-red-500">
              {!data ? "Không thể tải danh sách sinh viên. Vui lòng thử lại sau." : "Lớp học này không có sinh viên."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white shadow-md rounded-lg p-8 max-w-[95%] w-auto max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">📊 Thống kê điểm danh sinh viên</h2>
          <table className="table-auto w-full border-collapse border border-gray-400 text-center text-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border border-gray-400 px-4 py-3">STT</th>
                <th className="border border-gray-400 px-4 py-3">Họ tên</th>
                <th className="border border-gray-400 px-4 py-3">Mã SV</th>
                <th className="border border-gray-400 px-4 py-3">Tổng số buổi</th>
                <th className="border border-gray-400 px-4 py-3">Số buổi có mặt</th>
                <th className="border border-gray-400 px-4 py-3">Số buổi vắng</th>
                <th className="border border-gray-400 px-4 py-3">Tỷ lệ điểm danh</th>
                {data.length > 0 && Array.from({ length: data[0].total_lessons }).map((_, index) => (
                  <th key={index} className="border border-gray-400 px-4 py-3">Tiết {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((student, index) => {
                const attendanceRate = student.total_lessons > 0
                  ? ((student.attended_lessons / student.total_lessons) * 100).toFixed(2)
                  : '0.00';

                return (
                  <tr key={student.student_id} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-400 px-4 py-3">{index + 1}</td>
                    <td className="border border-gray-400 px-4 py-3">{student.student_name}</td>
                    <td className="border border-gray-400 px-4 py-3">{student.student_code}</td>
                    <td className="border border-gray-400 px-4 py-3">{student.total_lessons}</td>
                    <td className="border border-gray-400 px-4 py-3">{student.attended_lessons}</td>
                    <td className="border border-gray-400 px-4 py-3">{student.absent_lessons}</td>
                    <td className="border border-gray-400 px-4 py-3">
                      <div className="flex items-center justify-center">
                        <span className="text-lg">{attendanceRate}%</span>
                        <div className="ml-2 w-40 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-4 ${attendanceRate >= 75
                                ? 'bg-green-500'
                                : attendanceRate >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: student.total_lessons }).map((_, lessonIndex) => {
                      const lesson = student.absent_details[lessonIndex];
                      const isAbsent = lesson && lesson.status === 'Vắng';
                      const hasOccurred = lesson && new Date(lesson.study_date) <= new Date();
                      return (
                        <td key={lessonIndex} className="border border-gray-400 px-4 py-3">
                          <span
                            className={`text-2xl ${
                              !hasOccurred
                                ? 'text-gray-300'
                                : isAbsent
                                  ? 'text-red-500'
                                  : 'text-green-500'
                            }`}
                            title={`Tiết ${lessonIndex + 1}: ${lesson ? lesson.study_date : ''}`}
                          >
                            {!hasOccurred ? '-' : isAbsent ? 'X' : '✔'}
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
      </div>
    );
  };

  if (loading) return <div className="text-center py-4 animate-pulse text-gray-600">Đang tải...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{`Lỗi: ${error}`}</div>;
  if (!schedules.length) return <div className="text-center py-4 text-gray-500">Không có dữ liệu lịch học</div>;

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-200 via-teal-200 to-blue-200 p-4">
          <h2 className="text-xl font-semibold text-gray-700 text-center">Danh sách lớp học</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-xl px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Lớp học</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Môn học</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Các buổi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Thống kê </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule, index) => (
                <tr key={schedule.id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-lg text-gray-900 font-bold">{schedule.classroom || 'N/A'}</div>
                    <div className="text-md text-gray-500">{schedule.course_name || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-lg text-gray-900">{schedule.subject_name || 'N/A'}</div>
                    <div className="text-md text-gray-500">{schedule.major_name || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-lg text-gray-900">{schedule.room_name || 'N/A'}</div>
                    <div className="text-md text-gray-500">{schedule.shift_name || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-md text-gray-500">
                      {schedule.start_date || 'N/A'} - {schedule.end_date || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(schedule.days_of_week) && schedule.days_of_week.length > 0 ? (
                        schedule.days_of_week.map((day, dayIndex) => {
                          if (typeof day === 'object') {
                            const [dayName, shift] = Object.entries(day)[0] || [];
                            return dayName ? (
                              <span
                                key={dayIndex}
                                className="inline-flex items-center px-3 py-1 text-md font-medium bg-green-100 text-green-800 rounded-full"
                              >
                                {getDayOfWeek(dayName)} ({shift})
                              </span>
                            ) : null;
                          }
                          return null;
                        })
                      ) : (
                        <span>Không có dữ liệu</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className={`text-md font-bold ${schedule.schedule_status === 'Active'
                          ? 'text-green-600'
                          : schedule.schedule_status === 'Pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                    >
                      {schedule.schedule_status || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDetailClick(schedule)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
                    >
                      Chi tiết
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleStudentStatsClick(schedule.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                    >
                      Thống kê
                    </button>
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
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-700">Đang tải dữ liệu sinh viên...</p>
          </div>
        </div>
      )}
      {studentError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-red-500">{studentError}</p>
            <button
              onClick={() => setStudentError(null)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

