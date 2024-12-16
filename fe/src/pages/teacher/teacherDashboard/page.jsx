'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Users, BookOpen, MapPin } from 'lucide-react';

export default function TeacherInfo() {
  const [teacher, setTeacher] = useState(null);
  const [todayLessons, setTodayLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://127.0.0.1:8000/api/teacher', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu giảng viên');
        }
        const data = await response.json();
        setTeacher(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response ? `Lỗi: ${err.response.status} - ${err.response.statusText}` : err.message);
        setLoading(false);
      }
    };

    const fetchTodayLessons = async () => {
      if (!token) {
        console.log('Token không có sẵn cho fetchTodayLessons');
        return;
      }
      try {
        console.log('Đang gửi yêu cầu lấy lịch học');
        const response = await fetch('http://127.0.0.1:8000/api/teacher/timetable', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Đã nhận phản hồi:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Không thể lấy lịch dạy: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Dữ liệu lịch học nhận được:', data);

        // Lọc lịch học cho ngày hôm nay
        const today = new Date().toISOString().split('T')[0];
        const todayLessons = data.data.filter(lesson => lesson.date === today);
        setTodayLessons(todayLessons);
      } catch (err) {
        console.error('Lỗi khi lấy lịch học:', err);
        setError(err.message);
      }
    };

    fetchTeacherData();
    fetchTodayLessons();
  }, [token]);

  useEffect(() => {
    console.log('todayLessons đã được cập nhật:', todayLessons);
  }, [todayLessons]);

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) return 'Invalid Time';
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 text-center p-2 text-lg">
        Lỗi: {error}
      </div>
    );
  if (!teacher)
    return (
      <div className="text-gray-600 text-center p-2 text-lg">
        Không có dữ liệu giảng viên
      </div>
    );

  return (
    <div className="max-w-8xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-16 h-16 rounded-full mr-6"
          />
          <div>
            <h1 className="text-2xl font-bold">{teacher.name}</h1>
            <p className="text-lg text-gray-600">{teacher.major_name}</p>
            <p className="text-lg mt-2">
              <span
                className={`px-4 py-2 rounded ${
                  teacher.status === 'Hoạt động'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {teacher.status}
              </span>
            </p>
          </div>
        </div>

        <div className="flex mb-4 border-b">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-xl ${
              activeTab === 'info'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex-1 py-3 text-xl ${
              activeTab === 'timetable'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Lịch dạy hôm nay
          </button>
        </div>

        {activeTab === 'info' && (
          <table className="w-full text-lg">
            <tbody>
              {[ // Thông tin giảng viên
                { label: 'Mã giảng viên', value: teacher.teacher_code },
                { label: 'Ngành', value: teacher.major_name },
                { label: 'Email', value: teacher.email },
                { label: 'Số điện thoại', value: teacher.phone },
                { label: 'Ngày sinh', value: teacher.dob },
                { label: 'Giới tính', value: teacher.gender },
                { label: 'Dân tộc', value: teacher.ethnicity },
              ].map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-3 px-2 font-semibold">{item.label}:</td>
                  <td className="py-3 px-2 text-gray-600">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'timetable' && (
          <div>
            <h3 className="font-bold mb-4 text-xl">
              Lịch dạy hôm nay ({new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })})
            </h3>
            {console.log('Đang render lịch học, số lượng bài học:', todayLessons.length)}
            {todayLessons.length > 0 ? (
              <div className="space-y-4">
                {todayLessons.map((lesson, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 shadow">
                    <h4 className="text-lg font-semibold mb-2 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                      {lesson.subject_name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        Lớp: {lesson.class_name}
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        Thời gian: {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        Phòng: {lesson.room_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có lịch dạy hôm nay</h3>
                <p className="text-gray-500">Bạn không có buổi dạy nào được lên lịch cho ngày hôm nay.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

