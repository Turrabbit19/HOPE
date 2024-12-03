import { useState, useEffect } from 'react';

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
          }
        });
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu giảng viên');
        }
        const data = await response.json();
        setTeacher(data.data);
        setLoading(false);
      } catch (err) {
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
          }
        });
        if (!response.ok) {
          throw new Error('Không thể lấy lịch dạy');
        }
        const data = await response.json();
        const todayClasses = data.data.filter(lesson => {
          const lessonDate = new Date(lesson.date);
          const today = new Date();
          return lessonDate.toDateString() === today.toDateString();
        });
        setTimetable(todayClasses);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeacherData();
    fetchTimetable();
  }, [token]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (error) return <div className="text-red-600 text-center text-xl mt-10">Lỗi: {error}</div>;
  if (!teacher) return <div className="text-gray-600 text-center text-xl mt-10">Không có dữ liệu giảng viên</div>;

  return (
    <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-8xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden transform transition hover:scale-105 duration-500 ease-in-out">
        <div className="flex flex-col md:flex-row">
          {/* Phần hình ảnh */}
          <div className="md:w-1/3 bg-gradient-to-b from-indigo-500 p-8 flex items-center justify-center relative">
            <img
              className="h-48 w-48 rounded-full border-4 border-white shadow-lg transform hover:scale-110 transition duration-500"
              src={teacher.avatar}
              alt={teacher.name}
            />
            <div className="absolute top-4 left-4 bg-indigo-700 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
              {teacher.teacher_code}
            </div>
          </div>

          {/* Phần thông tin */}
          <div className="md:w-2/3 p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {teacher.name}
            </h1>
            <p className="text-lg text-gray-700 mt-2">
              {teacher.major_name}
            </p>
            <p className="mt-4">
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                  teacher.status === 'Hoạt động'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {teacher.status}
              </span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-300">
          <nav className="flex">
            {['info', 'timetable'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center text-lg font-semibold border-b-4 ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-indigo-500 hover:border-indigo-300'
                } transition-all duration-300 ease-in-out`}
              >
                {tab === 'info' ? 'Thông tin cá nhân' : 'Lịch dạy hôm nay'}
              </button>
            ))}
          </nav>
        </div>

        {/* Nội dung Tabs */}
        {activeTab === 'info' && (
          <div className="p-8 bg-gradient-to-t from-gray-50 to-white space-y-6">
            {['Ngành', 'Email', 'Số điện thoại', 'Ngày sinh', 'Giới tính', 'Dân tộc'].map((label, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">{label}:</span>
                <span className="text-gray-600">{Object.values(teacher)[index + 3]}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="p-8 bg-gradient-to-t from-gray-50 to-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Lịch dạy hôm nay
            </h3>
            {timetable.length > 0 ? (
              <ul className="space-y-6">
                {timetable.map((lesson, index) => (
                  <li
                    key={index}
                    className="p-6 bg-indigo-50 rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                    <p className="text-lg font-bold text-indigo-900">
                      {lesson.subject_name}
                    </p>
                    <p className="text-gray-700">Lớp: {lesson.class_name}</p>
                    <p className="text-gray-700 flex items-center mt-2">
                      <span className="mr-2">🕒</span>
                      Thời gian: {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                    </p>
                    <p className="text-gray-700">Phòng: {lesson.room}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-lg">Không có lớp dạy hôm nay.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}