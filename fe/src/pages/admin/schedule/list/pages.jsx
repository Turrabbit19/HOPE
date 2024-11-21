import React, { useEffect, useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../../config/axios"; // Axios instance
import moment from "moment";

const ScheduleList = () => {
    // State variables
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [expandedSemester, setExpandedSemester] = useState(null);
    const [expandedMajor, setExpandedMajor] = useState(null);
    const [expandedSubject, setExpandedSubject] = useState(null);
    const [courses, setCourses] = useState([]);
    const [semestersByCourse, setSemestersByCourse] = useState({});
    const [majorsByCourse, setMajorsByCourse] = useState({});
    const [subjectsByMajor, setSubjectsByMajor] = useState({});
    const [classroomsBySubject, setClassroomsBySubject] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch courses on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await instance.get("admin/courses");
                setCourses(response.data.data);
                console.log("Courses data:", response.data.data);
            } catch (err) {
                setError("Không thể lấy dữ liệu khóa học.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Fetching semesters for a specific course
    const fetchSemestersForCourse = async (courseId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await instance.get(
                `admin/course/${courseId}/semesters`
            );
            console.log(
                `Semesters for course ${courseId}:`,
                response.data.semesters
            );
            setSemestersByCourse((prev) => ({
                ...prev,
                [courseId]: response.data.semesters || [],
            }));
        } catch (err) {
            setError("Không thể lấy dữ liệu kỳ học cho khóa học này.");
        } finally {
            setLoading(false);
        }
    };

    // Fetching majors for a specific course
    const fetchMajorsForCourse = async (courseId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await instance.get(
                `admin/course/${courseId}/majors`
            );
            console.log("Majors data:", response.data.majors);
            setMajorsByCourse((prev) => ({
                ...prev,
                [courseId]: response.data.majors || [],
            }));
        } catch (err) {
            setError("Không thể lấy dữ liệu ngành học cho khóa học này.");
        } finally {
            setLoading(false);
        }
    };

    // Fetching subjects for a specific major
    const fetchSubjectsForMajor = async (courseId, semesterId, majorId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await instance.get(
                `admin/semester/${semesterId}/course/${courseId}/major/${majorId}/subjects`
            );
            console.log(
                `Subjects for major ${majorId}:`,
                response.data.subjects
            );
            setSubjectsByMajor((prev) => ({
                ...prev,
                [`${courseId}_${semesterId}_${majorId}`]:
                    response.data.subjects || [],
            }));
        } catch (err) {
            setError("Không thể lấy dữ liệu môn học cho ngành học này.");
        } finally {
            setLoading(false);
        }
    };

    // Fetching classrooms for a specific subject
    const fetchClassroomsForSubject = async (subjectId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await instance.get(
                `admin/schedule/${subjectId}/classrooms`
            );
            console.log(
                `Classrooms for subject ${subjectId}:`,
                response.data.data
            );
            setClassroomsBySubject((prev) => ({
                ...prev,
                [subjectId]: response.data.data || [], // Lưu theo `subjectId`
            }));
        } catch (err) {
            setError("Không thể lấy dữ liệu lớp học cho môn học này.");
        } finally {
            setLoading(false);
        }
    };

    // Handle toggling for each course, semester, major, and subject
    const toggleCourse = (courseId) => {
        setExpandedCourse(expandedCourse === courseId ? null : courseId);
        setExpandedSemester(null);
        setExpandedMajor(null);
        setExpandedSubject(null);
        if (expandedCourse !== courseId) {
            fetchSemestersForCourse(courseId);
        }
    };

    const toggleSemester = (courseId, semesterId) => {
        setExpandedSemester(
            expandedSemester === semesterId ? null : semesterId
        );
        setExpandedMajor(null);
        setExpandedSubject(null);
        if (expandedSemester !== semesterId) {
            fetchMajorsForCourse(courseId);
        }
    };

    const toggleMajor = (courseId, semesterId, majorId) => {
        setExpandedMajor(expandedMajor === majorId ? null : majorId);
        setExpandedSubject(null);
        if (expandedMajor !== majorId) {
            fetchSubjectsForMajor(courseId, semesterId, majorId);
        }
    };

    const toggleSubject = (subjectId) => {
        setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
        if (expandedSubject !== subjectId) {
            fetchClassroomsForSubject(subjectId);
        }
    };

    return (
        <div className="mx-auto p-10 bg-blue-50 min-h-screen">
            <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-10">
                Quản lý lịch học
            </h2>

            {loading && <p>Đang tải dữ liệu...</p>}

            {error && <p className="text-red-600">{error}</p>}

            <div className="space-y-8">
                {courses.length > 0 ? (
                    courses.map((course) => {
                        let statusColor = "";
                        switch (course.status) {
                            case "Đang diễn ra":
                                statusColor = "text-green-600";
                                break;
                            case "Chờ diễn ra":
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
                                key={course.id}
                                className="p-8 bg-white rounded-lg shadow-lg space-y-6"
                            >
                                <div
                                    onClick={() => toggleCourse(course.id)}
                                    className="cursor-pointer space-y-2"
                                >
                                    <h3 className="text-4xl mb-3 font-bold text-blue-600 flex items-center justify-between">
                                        {course.name}
                                        {expandedCourse === course.id ? (
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
                                            {moment(course.start_date).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </p>
                                        <p className="mb-2">
                                            <span className="font-semibold">
                                                Ngày kết thúc:
                                            </span>{" "}
                                            {moment(course.end_date).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </p>
                                        <p className={`text-xl text-gray-700`}>
                                            Trạng thái:{" "}
                                            <span
                                                className={`text-xl ${statusColor}`}
                                            >
                                                {course.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {expandedCourse === course.id && (
                                    <div className="mt-6 space-y-6">
                                        {semestersByCourse[course.id] &&
                                        semestersByCourse[course.id].length >
                                            0 ? (
                                            semestersByCourse[course.id].map(
                                                (semester) => (
                                                    <div
                                                        key={semester.id}
                                                        className="bg-gray-50 rounded-lg p-6"
                                                    >
                                                        <div
                                                            onClick={() =>
                                                                toggleSemester(
                                                                    course.id,
                                                                    semester.id
                                                                )
                                                            }
                                                            className="cursor-pointer flex items-center justify-between"
                                                        >
                                                            <h4 className="text-3xl font-semibold text-blue-500">
                                                                {semester.name}
                                                            </h4>
                                                            {expandedSemester ===
                                                            semester.id ? (
                                                                <DownOutlined className="ml-2 text-2xl" />
                                                            ) : (
                                                                <RightOutlined className="ml-2 text-2xl" />
                                                            )}
                                                        </div>

                                                        {expandedSemester ===
                                                            semester.id && (
                                                            <div className="mt-4 space-y-4">
                                                                {majorsByCourse[
                                                                    course.id
                                                                ] &&
                                                                majorsByCourse[
                                                                    course.id
                                                                ].length > 0 ? (
                                                                    majorsByCourse[
                                                                        course
                                                                            .id
                                                                    ].map(
                                                                        (
                                                                            major
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    major.id
                                                                                }
                                                                                className="bg-white rounded-lg p-6 shadow"
                                                                            >
                                                                                <h5
                                                                                    onClick={() =>
                                                                                        toggleMajor(
                                                                                            course.id,
                                                                                            semester.id,
                                                                                            major.id
                                                                                        )
                                                                                    }
                                                                                    className="text-2xl font-medium text-green-600 cursor-pointer"
                                                                                >
                                                                                    {
                                                                                        major.name
                                                                                    }
                                                                                </h5>

                                                                                {expandedMajor ===
                                                                                    major.id && (
                                                                                    <div className="mt-4 space-y-4">
                                                                                        {subjectsByMajor[
                                                                                            `${course.id}_${semester.id}_${major.id}`
                                                                                        ] &&
                                                                                        subjectsByMajor[
                                                                                            `${course.id}_${semester.id}_${major.id}`
                                                                                        ]
                                                                                            .length >
                                                                                            0 ? (
                                                                                            subjectsByMajor[
                                                                                                `${course.id}_${semester.id}_${major.id}`
                                                                                            ].map(
                                                                                                (
                                                                                                    subject
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            subject.id
                                                                                                        }
                                                                                                        className="bg-white p-6 shadow rounded-lg"
                                                                                                    >
                                                                                                        <h6
                                                                                                            onClick={() =>
                                                                                                                toggleSubject(
                                                                                                                    subject.id
                                                                                                                )
                                                                                                            }
                                                                                                            className="text-xl font-semibold text-indigo-600 cursor-pointer"
                                                                                                        >
                                                                                                            {
                                                                                                                subject.name
                                                                                                            }
                                                                                                        </h6>
                                                                                                        {expandedSubject ===
                                                                                                            subject.id && (
                                                                                                            <div>
                                                                                                                {/* Hiển thị danh sách phòng học */}
                                                                                                                {classroomsBySubject[
                                                                                                                    subject
                                                                                                                        .id
                                                                                                                ] &&
                                                                                                                classroomsBySubject[
                                                                                                                    subject
                                                                                                                        .id
                                                                                                                ]
                                                                                                                    .length >
                                                                                                                    0 ? (
                                                                                                                    classroomsBySubject[
                                                                                                                        subject
                                                                                                                            .id
                                                                                                                    ].map(
                                                                                                                        (
                                                                                                                            classroom
                                                                                                                        ) => (
                                                                                                                            <div
                                                                                                                                key={
                                                                                                                                    classroom.id
                                                                                                                                }
                                                                                                                                className="bg-gray-50 p-4 rounded-lg mb-4"
                                                                                                                            >
                                                                                                                                <p className="text-xl font-bold text-gray-700">
                                                                                                                                    Lớp
                                                                                                                                    học:{" "}
                                                                                                                                    {
                                                                                                                                        classroom.classroom
                                                                                                                                    }
                                                                                                                                </p>
                                                                                                                                <p>
                                                                                                                                    Phòng:{" "}
                                                                                                                                    {
                                                                                                                                        classroom.room
                                                                                                                                    }
                                                                                                                                </p>
                                                                                                                                <p>
                                                                                                                                    Ngày
                                                                                                                                    bắt
                                                                                                                                    đầu:{" "}
                                                                                                                                    {
                                                                                                                                        classroom.start_date
                                                                                                                                    }
                                                                                                                                </p>
                                                                                                                                <p>
                                                                                                                                    Link
                                                                                                                                    học:{" "}
                                                                                                                                    {classroom.link ===
                                                                                                                                    "NULL"
                                                                                                                                        ? "Không có"
                                                                                                                                        : classroom.link}
                                                                                                                                </p>
                                                                                                                            </div>
                                                                                                                        )
                                                                                                                    )
                                                                                                                ) : (
                                                                                                                    <p>
                                                                                                                        Không
                                                                                                                        có
                                                                                                                        phòng
                                                                                                                        học
                                                                                                                        nào
                                                                                                                        được
                                                                                                                        tìm
                                                                                                                        thấy.
                                                                                                                    </p>
                                                                                                                )}

                                                                                                                {/* Nút Tạo lịch học mới */}
                                                                                                                <Button
                                                                                                                    type="primary"
                                                                                                                    onClick={() => {
                                                                                                                        console.log(
                                                                                                                            "Passing majorId::",
                                                                                                                            major.id
                                                                                                                        );
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Link
                                                                                                                        to={`add`}
                                                                                                                        state={{
                                                                                                                            courseId:
                                                                                                                                course.id,
                                                                                                                            semesterId:
                                                                                                                                semester.id,
                                                                                                                            majorId:
                                                                                                                                major.id,
                                                                                                                            subjectId:
                                                                                                                                subject.id,
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        Tạo
                                                                                                                        lịch
                                                                                                                        học
                                                                                                                        mới
                                                                                                                    </Link>
                                                                                                                </Button>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )
                                                                                            )
                                                                                        ) : (
                                                                                            <p>
                                                                                                Đang
                                                                                                tải
                                                                                                môn
                                                                                                học...
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <p>
                                                                        Đang tải
                                                                        ngành
                                                                        học...
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p>
                                                Chưa có kỳ học cho khóa học này.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>Chưa có khóa học nào.</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleList;