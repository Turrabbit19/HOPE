
import React, { useEffect, useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../../config/axios";
import moment from "moment";

const ScheduleList = () => {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [expandedMajor, setExpandedMajor] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [coursesBySemester, setCoursesBySemester] = useState({});
  const [majorsBySemester, setMajorsBySemester] = useState({});
  const [subjectsByMajor, setSubjectsByMajor] = useState({});
  const [classroomsBySubject, setClassroomsBySubject] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classroomsCache, setClassroomsCache] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSemesters = async () => {
      setError(null);
      try {
        const response = await instance.get("admin/all/semesters");
        setSemesters(response.data.data);
        console.log("Semesters data:", response.data.data);
      } catch (err) {
        setError("Không thể lấy dữ liệu kỳ học.");
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  const fetchCoursesForSemester = async (semesterId) => {
    setError(null);
    try {
      const response = await instance.get(
        `admin/semester/${semesterId}/courses`
      );
      console.log(`Courses for semester ${semesterId}:`, response.data.courses);
      setCoursesBySemester((prev) => ({
        ...prev,
        [semesterId]: response.data.courses || [],
      }));
    } catch (err) {
      setError("Không thể lấy dữ liệu khóa học cho kỳ học này.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách ngành học cho một khóa học cụ thể
  const fetchMajorsForSemester = async (semesterId, courseId) => {
    setError(null);
    try {
      const response = await instance.get(
        `admin/semester/${semesterId}/${courseId}/majors`
      );
      console.log("Majors data:", response.data.majors); // Kiểm tra dữ liệu majors
      setMajorsBySemester((prev) => ({
        ...prev,
        [`${semesterId}_${courseId}`]: response.data.majors || [],
      }));
    } catch (err) {
      setError("Không thể lấy dữ liệu ngành học cho kỳ học này.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách môn học cho một ngành học cụ thể
  const fetchSubjectsForMajor = async (courseId, semesterId, majorId) => {
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

  const fetchClassroomsForSubject = async (courseId, subjectId) => {
    setError(null);
    try {
      const response = await instance.get(
        `admin/schedules/${courseId}/${subjectId}/classrooms`
      );
      console.log(
        `Classrooms for subject ${subjectId} in course ${courseId}:`,
        response.data.data
      );
      setClassroomsBySubject((prev) => ({
        ...prev,
        [`${courseId}_${subjectId}`]: response.data.data || [],
      }));
    } catch (err) {
      setError("Không thể lấy dữ liệu lớp học cho môn học này.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mở rộng/tắt mở rộng cho từng khóa học, kỳ học, ngành học và môn học
  const toggleSemester = (semesterId) => {
    setExpandedSemester((prev) => {
      const newSemester = prev === semesterId ? null : semesterId;

      // Chỉ gọi API nếu không có khóa học cho kỳ học này
      if (newSemester && !coursesBySemester[semesterId]) {
        fetchCoursesForSemester(newSemester);
      }

      return newSemester;
    });
    // Reset các trạng thái con khi thay đổi kỳ học
    setExpandedCourse(null);
    setExpandedMajor(null);
    setExpandedSubject(null);
  };

  const toggleCourse = (semesterId, courseId) => {
    setExpandedCourse((prev) => {
      const newCourse = prev === courseId ? null : courseId;

      if (newCourse && !majorsBySemester[`${semesterId}_${courseId}`]) {
        fetchMajorsForSemester(semesterId, newCourse); // Gọi API nếu chưa có dữ liệu
      }

      return newCourse;
    });

    setExpandedMajor(null);
    setExpandedSubject(null);
  };

  const toggleMajor = (semesterId, courseId, majorId) => {
    setExpandedMajor((prev) => {
      const newMajor = prev === majorId ? null : majorId;

      if (
        newMajor &&
        !subjectsByMajor[`${semesterId}_${courseId}_${majorId}`]
      ) {
        fetchSubjectsForMajor(semesterId, courseId, newMajor);
      }

      return newMajor;
    });

    // Reset môn học khi thay đổi ngành học
    setExpandedSubject(null);
  };

  const toggleSubject = (courseId, subjectId) => {
    setExpandedSubject((prev) => {
      const newSubject = prev === subjectId ? null : subjectId;

      if (newSubject && !classroomsBySubject[`${courseId}_${subjectId}`]) {
        fetchClassroomsForSubject(courseId, newSubject);
      }

      return newSubject;
    });
  };

  const handleAutoAssignStudents = async (
    semesterId,
    courseId,
    majorId,
    subjectId
  ) => {
    setLoading(true);
    try {
      const response = await instance.post(
        `http://localhost:8000/api/admin/schedules/${semesterId}/${courseId}/${majorId}/${subjectId}/random`
      );

      const updatedSubject = await instance.get(
        `admin/semester/${semesterId}/course/${courseId}/major/${majorId}/subjects`
      );
      setSubjectsByMajor((prev) => ({
        ...prev,
        [`${courseId}_${semesterId}_${majorId}`]:
          updatedSubject.data.subjects || [],
      }));

      const updatedClassrooms = await instance.get(
        `admin/schedules/${courseId}/${subjectId}/classrooms`
      );
      setClassroomsBySubject((prev) => ({
        ...prev,
        [`${courseId}_${subjectId}`]: updatedClassrooms.data.data || [],
      }));

      // Nếu thành công, hiển thị thông báo
      notification.success({
        message: "Thành công",
        description: "Sinh viên đã được phân bổ tự động.",
      });
    } catch (err) {
      // Nếu có lỗi, hiển thị thông báo lỗi
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi phân bổ sinh viên.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEmptySchedules = async (
    semesterId,
    courseId,
    majorId,
    subjectId
  ) => {
    setLoading(true);
    try {
      const response = await instance.delete(
        `http://localhost:8000/api/admin/schedules/${semesterId}/${courseId}/${majorId}/${subjectId}/delete`
      );

      const updatedClassrooms = await instance.get(
        `admin/schedules/${courseId}/${subjectId}/classrooms`
      );

      setClassroomsBySubject((prev) => ({
        ...prev,
        [`${courseId}_${subjectId}`]: updatedClassrooms.data.data || [],
      }));

      notification.success({
        message: "Thành công",
        description: "Đã xóa các lớp học không có sinh viên.",
      });
    } catch (err) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi loại bỏ các lớp học.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấp vào phòng học
  const handleClassroomClick = (classroomId) => {
    console.log("ID của phòng học:", classroomId);
    navigate(`details/${classroomId}`);
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  }

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
        {semesters.length > 0 ? (
          semesters.map((semester) => {
            // Xác định màu sắc cho trạng thái của khóa học
            let statusColor = "";
            switch (semester.status) {
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
                key={semester.id}
                className="p-8 bg-white rounded-lg shadow-lg space-y-6"
              >
                {/* Tiêu đề khóa học với khả năng mở rộng */}
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
                      <span className="font-semibold">Ngày bắt đầu:</span>{" "}
                      {moment(semester.start_date).format("DD/MM/YYYY")}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">Ngày kết thúc:</span>{" "}
                      {moment(semester.end_date).format("DD/MM/YYYY")}
                    </p>
                    <p className={`text-xl text-gray-700`}>
                      Trạng thái:{" "}
                      <span className={`text-xl ${statusColor}`}>
                        {semester.status}
                      </span>
                    </p>
                  </div>
                </div>

                {expandedSemester === semester.id && (
                  <div className="mt-6 space-y-6">
                    {/* Kiểm tra nếu có kỳ học */}
                    {coursesBySemester[semester.id] &&
                    coursesBySemester[semester.id].length > 0 ? (
                      coursesBySemester[semester.id].map((course) => (
                        <div
                          key={course.id}
                          className="bg-gray-50 rounded-lg p-6"
                        >
                          {/* Tiêu đề kỳ học với khả năng mở rộng */}
                          <div
                            onClick={() => toggleCourse(semester.id, course.id)}
                            className="cursor-pointer flex items-center justify-between"
                          >
                            <h4 className="text-3xl font-semibold text-blue-500">
                              Kì {course.order}: {course.course_name}
                            </h4>
                            {expandedCourse === course.id ? (
                              <DownOutlined className="ml-2 text-2xl" />
                            ) : (
                              <RightOutlined className="ml-2 text-2xl" />
                            )}
                          </div>

                          {/* Nếu kỳ học đang được mở rộng, hiển thị các ngành học */}
                          {expandedCourse === course.id && (
                            <div className="mt-4 space-y-4">
                              {/* Kiểm tra nếu có ngành học */}
                              {majorsBySemester[
                                `${semester.id}_${course.id}`
                              ] &&
                              majorsBySemester[`${semester.id}_${course.id}`]
                                .length > 0 ? (
                                majorsBySemester[
                                  `${semester.id}_${course.id}`
                                ].map((major) => (
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
                                      className="flex items-center justify-between text-2xl font-medium text-green-600 cursor-pointer"
                                    >
                                      <span>{major.name}</span>
                                      <span className="ml-4 text-xl text-gray-500">
                                        Số lượng sinh viên:{" "}
                                        {major.student_count}{" "}
                                        {/* Giả sử bạn có số lượng sinh viên là major.studentCount */}
                                      </span>
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
                                                  toggleSubject(
                                                    course.id,
                                                    subject.id
                                                  )
                                                }
                                                className="text-xl font-semibold text-indigo-600 cursor-pointer transition-colors duration-300 hover:text-indigo-800"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xl">
                                                    {subject.name}
                                                  </span>
                                                  <span
                                                    className={`text-xl font-medium ${
                                                      subject.student_count /
                                                        subject.total_student_count >=
                                                      0.75
                                                        ? "text-green-600"
                                                        : subject.student_count /
                                                            subject.total_student_count >=
                                                          0.5
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                    }`}
                                                  >
                                                    {subject.student_count}/
                                                    {
                                                      subject.total_student_count
                                                    }
                                                  </span>
                                                </div>
                                              </h6>

                                              {/* Nếu môn học đang được mở rộng, hiển thị danh sách phòng học */}
                                              {expandedSubject ===
                                                subject.id && (
                                                <div>
                                                  {/* Hiển thị danh sách phòng học dưới dạng 2 cột */}
                                                  {classroomsBySubject[
                                                    `${course.id}_${subject.id}`
                                                  ] &&
                                                  classroomsBySubject[
                                                    `${course.id}_${subject.id}`
                                                  ].length > 0 ? (
                                                    <div className="grid grid-cols-2 gap-4">
                                                      {classroomsBySubject[
                                                        `${course.id}_${subject.id}`
                                                      ].map((classroom) => (
                                                        <div
                                                          key={classroom.id}
                                                          className="flex justify-between bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-200"
                                                          onClick={() =>
                                                            handleClassroomClick(
                                                              classroom.id
                                                            )
                                                          }
                                                        >
                                                          {/* Phần thông tin lớp học */}
                                                          <div className="flex-1">
                                                            <p className="text-2xl font-bold text-gray-700">
                                                              Lớp học:{" "}
                                                              {classroom.code}
                                                            </p>
                                                            <p>
                                                              Giảng viên:{" "}
                                                              {
                                                                classroom.teacher
                                                              }
                                                            </p>
                                                            <p>
                                                              Phòng:{" "}
                                                              {classroom.room}
                                                            </p>
                                                            <p>
                                                              Ngày bắt đầu:{" "}
                                                              {
                                                                classroom.start_date
                                                              }
                                                            </p>
                                                            <p>
                                                              Link học:{" "}
                                                              {classroom.link ===
                                                              "NULL"
                                                                ? "Không có"
                                                                : classroom.link}
                                                            </p>
                                                          </div>

                                                          {/* Phần số lượng sinh viên */}
                                                          <div className="flex items-center justify-center bg-gray-100 p-6 rounded-lg w-1/3 shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                                                            <div className="flex flex-col items-center justify-center">
                                                              <div className="flex items-center space-x-2">
                                                                {/* Số lượng SV */}
                                                                <p
                                                                  className={`text-3xl font-bold ${
                                                                    classroom.students >=
                                                                    30
                                                                      ? "text-green-600"
                                                                      : classroom.students >=
                                                                        10
                                                                      ? "text-yellow-500"
                                                                      : "text-red-600"
                                                                  }`}
                                                                >
                                                                  {
                                                                    classroom.students
                                                                  }{" "}
                                                                  /{" "}
                                                                  {
                                                                    classroom.max_students
                                                                  }
                                                                </p>
                                                                {/* Biểu tượng trạng thái */}
                                                                {classroom.students >=
                                                                30 ? (
                                                                  <span className="text-green-600 text-3xl">
                                                                    &#10003;
                                                                  </span>
                                                                ) : classroom.students >=
                                                                  10 ? (
                                                                  <span className="text-yellow-500 text-3xl">
                                                                    &#9888;
                                                                  </span>
                                                                ) : (
                                                                  <span className="text-red-600 text-3xl">
                                                                    &#10060;
                                                                  </span>
                                                                )}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  ) : (
                                                    <p>
                                                      Không có phòng học nào
                                                      được tìm thấy.
                                                    </p>
                                                  )}

                                                  <div
                                                    style={{
                                                      paddingTop: "20px",
                                                    }}
                                                  >
                                                    {/* Button Container */}
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      {/* Group button - "Tạo lịch học mới" và "Phân bổ sinh viên tự động" ở bên trái */}
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          gap: "10px",
                                                        }}
                                                      >
                                                        {/* Button Tạo lịch học mới (màu xanh dương) */}
                                                        <Button
                                                          className="font-bold flex items-center gap-2 justify-center px-4 py-2 border rounded-md text-[#1167B4] border-[#1167B4] hover:bg-[#1167B4] hover:text-white transition duration-300"
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
                                                              majorId: major.id,
                                                              subjectId:
                                                                subject.id,
                                                            }}
                                                          >
                                                            Tạo lịch học mới
                                                          </Link>
                                                        </Button>

                                                        {/* Button Phân bổ sinh viên tự động (màu xanh lá) */}
                                                        <Button
                                                          className="font-bold flex items-center gap-2 justify-center px-4 py-2 border rounded-md text-green-500 border-green-500 hover:bg-green-500 hover:text-white transition duration-300"
                                                          onClick={() =>
                                                            handleAutoAssignStudents(
                                                              semester.id,
                                                              course.id,
                                                              major.id,
                                                              subject.id
                                                            )
                                                          }
                                                          loading={loading}
                                                          disabled={loading}
                                                        >
                                                          Phân bổ sinh viên tự
                                                          động
                                                        </Button>
                                                      </div>

                                                      {/* Button Loại bỏ lớp không có sinh viên (màu đỏ) ở góc phải */}
                                                      <Button
                                                        className="font-bold flex items-center gap-2 justify-center px-4 py-2 border rounded-md text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition duration-300"
                                                        onClick={() =>
                                                          deleteEmptySchedules(
                                                            semester.id,
                                                            course.id,
                                                            major.id,
                                                            subject.id
                                                          )
                                                        }
                                                        loading={loading}
                                                        disabled={loading}
                                                      >
                                                        Loại bỏ các lớp không có
                                                        sinh viên
                                                      </Button>
                                                    </div>
                                                  </div>
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