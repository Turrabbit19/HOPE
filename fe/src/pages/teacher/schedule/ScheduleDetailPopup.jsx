import React, { useState, useEffect } from 'react';
import ScheduleDetail from './ScheduleDetail';

const ScheduleDetailPopup = ({ schedule, onClose, token }) => {
  const [scheduleDetail, setScheduleDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduleDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/teacher/schedule/${schedule.id}/detail`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error('Không thể lấy chi tiết lịch học');
        }
        const data = await response.json();
        setScheduleDetail(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScheduleDetail();
  }, [schedule.id, token]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Chi tiết lịch học</h3>
          <div className="mt-2 px-7 py-3">
            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-500">Lỗi: {error}</p>}
            {scheduleDetail && <ScheduleDetail scheduleData={scheduleDetail} />}
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailPopup;

