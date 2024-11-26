import React, { useEffect, useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../../config/axios";
import moment from "moment";

const ScheduleList = () => {
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
  const [classroomsCache, setClassroomsCache] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách các khóa học khi component được mount
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

  const fetchSemestersForCourse = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(`admin/course/${courseId}/semesters`);
      console.log(`Semesters for course ${courseId}:`, response.data.semesters);
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

  // Lấy danh sách ngành học cho một khóa học cụ thể
  const fetchMajorsForCourse = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(`admin/course/${courseId}/majors`);
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

  // Lấy danh sách môn học cho một ngành học cụ thể
  const fetchSubjectsForMajor = async (courseId, semesterId, majorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(
        `admin/semester/${semesterId}/course/${courseId}/major/${majorId}/subjects`
      );
      console.log(`Subjects for major ${majorId}:`, response.data.subjects);
      setSubjectsByMajor((prev) => ({
        ...prev,
        [`${courseId}_${semesterId}_${majorId}`]: response.data.subjects || [],
      }));
    } catch (err) {
      setError("Không thể lấy dữ liệu môn học cho ngành học này.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách phòng học cho một môn học cụ thể
  const fetchClassroomsForSubject = async (subjectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(
        `admin/schedules/${subjectId}/classrooms`
      );
      console.log(`Classrooms for subject ${subjectId}:`, response.data.data);
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

  // Xử lý mở rộng/tắt mở rộng cho từng khóa học, kỳ học, ngành học và môn học
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
    setExpandedSemester(expandedSemester === semesterId ? null : semesterId);
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

  // Hàm xử lý khi nhấp vào phòng học
  const handleClassroomClick = (classroomId, subjectId, majorId) => {
    console.log("ID của phòng học:", classroomId);
    navigate(`details/${classroomId}`, {
      state: {
        subjectId: subjectId,
        majorId: majorId,
      },
    });
  };

  // // Lấy danh sách phòng học
  // useEffect(() => {
  //     const fetchClassrooms = async () => {
  //         try {
  //             const response = await instance.get(`/admin/classrooms`);
  //             setClassroomsCache(response.data?.data || []);
  //         } catch (err) {
  //             console.error("Không thể lấy danh sách lớp học:", err.message);
  //         }
  //     };

  //     fetchClassrooms();
  // }, []);
  // // Lấy id phòng học
  // const getClassroom = (classroomCode) => {
  //     const classroom = classroomsCache.find(
  //         (cls) => cls.code.toLowerCase() === classroomCode.toLowerCase()
  //     );

  //     if (!classroom) {
  //         console.error(`Không tìm thấy lớp học với mã: ${classroomCode}`);
  //         throw new Error(`Không tìm thấy lớp học với mã: ${classroomCode}`);
  //     }

  //     return classroom.id;
  // };
  // // Xóa phòng học
  // const deleteClassroom = async (classroomCode) => {
  //     try {
  //         const classroomId = getClassroom(classroomCode); // Lấy ID từ cache
  //         console.log("Đang xóa lớp học với ID:", classroomId);

  //         await instance.delete(`/admin/schedule/${classroomId}/destroy`);

  //         console.log(
  //             `Đã xóa lớp học với mã ${classroomCode} và ID ${classroomId}`
  //         );
  //     } catch (err) {
  //         console.error("Không thể xóa lớp học:", err.message);
  //     }
  // };

  return (
    <div className="mx-auto p-10 bg-blue-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-10">
        Quản lý lịch học
      </h2>

      {loading && <p>Đang tải dữ liệu...</p>}
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-8">
        {/* Kiểm tra nếu có khóa học */}
        {courses.length > 0 ? (
          courses.map((course) => {
            // Xác định màu sắc cho trạng thái của khóa học
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
                {/* Tiêu đề khóa học với khả năng mở rộng */}
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
                      <span className="font-semibold">Ngày bắt đầu:</span>{" "}
                      {moment(course.start_date).format("DD/MM/YYYY")}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">Ngày kết thúc:</span>{" "}
                      {moment(course.end_date).format("DD/MM/YYYY")}
                    </p>
                    <p className={`text-xl text-gray-700`}>
                      Trạng thái:{" "}
                      <span className={`text-xl ${statusColor}`}>
                        {course.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Nếu khóa học đang được mở rộng, hiển thị các kỳ học và ngành học */}
                {expandedCourse === course.id && (
                  <div className="mt-6 space-y-6">
                    {/* Kiểm tra nếu có kỳ học */}
                    {semestersByCourse[course.id] &&
                    semestersByCourse[course.id].length > 0 ? (
                      semestersByCourse[course.id].map((semester) => (
                        <div
                          key={semester.id}
                          className="bg-gray-50 rounded-lg p-6"
                        >
                          {/* Tiêu đề kỳ học với khả năng mở rộng */}
                          <div
                            onClick={() =>
                              toggleSemester(course.id, semester.id)
                            }
                            className="cursor-pointer flex items-center justify-between"
                          >
                            <h4 className="text-3xl font-semibold text-blue-500">
                              {semester.name}
                            </h4>
                            {expandedSemester === semester.id ? (
                              <DownOutlined className="ml-2 text-2xl" />
                            ) : (
                              <RightOutlined className="ml-2 text-2xl" />
                            )}
                          </div>

                          {/* Nếu kỳ học đang được mở rộng, hiển thị các ngành học */}
                          {expandedSemester === semester.id && (
                            <div className="mt-4 space-y-4">
                              {/* Kiểm tra nếu có ngành học */}
                              {majorsByCourse[course.id] &&
                              majorsByCourse[course.id].length > 0 ? (
                                majorsByCourse[course.id].map((major) => (
                                  <div
                                    key={major.id}
                                    className="bg-white rounded-lg p-6 shadow"
                                  >
                                    {/* Tiêu đề ngành học với khả năng mở rộng */}
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
                                      {major.name}
                                    </h5>

                                    {/* Nếu ngành học đang được mở rộng, hiển thị các môn học */}
                                    {expandedMajor === major.id && (
                                      <div className="mt-4 space-y-4">
                                        {/* Kiểm tra nếu có môn học */}
                                        {subjectsByMajor[
                                          `${course.id}_${semester.id}_${major.id}`
                                        ] &&
                                        subjectsByMajor[
                                          `${course.id}_${semester.id}_${major.id}`
                                        ].length > 0 ? (
                                          subjectsByMajor[
                                            `${course.id}_${semester.id}_${major.id}`
                                          ].map((subject) => (
                                            <div
                                              key={subject.id}
                                              className="bg-white p-6 shadow rounded-lg"
                                            >
                                              {/* Tiêu đề môn học với khả năng mở rộng */}
                                              <h6
                                                onClick={() =>
                                                  toggleSubject(subject.id)
                                                }
                                                className="text-xl font-semibold text-indigo-600 cursor-pointer"
                                              >
                                                {subject.name}
                                              </h6>
                                              {/* Nếu môn học đang được mở rộng, hiển thị danh sách phòng học */}
                                              {expandedSubject ===
                                                subject.id && (
                                                <div>
                                                  {/* Hiển thị danh sách phòng học */}
                                                  {classroomsBySubject[
                                                    subject.id
                                                  ] &&
                                                  classroomsBySubject[
                                                    subject.id
                                                  ].length > 0 ? (
                                                    classroomsBySubject[
                                                      subject.id
                                                    ].map((classroom) => (
                                                      <div
                                                        key={classroom.id}
                                                        className="bg-gray-50 p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-200"
                                                        onClick={() =>
                                                          handleClassroomClick(
                                                            classroom.id,
                                                            subject.id,
                                                            major.id
                                                          )
                                                        }
                                                      >
                                                        <p className="text-xl font-bold text-gray-700">
                                                          Lớp học:{" "}
                                                          {classroom.classroom}
                                                        </p>
                                                        <p>
                                                          Phòng:{" "}
                                                          {classroom.room}
                                                        </p>
                                                        <p>
                                                          Ngày bắt đầu:{" "}
                                                          {classroom.start_date}
                                                        </p>
                                                        <p>
                                                          Link học:{" "}
                                                          {classroom.link ===
                                                          "NULL"
                                                            ? "Không có"
                                                            : classroom.link}
                                                        </p>
                                                      </div>
                                                    ))
                                                  ) : (
                                                    <p>
                                                      Không có phòng học nào
                                                      được tìm thấy.
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
                                                        courseId: course.id,
                                                        semesterId: semester.id,
                                                        majorId: major.id,
                                                        subjectId: subject.id,
                                                        subjectName:
                                                          subject.name,
                                                      }}
                                                    >
                                                      Tạo lịch học mới
                                                    </Link>
                                                  </Button>
                                                </div>
                                              )}
                                            </div>
                                          ))
                                        ) : (
                                          <p>Đang tải môn học...</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <p>Đang tải ngành học...</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Chưa có kỳ học cho khóa học này.</p>
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
