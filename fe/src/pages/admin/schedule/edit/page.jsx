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
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;

const ScheduleEdit = () => {
    const [form] = Form.useForm();
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const { id: scheduleId } = useParams();

    // Fake data for dropdowns (you can replace these with real data)
    const courses = [
        { value: "course1", label: "Khóa 1" },
        { value: "course2", label: "Khóa 2" },
    ];
    const semesters = [
        { value: "semester1", label: "Kỳ 1" },
        { value: "semester2", label: "Kỳ 2" },
    ];
    const majors = [
        { value: "major1", label: "Ngành 1" },
        { value: "major2", label: "Ngành 2" },
    ];
    const subjects = [
        { value: "subject1", label: "Môn 1" },
        { value: "subject2", label: "Môn 2" },
    ];
    const classes = [
        { value: "class1", label: "Lớp 1" },
        { value: "class2", label: "Lớp 2" },
        { value: "class3", label: "Lớp 3" },
    ];
    const teachers = [
        { value: "teacher1", label: "Giảng viên 1" },
        { value: "teacher2", label: "Giảng viên 2" },
    ];
    const rooms = [
        { value: "room1", label: "Phòng 101" },
        { value: "room2", label: "Phòng 102" },
    ];

    useEffect(() => {
        const fetchScheduleDetails = async () => {
            // Fetch schedule data based on scheduleId
            // For this example, we'll use hardcoded data
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
            form.setFieldsValue(schedule);
            setSelectedClasses(schedule.classes || []);
        };

        fetchScheduleDetails();
    }, [form, scheduleId]);

    const handleFinish = (values) => {
        console.log("Form values: ", values);
        message.success("Lịch học đã được cập nhật thành công!");
    };

    const handleClassChange = (values) => {
        setSelectedClasses(values);
    };

    const handleCreateSchedule = () => {
        form.validateFields().then((values) => {
            const { classes, classDetails } = values;
            const schedule = [];

            classes.forEach((classId) => {
                const classInfo = classDetails[classId];
                const repeatDays = classInfo.repeatDays || [];
                if (repeatDays.length === 0) {
                    message.error(
                        `Vui lòng chọn ít nhất một ngày lặp cho lớp ${classId}!`
                    );
                    return;
                }

                const startDate = classInfo.startDate;
                const endDate = classInfo.endDate;
                if (endDate.isBefore(startDate)) {
                    message.error(
                        `Ngày kết thúc phải sau ngày bắt đầu cho lớp ${classId}!`
                    );
                    return;
                }

                schedule.push({
                    key: classId,
                    classId,
                    teacher: classInfo.teacher,
                    startDate: startDate.format("DD-MM-YYYY"),
                    endDate: endDate.format("DD-MM-YYYY"),
                    repeatDays: classInfo.repeatDays.join(", "),
                    session: classInfo.session,
                    learningMethod:
                        classInfo.learningMethod === "online"
                            ? "Trực tuyến"
                            : "Trực tiếp",
                    link:
                        classInfo.learningMethod === "online"
                            ? classInfo.classLink
                            : classInfo.classRoom,
                });
            });

            setScheduleData(schedule);
        });
    };

    const columns = [
        { title: "Lớp Học", dataIndex: "classId", key: "classId" },
        { title: "Giảng Viên", dataIndex: "teacher", key: "teacher" },
        { title: "Ngày Bắt Đầu", dataIndex: "startDate", key: "startDate" },
        { title: "Ngày Kết Thúc", dataIndex: "endDate", key: "endDate" },
        { title: "Thời Gian Lặp", dataIndex: "repeatDays", key: "repeatDays" },
        { title: "Ca Học", dataIndex: "session", key: "session" },
        {
            title: "Hình Thức Học",
            dataIndex: "learningMethod",
            key: "learningMethod",
        },
        {
            title: "Link Học Trực Tuyến/Phòng Học",
            dataIndex: "link",
            key: "link",
            render: (text, record) =>
                record.learningMethod === "Trực tuyến" && text ? (
                    <a href={text} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                ) : (
                    text
                ),
        },
    ];

    const renderClassFields = () => {
        return selectedClasses.map((classId) => (
            <TabPane tab={`Lớp ${classId}`} key={classId}>
                <Card title={`Thông Tin Cho Lớp ${classId}`}>
                    <Form.Item
                        label="Giảng Viên"
                        name={["classDetails", classId, "teacher"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn giảng viên!",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn giảng viên"
                            optionFilterProp="children"
                        >
                            {teachers.map((teacher) => (
                                <Option
                                    key={teacher.value}
                                    value={teacher.value}
                                >
                                    {teacher.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ngày Bắt Đầu"
                        name={["classDetails", classId, "startDate"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày bắt đầu!",
                            },
                        ]}
                    >
                        <DatePicker
                            format="DD-MM-YYYY"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Ngày Kết Thúc"
                        name={["classDetails", classId, "endDate"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày kết thúc!",
                            },
                        ]}
                    >
                        <DatePicker
                            format="DD-MM-YYYY"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Thời Gian Lặp"
                        name={["classDetails", classId, "repeatDays"]}
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
                                        <Checkbox value={day}>{day}</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
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
                                <Option key={i} value={`ca${i + 1}`}>{`Ca ${
                                    i + 1
                                }: ${7 + i * 2}h15 - ${9 + i * 2}h15`}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Hình Thức Học"
                        name={["classDetails", classId, "learningMethod"]}
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
                            prevValues.classDetails?.[classId]
                                ?.learningMethod !==
                            currentValues.classDetails?.[classId]
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
                </Card>
            </TabPane>
        ));
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Chỉnh Sửa Lịch Học</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                {/* Hàng 1: Khóa Học, Kỳ Học, Ngành Học */}
                {/* <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Khóa Học"
                            name="course"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn khóa học!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn khóa học"
                                optionFilterProp="children"
                            >
                                {courses.map((course) => (
                                    <Option
                                        key={course.value}
                                        value={course.value}
                                    >
                                        {course.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Kỳ Học"
                            name="semester"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn kỳ học!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn kỳ học"
                                optionFilterProp="children"
                            >
                                {semesters.map((semester) => (
                                    <Option
                                        key={semester.value}
                                        value={semester.value}
                                    >
                                        {semester.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Ngành Học"
                            name="major"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn ngành học!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn ngành học"
                                optionFilterProp="children"
                            >
                                {majors.map((major) => (
                                    <Option
                                        key={major.value}
                                        value={major.value}
                                    >
                                        {major.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row> */}

                {/* Hàng 2: Môn Học */}
                {/* <Form.Item
                    label="Môn Học"
                    name="subject"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn môn học!",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn môn học"
                        optionFilterProp="children"
                    >
                        {subjects.map((subject) => (
                            <Option key={subject.value} value={subject.value}>
                                {subject.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item> */}

                {/* Hàng 3: Lớp Học (Multiple Selection) */}
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

                {/* Render Fields for Each Selected Class */}
                {selectedClasses.length > 0 && (
                    <Tabs>{renderClassFields()}</Tabs>
                )}

                {/* Tạo Danh Sách Lịch Học */}
                <Button
                    type="dashed"
                    className="w-full mb-6"
                    onClick={handleCreateSchedule}
                >
                    Tạo Danh Sách Lịch Học
                </Button>

                {/* Kết Quả Lịch Học */}
                {scheduleData.length > 0 && (
                    <>
                        <h3 className="text-lg font-semibold mb-4">
                            Kết Quả Lịch Học
                        </h3>
                        <Table
                            columns={columns}
                            dataSource={scheduleData}
                            pagination={false}
                        />
                    </>
                )}

                {/* Nút Hành Động */}
                <Form.Item>
                    <Space
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Button type="default">Hủy Bỏ</Button>
                        <Button type="primary" htmlType="submit">
                            Cập Nhật
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ScheduleEdit;
