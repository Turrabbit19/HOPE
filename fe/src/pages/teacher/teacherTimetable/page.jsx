import React, { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    MapPin,
    Book,
    Info,
    AlertCircle,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherTimetable = () => {
    const [currentWeek, setCurrentWeek] = useState(() => new Date());
    const [selectedDay, setSelectedDay] = useState("");
    const [timetableData, setTimetableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);

    const navigate = useNavigate();
    const daysOfWeek = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ Nhật",
    ];
    const shifts = ["Ca 1", "Ca 2", "Ca 3", "Ca 4", "Ca 5", "Ca 6"];

    useEffect(() => {
        setSelectedDay(getCurrentDay());
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            fetchTimetableData(selectedSemester.id);
        }
    }, [selectedSemester]);

    const fetchSemesters = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Không tìm thấy token xác thực");
            }
            const response = await fetch(
                "http://127.0.0.1:8000/api/teacher/semesters",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Không thể tải danh sách kỳ học");
            }
            const data = await response.json();
            setSemesters(data.data || []);
            if (data.data && data.data.length > 0) {
                setSelectedSemester(data.data[0]);
            }
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tải danh sách kỳ học");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTimetableData = async (semesterId) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!semesterId) {
                setError("Không có kỳ học được chọn");
                setIsLoading(false);
                return;
            }
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Không tìm thấy token xác thực");
            }
            const response = await fetch(
                `http://127.0.0.1:8000/api/teacher/${semesterId}/timetable`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Không thể tải lịch dạy");
            }
            const data = await response.json();
            setTimetableData(data.data || []);
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tải lịch dạy");
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentDay = () => {
        const today = new Date().getDay();
        return daysOfWeek[today === 0 ? 6 : today - 1];
    };

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const handleNextWeek = () => {
        setCurrentWeek((prevWeek) => {
            const nextWeek = new Date(prevWeek);
            nextWeek.setDate(prevWeek.getDate() + 7);
            return nextWeek;
        });
    };

    const handlePreviousWeek = () => {
        setCurrentWeek((prevWeek) => {
            const previousWeek = new Date(prevWeek);
            previousWeek.setDate(prevWeek.getDate() - 7);
            return previousWeek;
        });
    };

    const handleGoToCurrentWeek = () => {
        const today = new Date();
        setCurrentWeek(today);
        setSelectedDay(getCurrentDay());
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getWeekDates = () => {
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    };

    const getScheduleForDayAndShift = (day, shift) => {
        if (!Array.isArray(timetableData)) {
            return undefined;
        }
        const dayDate = new Date(currentWeek);
        dayDate.setDate(
            currentWeek.getDate() -
                currentWeek.getDay() +
                daysOfWeek.indexOf(day) +
                1
        );
        const formattedDate = formatDate(dayDate);

        const schedule = timetableData.find(
            (item) => item.shift_name === shift
        );
        if (schedule) {
            const hasLessonOnDate = schedule.schedule_lessons.some(
                (lesson) => lesson.date === formattedDate
            );
            if (hasLessonOnDate) {
                return {
                    ...schedule,
                    subject_name: schedule.subject_name,
                    room_name: schedule.room_name,
                    classroom_code: schedule.classroom_code,
                };
            }
        }
        return undefined;
    };

    const getLessonForDate = (schedule, date) => {
        if (!schedule || !schedule.schedule_lessons) return null;
        return schedule.schedule_lessons.find((lesson) => lesson.date === date);
    };

    const openPopup = (schedule, lesson) => {
        setSelectedSchedule({ ...schedule, lesson });
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedSchedule(null);
    };

    const handleSemesterChange = (event) => {
        const semesterId = event.target.value;
        const semester = semesters.find(
            (sem) => sem.id === parseInt(semesterId)
        );
        setSelectedSemester(semester);
        setCurrentWeek(new Date(semester.start_date));
    };

    const handleEditSchedule = (selectedSchedule) => {
        navigate("/teacher/edit-schedule", {
            state: { schedule: selectedSchedule },
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Đã kết thúc":
                return "bg-green-100 border-green-200 text-green-700";
            case "Đang dạy":
                return "bg-yellow-100 border-red-200 text-red-700";
            case "Chưa tới":
                return "bg-gray-200 border-yellow-200 text-yellow-700";
            default:
                return "bg-gray-50 border-gray-200 text-gray-700";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
                <div className="max-w-md w-full bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-md flex items-center space-x-4">
                    <AlertCircle className="h-8 w-8" />
                    <span className="flex-1 text-lg">
                        <strong className="font-bold">Lỗi!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-gray-100 p-8">
            <div className=" mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleGoToCurrentWeek}
                            className="inline-flex items-center text-lg px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <Calendar className="h-6 w-6 mr-2" />
                            Tuần hiện tại
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center space-x-4">
                        <select
                            onChange={handleSemesterChange}
                            value={selectedSemester ? selectedSemester.id : ""}
                            className="text-lg block w-full md:w-auto pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                    {semester.name}
                                </option>
                            ))}
                        </select>

                        <select
                            onChange={handleDayChange}
                            value={selectedDay}
                            className="text-lg block w-full md:w-auto pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Tất cả các ngày</option>
                            {daysOfWeek.map((day) => (
                                <option key={day} value={day}>
                                    {day}{" "}
                                    {day === getCurrentDay() ? "(Hôm nay)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Week Navigation */}
                <div className="flex items-center justify-between p-5 bg-white rounded-md border border-gray-200 mb-8">
                    <button
                        onClick={handlePreviousWeek}
                        className="p-3 rounded-md bg-gray-100 hover:bg-gray-200"
                        aria-label="Previous week"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-lg text-gray-600">Tuần</span>
                        <span className="text-xl font-semibold text-gray-800">
                            {getWeekDates()}
                        </span>
                    </div>
                    <button
                        onClick={handleNextWeek}
                        className="p-3 rounded-md bg-gray-100 hover:bg-gray-200"
                        aria-label="Next week"
                    >
                        <ChevronRight className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                {/* Timetable */}
                <div className="bg-white rounded-md border border-gray-200 p-6">
                    {Array.isArray(timetableData) &&
                    timetableData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="h-14 w-14 text-yellow-500 mb-4" />
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                Không có dữ liệu lịch dạy
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Không có lịch dạy nào được tìm thấy cho kỳ học
                                này.
                            </p>
                        </div>
                    ) : selectedDay ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shifts.map((shift) => {
                                const schedule = getScheduleForDayAndShift(
                                    selectedDay,
                                    shift
                                );
                                const dayDate = new Date(currentWeek);
                                dayDate.setDate(
                                    currentWeek.getDate() -
                                        currentWeek.getDay() +
                                        daysOfWeek.indexOf(selectedDay) +
                                        1
                                );
                                const formattedDate = formatDate(dayDate);
                                const lesson = schedule
                                    ? getLessonForDate(schedule, formattedDate)
                                    : null;

                                return (
                                    <div
                                        key={shift}
                                        className={`relative p-6 rounded-md border ${
                                            lesson
                                                ? getStatusColor(lesson.status)
                                                : "bg-gray-50"
                                        }`}
                                    >
                                        <div className="absolute top-0 left-0 rounded-br-md bg-blue-600 text-white px-4 py-1 text-base font-semibold">
                                            {shift}
                                        </div>
                                        {schedule && lesson ? (
                                            <div className="mt-10">
                                                <h4 className="text-xl font-medium text-gray-800">
                                                    {schedule.subject_name}
                                                </h4>
                                                <p className="text-lg text-gray-600 mt-1">
                                                    {schedule.room_name}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        openPopup(
                                                            schedule,
                                                            lesson
                                                        )
                                                    }
                                                    className="mt-4 inline-flex items-center justify-center text-base px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                                >
                                                    Chi tiết
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-24 text-gray-400 text-lg">
                                                Không có lớp
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-base border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 z-10 bg-blue-100 px-6 py-4 text-left text-lg font-bold text-gray-600 uppercase border-b border-gray-200">
                                            Ca học
                                        </th>
                                        {daysOfWeek.map((day, index) => {
                                            const date = new Date(currentWeek);
                                            date.setDate(
                                                currentWeek.getDate() -
                                                    currentWeek.getDay() +
                                                    index +
                                                    1
                                            );
                                            return (
                                                <th
                                                    key={index}
                                                    className="bg-blue-100 px-6 py-4 text-center text-lg font-bold text-gray-600 uppercase border-b border-gray-200"
                                                >
                                                    <div>
                                                        <span>{day}</span>
                                                        <br />
                                                        <span className="text-base text-gray-500">
                                                            {formatDate(date)}
                                                        </span>
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {shifts.map((shift) => (
                                        <tr
                                            key={shift}
                                            className="border-b border-gray-100"
                                        >
                                            <td className="sticky left-0 bg-white border-r border-gray-200 px-6 py-4 font-semibold text-gray-700">
                                                {shift}
                                            </td>
                                            {daysOfWeek.map((day, dayIndex) => {
                                                const dayDate = new Date(
                                                    currentWeek
                                                );
                                                dayDate.setDate(
                                                    currentWeek.getDate() -
                                                        currentWeek.getDay() +
                                                        dayIndex +
                                                        1
                                                );
                                                const formattedDate =
                                                    formatDate(dayDate);
                                                const schedule =
                                                    getScheduleForDayAndShift(
                                                        day,
                                                        shift
                                                    );
                                                const lesson = schedule
                                                    ? getLessonForDate(
                                                          schedule,
                                                          formattedDate
                                                      )
                                                    : null;
                                                return (
                                                    <td
                                                        key={day}
                                                        className={`px-6 py-4 text-center align-top border-r border-gray-100 ${
                                                            lesson
                                                                ? getStatusColor(
                                                                      lesson.status
                                                                  )
                                                                : "bg-gray-50"
                                                        }`}
                                                    >
                                                        {schedule && lesson ? (
                                                            <div className="space-y-2">
                                                                <p className="font-semibold text-gray-800">
                                                                    {
                                                                        schedule.subject_name
                                                                    }
                                                                </p>
                                                                <p className="text-gray-600">
                                                                    {
                                                                        schedule.room_name
                                                                    }
                                                                </p>
                                                                <p className="text-base text-gray-500">
                                                                    {
                                                                        schedule.classroom_code
                                                                    }
                                                                </p>
                                                                <button
                                                                    onClick={() =>
                                                                        openPopup(
                                                                            schedule,
                                                                            lesson
                                                                        )
                                                                    }
                                                                    className="text-base bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                                                                >
                                                                    Chi tiết
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                Trống
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Popup Modal */}
            {showPopup && selectedSchedule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-7xl h-[50%] mx-4 bg-white rounded-xl shadow-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-500">
                            <h2 className="text-2xl font-semibold text-white flex items-center space-x-3">
                                <Info className="w-7 h-7" />
                                <span>Chi tiết lịch dạy </span>
                            </h2>
                            <button
                                onClick={closePopup}
                                className="text-white hover:text-gray-200 transition-colors duration-150"
                            >
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-5 text-gray-800 space-y-4">
                            <div className="flex items-center mt-6 text-2xl space-x-3">
                                <Book className="w-6 h-6 text-blue-500" />
                                <span>
                                    <span className="font-semibold">
                                        Môn học:
                                    </span>{" "}
                                    {selectedSchedule.subject_name}
                                </span>
                            </div>

                            <div className="flex items-center mt-6 text-2xl space-x-3">
                                <Clock className="w-6 h-6 text-blue-500" />
                                <span>
                                    <span className="font-semibold">
                                        Ca học:
                                    </span>{" "}
                                    {selectedSchedule.shift_name}
                                </span>
                            </div>

                            <div className="flex items-center mt-6 text-2xl space-x-3">
                                <MapPin className="w-6 h-6 text-blue-500" />
                                <span>
                                    <span className="font-semibold">
                                        Phòng học:
                                    </span>{" "}
                                    {selectedSchedule.room_name}
                                </span>
                            </div>

                            <div className="flex items-center mt-6 text-2xl space-x-3">
                                <Book className="w-6 h-6 text-blue-500" />
                                <span>
                                    <span className="font-semibold">
                                        Tiết học:
                                    </span>{" "}
                                    {selectedSchedule.lesson?.name}
                                </span>
                            </div>

                            <div className="flex items-center mt-6 text-2xl space-x-3">
                                <Info className="w-6 h-6 text-blue-500" />
                                <span>
                                    <span className="font-semibold">
                                        Nội dung:
                                    </span>{" "}
                                    {selectedSchedule.lesson?.description}
                                </span>
                            </div>

                            <div className="flex items-center mt-6 text-2xl space-x-3">
                                <Calendar className="w-6 h-6 text-blue-500" />
                                <span>
                                    <span className="font-semibold">Ngày:</span>{" "}
                                    {selectedSchedule.lesson?.date}
                                </span>
                            </div>

                            <div className="flex items-center mt-6 text-2xl space-x-3">
                                <Info className="w-6 h-6 text-blue-500" />
                                <span>
                                    <span className="font-semibold">
                                        Trạng thái:
                                    </span>{" "}
                                    {selectedSchedule.lesson?.status}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end px-6 py-4 border-t border-gray-200 space-x-4">
                            {selectedSchedule.lesson?.status === "Chưa tới" && (
                                <button
                                    onClick={() =>
                                        handleEditSchedule(selectedSchedule)
                                    }
                                    className="bg-indigo-600 text-white text-xl px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-150"
                                >
                                    Đổi lịch dạy
                                </button>
                            )}
                            <button
                                onClick={closePopup}
                                className="bg-gray-200 text-gray-700 text-lg px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-150"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherTimetable;
