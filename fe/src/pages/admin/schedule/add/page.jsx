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
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const ScheduleAdd = () => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("configure"); // Trạng thái tab hiện tại
    const [selectedClasses, setSelectedClasses] = useState([]); // Các lớp học đã chọn
    const [classDetails, setClassDetails] = useState({}); // Chi tiết từng lớp học
    const [teacherAssignments, setTeacherAssignments] = useState({}); // Phân công giáo viên

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    // Lấy các ID cần thiết từ state
    const {
        courseId,
        semesterId,
        majorId,
        subjectId,
        courseName,
        semesterName,
        majorName,
        subjectName,
    } = state || {};
    console.log("Received in ScheduleAdd - majorId:", majorId);
    // State để lưu dữ liệu từ API
    const [shifts, setShifts] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingShifts, setLoadingShifts] = useState(true);

    useEffect(() => {
        // Kiểm tra xem các thông tin cần thiết đã được truyền chưa
        if (!courseId || !semesterId || !majorId || !subjectId) {
            message.error("Thiếu thông tin cần thiết để thêm lịch học!");
            navigate("/schedule-list");
            return;
        }

        // Hàm fetch dữ liệu từ API
        console.log("Major ID:", majorId);

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                // Gọi API song song
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

                // Kiểm tra và xử lý dữ liệu shifts
                console.log("Shifts API response:", shiftsRes.data);
                let shiftsData = shiftsRes.data;
                if (Array.isArray(shiftsData)) {
                    setShifts(shiftsData);
                } else if (Array.isArray(shiftsData.data)) {
                    setShifts(shiftsData.data);
                } else {
                    throw new Error("Dữ liệu shifts không hợp lệ.");
                }

                // Kiểm tra và xử lý dữ liệu classrooms
                console.log("Classrooms API response:", classroomsRes.data);
                let classroomsData = classroomsRes.data;
                if (Array.isArray(classroomsData)) {
                    setClassrooms(classroomsData);
                } else if (Array.isArray(classroomsData.classrooms)) {
                    setClassrooms(classroomsData.classrooms);
                } else {
                    throw new Error("Dữ liệu classrooms không hợp lệ.");
                }

                // Kiểm tra và xử lý dữ liệu rooms
                console.log("Rooms API response:", roomsRes.data.data);
                let roomsData = roomsRes.data.data;
                if (Array.isArray(roomsData)) {
                    setRooms(roomsData);
                } else if (Array.isArray(roomsData.rooms)) {
                    setRooms(roomsData.rooms);
                } else {
                    throw new Error("Dữ liệu rooms không hợp lệ.");
                }

                // Kiểm tra và xử lý dữ liệu teachers
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
                message.error(
                    `Không thể tải dữ liệu cần thiết: ${error.message}`
                );
                setLoading(false);
                setLoadingShifts(false);
            }
        };

        fetchData();
    }, [courseId, semesterId, majorId, subjectId, navigate]);

    // Xử lý khi hoàn thành form cấu hình lớp học
    const handleFinish = (values) => {
        console.log("Form values: ", values);
        // Lưu trữ các lớp học đã chọn
        setSelectedClasses(values.classes);
        // Lưu trữ chi tiết từng lớp học
        setClassDetails(values.classDetails || {});
        // Reset phân công giáo viên khi cấu hình lại lớp học
        setTeacherAssignments({});
        // Chuyển sang tab tiếp theo
        setActiveTab("addTeacher");
        message.success("Cấu hình đã được lưu thành công!");
    };

    // Xử lý khi thay đổi các lớp học đã chọn
    const handleClassChange = (values) => {
        setSelectedClasses(values);
        // Xóa các chi tiết lớp học không còn được chọn
        setClassDetails((prevDetails) => {
            const updatedDetails = {};
            values.forEach((classId) => {
                if (prevDetails[classId]) {
                    updatedDetails[classId] = prevDetails[classId];
                }
            });
            return updatedDetails;
        });
        // Nếu người dùng thay đổi lớp học sau khi đã tạo lịch, đặt lại trạng thái lịch học
        if (activeTab === "addTeacher") {
            setActiveTab("configure");
            setTeacherAssignments({});
        }
    };

    // Hàm render các tab cho từng lớp học
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

                        {/* Hiển thị dựa trên hình thức học */}
                        <Form.Item
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.classDetails &&
                                currentValues.classDetails &&
                                prevValues.classDetails[classId]
                                    ?.learningMethod !==
                                    currentValues.classDetails[classId]
                                        ?.learningMethod
                            }
                        >
                            {({ getFieldValue }) => {
                                const learningMethod = getFieldValue([
                                    "classDetails",
                                    classId,
                                    "learningMethod",
                                ]);
                                if (learningMethod === "online") {
                                    return (
                                        <Form.Item
                                            label="Link Học Trực Tuyến"
                                            name={[
                                                "classDetails",
                                                classId,
                                                "classLink",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập link học!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Link học trực tuyến"
                                                prefix={<LinkOutlined />}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    );
                                } else if (learningMethod === "offline") {
                                    return (
                                        <Form.Item
                                            label="Phòng Học Trực Tiếp"
                                            name={[
                                                "classDetails",
                                                classId,
                                                "classRoom",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn phòng học!",
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Chọn phòng học"
                                                optionFilterProp="children"
                                            >
                                                {rooms.map((classrooms) => (
                                                    <Option
                                                        key={classrooms.id}
                                                        value={classrooms.id}
                                                    >
                                                        {classrooms.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    );
                                } else {
                                    return null;
                                }
                            }}
                        </Form.Item>
                    </Card>
                </TabPane>
            );
        });
    };

    // Xử lý khi chuyển tab
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    // Hàm kiểm tra xem giáo viên đã được phân công vào ca học này chưa
    const isTeacherAvailable = (teacherId, shiftId, currentClassId) => {
        return !Object.entries(teacherAssignments).some(
            ([classId, assignedTeacherId]) => {
                if (classId === currentClassId) return false; // Bỏ qua lớp hiện tại
                const assignedShiftId = classDetails[classId]?.session;
                return (
                    assignedTeacherId === teacherId &&
                    assignedShiftId === shiftId
                );
            }
        );
    };

    // Xử lý khi chọn giáo viên cho một lớp
    const handleTeacherSelect = (classId, teacherId) => {
        const shiftId = classDetails[classId]?.session;
        if (!shiftId) {
            message.error("Vui lòng chọn ca học trước!");
            return;
        }

        // Kiểm tra xem giáo viên có sẵn không
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

    // Hàm render giao diện phân công giáo viên
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
                        message.error(
                            "Vui lòng phân công giáo viên cho tất cả các lớp!"
                        );
                        return;
                    }

                    // Chuẩn bị payload để gửi lên API
                    const payload = {
                        start_date: classDetails[selectedClasses[0]]?.startDate
                            ? classDetails[selectedClasses[0]].startDate.format(
                                  "YYYY-MM-DD"
                              )
                            : null,
                        end_date: classDetails[selectedClasses[0]]?.endDate
                            ? classDetails[selectedClasses[0]].endDate.format(
                                  "YYYY-MM-DD"
                              )
                            : null,
                        days_of_week: form
                            .getFieldValue("repeatDays")
                            .map((day) => {
                                const dayMapping = {
                                    "Thứ 2": 1,
                                    "Thứ 3": 2,
                                    "Thứ 4": 3,
                                    "Thứ 5": 4,
                                    "Thứ 6": 5,
                                    "Thứ 7": 6,
                                };
                                return dayMapping[day];
                            }),
                        classrooms: selectedClasses.map((classId) => {
                            const selectedRoom = rooms.find(
                                (room) =>
                                    room.id === classDetails[classId]?.classRoom
                            );
                            if (!selectedRoom) {
                                console.error(
                                    `Phòng học không hợp lệ cho lớp: ${classId}, room_id: ${classDetails[classId]?.classRoom}`
                                );
                                message.error(
                                    `Phòng học không hợp lệ. Vui lòng chọn lại.`
                                );
                                return;
                            }
                            return {
                                id: classId,
                                shift_id: classDetails[classId]?.session,
                                room_id: selectedRoom.id, // Lấy room_id từ danh sách phòng học
                                link:
                                    classDetails[classId]?.learningMethod ===
                                    "online"
                                        ? classDetails[classId]?.classLink
                                        : null,
                            };
                        }),
                        teachers: selectedClasses.map((classId) => ({
                            class_id: classId,
                            teacher_id: teacherAssignments[classId],
                        })),
                    };

                    // Kiểm tra xem payload đã đầy đủ chưa
                    if (!payload.start_date || !payload.end_date) {
                        message.error(
                            "Vui lòng nhập đầy đủ ngày bắt đầu và kết thúc!"
                        );
                        return;
                    }

                    try {
                        // Lấy token
                        const token = localStorage.getItem("token");
                        // Gọi API để thêm lịch học
                        const response = await axios.post(
                            `http://localhost:8000/api/admin/schedules/${semesterId}/${courseId}/${majorId}/${subjectId}/add`,
                            payload,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (
                            response.status === 200 ||
                            response.status === 201
                        ) {
                            message.success("Thêm lịch học thành công!");
                            // Điều hướng về trang danh sách lịch học
                            navigate("/admin/schedule-list");
                        } else {
                            message.error("Thêm lịch học thất bại!");
                        }
                    } catch (error) {
                        console.error("Error adding schedule:", error);
                        if (
                            error.response &&
                            error.response.data &&
                            error.response.data.error
                        ) {
                            message.error(
                                `Thêm lịch học thất bại: ${error.response.data.error}`
                            );
                        } else {
                            message.error("Thêm lịch học thất bại!");
                        }
                    }
                }}
            >
                {selectedClasses.map((classId) => {
                    const classIdNumber = Number(classId);
                    const classData = classrooms.find(
                        (c) => c.id === classIdNumber
                    );
                    const className = classData
                        ? classData.name || classData.code
                        : `ID ${classId}`;
                    const details = classDetails[classId];
                    const shiftId = details?.session;
                    const shift = shifts.find((s) => s.id === shiftId);
                    const learningMethod = details?.learningMethod;
                    const learningMethodText =
                        learningMethod === "online"
                            ? "Trực tuyến"
                            : "Trực tiếp";
                    const classLink = details?.classLink || "";
                    const classRoom = details?.classRoom
                        ? rooms.find((room) => room.id === details.classRoom)
                              ?.name
                        : "";

                    return (
                        <Card
                            key={classId} // Sử dụng classId làm key duy nhất
                            title={`Phân Công Giáo Viên Cho Lớp ${className}`}
                            style={{ marginBottom: 16 }}
                        >
                            {/* Hiển thị thông tin chi tiết của lớp */}
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Ca Học:</Text>{" "}
                                {shift
                                    ? `${shift.name}: ${shift.start_time} - ${shift.end_time}`
                                    : "Chưa chọn"}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Text strong>Hình Thức Học:</Text>{" "}
                                {learningMethodText}
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
                                    teacherAssignments[classId]
                                        ? "success"
                                        : "error"
                                }
                                help={
                                    teacherAssignments[classId]
                                        ? ""
                                        : "Vui lòng chọn giáo viên!"
                                }
                            >
                                <Select
                                    placeholder="Chọn giáo viên"
                                    value={teacherAssignments[classId]}
                                    onChange={(value) =>
                                        handleTeacherSelect(classId, value)
                                    }
                                >
                                    {teachers.map((teacher) => (
                                        <Option
                                            key={teacher.id}
                                            value={teacher.id}
                                            disabled={
                                                !isTeacherAvailable(
                                                    teacher.id,
                                                    shiftId,
                                                    classId
                                                )
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
                        <Button
                            type="default"
                            onClick={() => setActiveTab("configure")}
                        >
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
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            {/* Hàng 1: Lớp Học (Multiple Selection) */}
                            <Form.Item
                                label="Lớp Học1"
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
                                        <Option
                                            key={classItem.id}
                                            value={classItem.id}
                                        >
                                            {classItem.code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Hàng 2: Ngày Bắt Đầu và Ngày Kết Thúc */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày Bắt Đầu"
                                        name={[
                                            "classDetails",
                                            selectedClasses[0],
                                            "startDate",
                                        ]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn ngày bắt đầu!",
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            format="DD-MM-YYYY"
                                            style={{ width: "100%" }}
                                            disabled={
                                                activeTab === "addTeacher"
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày Kết Thúc"
                                        name={[
                                            "classDetails",
                                            selectedClasses[0],
                                            "endDate",
                                        ]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn ngày kết thúc!",
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            format="DD-MM-YYYY"
                                            style={{ width: "100%" }}
                                            disabled={
                                                activeTab === "addTeacher"
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Hàng 3: Thời Gian Lặp */}
                            <Form.Item
                                label="Thời Gian Lặp"
                                name="repeatDays"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng chọn ít nhất một ngày!",
                                    },
                                ]}
                            >
                                <Checkbox.Group style={{ width: "100%" }}>
                                    <Row>
                                        {[
                                            "Thứ 2",
                                            "Thứ 3",
                                            "Thứ 4",
                                            "Thứ 5",
                                            "Thứ 6",
                                            "Thứ 7",
                                        ].map((day, index) => (
                                            <Col
                                                span={4}
                                                key={`${day}-${index}`}
                                            >
                                                <Checkbox value={day}>
                                                    {day}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>

                            {/* Hàng 4: Hình Thức Học */}
                            <Form.Item
                                label="Hình Thức Học"
                                name={[
                                    "classDetails",
                                    selectedClasses[0],
                                    "learningMethod",
                                ]}
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

                            {/* Các Trường "Ca Học" Tùy Theo Lớp Được Chọn */}
                            {selectedClasses.length > 0 && (
                                <Tabs style={{ marginTop: 24 }}>
                                    {renderClassSessionFields()}
                                </Tabs>
                            )}

                            {/* Nút Hành Động */}
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
                                            disabled={
                                                activeTab === "addTeacher"
                                            }
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
