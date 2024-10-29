import { Button } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ScheduleList = () => {
    const coursesData = [
        {
            id: "18.3",
            name: "Khóa 18.3",
            startDate: "01/09/2023",
            endDate: "30/06/2024",
            status: "Đang diễn ra",
            majors: [
                {
                    id: "cntt",
                    name: "Công nghệ thông tin",
                    subjects: [
                        {
                            id: "1",
                            name: "Nhập môn lập trình",
                            credits: 4,
                            code: "NMLT",
                            classes: [
                                {
                                    id: "1",
                                    teacher: "khanhpq01",
                                    schedule: [
                                        {
                                            day: "Thứ 2",
                                            time: "7:00 - 9:00",
                                            status: "Hết chỗ",
                                        },
                                        {
                                            day: "Thứ 3",
                                            time: "7:00 - 9:00",
                                            status: "Còn chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "2",
                            name: "Cơ sở dữ liệu",
                            credits: 3,
                            code: "CSDL",
                            classes: [
                                {
                                    id: "2",
                                    teacher: "hoangt01",
                                    schedule: [
                                        {
                                            day: "Thứ 2",
                                            time: "10:00 - 12:00",
                                            status: "Còn chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "3",
                            name: "Lập trình web",
                            credits: 3,
                            code: "LTWEB",
                            classes: [
                                {
                                    id: "3",
                                    teacher: "nguyenvp02",
                                    schedule: [
                                        {
                                            day: "Thứ 4",
                                            time: "13:00 - 15:00",
                                            status: "Còn chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "4",
                            name: "Mạng máy tính",
                            credits: 3,
                            code: "MMT",
                            classes: [
                                {
                                    id: "4",
                                    teacher: "tranmt03",
                                    schedule: [
                                        {
                                            day: "Thứ 5",
                                            time: "8:00 - 10:00",
                                            status: "Hết chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "kinhte",
                    name: "Kinh tế",
                    subjects: [
                        {
                            id: "5",
                            name: "Kinh tế vi mô",
                            credits: 3,
                            code: "KTVM",
                            classes: [
                                {
                                    id: "5",
                                    teacher: "nguyenkt04",
                                    schedule: [
                                        {
                                            day: "Thứ 2",
                                            time: "9:00 - 11:00",
                                            status: "Còn chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "6",
                            name: "Quản trị kinh doanh",
                            credits: 4,
                            code: "QTKD",
                            classes: [
                                {
                                    id: "6",
                                    teacher: "leminh05",
                                    schedule: [
                                        {
                                            day: "Thứ 3",
                                            time: "13:00 - 15:00",
                                            status: "Hết chỗ",
                                        },
                                        {
                                            day: "Thứ 5",
                                            time: "14:00 - 16:00",
                                            status: "Còn chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "7",
                            name: "Tài chính doanh nghiệp",
                            credits: 3,
                            code: "TCDN",
                            classes: [
                                {
                                    id: "8",
                                    teacher: "phamdn06",
                                    schedule: [
                                        {
                                            day: "Thứ 6",
                                            time: "10:00 - 12:00",
                                            status: "Còn chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "luat",
                    name: "Luật",
                    subjects: [
                        {
                            id: "8",
                            name: "Luật dân sự",
                            credits: 3,
                            code: "LDS",
                            classes: [],
                        },
                        {
                            id: "9",
                            name: "Luật thương mại",
                            credits: 3,
                            code: "LTM",
                            classes: [
                                {
                                    id: "10",
                                    teacher: "tranht08",
                                    schedule: [
                                        {
                                            day: "Thứ 3",
                                            time: "14:00 - 16:00",
                                            status: "Hết chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "19.3",
            name: "Khóa 19.3",
            startDate: "01/09/2024",
            endDate: "30/06/2025",
            status: "Sắp diễn ra",
            majors: [
                {
                    id: "cntt",
                    name: "Công nghệ thông tin",
                    subjects: [
                        {
                            id: "10",
                            name: "Hệ điều hành",
                            credits: 3,
                            code: "HĐH",
                            classes: [
                                {
                                    id: "11",
                                    teacher: "minhdn09",
                                    schedule: [
                                        {
                                            day: "Thứ 3",
                                            time: "10:00 - 12:00",
                                            status: "Còn chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: "11",
                            name: "Lập trình hướng đối tượng",
                            credits: 3,
                            code: "OOP",
                            classes: [
                                {
                                    id: "12",
                                    teacher: "tranan10",
                                    schedule: [
                                        {
                                            day: "Thứ 4",
                                            time: "9:00 - 11:00",
                                            status: "Hết chỗ",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const [expandedCourse, setExpandedCourse] = useState(null);
    const [expandedMajor, setExpandedMajor] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const navigate = useNavigate();

    const toggleCourse = (courseId) => {
        setExpandedCourse(expandedCourse === courseId ? null : courseId);
        setExpandedMajor(null);
        setSelectedSubject(null);
    };

    const toggleMajor = (majorId) => {
        setExpandedMajor(expandedMajor === majorId ? null : majorId);
        setSelectedSubject(null);
    };

    const selectSubject = (subjectId) => {
        setSelectedSubject(selectedSubject === subjectId ? null : subjectId);
    };

    const handleScheduleClick = (scheduleId) => {
        navigate(`details/${scheduleId}`);
    };

    return (
        <div className="mx-auto p-10 bg-blue-50 min-h-screen">
            <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-10">
                Quản lý lịch học
            </h2>

            <div className="space-y-8">
                {coursesData.map((course) => (
                    <div
                        key={course.id}
                        className="p-8 bg-white rounded-lg shadow-xl space-y-6"
                    >
                        <div
                            onClick={() => toggleCourse(course.id)}
                            className="cursor-pointer space-y-2"
                        >
                            <h3 className="text-3xl font-semibold">
                                {course.name}
                            </h3>
                            <p className="text-xl text-gray-600">
                                Ngày bắt đầu: {course.startDate}
                            </p>
                            <p className="text-xl text-gray-600">
                                Ngày kết thúc: {course.endDate}
                            </p>
                            <p
                                className={`text-xl font-semibold ${
                                    course.status === "Đang diễn ra"
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                }`}
                            >
                                {course.status}
                            </p>
                        </div>

                        {expandedCourse === course.id && (
                            <div className="mt-6 pl-6 space-y-6 border-l-4 border-blue-200">
                                {course.majors.map((major) => (
                                    <div key={major.id}>
                                        <button
                                            onClick={() =>
                                                toggleMajor(major.id)
                                            }
                                            className={`block w-full text-left px-6 py-4 rounded-lg text-2xl ${
                                                expandedMajor === major.id
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                        >
                                            {major.name}
                                        </button>

                                        {expandedMajor === major.id && (
                                            <div className="mt-4 pl-6 space-y-4 border-l-4 border-gray-200">
                                                {major.subjects.map(
                                                    (subject) => (
                                                        <div key={subject.id}>
                                                            <button
                                                                onClick={() =>
                                                                    selectSubject(
                                                                        subject.id
                                                                    )
                                                                }
                                                                className={`block w-full text-left px-6 py-4 rounded-lg text-xl ${
                                                                    selectedSubject ===
                                                                    subject.id
                                                                        ? "bg-blue-200 text-blue-900"
                                                                        : "bg-gray-100 hover:bg-gray-200"
                                                                }`}
                                                            >
                                                                {subject.name} -
                                                                Mã môn:{" "}
                                                                {subject.code} -
                                                                Tín chỉ:{" "}
                                                                {
                                                                    subject.credits
                                                                }
                                                            </button>

                                                            {selectedSubject ===
                                                                subject.id && (
                                                                <div className="mt-4 pl-6 space-y-3">
                                                                    {subject
                                                                        .classes
                                                                        .length ===
                                                                    0 ? (
                                                                        // Hiển thị nút "Tạo mới lịch học" ở giữa nếu không có lịch học
                                                                        <div className="flex justify-center items-center">
                                                                            <Button type="primary">
                                                                                <Link
                                                                                    // to={`/add?subject=${subject.id}`}
                                                                                    to={`add`}
                                                                                >
                                                                                    Tạo
                                                                                    lịch
                                                                                    học
                                                                                    mới
                                                                                </Link>
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        // Hiển thị danh sách lịch học và nút "Tạo mới" ở bên phải
                                                                        <>
                                                                            {subject.classes.map(
                                                                                (
                                                                                    classItem
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            classItem.id
                                                                                        }
                                                                                        className="p-4 border rounded-lg bg-gray-50 shadow-md"
                                                                                    >
                                                                                        <p className="font-semibold text-xl">
                                                                                            {
                                                                                                classItem.id
                                                                                            }{" "}
                                                                                            -{" "}
                                                                                            {
                                                                                                classItem.teacher
                                                                                            }
                                                                                        </p>
                                                                                        <div className="flex space-x-4 mt-4">
                                                                                            {classItem.schedule.map(
                                                                                                (
                                                                                                    sch,
                                                                                                    idx
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            idx
                                                                                                        }
                                                                                                        onClick={() =>
                                                                                                            handleScheduleClick(
                                                                                                                classItem.id
                                                                                                            )
                                                                                                        }
                                                                                                        className={`p-3 rounded-lg cursor-pointer ${
                                                                                                            sch.status ===
                                                                                                            "Còn chỗ"
                                                                                                                ? "bg-green-100"
                                                                                                                : "bg-red-100"
                                                                                                        } hover:bg-opacity-80`}
                                                                                                    >
                                                                                                        <p className="text-lg">
                                                                                                            {
                                                                                                                sch.day
                                                                                                            }{" "}
                                                                                                            -{" "}
                                                                                                            {
                                                                                                                sch.time
                                                                                                            }
                                                                                                        </p>
                                                                                                        <p
                                                                                                            className={`text-md font-semibold ${
                                                                                                                sch.status ===
                                                                                                                "Còn chỗ"
                                                                                                                    ? "text-green-700"
                                                                                                                    : "text-red-700"
                                                                                                            }`}
                                                                                                        >
                                                                                                            {
                                                                                                                sch.status
                                                                                                            }
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                            {/* Nút "Tạo mới lịch học" ở bên phải khi có lịch học */}
                                                                            <div className="flex justify-end mt-4">
                                                                                <Button type="primary">
                                                                                    <Link
                                                                                        // to={`/add?subject=${subject.id}`}
                                                                                        to={`add`}
                                                                                    >
                                                                                        Tạo
                                                                                        mới
                                                                                        lịch
                                                                                        học
                                                                                    </Link>
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleList;
