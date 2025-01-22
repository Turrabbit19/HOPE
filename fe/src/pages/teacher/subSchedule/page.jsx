import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Typography,
  notification,
  Spin,
  Modal,
} from "antd";
import instance from "../../../config/axios"; // Ensure axios instance is configured for your API requests
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const SubSchedulePage = () => {
  const navigate = useNavigate();

  const [subSchedules, setSubSchedules] = useState([]);
  const [students, setStudents] = useState([]); // State for students
  const [attendanceStatus, setAttendanceStatus] = useState({}); // Track attendance status for students
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isAttendanceSubmitted, setIsAttendanceSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Check if the user is logged in by checking for the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if token is not found
    }
  }, [navigate]);

  // Fetch sub schedules
  const fetchSubSchedules = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        "http://127.0.0.1:8000/api/teacher/get-sub-schedules"
      );
      if (response.status === 200) {
        setSubSchedules(response.data.data || []);
      } else {
        notification.error({
          message: "Error",
          description: "Unable to load substitute schedules.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Unable to load substitute schedules.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch students for a particular schedule and lesson
  const fetchStudents = async (scheduleId, lessonId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/teacher/schedule/${scheduleId}/${lessonId}/students`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }

      const data = await response.json();
      if (data.ListStudents && Array.isArray(data.ListStudents)) {
        setStudents(data.ListStudents);
        const initialStatus = {};
        data.ListStudents.forEach((student) => {
          initialStatus[student.student_id] =
            student.status === "Có mặt" ? 1 : 0;
        });
        setAttendanceStatus(initialStatus);
        setIsAttendanceSubmitted(data.lessonStatus === "Đã hoàn thành");
      } else {
        setStudents([]);
        setError("No students found for this class.");
      }
    } catch (err) {
      setError("Unable to fetch student list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle attendance marking
  const handleAttend = async () => {
    if (!selectedSchedule?.id || !selectedSchedule?.lesson_id) {
      notification.error({
        message: "Lỗi",
        description: "Thông tin lớp học hoặc buổi học không hợp lệ.",
      });
      return;
    }

    const attendanceData = students.map((student) => ({
      student_id: student.student_id,
      status: attendanceStatus[student.student_id] === 1 ? "1" : "0",
    }));

    if (attendanceData.length === 0) {
      notification.error({
        message: "Lỗi",
        description: "Điểm danh không thể thực hiện vì không có sinh viên nào.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/teacher/attendance/${selectedSchedule.id}/${selectedSchedule.lesson_id}/mark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ attendance: attendanceData }), // Make sure "attendance" is wrapped
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật điểm danh.");
      }

      notification.success({
        message: "Điểm danh thành công",
        description: "Điểm danh của bạn đã được ghi nhận.",
      });
      setIsAttendanceSubmitted(true);
    } catch (err) {
      notification.error({
        message: "Lỗi",
        description:
          err.message || "Không thể cập nhật điểm danh. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  // Open the attendance modal for a given schedule and lesson
  const handleOpenModal = (scheduleId, lessonId) => {
    if (scheduleId && lessonId) {
      setSelectedSchedule({ id: scheduleId, lesson_id: lessonId });
      fetchStudents(scheduleId, lessonId);
      setIsModalVisible(true);
    } else {
      notification.error({
        message: "Error",
        description: "Invalid schedule or lesson ID.",
      });
    }
  };

  // Close the attendance modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchSubSchedules();
  }, []);

  const memoizedStudents = useMemo(() => students, [students]);

  // Update attendance status for a student
  const handleChangeStatus = (studentId, newStatus) => {
    setAttendanceStatus((prevState) => ({
      ...prevState,
      [studentId]: newStatus,
    }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Substitute Teaching Schedule
      </Title>
      {loading ? (
        <Spin size="large" tip="Loading substitute schedules..." />
      ) : subSchedules.length > 0 ? (
        <Row gutter={[24, 24]}>
          {subSchedules.map((schedule) => (
            <Col xs={24} md={12} key={schedule.id}>
              <Card className="mt-4">
                <Title level={4}>{schedule.subject_name}</Title>
                <Descriptions
                  column={1}
                  bordered
                  size="small"
                  style={{ marginTop: 16 }}
                >
                  <Descriptions.Item label="Lesson">
                    {schedule.lesson_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {schedule.lesson_description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    {schedule.study_date}
                  </Descriptions.Item>
                  <Descriptions.Item label="Room">
                    {schedule.room || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Shift">
                    {schedule.shift || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Classroom">
                    {schedule.classroom || "N/A"}
                  </Descriptions.Item>
                </Descriptions>

                <Button
                  style={{ marginTop: 10 }}
                  onClick={() =>
                    handleOpenModal(schedule.schedule_id, schedule.lesson_id)
                  }
                >
                  Mark Attendance
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Title level={4}>No substitute schedules available</Title>
        </Card>
      )}

      {/* Modal to mark attendance */}
      <Modal
        title="Mark Attendance"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleAttend}
            disabled={isAttendanceSubmitted}
          >
            Mark Attendance
          </Button>,
        ]}
      >
        <p>
          Do you want to mark attendance for the class{" "}
          <strong>{selectedSchedule?.subject_name}</strong> on{" "}
          {moment(selectedSchedule?.study_date).format("DD/MM/YYYY")}?
        </p>

        <div className="overflow-x-auto max-h-[70vh] border border-gray-200 rounded-lg">
          <table className="min-w-full bg-white overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xl font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Student ID
                </th>
                <th className="py-3 px-6 text-left text-xl font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Photo
                </th>
                <th className="py-3 px-6 text-left text-xl font-medium text-gray-500 uppercase tracking-wider w-2/6">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-xl font-medium text-gray-500 uppercase tracking-wider w-2/6">
                  Attendance Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {memoizedStudents.map((student) => (
                <tr
                  key={student.student_id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="py-4 px-6 text-gray-900 text-xl">
                    {student.student_code || "N/A"}
                  </td>
                  <td className="py-4 px-6">
                    {student.student_avatar ? (
                      <img
                        src={student.student_avatar}
                        alt={student.student_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 font-semibold text-lg">
                          {student.student_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    {student.student_name}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={attendanceStatus[student.student_id] || 0}
                      onChange={(e) => {
                        handleChangeStatus(
                          student.student_id,
                          Number(e.target.value)
                        );
                      }}
                    >
                      <option value={1}>Present</option>
                      <option value={0}>Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default SubSchedulePage;
