import React, { useState, useEffect } from "react";
import ListClassLessonDetail from "./ListClassLessonDetail";

const ListClassLessonPopup = ({ schedule, onClose, token }) => {
    const [scheduleDetail, setScheduleDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScheduleDetail = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/teacher/schedule/${schedule.id}/detail`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Không thể lấy chi tiết lịch dạy");
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
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="w-full h-full bg-white p-8 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h5 className="text-3xl font-bold text-gray-800">
                        Chi tiết lịch học
                    </h5>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                    >
                        <svg
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="px-4">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
                            <p className="text-xl text-gray-700">Đang tải...</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                                    />
                                </svg>
                            </div>
                            <p className="text-red-600 text-lg">{error}</p>
                        </div>
                    )}
                    {scheduleDetail && (
                        <ListClassLessonDetail scheduleData={scheduleDetail} />
                    )}
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-500 text-white text-lg font-semibold rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListClassLessonPopup;
