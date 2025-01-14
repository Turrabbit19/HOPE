"use client";
import React, { useState, useEffect } from "react";
import {
    AlertCircle,
    Clock,
    Users,
    BookOpen,
    MapPin,
    User as UserIcon,
} from "lucide-react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default function TeacherInfo() {
    const [teacher, setTeacher] = useState(null);
    const [todayLessons, setTodayLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        const fetchTeacherData = async () => {
            if (!token) return;
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/teacher",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Không thể lấy dữ liệu giảng viên");
                }
                const data = await response.json();
                setTeacher(data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(
                    err.response
                        ? `Lỗi: ${err.response.status} - ${err.response.statusText}`
                        : err.message
                );
                setLoading(false);
            }
        };

        const fetchTodayLessons = async () => {
            if (!token) {
                console.log("Token không có sẵn cho fetchTodayLessons");
                return;
            }
            try {
                console.log("Đang gửi yêu cầu lấy lịch học");
                const response = await fetch(
                    "http://127.0.0.1:8000/api/teacher/timetable",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        `Không thể lấy lịch dạy: ${response.status} ${response.statusText}`
                    );
                }
                const data = await response.json();
                const today = new Date();
                const todayString = today.toLocaleDateString("en-GB");
                const lessonsToday = data.data.flatMap((lesson) =>
                    lesson.schedule_lessons
                        .filter((lessonItem) => lessonItem.date === todayString)
                        .map((lessonItem) => ({
                            subject_name: lesson.subject_name,
                            class_name: lesson.classroom_code,
                            room_name: lesson.room_name,
                            lesson_name: lessonItem.name,
                            lesson_description: lessonItem.description,
                            lesson_date: lessonItem.date,
                            status: lessonItem.status,
                            start_time: lessonItem.start_time,
                            end_time: lessonItem.end_time,
                        }))
                );
                setTodayLessons(lessonsToday);
            } catch (err) {
                console.error("Lỗi khi lấy lịch học:", err);
                setError(err.message);
            }
        };

        fetchTeacherData();
        fetchTodayLessons();
    }, [token]);

    useEffect(() => {
        console.log("todayLessons đã được cập nhật:", todayLessons);
    }, [todayLessons]);

    const formatTime = (time) => {
        if (!time) return "N/A";
        const [hours, minutes] = time.split(":");
        if (!hours || !minutes) return "Invalid Time";
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    if (error)
        return (
            <div className="text-red-600 text-center p-6 text-xl">
                Lỗi: {error}
            </div>
        );
    if (!teacher)
        return (
            <div className="text-gray-600 text-center p-6 text-xl">
                Không có dữ liệu giảng viên
            </div>
        );

    return (
        <div className="">
            {" "}
            <div className="mx-auto p-6">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex">
                    <div className="w-1/3 bg-blue-50 p-6 border-r">
                        <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl max-w-full mx-auto font-sans">
                            <div className="flex items-center space-x-8 mb-8">
                                {/* {teacher.avatar ? (
                                    <img
                                        src={teacher.avatar}
                                        alt={teacher.name}
                                        className="w-28 h-28 rounded-full border-4 border-gray-300 shadow-md"
                                    />
                                ) : ( */}
                                <UserIcon className="w-28 h-28 text-gray-300 border-4 border-gray-300 rounded-full p-2" />
                                {/* )} */}
                                <div>
                                    <h2 className="text-3xl font-extrabold">
                                        {teacher.name}
                                    </h2>
                                    <p className="text-gray-500 text-lg mt-1">
                                        MGV: {teacher.teacher_code}
                                    </p>
                                    <p className="text-gray-500 text-lg">
                                        Ngành: {teacher.major_name}
                                    </p>
                                    <p className="text-gray-500 text-lg">
                                        Email: {teacher.email}
                                    </p>
                                    <span
                                        className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold ${
                                            teacher.status === "Hoạt động"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-red-200 text-red-800"
                                        }`}
                                    >
                                        {teacher.status}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-6 font-medium">
                                {[
                                    {
                                        icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
                                        label: "Số điện thoại",
                                        value: teacher.phone,
                                    },
                                    {
                                        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                                        label: "Ngày sinh",
                                        value: teacher.dob,
                                    },
                                    {
                                        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                                        label: "Giới tính",
                                        value: teacher.gender,
                                    },
                                    {
                                        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                                        label: "Dân tộc",
                                        value: teacher.ethnicity,
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-6 p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition"
                                    >
                                        <svg
                                            className="w-8 h-8 text-gray-400 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d={item.icon}
                                            ></path>
                                        </svg>
                                        <div className="grid grid-cols-2 gap-x-4 flex-grow">
                                            <span className="text-gray-700 font-semibold text-xl leading-none">
                                                {item.label}:
                                            </span>
                                            <span className="text-gray-900 text-lg break-words leading-none">
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tabs nằm bên phải - dùng một bộ Tabs duy nhất */}
                    <div className="w-2/3 p-6">
                        <Tabs>
                            <div className="bg-white rounded-xl shadow-lg mb-6">
                                <TabList className="flex space-x-4">
                                    <Tab
                                        className="py-4 px-6 text-lg font-medium transition-colors duration-200 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                        selectedClassName="bg-gray-100 text-black border-b-4 border-blue-500"
                                    >
                                        Thông tin giảng viên
                                    </Tab>
                                    <Tab
                                        className="py-4 px-6 text-lg font-medium transition-colors duration-200 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                        selectedClassName="bg-gray-100 text-black border-b-4 border-blue-500"
                                    >
                                        Lịch dạy hôm nay
                                    </Tab>
                                </TabList>
                            </div>

                            <TabPanel>
                                <div className="bg-white rounded-md shadow p-6 mt-4">
                                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                                        Thông tin chi tiết
                                    </h1>
                                    <table className="w-full text-left text-gray-700 border-t pt-4">
                                        <tbody>
                                            {[
                                                {
                                                    label: "Mã giảng viên",
                                                    value: teacher.teacher_code,
                                                },
                                                {
                                                    label: "Ngành",
                                                    value: teacher.major_name,
                                                },
                                                {
                                                    label: "Email",
                                                    value: teacher.email,
                                                },
                                                {
                                                    label: "Số điện thoại",
                                                    value: teacher.phone,
                                                },
                                                {
                                                    label: "Ngày sinh",
                                                    value: teacher.dob,
                                                },
                                                {
                                                    label: "Giới tính",
                                                    value: teacher.gender,
                                                },
                                                {
                                                    label: "Dân tộc",
                                                    value: teacher.ethnicity,
                                                },
                                            ].map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-gray-50"
                                                            : "bg-white"
                                                    }
                                                >
                                                    <td className="py-3 px-4 font-semibold w-1/3">
                                                        {item.label}:
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {item.value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <div className="bg-white rounded-md shadow p-6 mt-4">
                                    <h3 className="text-3xl font-bold mb-4 text-gray-800 text-center">
                                        Lịch dạy hôm nay (
                                        {new Date().toLocaleDateString(
                                            "vi-VN",
                                            {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            }
                                        )}
                                        )
                                    </h3>
                                    {todayLessons.length > 0 ? (
                                        <ul className="space-y-6">
                                            {todayLessons.map(
                                                (lesson, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-blue-50 rounded-lg shadow-md hover:bg-indigo-50 transition transform hover:scale-105"
                                                    >
                                                        <div className="flex-1">
                                                            <h4 className="text-xl font-bold mb-3 flex items-center text-gray-800">
                                                                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                                                {
                                                                    lesson.subject_name
                                                                }
                                                            </h4>
                                                            <p className="flex items-center text-gray-700 text-lg mb-2">
                                                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                                                <span className="font-semibold">
                                                                    Lớp:
                                                                </span>{" "}
                                                                {
                                                                    lesson.class_name
                                                                }
                                                            </p>
                                                            <p className="flex items-center text-gray-700 text-lg mb-2">
                                                                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                                                <span className="font-semibold">
                                                                    Thời gian:
                                                                </span>{" "}
                                                                {formatTime(
                                                                    lesson.start_time
                                                                )}{" "}
                                                                -{" "}
                                                                {formatTime(
                                                                    lesson.end_time
                                                                )}
                                                            </p>
                                                            <p className="flex items-center text-gray-700 text-lg mb-2">
                                                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                                                <span className="font-semibold">
                                                                    Phòng:
                                                                </span>{" "}
                                                                {
                                                                    lesson.room_name
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center mt-4 md:mt-0">
                                                            <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                                                            <span className="font-semibold text-gray-700 text-lg">
                                                                Trạng thái:
                                                            </span>{" "}
                                                            <span className="ml-1 text-gray-800 text-lg">
                                                                {lesson.status}
                                                            </span>
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
                                                <AlertCircle className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                                Không có lịch dạy hôm nay
                                            </h3>
                                            <p className="text-gray-600 text-center text-xl">
                                                Bạn không có buổi dạy nào được
                                                lên lịch cho ngày hôm nay.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
