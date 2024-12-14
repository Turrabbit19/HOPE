'use client';

import React, { useState, useEffect } from 'react';

export default function TeacherInfo() {
  const [teacher, setTeacher] = useState(null);
  const [timetable, setTimetable] = useState([]);
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
        console.error('Error fetching teacher data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchTimetable = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://127.0.0.1:8000/api/teacher/timetable', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Không thể lấy lịch dạy');
        }
        const data = await response.json();
        setTimetable(data.data);
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError(err.message);
      }
    };

    fetchTeacherData();
    fetchTimetable();
  }, [token]);

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
            <h3 className="font-bold mb-4 text-xl">Lịch dạy</h3>
            {timetable.length > 0 ? (
              <table className="w-full text-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-2 text-left">Môn học</th>
                    <th className="py-3 px-2 text-left">Lớp</th>
                    {/* <th className="py-3 px-2 text-left">Thời gian</th> */}
                    <th className="py-3 px-2 text-left">Phòng</th>
                    <th className="py-3 px-2 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((lesson, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-3 px-2">{lesson.subject_name}</td>
                      <td className="py-3 px-2">{lesson.classroom_code}</td>
                      {/* <td className="py-3 px-2">
                        {formatTime(lesson.date)} - {formatTime(lesson.date)}
                      </td> */}
                      <td className="py-3 px-2">{lesson.room_name}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded ${
                          lesson.status === 'Đã hoàn thành'
                            ? 'bg-green-100 text-green-800'
                            : lesson.status === 'Đang dạy'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {lesson.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 text-lg">Không có lịch dạy.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

