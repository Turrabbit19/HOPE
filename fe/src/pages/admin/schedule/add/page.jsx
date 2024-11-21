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
    const [activeTab, setActiveTab] = useState("configure"); // Current tab state
    const [selectedClasses, setSelectedClasses] = useState([]); // Selected classes
    const [classDetails, setClassDetails] = useState({}); // Details for each class
    const [teacherAssignments, setTeacherAssignments] = useState({}); // Teacher assignments

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;


    // Extract necessary IDs from state
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
    // State to store data from API
    const [shifts, setShifts] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingShifts, setLoadingShifts] = useState(true);

    useEffect(() => {
        // Check if necessary information is provided
        if (!courseId || !semesterId || !majorId || !subjectId) {
            message.error("Thiếu thông tin cần thiết để thêm lịch học!");
            navigate("/schedule-list");
            return;
        }

        // Function to fetch data from APIs
        console.log("Major ID:", majorId);

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                // Call APIs in parallel
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

                // Process shifts data
                console.log("Shifts API response:", shiftsRes.data);
                let shiftsData = shiftsRes.data;
                if (Array.isArray(shiftsData)) {
                    setShifts(shiftsData);
                } else if (Array.isArray(shiftsData.data)) {
                    setShifts(shiftsData.data);
                } else {
                    throw new Error("Dữ liệu shifts không hợp lệ.");
                }

                // Process classrooms data
                console.log("Classrooms API response:", classroomsRes.data);
                let classroomsData = classroomsRes.data;
                if (Array.isArray(classroomsData)) {
                    setClassrooms(classroomsData);
                } else if (Array.isArray(classroomsData.classrooms)) {
                    setClassrooms(classroomsData.classrooms);
                } else {
                    throw new Error("Dữ liệu classrooms không hợp lệ.");
                }

                // Process rooms data
                console.log("Rooms API response:", roomsRes.data.data);
                let roomsData = roomsRes.data.data;
                if (Array.isArray(roomsData)) {
                    setRooms(roomsData);
                } else if (Array.isArray(roomsData.rooms)) {
                    setRooms(roomsData.rooms);
                } else {
                    throw new Error("Dữ liệu rooms không hợp lệ.");
                }

                // Process teachers data
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

    // Watch learningMethod to trigger re-render
    const learningMethod = Form.useWatch("learningMethod", form);

    // Handle form submission for configuration
    const handleFinish = (values) => {
        console.log("Form values: ", values);
        // Save selected classes
        setSelectedClasses(values.classes);
        // Save class details (only session and classRoom/classLink)
        const details = {};
        values.classes.forEach((classId) => {
            details[classId] = {
                session: values.classDetails?.[classId]?.session || null,
                classLink: values.classDetails?.[classId]?.classLink || "",
                classRoom: values.classDetails?.[classId]?.classRoom || null,
            };
        });
        setClassDetails(details);
        // Reset teacher assignments
        setTeacherAssignments({});
        // Switch to teacher assignment tab
        setActiveTab("addTeacher");
        message.success("Cấu hình đã được lưu thành công!");
    };

    // Handle class selection changes
    const handleClassChange = (values) => {
        setSelectedClasses(values);
        // Update classDetails to keep only selected classes
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
        // If changing classes after assignment, reset
        if (activeTab === "addTeacher") {
            setActiveTab("configure");
            setTeacherAssignments({});
        }
    };

    // Handle learningMethod change to reset class details
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

    // Render session and classRoom/classLink fields for each class
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

                        {/* Display classRoom or classLink based on learningMethod */}
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

    // Handle tab change
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    // Check if teacher is available
    const isTeacherAvailable = (teacherId, shiftId, currentClassId) => {
        return !Object.entries(teacherAssignments).some(
            ([classId, assignedTeacherId]) => {
                if (classId === currentClassId) return false; // Skip current class
                const assignedShiftId = classDetails[classId]?.session;
                return (
                    assignedTeacherId === teacherId &&
                    assignedShiftId === shiftId
                );
            }

        );
    };

    // Handle teacher selection for a class
    const handleTeacherSelect = (classId, teacherId) => {
        const shiftId = classDetails[classId]?.session;
        if (!shiftId) {
            message.error("Vui lòng chọn ca học trước!");
            return;
        }

        // Check if teacher is available
        const available = isTeacherAvailable(teacherId, shiftId, classId);
        if (!available) {
            message.error("Giáo viên này đã bị trùng lịch dạy với lớp khác!");
            return;
        }

        // Update teacher assignment
        setTeacherAssignments((prev) => ({
            ...prev,
            [classId]: teacherId,
        }));
        message.success("Phân công giáo viên thành công!");
    };

    // Render teacher assignment form
    const renderTeacherAssignment = () => {
        if (selectedClasses.length === 0) {
            return <p>Vui lòng cấu hình lớp học trước khi thêm giáo viên.</p>;
        }

        return (
            <Form
                layout="vertical"
                onFinish={async () => {
                    // Check if all classes have assigned teachers
                    const allAssigned = selectedClasses.every(
                        (classId) => teacherAssignments[classId]
                    );
                    if (!allAssigned) {
                        message.error(
                            "Vui lòng phân công giáo viên cho tất cả các lớp!"
                        );
                        return;
                    }

                    // Prepare payload
                    const payload = {
                        start_date: form.getFieldValue("startDate")
                            ? form
                                  .getFieldValue("startDate")
                                  .format("YYYY-MM-DD")
                            : null,
                        end_date: form.getFieldValue("endDate")
                            ? form.getFieldValue("endDate").format("YYYY-MM-DD")
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
                        learning_method: form.getFieldValue("learningMethod"),
                        classrooms: selectedClasses
                            .map((classId) => {
                                const selectedRoom = rooms.find(
                                    (room) =>
                                        room.id ===
                                        classDetails[classId]?.classRoom
                                );
                                if (
                                    form.getFieldValue("learningMethod") ===
                                        "offline" &&
                                    !selectedRoom
                                ) {
                                    console.error(
                                        `Phòng học không hợp lệ cho lớp: ${classId}, room_id: ${classDetails[classId]?.classRoom}`
                                    );
                                    message.error(
                                        `Phòng học không hợp lệ. Vui lòng chọn lại cho lớp ${classId}.`
                                    );
                                    return null;
                                }
                                return {
                                    id: classId,
                                    shift_id: classDetails[classId]?.session,
                                    room_id:
                                        form.getFieldValue("learningMethod") ===
                                        "offline"
                                            ? selectedRoom.id
                                            : null, // Get room_id if offline
                                    link:
                                        form.getFieldValue("learningMethod") ===
                                        "online"
                                            ? classDetails[classId]?.classLink
                                            : null,
                                };
                            })
                            .filter((item) => item !== null), // Remove null items
                        teachers: selectedClasses.map((classId) => ({
                            class_id: classId,
                            teacher_id: teacherAssignments[classId],
                        })),
                    };

                    // Check if start_date and end_date are set
                    if (!payload.start_date || !payload.end_date) {
                        message.error(
                            "Vui lòng nhập đầy đủ ngày bắt đầu và kết thúc!"
                        );
                        return;
                    }

                    try {
                        // Get token
                        const token = localStorage.getItem("token");
                        // Call API to add schedule
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
                            // Navigate to schedule list
                            navigate("/admin/list-schedule");
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
                    const classLink = details?.classLink || "";
                    const classRoom = details?.classRoom
                        ? rooms.find((room) => room.id === details.classRoom)
                              ?.name
                        : "";

                    return (
                        <Card
                            key={classId} // Use classId as unique key
                            title={`Phân Công Giáo Viên Cho Lớp ${className}`}
                            style={{ marginBottom: 16 }}
                        >
                            {/* Display class details */}
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Ca Học:</Text>{" "}
                                {shift
                                    ? `${shift.name}: ${shift.start_time} - ${shift.end_time}`
                                    : "Chưa chọn"}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Text strong>Hình Thức Học:</Text>{" "}
                                {learningMethod === "online"
                                    ? "Trực tuyến"
                                    : "Trực tiếp"}
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

                            {/* Select Teacher */}
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
                    {/* Configuration Tab */}
                    <TabPane tab="Cấu Hình Lớp Học" key="configure">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinish}
                            onValuesChange={handleValuesChange}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            {/* Row 1: Classes (Multiple Selection) */}
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
                                        <Option
                                            key={classItem.id}
                                            value={classItem.id}
                                        >
                                            {classItem.code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Row 2: Start Date and End Date */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ngày Bắt Đầu"
                                        name="startDate"
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
                                        name="endDate"
                                        dependencies={["startDate"]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn ngày kết thúc!",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        !getFieldValue(
                                                            "startDate"
                                                        )
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    if (
                                                        value.isAfter(
                                                            getFieldValue(
                                                                "startDate"
                                                            )
                                                        )
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            "Ngày kết thúc phải sau ngày bắt đầu!"
                                                        )
                                                    );
                                                },
                                            }),
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

                            {/* Row 3: Repeat Days */}
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

                            {/* Row 4: Learning Method */}
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

                            {/* Class-specific fields */}
                            {selectedClasses.length > 0 && (
                                <Tabs style={{ marginTop: 24 }}>
                                    {renderClassSessionFields()}
                                </Tabs>
                            )}

                            {/* Action Buttons */}
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

                    {/* Teacher Assignment Tab */}
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
