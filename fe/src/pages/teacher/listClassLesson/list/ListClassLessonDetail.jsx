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
        // Initialize attendance status for each student
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
      // Update the local state or refetch the student list here if needed
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setError('Không thể cập nhật điểm danh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left">
      <h4 className="font-bold mb-2 text-xl">{ScheduleInfor.subject_name}</h4>
      <p className="mb-1">Lớp học: {ScheduleInfor.classroom}</p>
      <p className="mb-1">Ca học: {ScheduleInfor.shift_name}</p>
      <p className="mb-1">Phòng: {ScheduleInfor.room_name}</p>
      <p className="mb-1">Liên kết: {ScheduleInfor.link}</p>
      <p className="mb-4">
        Thời gian: {ScheduleInfor.start_date} - {ScheduleInfor.end_date}
      </p>

      <h5 className="font-bold mt-6 mb-4 text-lg">Danh sách buổi học:</h5>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Điểm danh
              </th>
            </tr>
          </thead>
          <tbody>
            {ScheduleInfor.schedule_lessons.map((lesson) => (
              <React.Fragment key={lesson.id}>
                <tr className={isCurrentDate(lesson.date) ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lesson.name}
                    {isCurrentDate(lesson.date) && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Hôm nay
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lesson.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lesson.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        lesson.status === 'Đã học'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleAttendance(lesson.id)}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
                        loading && selectedLesson === lesson.id
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={loading && selectedLesson === lesson.id}
                    >
                      {loading && selectedLesson === lesson.id
                        ? 'Đang tải...'
                        : 'Điểm danh'}
                    </button>
                  </td>
                </tr>
                {selectedLesson === lesson.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      {error ? (
                        <p className="text-red-500 text-sm">{error}</p>
                      ) : (
                        <>
                          <h6 className="font-semibold mb-2 text-gray-700">
                            Danh sách sinh viên:
                          </h6>
                          {Array.isArray(students) && students.length > 0 ? (
                            <ul className="space-y-2">
                              {students.map((student) => (
                                <li
                                  key={student.student_id}
                                  className="flex items-center justify-between text-sm text-gray-600"
                                >
                                  <span>{student.student_name}</span>
                                  <button
                                    onClick={() => toggleAttendance(student.student_id)}
                                    className={`px-3 py-1 rounded ${
                                      attendanceStatus[student.student_id] === 1
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                    }`}
                                  >
                                    {attendanceStatus[student.student_id] === 1 ? 'Có mặt' : 'Vắng mặt'}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Không có sinh viên trong danh sách.
                            </p>
                          )}
                          {students.length > 0 && (
                            <button
                              onClick={() => submitAttendance(lesson.id)}
                              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                              disabled={loading}
                            >
                              {loading ? 'Đang cập nhật...' : 'Cập nhật điểm danh'}
                            </button>
                          )}
                        </>
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