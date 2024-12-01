import React, { useState } from 'react';

const ListClassLessonDetail = ({ scheduleData }) => {
  const { ScheduleInfor } = scheduleData;
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const isCurrentDate = (dateString) => {
    const today = new Date();
    const lessonDate = new Date(dateString.split('/').reverse().join('-'));
    return today.toDateString() === lessonDate.toDateString();
  };

  const handleAttendance = async (lessonId) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/teacher/schedule/${ScheduleInfor.id}/${lessonId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data from server');
      }

      const data = await response.json();

      if (data.ListStudents) {
        setStudents(data.ListStudents);
        setSelectedLesson((prevSelectedLesson) =>
          prevSelectedLesson === lessonId ? null : lessonId
        );
        const initialStatus = {};
        data.ListStudents.forEach(student => {
          initialStatus[student.student_id] = student.status === 'Có mặt' ? 1 : 0;
        });
        setAttendanceStatus(initialStatus);
      } else {
        setError('Không có dữ liệu sinh viên.');
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError('Không thể lấy danh sách sinh viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendanceStatus(prevStatus => ({
      ...prevStatus,
      [studentId]: prevStatus[studentId] === 1 ? 0 : 1
    }));
  };

  const submitAttendance = async (lessonId) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    const attendanceData = {
      attendance: Object.entries(attendanceStatus).map(([student_id, status]) => ({
        student_id: parseInt(student_id),
        status
      }))
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/teacher/attendance/${ScheduleInfor.id}/${lessonId}/mark`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(attendanceData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit attendance');
      }

      const result = await response.json();
      console.log('Attendance submitted successfully:', result);
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setError('Không thể cập nhật điểm danh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6  mx-auto">
      <h4 className="text-2xl font-bold mb-4 text-gray-800">{ScheduleInfor.subject_name}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <p className="text-gray-600"><span className="font-semibold">Lớp học:</span> {ScheduleInfor.classroom}</p>
          <p className="text-gray-600"><span className="font-semibold">Ca học:</span> {ScheduleInfor.shift_name}</p>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600"><span className="font-semibold">Phòng:</span> {ScheduleInfor.room_name}</p>
          <p className="text-gray-600"><span className="font-semibold">Liên kết:</span> {ScheduleInfor.link}</p>
        </div>
      </div>
      <p className="text-gray-600 mb-6">
        <span className="font-semibold">Thời gian:</span> {ScheduleInfor.start_date} - {ScheduleInfor.end_date}
      </p>

      <h5 className="text-xl font-bold mb-4 text-gray-800">Danh sách buổi học:</h5>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Tên', 'Mô tả', 'Ngày', 'Trạng thái', 'Điểm danh'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ScheduleInfor.schedule_lessons.map((lesson) => (
              <React.Fragment key={lesson.id}>
                <tr className={`${isCurrentDate(lesson.date) ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors duration-200`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{lesson.name}</div>
                      {isCurrentDate(lesson.date) && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hôm nay
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{lesson.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{lesson.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lesson.status === 'Đã học' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lesson.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleAttendance(lesson.id)}
                      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
                        loading && selectedLesson === lesson.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={loading && selectedLesson === lesson.id}
    >
                      {loading && selectedLesson === lesson.id ? 'Đang tải...' : 'Điểm danh'}
                    </button>
                  </td>
                </tr>
                {selectedLesson === lesson.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      {error ? (
                        <p className="text-red-500 text-sm">{error}</p>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h6 className="font-semibold mb-4 text-gray-700">Danh sách sinh viên:</h6>
                          {Array.isArray(students) && students.length > 0 ? (
                            <ul className="space-y-2">
                              {students.map((student) => (
                                <li key={student.student_id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                                  <span className="text-sm text-gray-600">{student.student_name}</span>
                                  <button
                                    onClick={() => toggleAttendance(student.student_id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                      attendanceStatus[student.student_id] === 1
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                                  >
                                    {attendanceStatus[student.student_id] === 1 ? 'Có mặt' : 'Vắng mặt'}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">Không có sinh viên trong danh sách.</p>
                          )}
                          {students.length > 0 && (
                            <button
                              onClick={() => submitAttendance(lesson.id)}
                              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                              disabled={loading}
                            >
                              {loading ? 'Đang cập nhật...' : 'Cập nhật điểm danh'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListClassLessonDetail;

