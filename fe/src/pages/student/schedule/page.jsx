"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    addWeeks,
    subWeeks,
    format,
    startOfWeek,
    endOfWeek,
    addDays,
    isBefore,
    isAfter,
    eachWeekOfInterval,
    getWeek,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    User,
    Book,
    MapPin,
    LinkIcon,
} from "lucide-react";
import { Alert, Descriptions } from "antd";

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-40 w-40 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}

export default function DashboardActions() {
    const [currentWeek, setCurrentWeek] = useState(() => new Date());
    const [selectedDay, setSelectedDay] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [semesterStartDate, setSemesterStartDate] = useState(null);
    const [semesterEndDate, setSemesterEndDate] = useState(null);
    const [notification, setNotification] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);

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
            fetchSchedules();
        }
    }, [selectedSemester]);

    useEffect(() => {
        if (semesterStartDate && semesterEndDate) {
            const weeksList = eachWeekOfInterval(
                { start: semesterStartDate, end: semesterEndDate },
                { weekStartsOn: 1 }
            );
            setWeeks(weeksList);
            setSelectedWeek(weeksList[0]);
            setCurrentWeek(weeksList[0]);
        }
    }, [semesterStartDate, semesterEndDate]);

    const fetchSemesters = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Không tìm thấy token xác thực");
            }

            const response = await fetch(
                "http://localhost:8000/api/student/semesters",
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
                const currentSemester = data.data.find((sem) => {
                    const startDate = new Date(
                        sem.start_date.split("/").reverse().join("-")
                    );
                    const endDate = new Date(
                        sem.end_date.split("/").reverse().join("-")
                    );
                    const today = new Date();
                    return (
                        isBefore(today, endDate) && isAfter(today, startDate)
                    );
                });

                if (currentSemester) {
                    setSelectedSemester(currentSemester.id.toString());
                    setSemesterStartDate(
                        new Date(
                            currentSemester.start_date
                                .split("/")
                                .reverse()
                                .join("-")
                        )
                    );
                    setSemesterEndDate(
                        new Date(
                            currentSemester.end_date
                                .split("/")
                                .reverse()
                                .join("-")
                        )
                    );
                    setCurrentWeek(new Date());
                } else {
                    setSelectedSemester(data.data[0].id.toString());
                    setSemesterStartDate(
                        new Date(
                            data.data[0].start_date
                                .split("/")
                                .reverse()
                                .join("-")
                        )
                    );
                    setSemesterEndDate(
                        new Date(
                            data.data[0].end_date.split("/").reverse().join("-")
                        )
                    );
                    setCurrentWeek(
                        new Date(
                            data.data[0].start_date
                                .split("/")
                                .reverse()
                                .join("-")
                        )
                    );
                }
            }
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tải danh sách kỳ học");
        }
    };

    const fetchSchedules = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Không tìm thấy token xác thực");
            }

            if (!selectedSemester) {
                setSchedules([]);
                return;
            }

            const response = await fetch(
                `http://localhost:8000/api/student/${selectedSemester}/timetable`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Token không hợp lệ hoặc đã hết hạn");
                }
                throw new Error("Không thể tải lịch học");
            }

            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
                setSchedules(data.data);
            } else {
                setSchedules([]);
            }
        } catch (err) {
            if (
                err.message.includes('Attempt to read property "user" on null')
            ) {
                setError("Lỗi xác thực người dùng. Vui lòng đăng nhập lại.");
            } else {
                setError(err.message || "Đã xảy ra lỗi khi tải lịch học");
            }
            setSchedules([]);
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
        setSelectedWeek((prevWeek) => {
            const nextWeekIndex =
                weeks.findIndex((week) => week === prevWeek) + 1;
            if (nextWeekIndex < weeks.length) {
                return weeks[nextWeekIndex];
            }
            setNotification("Đã đến cuối kỳ học");
            setTimeout(() => setNotification(null), 3000);
            return prevWeek;
        });
    };

    const handlePreviousWeek = () => {
        setSelectedWeek((prevWeek) => {
            const prevWeekIndex =
                weeks.findIndex((week) => week === prevWeek) - 1;
            if (prevWeekIndex >= 0) {
                return weeks[prevWeekIndex];
            }
            setNotification("Đã đến đầu kỳ học");
            setTimeout(() => setNotification(null), 3000);
            return prevWeek;
        });
    };

    const handleGoToCurrentWeek = () => {
        const today = new Date();
        if (semesterStartDate && semesterEndDate) {
            if (
                isAfter(today, semesterStartDate) &&
                isBefore(today, semesterEndDate)
            ) {
                const currentWeekIndex = weeks.findIndex((week) =>
                    isBefore(today, addWeeks(week, 1))
                );
                setSelectedWeek(weeks[currentWeekIndex]);
            } else if (isBefore(today, semesterStartDate)) {
                setSelectedWeek(weeks[0]);
            } else {
                setSelectedWeek(weeks[weeks.length - 1]);
            }
        }
        setSelectedDay(getCurrentDay());
    };

    const handleSemesterChange = (event) => {
        const selectedSemesterId = event.target.value;
        setSelectedSemester(selectedSemesterId);
        setSchedules([]);

        const selectedSemesterData = semesters.find(
            (sem) => sem.id.toString() === selectedSemesterId
        );
        if (selectedSemesterData) {
            const startDate = new Date(
                selectedSemesterData.start_date.split("/").reverse().join("-")
            );
            const endDate = new Date(
                selectedSemesterData.end_date.split("/").reverse().join("-")
            );
            setSemesterStartDate(startDate);
            setSemesterEndDate(endDate);
            const weeksList = eachWeekOfInterval(
                { start: startDate, end: endDate },
                { weekStartsOn: 1 }
            );
            setWeeks(weeksList);
            setSelectedWeek(weeksList[0]);
        } else {
            setSemesterStartDate(null);
            setSemesterEndDate(null);
            setWeeks([]);
            setSelectedWeek(null);
        }
    };

    const handleWeekChange = (event) => {
        const selectedWeekIndex = parseInt(event.target.value, 10);
        setSelectedWeek(weeks[selectedWeekIndex]);
    };

    const startOfCurrentWeek = useMemo(
        () => startOfWeek(selectedWeek || currentWeek, { weekStartsOn: 1 }),
        [selectedWeek, currentWeek]
    );
    const endOfCurrentWeek = useMemo(
        () => endOfWeek(selectedWeek || currentWeek, { weekStartsOn: 1 }),
        [selectedWeek, currentWeek]
    );

    const getScheduleForDayAndShift = (day, shift) => {
        const dayDate = format(
            addDays(startOfCurrentWeek, daysOfWeek.indexOf(day)),
            "dd/MM/yyyy"
        );
        return schedules.find(
            (schedule) =>
                schedule.shift_name === shift &&
                schedule.schedule_lessons.some(
                    (lesson) => lesson.date === dayDate
                )
        );
    };

    const getLessonForDate = (schedule, date) => {
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

    const getStatusColor = (status) => {
        switch (status) {
            case "Có mặt":
                return "bg-green-100 text-green-800";
            case "Vắng":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <p className="text-center py-8 text-red-500 text-3xl font-semibold">
                Lỗi: {error}
            </p>
        );
    }

    return (
        <div className=" bg-gray-50 py-8">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                {notification && (
                    <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg text-xl font-medium animate-fade-in">
                        {notification}
                    </div>
                )}
                <div className="bg-gray-100 shadow-xl rounded-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0 lg:space-x-4">
                            <button
                                onClick={handleGoToCurrentWeek}
                                className="inline-flex items-center text-lg px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Calendar className="h-6 w-6 mr-2" />
                                Tuần hiện tại
                            </button>

                            <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-x-6 lg:space-y-0">
                                <select
                                    onChange={handleSemesterChange}
                                    value={selectedSemester}
                                    className="w-full lg:w-auto px-6 py-3 bg-white text-blue-600 text-xl font-semibold rounded-lg hover:bg-blue-50 transition duration-300 shadow-md border-2 border-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {semesters.map((semester) => (
                                        <option
                                            key={semester.id}
                                            value={semester.id}
                                        >
                                            {semester.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    onChange={handleWeekChange}
                                    value={weeks.findIndex(
                                        (week) => week === selectedWeek
                                    )}
                                    className="w-full lg:w-auto px-6 py-3 bg-white text-blue-600 text-xl font-semibold rounded-lg hover:bg-blue-50 transition duration-300 shadow-md border-2 border-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {weeks.map((week, index) => (
                                        <option key={index} value={index}>
                                            Tuần {index + 1}:{" "}
                                            {format(week, "dd/MM/yyyy")} -{" "}
                                            {format(
                                                addDays(week, 6),
                                                "dd/MM/yyyy"
                                            )}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    onChange={handleDayChange}
                                    value={selectedDay}
                                    className="w-full lg:w-auto px-6 py-3 bg-white text-blue-600 text-xl font-semibold rounded-lg hover:bg-blue-50 transition duration-300 shadow-md border-2 border-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tất cả các ngày</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day} value={day}>
                                            {day}{" "}
                                            {day === getCurrentDay()
                                                ? "(Hôm nay)"
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-white rounded-md border border-gray-200 mb-8">
                            <button
                                onClick={handlePreviousWeek}
                                className="p-3 rounded-md bg-gray-100 hover:bg-gray-200"
                                aria-label="Previous week"
                            >
                                <ChevronLeft className="h-6 w-6 text-gray-600" />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-gray-600 mb-2 text-xl font-medium">
                                    {selectedSemester
                                        ? "Thời gian học kỳ"
                                        : "Tuần hiện tại"}
                                </span>
                                <div className="text-center font-bold text-gray-800 text-2xl">
                                    {semesterStartDate && semesterEndDate
                                        ? `${format(
                                              startOfCurrentWeek,
                                              "dd/MM/yyyy",
                                              {
                                                  locale: vi,
                                              }
                                          )} - ${format(
                                              endOfCurrentWeek,
                                              "dd/MM/yyyy",
                                              {
                                                  locale: vi,
                                              }
                                          )}`
                                        : `${format(
                                              startOfCurrentWeek,
                                              "dd/MM/yyyy",
                                              {
                                                  locale: vi,
                                              }
                                          )} - ${format(
                                              endOfCurrentWeek,
                                              "dd/MM/yyyy",
                                              {
                                                  locale: vi,
                                              }
                                          )}`}
                                </div>
                            </div>
                            <button
                                onClick={handleNextWeek}
                                className="p-3 rounded-md bg-gray-100 hover:bg-gray-200"
                                aria-label="Next week"
                            >
                                <ChevronRight className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        {selectedDay ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {shifts.map((shift) => {
                                    const schedule = getScheduleForDayAndShift(
                                        selectedDay,
                                        shift
                                    );
                                    const dayDate = format(
                                        addDays(
                                            startOfCurrentWeek,
                                            daysOfWeek.indexOf(selectedDay)
                                        ),
                                        "dd/MM/yyyy"
                                    );
                                    {
                                        /* ok oke oke */
                                    }
                                    const lesson = schedule
                                        ? getLessonForDate(schedule, dayDate)
                                        : null;
                                    return (
                                        <div
                                            key={shift}
                                            className={`relative p-6 rounded-md border ${
                                                lesson
                                                    ? getStatusColor(
                                                          lesson.status
                                                      )
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
                            <div className="overflow-x-auto mt-8 bg-white rounded-xl shadow-lg">
                                {schedules.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 text-3xl font-medium">
                                        Chưa có lịch học cho kỳ này
                                    </div>
                                ) : (
                                    <table className="w-full text-center">
                                        <thead>
                                            <tr className="bg-blue-50">
                                                <th className="p-4 font-semibold text-gray-700 text-center sticky left-0 bg-blue-50 z-10 text-2xl">
                                                    Ca học
                                                </th>
                                                {daysOfWeek.map(
                                                    (day, index) => (
                                                        <th
                                                            key={index}
                                                            className="p-4 text-center font-semibold text-gray-700 text-2xl"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span>
                                                                    {day}
                                                                </span>
                                                                <span className="text-gray-500 font-normal text-xl">
                                                                    {format(
                                                                        addDays(
                                                                            startOfCurrentWeek,
                                                                            index
                                                                        ),
                                                                        "dd/MM",
                                                                        {
                                                                            locale: vi,
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shifts.map((shift) => (
                                                <tr
                                                    key={shift}
                                                    className="hover:bg-gray-50 transition-colors duration-300"
                                                >
                                                    <td className="p-4 text-gray-700 font-medium text-xl">
                                                        {shift}
                                                    </td>
                                                    {daysOfWeek.map(
                                                        (day, dayIndex) => {
                                                            const dayDate =
                                                                format(
                                                                    addDays(
                                                                        startOfCurrentWeek,
                                                                        dayIndex
                                                                    ),
                                                                    "dd/MM/yyyy"
                                                                );
                                                            const schedule =
                                                                getScheduleForDayAndShift(
                                                                    day,
                                                                    shift
                                                                );
                                                            const lesson =
                                                                schedule
                                                                    ? getLessonForDate(
                                                                          schedule,
                                                                          dayDate
                                                                      )
                                                                    : null;
                                                            return (
                                                                <td
                                                                    key={day}
                                                                    className={`${
                                                                        lesson
                                                                            ? getStatusColor(
                                                                                  lesson.status
                                                                              )
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {schedule &&
                                                                    lesson ? (
                                                                        <div
                                                                            onClick={() =>
                                                                                openPopup(
                                                                                    schedule,
                                                                                    lesson
                                                                                )
                                                                            }
                                                                            className=" p-4 shadow-md cursor-pointer hover:bg-gray-100 transition duration-300"
                                                                        >
                                                                            <p className="text-lg font-semibold">
                                                                                {
                                                                                    schedule.room_name
                                                                                }
                                                                            </p>
                                                                            <p className="text-lg">
                                                                                {
                                                                                    schedule.subject_name
                                                                                }
                                                                            </p>
                                                                            <p className="text-lg">
                                                                                {
                                                                                    schedule.classroom_code
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-gray-400 text-lg">
                                                                            Trống
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        }
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {showPopup && selectedSchedule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                        <div className="bg-white rounded-xl max-w-5xl w-full shadow-2xl transform transition-all animate-scale-in">
                            <div className="p-8">
                                <Alert
                                    message="Thông tin chi tiết lịch học"
                                    type="success"
                                    showIcon
                                    className="mb-6"
                                />
                                <Descriptions
                                    bordered
                                    column={1}
                                    size="small"
                                    labelStyle={{
                                        width: "30%",
                                        fontWeight: "bold",
                                    }}
                                    contentStyle={{ width: "70%" }}
                                >
                                    <Descriptions.Item label="Giảng viên">
                                        {selectedSchedule.lesson.teacher_name}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Môn học">
                                        {selectedSchedule.subject_name}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Ca học">
                                        {selectedSchedule.shift_name}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Tiết học">
                                        {selectedSchedule.lesson.name}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Nội dung">
                                        {selectedSchedule.lesson.description}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Ngày">
                                        {selectedSchedule.lesson.date}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Trạng thái">
                                        {/* Giữ logic getStatusColor, chỉ hiển thị status kèm màu */}
                                        <span
                                            className={`${getStatusColor(
                                                selectedSchedule.lesson.status
                                            )} ml-2`}
                                        >
                                            {selectedSchedule.lesson.status}
                                        </span>
                                    </Descriptions.Item>

                                    {/* Kiểm tra nếu link !== "NULL" thì mới hiển thị */}
                                    {selectedSchedule.link !== "NULL" && (
                                        <Descriptions.Item label="Link">
                                            <a
                                                href={selectedSchedule.link}
                                                className="text-blue-500 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {selectedSchedule.link}
                                            </a>
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>
                            </div>

                            {/* Footer button đóng popup */}
                            <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse rounded-b-xl">
                                <button
                                    onClick={closePopup}
                                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-md px-6 py-3 bg-blue-600 text-xl font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-xl transition duration-300"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
