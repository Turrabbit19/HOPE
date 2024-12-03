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

  if (loading) return <div className="text-center py-4 animate-pulse text-gray-600">Đang tải...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{`Lỗi: ${error}`}</div>;
  if (!schedules.length) return <div className="text-center py-4 text-gray-500">Không có dữ liệu lịch học</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className=" mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-200 via-teal-200 to-blue-200 p-6 text-gray-700 text-center">
          <h2 className="text-3xl font-semibold">Danh sách lớp học</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                {[
                  'Lớp học',
                  'Khóa học',
                  'Học kỳ',
                  'Ngành',
                  'Môn học',
                  'Ca học',
                  'Phòng học',
                  'Ngày bắt đầu',
                  'Ngày kết thúc',
                  'Các ngày trong tuần',
                  'Chi tiết',
                ].map((header) => (
                  <th key={header} className="py-3 px-4 text-left text-sm font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4 text-gray-600">{schedule.classroom}</td>
                  <td className="px-6 py-4 text-gray-600">{schedule.course_name}</td>
                  <td className="px-6 py-4 text-gray-600">{schedule.semester_name}</td>
                  <td className="px-6 py-4 text-gray-600">{schedule.major_name}</td>
                  <td className="px-6 py-4 text-gray-600">{schedule.subject_name}</td>
                  <td className="px-6 py-4 text-gray-600">{schedule.shift_name}</td>
                  <td className="px-6 py-4 text-gray-600">{schedule.room_name}</td>
                  <td className="px-6 py-4 text-gray-600">{schedule.start_date}</td>
                  <td className="px-6 py-4 text-gray-600">{schedule.end_date}</td>
                  <td className="px-6 py-4">
                    {schedule.days_of_week.map((day, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2"
                      >
                        {Object.entries(day)[0][0]} {Object.entries(day)[0][1]}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDetailClick(schedule)}
                      className="bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isPopupOpen && (
          <ListClassLessonPopup
            schedule={selectedSchedule}
            onClose={() => setIsPopupOpen(false)}
            token={token}
          />
        )}
      </div>
    </div>
  );
}
