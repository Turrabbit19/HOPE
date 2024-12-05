import React, { useState, useEffect } from 'react';
import ListClassLessonPopup from './list/ListClassLessonPopup';

export default function ScheduleTable() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        const response = await fetch('http://127.0.0.1:8000/api/teacher/schedules', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Không thể lấy dữ liệu lịch học');
        const data = await response.json();
        setSchedules(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token]);

  const handleDetailClick = (schedule) => {
    setSelectedSchedule(schedule);
    setIsPopupOpen(true);
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp học</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Môn học</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Các buổi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-lg text-gray-900 font-bold">{schedule.classroom}</div> {/* text-lg */}
                    <div className="text-md text-gray-500">{schedule.course_name}</div> {/* text-md */}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-lg text-gray-900">{schedule.subject_name}</div> {/* text-lg */}
                    <div className="text-md text-gray-500">{schedule.major_name}</div> {/* text-md */}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-lg text-gray-900">{schedule.room_name}</div> {/* text-lg */}
                    <div className="text-md text-gray-500">{schedule.shift_name}</div> {/* text-md */}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-md text-gray-500">
                      {schedule.start_date} - {schedule.end_date}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {schedule.days_of_week.map((day, index) => {
                        const [dayName, shift] = Object.entries(day)[0];
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-md font-medium bg-green-100 text-green-800 rounded-full"
                          >
                            {getDayOfWeek(dayName)} ({shift})
                          </span>
                        );
                      })}
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
    </div>
  );
}

