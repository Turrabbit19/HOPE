// ScheduleAdd.jsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Space,
  Select,
  Tabs,
  Card,
  message,
  Typography,
  Spin,
  Modal,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import qs from "qs";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const ScheduleAdd = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  // Trích xuất các ID cần thiết từ state
  const { courseId, semesterId, majorId, subjectId, subjectName } = state || {};
  console.log("Received in ScheduleAdd - majorId:", majorId);

  // Các state để lưu trữ dữ liệu từ API
  const [shifts, setShifts] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShifts, setLoadingShifts] = useState(true);

  // State hiện tại của tab
  const [activeTab, setActiveTab] = useState("configure"); // Tab hiện tại
  const [selectedClasses, setSelectedClasses] = useState([]); // Các lớp học đã chọn
  const [classDetails, setClassDetails] = useState({}); // Chi tiết cho mỗi lớp
  const [teacherAssignments, setTeacherAssignments] = useState({}); // Phân công giáo viên

  // State để lưu mapping classroom_id => schedule_id
  const [createdSchedules, setCreatedSchedules] = useState({});

  // State để tính toán ngày kết thúc
  const [isCalculatingEndDate, setIsCalculatingEndDate] = useState(false);

  // Giám sát các trường trong form
  const learningMethod = Form.useWatch("learningMethod", form);
  const startDate = Form.useWatch("startDate", form);
  const repeatDays = Form.useWatch("repeatDays", form);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleCal, setIsModalVisibleCal] = useState(false);

  const handleModalOk = () => {
    navigate("/admin/classrooms", {
      state: {
        subjectId: subjectId,
      },
    });
  };
  const handleModalOk1 = () => {
    navigate(`/admin/list-subject/detail/${subjectId}`, {
      state: {
        subjectName: subjectName,
      },
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  // Fetch dữ liệu khi component mount
  useEffect(() => {
    // Kiểm tra nếu thiếu thông tin cần thiết
    if (!courseId || !semesterId || !majorId || !subjectId) {
      message.error("Thiếu thông tin cần thiết để thêm lịch học!");
      navigate("/schedule-list");
      return;
    }

    console.log("Major ID:", majorId);

    // Hàm để lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Gọi các API song song
        const [shiftsRes, classroomsRes, teachersRes, roomsRes] =
          await Promise.all([
            axios.get("http://localhost:8000/api/admin/shifts", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            axios.get(
              `http://localhost:8000/api/admin/${subjectId}/classrooms/without-schedule`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            axios.get(
              `http://localhost:8000/api/admin/major/${majorId}/teachers`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            axios.get("http://localhost:8000/api/admin/rooms", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        // Xử lý dữ liệu shifts
        console.log("Shifts API response:", shiftsRes.data);
        let shiftsData = shiftsRes.data;
        if (Array.isArray(shiftsData)) {
          setShifts(shiftsData);
        } else if (Array.isArray(shiftsData.data)) {
          setShifts(shiftsData.data);
        } else {
          throw new Error("Dữ liệu shifts không hợp lệ.");
        }

        // Xử lý dữ liệu classrooms
        console.log("Classrooms API response:", classroomsRes.data);
        let classroomsData = classroomsRes.data;
        if (Array.isArray(classroomsData)) {
          setClassrooms(classroomsData);
        } else if (Array.isArray(classroomsData.classrooms)) {
          setClassrooms(classroomsData.classrooms);
        } else {
          throw new Error("Dữ liệu classrooms không hợp lệ.");
        }

        // Xử lý dữ liệu rooms
        console.log("Rooms API response:", roomsRes.data.data);
        let roomsData = roomsRes.data.data;
        if (Array.isArray(roomsData)) {
          setRooms(roomsData);
        } else if (Array.isArray(roomsData.rooms)) {
          setRooms(roomsData.rooms);
        } else {
          throw new Error("Dữ liệu rooms không hợp lệ.");
        }

        // Xử lý dữ liệu teachers
        console.log("Teachers API response:", teachersRes.data);
        let teachersData = teachersRes.data.listTeachers;
        if (Array.isArray(teachersData)) {
          setTeachers(teachersData);
        } else {
          throw new Error("Dữ liệu teachers không hợp lệ.");
        }

        setLoading(false);
        setLoadingShifts(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error(`Không thể tải dữ liệu cần thiết: ${error.message}`);
        setLoading(false);
        setLoadingShifts(false);
      }
    };

    fetchData();
  }, [courseId, semesterId, majorId, subjectId, navigate]);

  // useEffect để tính toán ngày kết thúc khi startDate hoặc repeatDays thay đổi
  useEffect(() => {
    // Hàm để tính toán ngày kết thúc
    const calculateEndDate = async () => {
      if (!startDate || !repeatDays || repeatDays.length === 0) {
        // Không tính toán nếu thiếu trường cần thiết
        return;
      }

      if (!subjectId) {
        message.error("Thiếu subject_id để tính toán ngày kết thúc!");
        return;
      }

      setIsCalculatingEndDate(true);

      try {
        const token = localStorage.getItem("token");
        const dayMapping = {
          "Thứ 2": 2,
          "Thứ 3": 3,
          "Thứ 4": 4,
          "Thứ 5": 5,
          "Thứ 6": 6,
          "Thứ 7": 7,
        };

        const daysOfWeek = repeatDays.map((day) => dayMapping[day]);

        const response = await axios.get(
          "http://localhost:8000/api/admin/calculate-end-date",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              start_date: startDate.format("YYYY-MM-DD"), // Định dạng "YYYY-MM-DD"
              subject_id: subjectId,
              days_of_week: daysOfWeek, // Gửi dưới dạng mảng
            },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "brackets" }), // Sử dụng arrayFormat 'brackets' để gửi mảng đúng cách
          }
        );

        if (response.data && response.data.end_date) {
          const endDate = moment(response.data.end_date, "YYYY-MM-DD");
          form.setFieldsValue({ endDate });
          message.success("Ngày kết thúc đã được tính toán tự động!");
        } else {
          message.error("Không nhận được ngày kết thúc từ API.");
          setIsModalVisibleCal(true);
        }
      } catch (error) {
        setIsModalVisibleCal(true);
        console.error("Error calculating end date:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const apiErrors = error.response.data.errors;
          Object.values(apiErrors).forEach((errArray) => {
            errArray.forEach((errMsg) => {
              message.error(errMsg);
            });
          });
        } else {
          setIsModalVisibleCal(true);
          message.error("Không thể tính toán ngày kết thúc.");
        }
      } finally {
        setIsCalculatingEndDate(false);
      }
    };

    calculateEndDate();
  }, [startDate, repeatDays, subjectId, form]);

  // Hàm kiểm tra xem giáo viên có sẵn sàng hay không
  const isTeacherAvailable = (teacherId, shiftId, currentClassId) => {
    return !Object.entries(teacherAssignments).some(
      ([classId, assignedTeacherId]) => {
        if (classId === currentClassId) return false; // Bỏ qua lớp hiện tại
        const assignedShiftId = classDetails[classId]?.session;
        return assignedTeacherId === teacherId && assignedShiftId === shiftId;
      }
    );
  };

  // Xử lý khi chọn lớp học
  const handleClassChange = (values) => {
    setSelectedClasses(values);
    // Cập nhật classDetails chỉ giữ lại các lớp đã chọn
    setClassDetails((prevDetails) => {
      const updatedDetails = {};
      values.forEach((classId) => {
        if (prevDetails[classId]) {
          updatedDetails[classId] = prevDetails[classId];
        } else {
          updatedDetails[classId] = {
            session: null,
            classLink: "",
            classRoom: null,
          };
        }
      });
      return updatedDetails;
    });
    // Nếu thay đổi lớp sau khi phân công, reset lại
    if (activeTab === "addTeacher") {
      setActiveTab("configure");
      setTeacherAssignments({});
      setCreatedSchedules({});
    }
  };

  // Xử lý thay đổi giá trị trong form
  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.learningMethod) {
      const updatedDetails = {};
      selectedClasses.forEach((classId) => {
        updatedDetails[classId] = {
          session: classDetails[classId]?.session || null,
          classLink: "",
          classRoom: null,
        };
      });
      setClassDetails(updatedDetails);
      form.setFieldsValue({
        classDetails: updatedDetails,
      });
    }
  };

  // Xử lý khi chuyển tab
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Xử lý khi chọn giáo viên cho một lớp
  const handleTeacherSelect = (classId, teacherId) => {
    const shiftId = classDetails[classId]?.session;
    if (!shiftId) {
      message.error("Vui lòng chọn ca học trước!");
      return;
    }

    // Kiểm tra xem giáo viên có sẵn sàng hay không
    const available = isTeacherAvailable(teacherId, shiftId, classId);
    if (!available) {
      message.error("Giáo viên này đã bị trùng lịch dạy với lớp khác!");
      return;
    }

    // Cập nhật phân công giáo viên
    setTeacherAssignments((prev) => ({
      ...prev,
      [classId]: teacherId,
    }));
    message.success("Phân công giáo viên thành công!");
  };

  // Xử lý khi submit cấu hình lớp học
  const handleFinish = (values) => {
    console.log("Form values: ", values);
    // Lưu các lớp đã chọn
    setSelectedClasses(values.classes);
    // Lưu chi tiết lớp học (chỉ session và classRoom/classLink)
    const details = {};
    values.classes.forEach((classId) => {
      details[classId] = {
        session: values.classDetails?.[classId]?.session || null,
        classLink: values.classDetails?.[classId]?.classLink || "",
        classRoom: values.classDetails?.[classId]?.classRoom || null,
      };
    });
    setClassDetails(details);
    // Reset phân công giáo viên
    setTeacherAssignments({});
    // Chuyển sang tab phân công giáo viên
    setActiveTab("addTeacher");
    message.success("Cấu hình đã được lưu thành công!");
  };

  const assignTeachers = async (payload) => {
    console.log("Assign Teachers Payload:", payload);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/admin/schedules/assign`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Phân công giáo viên thành công!");
        // Điều hướng đến danh sách lịch học
        navigate("/admin/list-schedule");
      } else {
        message.error("Phân công giáo viên thất bại!");
      }
    } catch (error) {
      console.error("Error assigning teachers:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(
          `Phân công giáo viên thất bại: ${error.response.data.error}`
        );
      } else {
        message.error("Phân công giáo viên thất bại!");
      }
    }
  };

  // Hàm render các trường session và classRoom/classLink cho mỗi lớp
  const renderClassSessionFields = () => {
    if (loadingShifts) {
      return (
        <div className="flex justify-center items-center">
          <Spin tip="Đang tải ca học..." />
        </div>
      );
    }

    return selectedClasses.map((classId) => {
      const classData = classrooms.find((c) => c.id === classId);
      const className = classData ? classData.code : `ID ${classId}`;
      console.log(className);

      return (
        <TabPane tab={`Lớp ${className}`} key={classId}>
          <Card title={`Ca Học Cho Lớp ${className}`}>
            <Form.Item
              label="Ca Học"
              name={["classDetails", classId, "session"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ca học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn ca học"
                optionFilterProp="children"
              >
                {shifts.map((shift) => (
                  <Option key={shift.id} value={shift.id}>
                    {`${shift.name}: ${shift.start_time} - ${shift.end_time}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Hiển thị classRoom hoặc classLink dựa trên learningMethod */}
            {learningMethod === "online" ? (
              <Form.Item
                label="Link Học Trực Tuyến"
                name={["classDetails", classId, "classLink"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập link học!",
                  },
                ]}
              >
                <Input
                  placeholder="Link học trực tuyến"
                  prefix={<LinkOutlined />}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            ) : learningMethod === "offline" ? (
              <Form.Item
                label="Phòng Học Trực Tiếp"
                name={["classDetails", classId, "classRoom"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phòng học!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn phòng học"
                  optionFilterProp="children"
                >
                  {rooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : null}
          </Card>
        </TabPane>
      );
    });
  };

  // Hàm render form phân công giáo viên
  const renderTeacherAssignment = () => {
    if (selectedClasses.length === 0) {
      return <p>Vui lòng cấu hình lớp học trước khi thêm giáo viên.</p>;
    }

    return (
      <Form
        layout="vertical"
        onFinish={async () => {
          // Kiểm tra xem tất cả các lớp đã được phân công giáo viên chưa
          const allAssigned = selectedClasses.every(
            (classId) => teacherAssignments[classId]
          );
          if (!allAssigned) {
            message.error("Vui lòng phân công giáo viên cho tất cả các lớp!");
            return;
          }

          // Chuẩn bị payload
          const payload = {
            schedules: selectedClasses.map((classId) => ({
              teacher_id: teacherAssignments[classId],
              schedule_id: createdSchedules[String(classId)], // Đảm bảo classId là string
            })),
          };

          console.log("Assign Teachers Payload:", payload); // Log payload

          // Gọi API để phân công giáo viên
          await assignTeachers(payload);
        }}
      >
        {selectedClasses.map((classId) => {
          const classIdNumber = Number(classId);
          const classData = classrooms.find((c) => c.id === classIdNumber);
          const className = classData
            ? classData.name || classData.code
            : `ID ${classId}`;
          const details = classDetails[classId];
          const shiftId = details?.session;
          const shift = shifts.find((s) => s.id === shiftId);
          const classLink = details?.classLink || "";
          const classRoom = details?.classRoom
            ? rooms.find((room) => room.id === details.classRoom)?.name
            : "";

          return (
            <Card
              key={classId}
              title={`Phân Công Giáo Viên Cho Lớp ${className}`}
              style={{ marginBottom: 16 }}
            >
              {/* Hiển thị chi tiết lớp học */}
              <div style={{ marginBottom: 16 }}>
                <Text strong>Ca Học:</Text>{" "}
                {shift
                  ? `${shift.name}: ${shift.start_time} - ${shift.end_time}`
                  : "Chưa chọn"}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Hình Thức Học:</Text>{" "}
                {learningMethod === "online" ? "Trực tuyến" : "Trực tiếp"}
              </div>
              {learningMethod === "online" ? (
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Link Học Trực Tuyến:</Text>{" "}
                  {classLink || "Chưa nhập"}
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Phòng Học Trực Tiếp:</Text>{" "}
                  {classRoom || "Chưa chọn"}
                </div>
              )}

              {/* Chọn Giáo Viên */}
              <Form.Item
                label="Chọn Giáo Viên"
                required
                validateStatus={
                  teacherAssignments[classId] ? "success" : "error"
                }
                help={
                  teacherAssignments[classId] ? "" : "Vui lòng chọn giáo viên!"
                }
              >
                <Select
                  placeholder="Chọn giáo viên"
                  value={teacherAssignments[classId]}
                  onChange={(value) => handleTeacherSelect(classId, value)}
                >
                  {teachers.map((teacher) => (
                    <Option
                      key={teacher.id}
                      value={teacher.id}
                      disabled={
                        !isTeacherAvailable(teacher.id, shiftId, classId)
                      }
                    >
                      {teacher.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          );
        })}

        <Form.Item>
          <Space>
            <Button type="default" onClick={() => setActiveTab("configure")}>
              Quay Lại
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu Phân Công
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="p-6">
      <Modal
        title="Lỗi khi chưa có lớp"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Thêm lớp"
      >
        <p>
          Hiện tại không có lớp cho môn học {subjectName}. Vui lòng thêm lớp
          trước khi xếp lịch.
        </p>
      </Modal>
      <Modal
        title="Lỗi khi chưa có tiết học"
        visible={isModalVisibleCal}
        onOk={handleModalOk1}
        onCancel={handleModalCancel}
        okText="Thêm tiết học"
      >
        <p>
          Hiện tại không có tiết cho môn học {subjectName}. Vui lòng thêm tiết
          học trước khi xếp lịch.
        </p>
      </Modal>
      <h2 className="text-xl font-semibold mb-4">Cấu Hình Thông Tin</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {/* Tab Cấu Hình Lớp Học */}
          <TabPane tab="Cấu Hình Lớp Học" key="configure">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              onValuesChange={handleValuesChange}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              {/* Lựa chọn lớp học (chọn nhiều) */}
              <Form.Item
                label="Lớp Học"
                name="classes"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn lớp học!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  placeholder="Chọn lớp học"
                  optionFilterProp="children"
                  onChange={handleClassChange}
                  disabled={activeTab === "addTeacher"}
                >
                  {classrooms.map((classItem) => (
                    <Option key={classItem.id} value={classItem.id}>
                      {classItem.code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Chọn ngày bắt đầu và kết thúc */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ngày Bắt Đầu"
                    name="startDate"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày bắt đầu!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY" // Định dạng hiển thị "DD-MM-YYYY"
                      style={{ width: "100%" }}
                      disabled={activeTab === "addTeacher"}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ngày Kết Thúc"
                    name="endDate"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày kết thúc!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || !getFieldValue("startDate")) {
                            return Promise.resolve();
                          }
                          if (value.isAfter(getFieldValue("startDate"))) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Ngày kết thúc phải sau ngày bắt đầu!")
                          );
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY" // Định dạng hiển thị "DD-MM-YYYY"
                      style={{ width: "100%" }}
                      disabled={activeTab === "addTeacher"}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Hiển thị loading khi đang tính toán ngày kết thúc */}
              {isCalculatingEndDate && (
                <Row>
                  <Col span={24}>
                    <Spin size="small" tip="Đang tính toán ngày kết thúc..." />
                  </Col>
                </Row>
              )}

              {/* Chọn thời gian lặp */}
              <Form.Item
                label="Thời Gian Lặp"
                name="repeatDays"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ít nhất một ngày!",
                  },
                ]}
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <Row>
                    {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map(
                      (day, index) => (
                        <Col span={4} key={`${day}-${index}`}>
                          <Checkbox value={day}>{day}</Checkbox>
                        </Col>
                      )
                    )}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              {/* Chọn hình thức học */}
              <Form.Item
                label="Hình Thức Học"
                name="learningMethod"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình thức học!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn hình thức học"
                  optionFilterProp="children"
                  disabled={activeTab === "addTeacher"}
                >
                  <Option value="online">Trực tuyến</Option>
                  <Option value="offline">Trực tiếp</Option>
                </Select>
              </Form.Item>

              {/* Các trường cụ thể cho từng lớp */}
              {selectedClasses.length > 0 && (
                <Tabs style={{ marginTop: 24 }}>
                  {renderClassSessionFields()}
                </Tabs>
              )}

              {/* Các nút hành động */}
              <Form.Item style={{ marginTop: 24 }}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    type="default"
                    onClick={() => form.resetFields()}
                    disabled={activeTab === "addTeacher"}
                  >
                    Hủy Bỏ
                  </Button>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={activeTab === "addTeacher"}
                    >
                      Tạo mới
                    </Button>
                  </Space>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Tab Thêm Giáo Viên */}
          <TabPane
            tab="Thêm Giáo Viên"
            key="addTeacher"
            disabled={selectedClasses.length === 0}
          >
            {renderTeacherAssignment()}
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default ScheduleAdd;
