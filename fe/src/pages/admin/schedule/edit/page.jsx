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
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const ScheduleEdit = () => {
    const [form] = Form.useForm();
    const [learningMethod, setLearningMethod] = useState(null);
    const [scheduleData, setScheduleData] = useState([]);
    const { id: scheduleId } = useParams();

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
            const schedule = {
                course: "course1",
                semester: "semester1",
                major: "major1",
                subject: "subject1",
                class: "class1",
                teacher: "teacher1",
                startDate: moment("2024-01-01"),
                endDate: moment("2024-04-30"),
                session: "ca1",
                repeatDays: ["Thứ 2", "Thứ 4"],
                learningMethod: "online",
                classLink: "https://classroom.link",
            };
            form.setFieldsValue(schedule);
            setLearningMethod(schedule.learningMethod);
        };

        fetchScheduleDetails();
    }, [form, scheduleId]);

    const handleFinish = (values) => {
        console.log("Form values: ", values);
        message.success("Lịch học đã được cập nhật thành công!");
    };

    const handleLearningMethodChange = (value) => {
        setLearningMethod(value);
    };

    const handleCreateSchedule = () => {
        form.validateFields().then((values) => {
            const repeatDays = values.repeatDays || [];
            if (repeatDays.length === 0) {
                message.error("Vui lòng chọn ít nhất một ngày lặp!");
                return;
            }

            const startDate = values.startDate;
            const endDate = values.endDate;
            if (endDate.isBefore(startDate)) {
                message.error("Ngày kết thúc phải sau ngày bắt đầu!");
                return;
            }

            const schedule = repeatDays.map((day, index) => ({
                key: index + 1,
                session: `Buổi ${index + 1}`,
                date: startDate.format("DD-MM-YYYY"),
                startTime: `${7 + index * 2}h15`,
                endTime: `${9 + index * 2}h15`,
                learningMethod:
                    values.learningMethod === "online"
                        ? "Trực tuyến"
                        : "Trực tiếp",
                link:
                    values.learningMethod === "online"
                        ? values.classLink
                        : values.classRoom,
            }));
            setScheduleData(schedule);
        });
    };

    const columns = [
        { title: "Buổi Học", dataIndex: "session", key: "session" },
        { title: "Ngày", dataIndex: "date", key: "date" },
        {
            title: "Thời Gian Bắt Đầu",
            dataIndex: "startTime",
            key: "startTime",
        },
        { title: "Thời Gian Kết Thúc", dataIndex: "endTime", key: "endTime" },
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

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Chỉnh Sửa Lịch Học</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                <Row gutter={16}>
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
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
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
                                    <Option
                                        key={subject.value}
                                        value={subject.value}
                                    >
                                        {subject.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Lớp Học"
                            name="class"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn lớp học!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn lớp học"
                                optionFilterProp="children"
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
                    </Col>
                </Row>

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
                                format="DD-MM-YYYY"
                                style={{ width: "100%" }}
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
                                    <Checkbox value={day}>{day}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item
                    label="Ca Học"
                    name="session"
                    rules={[
                        { required: true, message: "Vui lòng chọn ca học!" },
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

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Giảng Viên"
                            name="teacher"
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
                    </Col>
                    <Col span={12}>
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
                                onChange={handleLearningMethodChange}
                            >
                                <Option value="online">Trực tuyến</Option>
                                <Option value="offline">Trực tiếp</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {learningMethod === "online" && (
                    <Form.Item
                        label="Link Học Trực Tuyến"
                        name="classLink"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập link học!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Link phòng học"
                            prefix={<LinkOutlined />}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                )}
                {learningMethod === "offline" && (
                    <Form.Item
                        label="Phòng Học Trực Tiếp"
                        name="classRoom"
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
                                <Option key={room.value} value={room.value}>
                                    {room.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Button
                    type="dashed"
                    className="w-full mb-6"
                    onClick={handleCreateSchedule}
                >
                    Tạo Danh Sách Lịch Học
                </Button>

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
