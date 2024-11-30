import React, { useState } from 'react';

const ListClassLessonDetail = ({ scheduleData }) => {
  const { ScheduleInfor } = scheduleData;
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if the date is today's date
  const isCurrentDate = (dateString) => {
    const today = new Date();
    const lessonDate = new Date(dateString.split('/').reverse().join('-'));
    return today.toDateString() === lessonDate.toDateString();
  };

  // Handle fetching students when the "Điểm danh" button is clicked
  const handleAttendance = async (lessonId) => {
    if (loading) return; // Prevent duplicate calls during loading

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token'); // Get token from localStorage

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
            Authorization: `Bearer ${token}`, // Send token in header
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data from server');
      }

      const data = await response.json(); // Parse JSON data

      // Use the correct structure for the students list
      if (data.ListStudents) {
        setStudents(data.ListStudents); // Assuming the ListStudents field contains student info
        setSelectedLesson((prevSelectedLesson) =>
          prevSelectedLesson === lessonId ? null : lessonId
        );
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
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${lesson.status === 'Đã học'
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
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${loading && selectedLesson === lesson.id
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
                            <ul className="list-disc list-inside space-y-1">
                              {students.map((student) => (
                                <li
                                  key={student.student_id}
                                  className="text-sm text-gray-600"
                                >
                                  {student.student_name} - {student.status}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Không có sinh viên trong danh sách.
                            </p>
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
