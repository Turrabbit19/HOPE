import React, { useState, useEffect } from 'react';
import ScheduleDetailPopup from './ScheduleDetailPopup';

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
          }
        });
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu lịch học');
        }
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

  if (loading) return <div className="text-center py-4">Đang tải...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Lỗi: {error}</div>;
  if (!schedules || schedules.length === 0) return <div className="text-center py-4">Không có dữ liệu lịch học</div>;

  return (
    <div className="schedule-table bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-full mx-auto my-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Danh sách lớp học</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp học</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa học</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học kỳ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngành</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Môn học</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca học</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng học</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Các ngày trong tuần</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.classroom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.course_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.semester_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.major_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.subject_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.shift_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.room_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.start_date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.end_date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {schedule.days_of_week.map((day, index) => (
                  <span key={index} className="inline-block mr-2">
                    {Object.entries(day)[0][0]} {Object.entries(day)[0][1]}
                    {index < schedule.days_of_week.length - 1 ? ',' : ''}
                  </span>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => handleDetailClick(schedule)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupOpen && (
        <ScheduleDetailPopup
          schedule={selectedSchedule}
          onClose={() => setIsPopupOpen(false)}
          token={token}
        />
      )}
    </div>
  );
}

