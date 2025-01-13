"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, Users, BookOpen, MapPin } from "lucide-react";
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
        <div className=" mx-auto  px-4">
            <Tabs>
                <TabList>
                    <Tab>Thông tin giảng viên</Tab>
                    <Tab>Lịch dạy hôm nay</Tab>
                </TabList>

                <TabPanel>
                    <div className="bg-white rounded-md shadow p-6 mt-4">
                        <div className="flex flex-col items-center mb-6">
                            <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-32 h-32 rounded-full object-cover shadow-lg"
                            />
                            <h1 className="text-3xl font-bold mt-4 text-gray-800">
                                {teacher.name}
                            </h1>
                            <p className="text-xl font-semibold text-gray-600 mt-2">
                                Chuyên Ngành :{teacher.major_name}
                            </p>
                            <span
                                className={`inline-block mt-3 px-4 py-2 rounded-full text-md font-semibold ${
                                    teacher.status === "Hoạt động"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-red-200 text-red-800"
                                }`}
                            >
                                {teacher.status}
                            </span>
                        </div>
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
                                    { label: "Email", value: teacher.email },
                                    {
                                        label: "Số điện thoại",
                                        value: teacher.phone,
                                    },
                                    { label: "Ngày sinh", value: teacher.dob },
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
                            {new Date().toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                            )
                        </h3>
                        {todayLessons.length > 0 ? (
                            <div className="space-y-6">
                                {todayLessons.map((lesson, index) => (
                                    <div
                                        key={index}
                                        className="border-l-4 border-blue-400 bg-blue-50 rounded p-4"
                                    >
                                        <h4 className="text-xl font-bold mb-3 flex items-center text-gray-800">
                                            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                            {lesson.subject_name}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                            <p className="flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="font-semibold">
                                                    Lớp:
                                                </span>{" "}
                                                {lesson.class_name}
                                            </p>
                                            <p className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="font-semibold">
                                                    Thời gian:
                                                </span>{" "}
                                                {formatTime(lesson.start_time)}{" "}
                                                - {formatTime(lesson.end_time)}
                                            </p>
                                            <p className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="font-semibold">
                                                    Phòng:
                                                </span>{" "}
                                                {lesson.room_name}
                                            </p>
                                            <p className="flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                                                <span className="font-semibold">
                                                    Trạng thái:
                                                </span>{" "}
                                                {lesson.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Không có lịch dạy hôm nay
                                </h3>
                                <p className="text-gray-600 text-center text-xl">
                                    Bạn không có buổi dạy nào được lên lịch cho
                                    ngày hôm nay.
                                </p>
                            </div>
                        )}
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
}
