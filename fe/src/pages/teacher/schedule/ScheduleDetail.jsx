import React from 'react';

const ScheduleDetail = ({ scheduleData }) => {
  const { ScheduleInfor } = scheduleData;

  // Hàm để kiểm tra xem một ngày có phải là ngày hiện tại không
  const isCurrentDate = (dateString) => {
    const today = new Date();
    const lessonDate = new Date(dateString.split('/').reverse().join('-'));
    return today.toDateString() === lessonDate.toDateString();
  };

  return (
    <div className="text-left">
      <h4 className="font-bold mb-2">{ScheduleInfor.subject_name}</h4>
      <p>Lớp học: {ScheduleInfor.classroom}</p>
      <p>Ca học: {ScheduleInfor.shift_name}</p>
      <p>Phòng: {ScheduleInfor.room_name}</p>
      <p>Liên kết: {ScheduleInfor.link}</p>
      <p>Thời gian: {ScheduleInfor.start_date} - {ScheduleInfor.end_date}</p>
      
      <h5 className="font-bold mt-4 mb-2">Danh sách buổi học:</h5>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ScheduleInfor.schedule_lessons.map((lesson) => (
            <tr key={lesson.id} className={isCurrentDate(lesson.date) ? 'bg-blue-100' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lesson.name}
                {isCurrentDate(lesson.date) && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Hôm nay
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lesson.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  lesson.status === 'Đã học' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {lesson.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleDetail;

