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
    Table,
    message,
    Tabs,
    Card,
    Typography,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const ScheduleEdit = () => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("configure"); // Trạng thái tab hiện tại
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [scheduleData, setScheduleData] = useState({});
    const { id: scheduleId } = useParams();

    const [teacherAssignments, setTeacherAssignments] = useState({}); // Phân công giáo viên
    const [scheduleUpdated, setScheduleUpdated] = useState(false); // Trạng thái lịch học đã được cập nhật

    const classes = [
        { value: "class1", label: "Lớp 1" },
        { value: "class2", label: "Lớp 2" },
        { value: "class3", label: "Lớp 3" },
    ];
    const teachers = [
        { value: "teacher1", label: "Giảng viên 1" },
        { value: "teacher2", label: "Giảng viên 2" },
        { value: "teacher3", label: "Giảng viên 3" },
    ];
    const rooms = [
        { value: "room1", label: "Phòng 101" },
        { value: "room2", label: "Phòng 102" },
    ];

    useEffect(() => {
        const fetchScheduleDetails = async () => {
            const schedule = {
                course: "course1",
                semester: "semester1",
                major: "major1",
                subject: "subject1",
                classes: ["class1", "class2"],
                classDetails: {
                    class1: {
                        teacher: "teacher1",
                        startDate: moment("2024-01-01"),
                        endDate: moment("2024-02-28"),
                        repeatDays: ["Thứ 2", "Thứ 4"],
                        session: "ca1",
                        learningMethod: "online",
                        classLink: "https://class1.link",
                    },
                    class2: {
                        teacher: "teacher2",
                        startDate: moment("2024-03-01"),
                        endDate: moment("2024-04-30"),
                        repeatDays: ["Thứ 3", "Thứ 5"],
                        session: "ca2",
                        learningMethod: "offline",
                        classRoom: "room1",
                    },
                },
            };
            form.setFieldsValue({
                ...schedule,
                startDate: schedule.classDetails[schedule.classes[0]].startDate,
                endDate: schedule.classDetails[schedule.classes[0]].endDate,
                repeatDays:
                    schedule.classDetails[schedule.classes[0]].repeatDays,
                learningMethod:
                    schedule.classDetails[schedule.classes[0]].learningMethod,
                classLink: schedule.classDetails[schedule.classes[0]].classLink,
                classRoom: schedule.classDetails[schedule.classes[0]].classRoom,
            });
            setSelectedClasses(schedule.classes || []);
            setScheduleData(schedule.classDetails || {});
            setScheduleUpdated(true); // Giả sử lịch học đã được cập nhật khi tải dữ liệu
        };

        fetchScheduleDetails();
    }, [form, scheduleId]);

    const handleFinish = (values) => {
        console.log("Form values: ", values);
        message.success("Lịch học đã được cập nhật thành công!");
        setScheduleUpdated(true); // Đánh dấu lịch học đã được cập nhật
    };

    const handleClassChange = (values) => {
        setSelectedClasses(values);
        // Xóa các chi tiết lớp học không còn được chọn
        setScheduleData((prevData) => {
            const updatedData = {};
            values.forEach((classId) => {
                if (prevData[classId]) {
                    updatedData[classId] = prevData[classId];
                }
            });
            return updatedData;
        });
        //  đặt lại trạng thái lịch học
        if (scheduleUpdated) {
            setScheduleUpdated(false);
            setTeacherAssignments({});
        }
    };

    // Hàm render các tab cho từng lớp học
    const renderClassSessionFields = () => {
        return selectedClasses.map((classId) => (
            <TabPane tab={`Lớp ${classId}`} key={classId}>
                <Card title={`Ca Học Cho Lớp ${classId}`}>
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
                            {[...Array(6)].map((_, i) => (
                                <Option key={i} value={`ca${i + 1}`}>
                                    {`Ca ${i + 1}: ${7 + i * 2}h15 - ${
                                        9 + i * 2
                                    }h15`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Card>
            </TabPane>
        ));
    };

    // Hàm kiểm tra xem giáo viên đã được phân công vào ca học này chưa
    const isTeacherAvailable = (teacherId, session, currentClassId) => {
        return !Object.entries(teacherAssignments).some(
            ([classId, assigned]) => {
                if (classId === currentClassId) return false; // Bỏ qua lớp hiện tại
                const assignedSession = scheduleData[classId]?.session;
                return assigned === teacherId && assignedSession === session;
            }
        );
    };

    // Xử lý khi chọn giáo viên cho một lớp
    const handleTeacherSelect = (classId, teacherId) => {
        const session = scheduleData[classId]?.session;
        if (!session) {
            message.error("Vui lòng cấu hình ca học trước!");
            return;
        }

        // Kiểm tra xem giáo viên có sẵn không
        const available = isTeacherAvailable(teacherId, session, classId);
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
                onFinish={() => {
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
                    console.log("Teacher Assignments: ", teacherAssignments);
                    message.success(
                        "Phân công giáo viên đã được lưu thành công!"
                    );
                }}
            >
                {selectedClasses.map((classId) => {
                    const details = scheduleData[classId];
                    const session = details?.session;
                    const startDate = details?.startDate
                        ? details.startDate.format("DD-MM-YYYY")
                        : "Chưa chọn";
                    const endDate = details?.endDate
                        ? details.endDate.format("DD-MM-YYYY")
                        : "Chưa chọn";
                    const repeatDays =
                        details?.repeatDays?.join(", ") || "Chưa chọn";
                    const learningMethod = details?.learningMethod;
                    const learningMethodText =
                        learningMethod === "online"
                            ? "Trực tuyến"
                            : "Trực tiếp";
                    const classLink = details?.classLink || "";
                    const classRoom = details?.classRoom
                        ? rooms.find((room) => room.value === details.classRoom)
                              ?.label
                        : "";

                    return (
                        <Card
                            key={classId}
                            title={`Phân Công Giáo Viên Cho Lớp ${classId}`}
                            style={{ marginBottom: 16 }}
                        >
                            {/* Hiển thị thông tin chi tiết của lớp */}
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Ca Học:</Text>{" "}
                                {session
                                    ? `Ca ${session.replace("ca", "")}: ${
                                          7 +
                                          (parseInt(session.replace("ca", "")) -
                                              1) *
                                              2
                                      }h15 - ${
                                          9 +
                                          (parseInt(session.replace("ca", "")) -
                                              1) *
                                              2
                                      }h15`
                                    : "Chưa chọn"}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Text strong>Ngày Bắt Đầu:</Text> {startDate}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Text strong>Ngày Kết Thúc:</Text> {endDate}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Text strong>Thời Gian Lặp:</Text> {repeatDays}
                            </div>
                            <div style={{ marginBottom: 16 }}>
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
                                            key={teacher.value}
                                            value={teacher.value}
                                            disabled={
                                                !isTeacherAvailable(
                                                    teacher.value,
                                                    session,
                                                    classId
                                                )
                                            }
                                        >
                                            {teacher.label}
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
            <h2 className="text-xl font-semibold mb-4">Chỉnh Sửa Lịch Học</h2>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                {/* Tab Chỉnh Sửa Lịch Học */}
                <TabPane tab="Chỉnh Sửa Lịch Học" key="configure">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        {/* Hàng 1: Lớp Học (Multiple Selection) */}
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
                            >
                                {classes.map((classItem) => (
                                    <Option
                                        key={classItem.value}
                                        value={classItem.value}
                                    >
                                        {classItem.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Các Trường Thông Tin Chung */}

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
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

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
                                    {[
                                        "Thứ 2",
                                        "Thứ 3",
                                        "Thứ 4",
                                        "Thứ 5",
                                        "Thứ 6",
                                        "Thứ 7",
                                    ].map((day, index) => (
                                        <Col span={4} key={index}>
                                            <Checkbox value={day}>
                                                {day}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>

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
                            >
                                <Option value="online">Trực tuyến</Option>
                                <Option value="offline">Trực tiếp</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.learningMethod !==
                                currentValues.learningMethod
                            }
                        >
                            {({ getFieldValue }) => {
                                const learningMethod =
                                    getFieldValue("learningMethod");
                                if (learningMethod === "online") {
                                    return (
                                        <Form.Item
                                            label="Link Học Trực Tuyến"
                                            name="classLink"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập link học!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Link phòng học"
                                                prefix={<LinkOutlined />}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    );
                                } else if (learningMethod === "offline") {
                                    return (
                                        <Form.Item
                                            label="Phòng Học Trực Tiếp"
                                            name="classRoom"
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
                                                {rooms.map((room) => (
                                                    <Option
                                                        key={room.value}
                                                        value={room.value}
                                                    >
                                                        {room.label}
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

                        {/* Render Fields for Each Selected Class */}
                        {selectedClasses.length > 0 && (
                            <Tabs style={{ marginBottom: 24 }}>
                                {renderClassSessionFields()}
                            </Tabs>
                        )}

                        <Form.Item>
                            <Space
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button type="default">Hủy Bỏ</Button>
                                <Button type="primary" htmlType="submit">
                                    Cập Nhật
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </TabPane>

                <TabPane
                    tab="Giảng Viên"
                    key="addTeacher"
                    disabled={!scheduleUpdated}
                >
                    {renderTeacherAssignment()}
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ScheduleEdit;
