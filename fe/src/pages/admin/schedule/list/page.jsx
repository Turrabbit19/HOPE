import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const semestersData = [
    // Kỳ 1
    {
        id: "1",
        name: "Kỳ 1",
        startDate: "01/09/2023",
        endDate: "31/12/2023",
        status: "Kết thúc",
        courses: [
            {
                id: "18.3",
                name: "Khóa 18.3",
                majors: [
                    // Ngành Công nghệ thông tin
                    {
                        id: "cntt",
                        name: "Công nghệ thông tin",
                        subjects: [
                            {
                                id: "1",
                                name: "Nhập môn lập trình",
                                credits: 3,
                                code: "NMLT",
                                classes: [
                                    {
                                        id: "1",
                                        teacher: "Nguyễn Văn A",
                                        schedule: [
                                            {
                                                day: "Thứ 2",
                                                time: "7:30 - 9:30",
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
                                        teacher: "Trần Thị B",
                                        schedule: [
                                            {
                                                day: "Thứ 3",
                                                time: "9:45 - 11:45",
                                                status: "Hết chỗ",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    // Ngành Quản trị kinh doanh
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
                                        teacher: "Lê Văn C",
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
                                name: "Nguyên lý kế toán",
                                credits: 3,
                                code: "NLKT",
                                classes: [
                                    {
                                        id: "4",
                                        teacher: "Phạm Thị D",
                                        schedule: [
                                            {
                                                day: "Thứ 5",
                                                time: "15:15 - 17:15",
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
            {
                id: "19.3",
                name: "Khóa 19.3",
                majors: [
                    // Ngành Quản trị kinh doanh
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
                                        teacher: "Lê Văn C",
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
                                name: "Nguyên lý kế toán",
                                credits: 3,
                                code: "NLKT",
                                classes: [
                                    {
                                        id: "4",
                                        teacher: "Phạm Thị D",
                                        schedule: [
                                            {
                                                day: "Thứ 5",
                                                time: "15:15 - 17:15",
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

    // Kỳ 2
    {
        id: "2",
        name: "Kỳ 2",
        startDate: "01/01/2024",
        endDate: "30/04/2024",
        status: "Đang diễn ra",
        courses: [
            {
                id: "18.3",
                name: "Khóa 18.3",
                majors: [
                    // Ngành Công nghệ thông tin
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
                                        teacher: "Nguyễn Văn E",
                                        schedule: [
                                            {
                                                day: "Thứ 2",
                                                time: "7:30 - 9:30",
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
                                        teacher: "Trần Thị F",
                                        schedule: [
                                            {
                                                day: "Thứ 3",
                                                time: "9:45 - 11:45",
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
        ],
    },

    // Kỳ 3
    {
        id: "3",
        name: "Kỳ 3",
        startDate: "01/05/2024",
        endDate: "31/08/2024",
        status: "Đang diễn ra",
        courses: [
            {
                id: "18.3",
                name: "Khóa 18.3",
                majors: [
                    // Ngành Công nghệ thông tin
                    {
                        id: "cntt",
                        name: "Công nghệ thông tin",
                        subjects: [
                            {
                                id: "7",
                                name: "Cơ sở dữ liệu",
                                credits: 4,
                                code: "CSDL",
                                classes: [
                                    {
                                        id: "7",
                                        teacher: "Lê Văn G",
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
                                id: "8",
                                name: "Mạng máy tính",
                                credits: 3,
                                code: "MMT",
                                classes: [
                                    {
                                        id: "8",
                                        teacher: "Phạm Thị H",
                                        schedule: [
                                            {
                                                day: "Thứ 5",
                                                time: "15:15 - 17:15",
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

    // Kỳ 4
    {
        id: "4",
        name: "Kỳ 4",
        startDate: "01/09/2024",
        endDate: "31/12/2024",
        status: "Đang diễn ra",
        courses: [
            {
                id: "18.3",
                name: "Khóa 18.3",
                majors: [
                    // Ngành Công nghệ thông tin
                    {
                        id: "cntt",
                        name: "Công nghệ thông tin",
                        subjects: [
                            {
                                id: "9",
                                name: "Hệ điều hành",
                                credits: 3,
                                code: "HDH",
                                classes: [
                                    {
                                        id: "9",
                                        teacher: "Nguyễn Văn I",
                                        schedule: [
                                            {
                                                day: "Thứ 6",
                                                time: "7:30 - 9:30",
                                                status: "Hết chỗ",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: "10",
                                name: "Phân tích thiết kế hệ thống",
                                credits: 3,
                                code: "PTTKHT",
                                classes: [
                                    {
                                        id: "10",
                                        teacher: "Trần Thị K",
                                        schedule: [
                                            {
                                                day: "Thứ 2",
                                                time: "9:45 - 11:45",
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

    // Kỳ 5
    {
        id: "5",
        name: "Kỳ 5",
        startDate: "01/01/2025",
        endDate: "30/04/2025",
        status: "Sắp diễn ra",
        courses: [
            {
                id: "18.3",
                name: "Khóa 18.3",
                majors: [
                    // Ngành Công nghệ thông tin
                    {
                        id: "cntt",
                        name: "Công nghệ thông tin",
                        subjects: [
                            {
                                id: "11",
                                name: "Phát triển ứng dụng web",
                                credits: 4,
                                code: "PTUDW",
                                classes: [
                                    {
                                        id: "11",
                                        teacher: "Lê Văn M",
                                        schedule: [
                                            {
                                                day: "Thứ 3",
                                                time: "13:00 - 15:00",
                                                status: "Còn chỗ",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: "12",
                                name: "An toàn thông tin",
                                credits: 3,
                                code: "ATTT",
                                classes: [
                                    {
                                        id: "12",
                                        teacher: "Phạm Thị N",
                                        schedule: [
                                            {
                                                day: "Thứ 4",
                                                time: "15:15 - 17:15",
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
        ],
    },

    // Kỳ 6
    {
        id: "6",
        name: "Kỳ 6",
        startDate: "01/05/2025",
        endDate: "31/08/2025",
        status: "Sắp diễn ra",
        courses: [
            {
                id: "18.3",
                name: "Khóa 18.3",
                majors: [
                    // Ngành Công nghệ thông tin
                    {
                        id: "cntt",
                        name: "Công nghệ thông tin",
                        subjects: [
                            {
                                id: "13",
                                name: "Trí tuệ nhân tạo",
                                credits: 3,
                                code: "TTNT",
                                classes: [
                                    {
                                        id: "13",
                                        teacher: "Nguyễn Văn O",
                                        schedule: [
                                            {
                                                day: "Thứ 5",
                                                time: "7:30 - 9:30",
                                                status: "Còn chỗ",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: "14",
                                name: "Học máy",
                                credits: 3,
                                code: "HM",
                                classes: [
                                    {
                                        id: "14",
                                        teacher: "Trần Thị P",
                                        schedule: [
                                            {
                                                day: "Thứ 6",
                                                time: "9:45 - 11:45",
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
        ],
    },

    // Kỳ 7
    {
        id: "7",
        name: "Kỳ 7",
        startDate: "01/09/2025",
        endDate: "31/12/2025",
        status: "Sắp diễn ra",
        courses: [
            {
                id: "18.3",
                name: "Khóa 18.3",
                majors: [
                    // Ngành Công nghệ thông tin
                    {
                        id: "cntt",
                        name: "Công nghệ thông tin",
                        subjects: [
                            {
                                id: "15",
                                name: "Đồ án tốt nghiệp",
                                credits: 10,
                                code: "DATN",
                                classes: [
                                    {
                                        id: "15",
                                        teacher: "Lê Văn Q",
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
                        ],
                    },
                ],
            },
        ],
    },
];

const ScheduleList = () => {
    const [expandedSemester, setExpandedSemester] = useState(null);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [expandedMajor, setExpandedMajor] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const navigate = useNavigate();

    const toggleSemester = (semesterId) => {
        setExpandedSemester(
            expandedSemester === semesterId ? null : semesterId
        );
        setExpandedCourse(null);
        setExpandedMajor(null);
        setSelectedSubject(null);
    };

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
                {semestersData.map((semester) => {
                    // Đặt màu sắc cho trạng thái kỳ học
                    let statusColor = "";
                    switch (semester.status) {
                        case "Đang diễn ra":
                            statusColor = "text-green-600";
                            break;
                        case "Sắp diễn ra":
                            statusColor = "text-yellow-600";
                            break;
                        case "Kết thúc":
                            statusColor = "text-red-600";
                            break;
                        default:
                            statusColor = "text-gray-600";
                    }

                    return (
                        <div
                            key={semester.id}
                            className="p-8 bg-white rounded-lg shadow-lg space-y-6"
                        >
                            {/* Semester Header */}
                            <div
                                onClick={() => toggleSemester(semester.id)}
                                className="cursor-pointer space-y-2"
                            >
                                <h3 className="text-4xl mb-3 font-bold text-blue-600 flex items-center justify-between">
                                    {semester.name}
                                    {expandedSemester === semester.id ? (
                                        <DownOutlined className="ml-2 text-2xl" />
                                    ) : (
                                        <RightOutlined className="ml-2 text-2xl" />
                                    )}
                                </h3>
                                <div className="text-xl text-gray-700">
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Ngày bắt đầu:
                                        </span>{" "}
                                        {semester.startDate}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Ngày kết thúc:
                                        </span>{" "}
                                        {semester.endDate}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Trạng thái:
                                        </span>{" "}
                                        <span
                                            className={`${statusColor} font-bold`}
                                        >
                                            {semester.status}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {expandedSemester === semester.id && (
                                <div className="mt-6 space-y-6">
                                    {semester.courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="bg-gray-50 rounded-lg p-6"
                                        >
                                            {/* Course Header */}
                                            <div
                                                onClick={() =>
                                                    toggleCourse(course.id)
                                                }
                                                className="cursor-pointer flex justify-between items-center"
                                            >
                                                <h4 className="text-3xl font-semibold text-blue-500">
                                                    {course.name}
                                                </h4>
                                                {expandedCourse ===
                                                course.id ? (
                                                    <DownOutlined className="text-2xl text-gray-600" />
                                                ) : (
                                                    <RightOutlined className="text-2xl text-gray-600" />
                                                )}
                                            </div>

                                            {expandedCourse === course.id && (
                                                <div className="mt-4 space-y-4">
                                                    {course.majors.map(
                                                        (major) => (
                                                            <div
                                                                key={major.id}
                                                                className="bg-white rounded-lg p-6 shadow"
                                                            >
                                                                {/* Major Header */}
                                                                <div
                                                                    onClick={() =>
                                                                        toggleMajor(
                                                                            major.id
                                                                        )
                                                                    }
                                                                    className="cursor-pointer flex justify-between items-center"
                                                                >
                                                                    <h5 className="text-2xl font-medium text-green-600">
                                                                        {
                                                                            major.name
                                                                        }
                                                                    </h5>
                                                                    {expandedMajor ===
                                                                    major.id ? (
                                                                        <DownOutlined className="text-xl text-gray-600" />
                                                                    ) : (
                                                                        <RightOutlined className="text-xl text-gray-600" />
                                                                    )}
                                                                </div>

                                                                {/* Subjects within the Major */}
                                                                {expandedMajor ===
                                                                    major.id && (
                                                                    <div className="mt-4 space-y-4">
                                                                        {major.subjects.map(
                                                                            (
                                                                                subject
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        subject.id
                                                                                    }
                                                                                    className="bg-gray-50 rounded-lg p-6"
                                                                                >
                                                                                    {/* Subject Header */}
                                                                                    <div
                                                                                        onClick={() =>
                                                                                            selectSubject(
                                                                                                subject.id
                                                                                            )
                                                                                        }
                                                                                        className="cursor-pointer flex justify-between items-center"
                                                                                    >
                                                                                        <p className="text-xl font-semibold text-indigo-600">
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
                                                                                            <DownOutlined className="text-xl text-gray-600" />
                                                                                        ) : (
                                                                                            <RightOutlined className="text-xl text-gray-600" />
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Classes within the Subject */}
                                                                                    {selectedSubject ===
                                                                                        subject.id && (
                                                                                        <div className="mt-4 space-y-4">
                                                                                            {subject
                                                                                                .classes
                                                                                                .length ===
                                                                                            0 ? (
                                                                                                <div className="flex justify-center items-center">
                                                                                                    <Button type="primary">
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
                                                                                                                className="p-6 border rounded-lg bg-white shadow-md"
                                                                                                            >
                                                                                                                <p className="font-semibold text-xl text-gray-700">
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
                                                                                                                <div className="flex flex-wrap mt-4">
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
                                                                                                                                className={`m-2 p-4 rounded-lg cursor-pointer shadow ${
                                                                                                                                    sch.status ===
                                                                                                                                    "Còn chỗ"
                                                                                                                                        ? "bg-green-100 border border-green-500"
                                                                                                                                        : "bg-red-100 border border-red-500"
                                                                                                                                }`}
                                                                                                                            >
                                                                                                                                <p className="text-base text-gray-700">
                                                                                                                                    {
                                                                                                                                        sch.day
                                                                                                                                    }{" "}
                                                                                                                                    -{" "}
                                                                                                                                    {
                                                                                                                                        sch.time
                                                                                                                                    }
                                                                                                                                </p>
                                                                                                                                <p
                                                                                                                                    className={`text-base font-bold ${
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
                                                                                                    <div className="flex justify-end mt-4">
                                                                                                        <Button type="primary">
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
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleList;
