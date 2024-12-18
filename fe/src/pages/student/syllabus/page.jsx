"use client";

import { useEffect, useState, useCallback } from "react";
import {
    X,
    Book,
    Calendar,
    User,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    HelpCircle,
    Check,
    Info,
} from "lucide-react";

function SubjectDetailsModal({ subject, isOpen, onClose }) {
    if (!isOpen || !subject) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case "Có mặt":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "Vắng":
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <HelpCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-[70%] w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {subject.subject.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="space-y-8">
                    {/* Thông tin chung */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-3xl font-semibold mb-4 text-blue-800">
                            Thông tin chung
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-2xl">
                            <p className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-blue-500" />{" "}
                                <strong>Số tín chỉ:</strong>{" "}
                                {subject.subject.credit}
                            </p>
                            <p className="flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-500" />{" "}
                                <strong>Hình thức học:</strong>{" "}
                                {subject.subject.form}
                            </p>
                        </div>
                        <p className="mt-4 text-2xl">
                            <strong>Mô tả:</strong>{" "}
                            {subject.subject.description}
                        </p>
                    </div>

                    {/* Kiểm tra lịch học */}
                    {subject.schedule && subject.schedule.length > 0 ? (
                        <>
                            {/* Lịch học */}
                            <div>
                                <h3 className="text-3xl font-semibold mb-4 text-gray-800">
                                    Lịch học
                                </h3>
                                {subject.schedule.map((schedule, index) => (
                                    <div
                                        key={index}
                                        className="mb-6 bg-gray-50 p-4 rounded-lg"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-2xl">
                                            <p className="flex items-center">
                                                <Calendar className="w-5 h-5 mr-2 text-gray-600" />{" "}
                                                <strong>Lớp học: </strong>{" "}
                                                {subject.classroom.code}
                                            </p>
                                            <p className="flex items-center">
                                                <Calendar className="w-5 h-5 mr-2 text-gray-600" />{" "}
                                                <strong>Thời gian:</strong>{" "}
                                                {schedule.start_date} -{" "}
                                                {schedule.end_date}
                                            </p>
                                            <p className="flex items-center">
                                                <Clock className="w-5 h-5 mr-2 text-gray-600" />{" "}
                                                <strong>Ca học:</strong>{" "}
                                                {schedule.shift_name}
                                            </p>
                                            <p className="flex items-center">
                                                <User className="w-5 h-5 mr-2 text-gray-600" />{" "}
                                                <strong>Giảng viên:</strong>{" "}
                                                {schedule.teacher_name}
                                            </p>
                                            <p className="flex items-center">
                                                <MapPin className="w-5 h-5 mr-2 text-gray-600" />{" "}
                                                <strong>Phòng:</strong>{" "}
                                                {schedule.room}
                                            </p>
                                            <p className="flex items-center">
                                                <Calendar className="w-5 h-5 mr-2 text-gray-600" />{" "}
                                                <strong>
                                                    Các ngày trong tuần:{" "}
                                                </strong>{" "}
                                                {schedule.days_of_week
                                                    .map(
                                                        (day) =>
                                                            Object.values(
                                                                day
                                                            )[0]
                                                    )
                                                    .join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="text-3xl font-semibold mb-4 text-green-800">
                                    Thống kê điểm danh
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-2xl">
                                    <p>
                                        <strong>Tổng số buổi:</strong>{" "}
                                        {subject.statistics.total_lessons}
                                    </p>
                                    <p>
                                        <strong>Số buổi đã tham gia:</strong>{" "}
                                        {subject.statistics.attended_lessons}
                                    </p>
                                    <p>
                                        <strong>Số buổi vắng:</strong>{" "}
                                        {subject.statistics.missed_lessons}
                                    </p>
                                    <p>
                                        <strong>Tỷ lệ tham gia:</strong>
                                        <span className="text-green-600">
                                            {subject.statistics.attendance_rate}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Tỷ lệ vắng mặt:</strong>
                                        <span className="text-red-600">
                                            {subject.statistics.missed_rate}
                                        </span>
                                    </p>
                                </div>

                                {/* Gộp thanh tiến độ tổng hợp */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="h-2.5"
                                        style={{
                                            width: `${parseFloat(
                                                subject.statistics
                                                    .attendance_rate
                                            )}%`,
                                            backgroundColor: "#4CAF50",
                                            float: "left",
                                        }}
                                    ></div>
                                    <div
                                        className="h-2.5"
                                        style={{
                                            width: `${parseFloat(
                                                subject.statistics.missed_rate
                                            )}%`,
                                            backgroundColor: "#F44336",
                                            float: "left",
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Chi tiết các buổi học */}
                            <div>
                                <h3 className="text-3xl font-semibold mb-4 text-gray-800">
                                    Chi tiết các buổi học
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {subject.schedule[0].lessons.map(
                                        (lesson, index) => (
                                            <div
                                                key={index}
                                                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow "
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <strong className="text-2xl">
                                                        {lesson.name}
                                                    </strong>
                                                    {getStatusIcon(
                                                        lesson.status
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 text-xl">
                                                    Ngày: {lesson.date}
                                                </p>
                                                
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-lg">
                            Chưa có lịch học được cung cấp cho môn học này.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Syllabus() {
    const [curriculumData, setCurriculumData] = useState(null);
    const [classroomsData, setClassroomsData] = useState(null);
    const [error, setError] = useState(null);
    const [classroomsError, setClassroomsError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [classroomsLoading, setClassroomsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Curriculum");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjectsWithSchedule, setSubjectsWithSchedule] = useState(() => {
        const saved = localStorage.getItem("subjectsWithSchedule");
        return saved ? JSON.parse(saved) : {};
    });

    const tabs = [
        { id: "Curriculum", label: "Curriculum", icon: "📚" },
        { id: "Classrooms", label: "Classrooms", icon: "🏫" },
    ];

    // Fetch Curriculum Data
    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "http://127.0.0.1:8000/api/student/syllabus",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch curriculum data");
                }

                const data = await response.json();
                setCurriculumData(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculum();
    }, []);

    // Fetch Classrooms Data
    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "http://localhost:8000/api/student/classrooms",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Không thể tải dữ liệu lớp học");
                }

                const data = await response.json();
                setClassroomsData(data.data);
            } catch (err) {
                setClassroomsError(
                    err instanceof Error ? err.message : "Đã xảy ra lỗi"
                );
            } finally {
                setClassroomsLoading(false);
            }
        };

        fetchClassrooms();
    }, []);

    const fetchSubjectDetails = useCallback(async (subjectId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://127.0.0.1:8000/api/student/syllabus/${subjectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch subject details");
            }

            const data = await response.json();

            console.log(data);
            setSelectedSubject(data.data);
            setIsModalOpen(true);

            setSubjectsWithSchedule((prev) => ({
                ...prev,
                [subjectId]:
                    data.data.schedule && data.data.schedule.length > 0,
            }));
        } catch (err) {
            console.error("Error fetching subject details:", err);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "subjectsWithSchedule",
            JSON.stringify(subjectsWithSchedule)
        );
    }, [subjectsWithSchedule]);

    if (loading || classroomsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl">
                Đang tải...
            </div>
        );
    }

    if (error || classroomsError) {
        return (
            <div className="text-red-500 text-center text-xl">
                {error || classroomsError}
            </div>
        );
    }

    return (
        <div className="mx-auto p-4 text-base">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6 border-b text-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 ${
                            activeTab === tab.id
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Nội dung theo tab */}
            <div className="mt-4">
                {activeTab === "Curriculum" && (
                    <>
                        <div className="flex justify-between items-start mb-4">
                            <div className="mb-4 p-4 bg-gray-100 rounded-lg flex items-center space-x-4">
                                <Info className="w-5 h-5 text-blue-500" />
                                <span className="text-lg">Chú thích:</span>
                                <div className="flex items-center">
                                    <Check className="w-5 h-5 text-green-500 mr-1" />
                                    <span className="text-lg">
                                        Có dữ liệu lịch học
                                    </span>
                                </div>
                                <div className="flex items-center ml-4">
                                    <X className="w-5 h-5 text-red-500 mr-1" />
                                    <span className="text-lg">
                                        Không có dữ liệu lịch học
                                    </span>
                                </div>
                            </div>
                           
                        </div>

                        {/* Curriculum Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {curriculumData?.data.map((semester) => (
                                <div
                                    key={semester.order}
                                    className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
                                >
                                    <div className="bg-blue-50 p-4 flex justify-between items-center">
                                        <h2 className="font-medium text-2xl">
                                            Học kỳ {semester.order}
                                        </h2>
                                        <span className="text-2xl text-gray-600">
                                            {semester.subjects.length} môn
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead className="bg-gray-100 text-sm font-semibold">
                                                <tr>
                                                    <th className="border py-1 px-2 text-left text-xl">
                                                        STT
                                                    </th>
                                                    <th className="border py-3 px-4 text-left text-xl">
                                                        Môn học
                                                    </th>
                                                    <th className="border py-1 px-2 text-center text-xl">
                                                        Tín chỉ
                                                    </th>
                                                    <th className="border py-1 px-2 text-center text-xl">
                                                        Hình thức
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {semester.subjects.map(
                                                    (subject, index) => (
                                                        <tr
                                                            key={subject.id}
                                                            className="border-t hover:bg-gray-50"
                                                        >
                                                            <td className="border py-1 px-2 text-xl text-center">
                                                                {index + 1}
                                                            </td>
                                                            <td className="border py-3 px-4">
                                                                <div className="flex items-center">
                                                                    <button
                                                                        onClick={() =>
                                                                            fetchSubjectDetails(
                                                                                subject.id
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:underline text-xl text-left flex items-center"
                                                                    >
                                                                        {
                                                                            subject.name
                                                                        }
                                                                    </button>
                                                                    <div className="flex items-center ml-2">
                                                                        {subjectsWithSchedule[
                                                                            subject
                                                                                .id
                                                                        ] && (
                                                                            <Check
                                                                                className="w-5 h-5 text-green-500"
                                                                                title="Có dữ liệu lịch học"
                                                                            />
                                                                        )}
                                                                        {subject.hasOngoingClass && (
                                                                            <div
                                                                                className="w-3 h-3 bg-blue-500 rounded-full ml-1"
                                                                                title="Đang có lớp học"
                                                                            ></div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="border py-1 px-2 text-center text-xl">
                                                                {subject.credit}
                                                            </td>
                                                            <td className="border py-1 px-2 text-center text-xl">
                                                                <span
                                                                    className={`${
                                                                        subject.form ===
                                                                        "ONL"
                                                                            ? "text-green-600"
                                                                            : "text-red-600"
                                                                    } font-medium`}
                                                                >
                                                                    {
                                                                        subject.form
                                                                    }
                                                                </span>
                                                            </td>
                                                            
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <SubjectDetailsModal
                            subject={selectedSubject}
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </>
                )}

                {activeTab === "Classrooms" && (
                    <div className="mx-auto p-4">
                        <h1 className="text-3xl font-bold mb-6">
                            Danh Sách Lớp Học Đang Học
                        </h1>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            {classroomsData.length === 0 ? (
                                <p className="text-gray-500">
                                    Không có lớp học nào.
                                </p>
                            ) : (
                                <table className="w-full table-auto border-collapse">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="border py-2 px-4 text-left">
                                                ID
                                            </th>
                                            <th className="border py-2 px-4 text-left">
                                                Mã Lớp
                                            </th>
                                            <th className="border py-2 px-4 text-left">
                                                Tên Môn Học
                                            </th>
                                            <th className="border py-2 px-4 text-left">
                                                Ca Học
                                            </th>
                                            <th className="border py-2 px-4 text-left">
                                                Phòng
                                            </th>
                                            <th className="border py-2 px-4 text-left">
                                                Thời Gian
                                            </th>
                                            <th className="border py-2 px-4 text-left">
                                                Ngày Trong Tuần
                                            </th>
                                            <th className="border py-2 px-4 text-left">
                                                Trạng Thái Lịch
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classroomsData.map((classroom) => (
                                            <tr
                                                key={classroom.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="border py-2 px-4">
                                                    {classroom.id}
                                                </td>
                                                <td className="border py-2 px-4">
                                                    {classroom.classroom}
                                                </td>
                                                <td className="border py-2 px-4">
                                                    {classroom.subject_name}
                                                </td>
                                                <td className="border py-2 px-4">
                                                    {classroom.shift_name}
                                                </td>
                                                <td className="border py-2 px-4">
                                                    {classroom.room_name}
                                                </td>
                                                <td className="border py-2 px-4">
                                                    {classroom.start_date} -{" "}
                                                    {classroom.end_date}
                                                </td>
                                                <td className="border py-2 px-4">
                                                    {classroom.days_of_week.join(
                                                        ", "
                                                    )}
                                                </td>
                                                <td className="border py-2 px-4">
                                                    {classroom.schedule_status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
