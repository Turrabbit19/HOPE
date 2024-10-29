import React, { useState } from "react";
import { Link } from "react-router-dom";

const coursesData = [
    {
        id: "18.3",
        name: "Khóa 18.3",
        startDate: "01/09/2023",
        endDate: "30/06/2024",
        status: "Đang diễn ra",
        majors: [
            {
                id: "1",
                name: "Công nghệ thông tin",
                subjects: [
                    {
                        id: "1",
                        name: "Nhập môn lập trình",
                        credits: 4,
                        code: "NMLT",
                        classes: [
                            {
                                id: "NMLT01",
                                teacher: "ktuanlaph19427",
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
                                id: "CSDL01",
                                teacher: "tuanlaph19427",
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
                                id: "LTWEB01",
                                teacher: "ngtuanlaph19427",
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
                                id: "MMT01",
                                teacher: "tuanlaph19427",
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
                id: "2",
                name: "Kinh tế",
                subjects: [
                    {
                        id: "5",
                        name: "Kinh tế vi mô",
                        credits: 3,
                        code: "KTVM",
                        classes: [
                            {
                                id: "KTVM01",
                                teacher: "ngtuanlaph19427",
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
                                id: "QTKD01",
                                teacher: "tuanlaph19427",
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
                                id: "TCDN01",
                                teacher: "tuanlaph19427",
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
                id: "3",
                name: "Luật",
                subjects: [
                    {
                        id: "8",
                        name: "Luật dân sự",
                        credits: 3,
                        code: "LDS",
                        classes: [
                            {
                                id: "LDS01",
                                teacher: "htuanlaph19427",
                                schedule: [
                                    {
                                        day: "Thứ 2",
                                        time: "8:00 - 10:00",
                                        status: "Còn chỗ",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: "9",
                        name: "Luật thương mại",
                        credits: 3,
                        code: "LTM",
                        classes: [
                            {
                                id: "LTM01",
                                teacher: "tuanlaph19427",
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
                id: "1",
                name: "Công nghệ thông tin",
                subjects: [
                    {
                        id: "10",
                        name: "Hệ điều hành",
                        credits: 3,
                        code: "HĐH",
                        classes: [
                            {
                                id: "HDH01",
                                teacher: "tuanlaph19427",
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
                                id: "OOP01",
                                teacher: "tuanlaph19427",
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

const ScheduleList = () => {
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [expandedMajor, setExpandedMajor] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

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
                                                                                                className={`p-3 rounded-lg ${
                                                                                                    sch.status ===
                                                                                                    "Còn chỗ"
                                                                                                        ? "bg-green-100"
                                                                                                        : "bg-red-100"
                                                                                                }`}
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
                                                                                {/* Nút Sửa lịch học và Chi tiết */}
                                                                                <div className="mt-4 flex justify-end space-x-4">
                                                                                    <button className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-md hover:bg-blue-600 transition">
                                                                                        <Link
                                                                                            to={`edit/${subject.id}`}
                                                                                        >
                                                                                            Sửa
                                                                                            lịch
                                                                                            học
                                                                                        </Link>
                                                                                    </button>
                                                                                    <button className="px-6 py-3 bg-gray-500 text-white font-semibold text-lg rounded-md hover:bg-gray-600 transition">
                                                                                        <Link
                                                                                            to={`details/${subject.id}`}
                                                                                        >
                                                                                            Chi
                                                                                            tiết
                                                                                        </Link>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )
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

            <button className="mt-12 px-10 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-2xl rounded-full mx-auto block shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300">
                <Link to={`add`}>Tạo lịch học mới</Link>
            </button>
        </div>
    );
};

export default ScheduleList;
