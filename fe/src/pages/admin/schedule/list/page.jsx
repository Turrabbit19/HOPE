import { DownOutlined, RightOutlined } from "@ant-design/icons";
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
            semesters: [
                // Kỳ 1
                {
                    id: "1",
                    name: "Kỳ 1",
                    majors: [
                        // Ngành CNTT
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
                                            teacher: "atuandz",
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
                                    name: "Toán rời rạc",
                                    credits: 3,
                                    code: "TRR",
                                    classes: [
                                        {
                                            id: "2",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 4",
                                                    time: "9:00 - 11:00",
                                                    status: "Còn chỗ",
                                                },
                                                {
                                                    day: "Thứ 5",
                                                    time: "13:00 - 15:00",
                                                    status: "Hết chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    id: "3",
                                    name: "Anh văn cơ bản",
                                    credits: 2,
                                    code: "AVCB",
                                    classes: [
                                        {
                                            id: "3",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 6",
                                                    time: "15:00 - 17:00",
                                                    status: "Còn chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        // Ngành Kế toán
                        {
                            id: "ketoan",
                            name: "Kế toán",
                            subjects: [
                                {
                                    id: "4",
                                    name: "Nguyên lý kế toán",
                                    credits: 3,
                                    code: "NLKT",
                                    classes: [
                                        {
                                            id: "4",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 3",
                                                    time: "9:00 - 11:00",
                                                    status: "Còn chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    id: "5",
                                    name: "Kinh tế vi mô",
                                    credits: 3,
                                    code: "KTVM",
                                    classes: [
                                        {
                                            id: "5",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 4",
                                                    time: "13:00 - 15:00",
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
                // Kỳ 2
                {
                    id: "2",
                    name: "Kỳ 2",
                    majors: [
                        // Ngành CNTT
                        {
                            id: "cntt",
                            name: "Công nghệ thông tin",
                            subjects: [
                                {
                                    id: "6",
                                    name: "Cấu trúc dữ liệu và giải thuật",
                                    credits: 4,
                                    code: "CTDL-GT",
                                    classes: [
                                        {
                                            id: "6",
                                            teacher: "atuandz",
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
                                    id: "7",
                                    name: "Lập trình hướng đối tượng",
                                    credits: 4,
                                    code: "LTHDT",
                                    classes: [
                                        {
                                            id: "7",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 3",
                                                    time: "13:00 - 15:00",
                                                    status: "Hết chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        // Ngành QTKD
                        {
                            id: "qtkd",
                            name: "Quản trị kinh doanh",
                            subjects: [
                                {
                                    id: "8",
                                    name: "Marketing căn bản",
                                    credits: 3,
                                    code: "MKT",
                                    classes: [
                                        {
                                            id: "8",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 5",
                                                    time: "9:00 - 11:00",
                                                    status: "Còn chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    id: "9",
                                    name: "Quản trị học",
                                    credits: 3,
                                    code: "QTH",
                                    classes: [
                                        {
                                            id: "9",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 6",
                                                    time: "13:00 - 15:00",
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
                // Kỳ 3
                {
                    id: "3",
                    name: "Kỳ 3",
                    majors: [
                        // Ngành CNTT
                        {
                            id: "cntt",
                            name: "Công nghệ thông tin",
                            subjects: [
                                {
                                    id: "10",
                                    name: "Hệ điều hành",
                                    credits: 3,
                                    code: "HDH",
                                    classes: [
                                        {
                                            id: "10",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 2",
                                                    time: "13:00 - 15:00",
                                                    status: "Còn chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    id: "11",
                                    name: "Mạng máy tính",
                                    credits: 3,
                                    code: "MMT",
                                    classes: [
                                        {
                                            id: "11",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 3",
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
                // Kỳ 4
                {
                    id: "4",
                    name: "Kỳ 4",
                    majors: [
                        // Ngành CNTT
                        {
                            id: "cntt",
                            name: "Công nghệ thông tin",
                            subjects: [
                                {
                                    id: "12",
                                    name: "Cơ sở dữ liệu",
                                    credits: 4,
                                    code: "CSDL",
                                    classes: [
                                        {
                                            id: "12",
                                            teacher: "atuandz",
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
                                    id: "13",
                                    name: "Phát triển ứng dụng web",
                                    credits: 4,
                                    code: "PTUDW",
                                    classes: [
                                        {
                                            id: "13",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 5",
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
                // Kỳ 5
                {
                    id: "5",
                    name: "Kỳ 5",
                    majors: [
                        // Ngành CNTT
                        {
                            id: "cntt",
                            name: "Công nghệ thông tin",
                            subjects: [
                                {
                                    id: "14",
                                    name: "Phát triển phần mềm",
                                    credits: 4,
                                    code: "PTPM",
                                    classes: [
                                        {
                                            id: "14",
                                            teacher: "atuandz",
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
                                    id: "15",
                                    name: "An toàn thông tin",
                                    credits: 3,
                                    code: "ATTT",
                                    classes: [
                                        {
                                            id: "15",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 3",
                                                    time: "13:00 - 15:00",
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
                // Kỳ 6
                {
                    id: "6",
                    name: "Kỳ 6",
                    majors: [
                        // Ngành CNTT
                        {
                            id: "cntt",
                            name: "Công nghệ thông tin",
                            subjects: [
                                {
                                    id: "16",
                                    name: "Trí tuệ nhân tạo",
                                    credits: 4,
                                    code: "TTNT",
                                    classes: [
                                        {
                                            id: "16",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 4",
                                                    time: "9:00 - 11:00",
                                                    status: "Còn chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    id: "17",
                                    name: "Khoa học dữ liệu",
                                    credits: 4,
                                    code: "KHDT",
                                    classes: [
                                        {
                                            id: "17",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 5",
                                                    time: "13:00 - 15:00",
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
                // Kỳ 7
                {
                    id: "7",
                    name: "Kỳ 7",
                    majors: [
                        // Ngành CNTT
                        {
                            id: "cntt",
                            name: "Công nghệ thông tin",
                            subjects: [
                                {
                                    id: "18",
                                    name: "Đồ án tốt nghiệp",
                                    credits: 10,
                                    code: "DATN",
                                    classes: [
                                        {
                                            id: "18",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 6",
                                                    time: "9:00 - 11:00",
                                                    status: "Còn chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        // Khóa 19.3
        {
            id: "19.3",
            name: "Khóa 19.3",
            startDate: "01/09/2024",
            endDate: "30/06/2025",
            status: "Sắp diễn ra",
            semesters: [
                // Kỳ 1
                {
                    id: "1",
                    name: "Kỳ 1",
                    majors: [
                        // Ngành CNTT
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
                                            teacher: "atuandz",
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
                                    name: "Toán rời rạc",
                                    credits: 3,
                                    code: "TRR",
                                    classes: [
                                        {
                                            id: "2",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 4",
                                                    time: "9:00 - 11:00",
                                                    status: "Còn chỗ",
                                                },
                                                {
                                                    day: "Thứ 5",
                                                    time: "13:00 - 15:00",
                                                    status: "Hết chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        // Ngành QTKD
                        {
                            id: "qtkd",
                            name: "Quản trị kinh doanh",
                            subjects: [
                                {
                                    id: "3",
                                    name: "Kinh tế vi mô",
                                    credits: 3,
                                    code: "KTVM",
                                    classes: [
                                        {
                                            id: "3",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 3",
                                                    time: "9:00 - 11:00",
                                                    status: "Còn chỗ",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    id: "4",
                                    name: "Marketing căn bản",
                                    credits: 3,
                                    code: "MKT",
                                    classes: [
                                        {
                                            id: "4",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 4",
                                                    time: "13:00 - 15:00",
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
                // Kỳ 2
                {
                    id: "2",
                    name: "Kỳ 2",
                    majors: [
                        // Ngành CNTT
                        {
                            id: "cntt",
                            name: "Công nghệ thông tin",
                            subjects: [
                                {
                                    id: "5",
                                    name: "Cấu trúc dữ liệu và giải thuật",
                                    credits: 4,
                                    code: "CTDL-GT",
                                    classes: [
                                        {
                                            id: "5",
                                            teacher: "atuandz",
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
                                    name: "Lập trình hướng đối tượng",
                                    credits: 4,
                                    code: "LTHDT",
                                    classes: [
                                        {
                                            id: "6",
                                            teacher: "atuandz",
                                            schedule: [
                                                {
                                                    day: "Thứ 3",
                                                    time: "13:00 - 15:00",
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
                // Kỳ 3 đến Kỳ 7
                {
                    id: "3",
                    name: "Kỳ 3",
                    majors: [
                        // Dữ liệu giả cho Kỳ 3
                    ],
                },
                {
                    id: "4",
                    name: "Kỳ 4",
                    majors: [
                        // Dữ liệu giả cho Kỳ 4
                    ],
                },
                {
                    id: "5",
                    name: "Kỳ 5",
                    majors: [
                        // Dữ liệu giả cho Kỳ 5
                    ],
                },
                {
                    id: "6",
                    name: "Kỳ 6",
                    majors: [
                        // Dữ liệu giả cho Kỳ 6
                    ],
                },
                {
                    id: "7",
                    name: "Kỳ 7",
                    majors: [
                        // Dữ liệu giả cho Kỳ 7
                    ],
                },
            ],
        },
    ];

    const [expandedCourse, setExpandedCourse] = useState(null);
    const [expandedSemester, setExpandedSemester] = useState(null);
    const [expandedMajor, setExpandedMajor] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const navigate = useNavigate();

    const toggleCourse = (courseId) => {
        setExpandedCourse(expandedCourse === courseId ? null : courseId);
        setExpandedSemester(null);
        setExpandedMajor(null);
        setSelectedSubject(null);
    };

    const toggleSemester = (semesterId) => {
        setExpandedSemester(
            expandedSemester === semesterId ? null : semesterId
        );
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
                                {course.semesters.map((semester) => (
                                    <div key={semester.id}>
                                        <div
                                            onClick={() =>
                                                toggleSemester(semester.id)
                                            }
                                            className="cursor-pointer flex justify-between items-center space-x-2 p-3 rounded"
                                            style={{
                                                backgroundColor:
                                                    expandedSemester ===
                                                    semester.id
                                                        ? "#BFDBFE"
                                                        : "transparent",
                                            }}
                                        >
                                            <h4 className="text-3xl font-bold">
                                                {semester.name}
                                            </h4>
                                            {expandedSemester ===
                                            semester.id ? (
                                                <DownOutlined className="text-2xl" />
                                            ) : (
                                                <RightOutlined className="text-2xl" />
                                            )}
                                        </div>

                                        {expandedSemester === semester.id && (
                                            <div className="mt-4 ml-6 border-l-4 border-blue-300">
                                                {semester.majors.map(
                                                    (major) => (
                                                        <div
                                                            key={major.id}
                                                            className="mt-4"
                                                        >
                                                            <div
                                                                onClick={() =>
                                                                    toggleMajor(
                                                                        major.id
                                                                    )
                                                                }
                                                                className="cursor-pointer flex items-center space-x-2 p-3 rounded"
                                                                style={{
                                                                    backgroundColor:
                                                                        expandedMajor ===
                                                                        major.id
                                                                            ? "#D1FAE5"
                                                                            : "transparent",
                                                                }}
                                                            >
                                                                <h5 className="text-2xl font-semibold">
                                                                    {major.name}
                                                                </h5>
                                                                {expandedMajor ===
                                                                major.id ? (
                                                                    <DownOutlined className="text-2xl" />
                                                                ) : (
                                                                    <RightOutlined className="text-2xl" />
                                                                )}
                                                            </div>

                                                            {expandedMajor ===
                                                                major.id && (
                                                                <div className="mt-4 ml-6 border-l-4 border-green-300">
                                                                    {major.subjects.map(
                                                                        (
                                                                            subject
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    subject.id
                                                                                }
                                                                                className="mt-4"
                                                                            >
                                                                                <div
                                                                                    onClick={() =>
                                                                                        selectSubject(
                                                                                            subject.id
                                                                                        )
                                                                                    }
                                                                                    className="cursor-pointer flex items-center space-x-2 p-3 rounded"
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            selectedSubject ===
                                                                                            subject.id
                                                                                                ? "#FEF3C7"
                                                                                                : "transparent",
                                                                                    }}
                                                                                >
                                                                                    <p className="text-xl font-semibold">
                                                                                        {
                                                                                            subject.name
                                                                                        }{" "}
                                                                                        -
                                                                                        Mã
                                                                                        môn:{" "}
                                                                                        {
                                                                                            subject.code
                                                                                        }{" "}
                                                                                        -
                                                                                        Tín
                                                                                        chỉ:{" "}
                                                                                        {
                                                                                            subject.credits
                                                                                        }
                                                                                    </p>
                                                                                    {selectedSubject ===
                                                                                    subject.id ? (
                                                                                        <DownOutlined className="text-2xl" />
                                                                                    ) : (
                                                                                        <RightOutlined className="text-2xl" />
                                                                                    )}
                                                                                </div>

                                                                                {selectedSubject ===
                                                                                    subject.id && (
                                                                                    <div className="mt-4 ml-6">
                                                                                        {subject
                                                                                            .classes
                                                                                            .length ===
                                                                                        0 ? (
                                                                                            <div className="flex justify-center items-center">
                                                                                                <Button
                                                                                                    type="primary"
                                                                                                    size="large"
                                                                                                >
                                                                                                    <Link
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
                                                                                            <>
                                                                                                {subject.classes.map(
                                                                                                    (
                                                                                                        classItem
                                                                                                    ) => (
                                                                                                        <div
                                                                                                            key={
                                                                                                                classItem.id
                                                                                                            }
                                                                                                            className="p-4 border rounded-lg bg-gray-50 shadow-md mt-4"
                                                                                                        >
                                                                                                            <p className="font-semibold text-xl">
                                                                                                                Lớp:{" "}
                                                                                                                {
                                                                                                                    classItem.id
                                                                                                                }{" "}
                                                                                                                -
                                                                                                                Giảng
                                                                                                                viên:{" "}
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
                                                                                                                                    ? "bg-green-300"
                                                                                                                                    : "bg-red-300"
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
                                                                                                                                className={`text-lg font-bold ${
                                                                                                                                    sch.status ===
                                                                                                                                    "Còn chỗ"
                                                                                                                                        ? "text-green-900"
                                                                                                                                        : "text-red-900"
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
                                                                                                <div className="flex justify-end mt-4">
                                                                                                    <Button
                                                                                                        type="primary"
                                                                                                        size="large"
                                                                                                    >
                                                                                                        <Link
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
