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
    Card,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import moment from "moment";
import instance from "../../../../config/axios";

const { Option } = Select;

const ScheduleEdit = () => {
    const [form] = Form.useForm();
    const [scheduleData, setScheduleData] = useState([]);
    const { id: scheduleId } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);


    useEffect(() =>{
        const fetchData = async () => {
            try {
                const subjectsResponse = await instance.get('/admin/subjects');
                const teachersResponse = await instance.get('/admin/teachers');
                const roomsResponse = await instance.get('/admin/rooms');

                setSubjects(subjectsResponse.data.data);
                setTeachers(teachersResponse.data.data);
                setRooms(roomsResponse.data.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
                message.error("Không thể tải dữ liệu, vui lòng thử lại.");
            }
        };

        fetchData();
    }, [])


    useEffect(() => {
        const fetchScheduleDetails = async () => {
            try {
                const response = await instance.get(`/admin/schedules/${scheduleId}`);
                const schedule = response.data.data;
                console.log(schedule);
                const session = schedule.shift_name.toLowerCase().replace(/\s+/g, '');
                const mappedDays = schedule.days_of_week.map(item => {
                    const day = Object.values(item)[0];
                    switch (day) {
                        case 2: return "Thứ 2";
                        case 3: return "Thứ 3";
                        case 4: return "Thứ 4";
                        case 5: return "Thứ 5";
                        case 6: return "Thứ 6";
                        case 7: return "Thứ 7";
                        default: return "";
                    }
                });
                form.setFieldsValue({
                    teacher: schedule.teacher_name,
                    startDate: moment(schedule.startDate),
                    endDate: moment(schedule.endDate),
                    session: session,
                    repeatDays: mappedDays,
                    classLink: schedule.link !== "NULL" ? schedule.link : "",
                classRoom: schedule.link === "NULL" ? schedule.room_name : "",
                    });

            } catch (error) {
                console.error("Error fetching schedule details: ", error);
                message.error("Không thể tải lịch học, vui lòng thử lại.");
            }
        };

        if (scheduleId) {
            fetchScheduleDetails();
        }
    }, [scheduleId, form]);

    const handleFinish = async (values) => {
        
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

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Chỉnh Sửa Lịch Học</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="bg-white p-6 rounded-lg shadow-md"
            >

                <Card title={`Thông Tin Cho Lớp ${scheduleId}`}>
                    <Form.Item
                        label="Giảng Viên"
                        name="teacher"
                        rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}
                    >
                        <Select showSearch placeholder="Chọn giảng viên">
                            {teachers.map((teacher) => (
                                <Option key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ngày Bắt Đầu"
                        name="startDate"
                        rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                    >
                        <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Ngày Kết Thúc"
                        name="endDate"
                        rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
                    >
                        <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Thời Gian Lặp"
                        name="repeatDays"
                        rules={[{ required: true, message: "Vui lòng chọn ít nhất một ngày!" }]}
                    >
                        <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                                {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map((day, index) => (
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
                        rules={[{ required: true, message: "Vui lòng chọn ca học!" }]}
                    >
                        <Select showSearch placeholder="Chọn ca học">
                            {[...Array(6)].map((_, i) => (
                                <Option key={i} value={`ca${i + 1}`}>
                                    {`Ca ${i + 1}: ${7 + i * 2}h15 - ${9 + i * 2}h15`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Hình Thức Học"
                        name="learningMethod"
                        rules={[{ required: true, message: "Vui lòng chọn hình thức học!" }]}
                    >
                        <Select showSearch placeholder="Chọn hình thức học">
                            <Option value="online">Trực tuyến</Option>
                            <Option value="offline">Trực tiếp</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.learningMethod !== currentValues.learningMethod}>
                        {({ getFieldValue }) => {
                            const learningMethod = getFieldValue("learningMethod");
                            if (learningMethod === "online") {
                                return (
                                    <Form.Item
                                        label="Link Học Trực Tuyến"
                                        name="classLink"
                                        rules={[{ required: true, message: "Vui lòng nhập link học!" }]}
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
                                        rules={[{ required: true, message: "Vui lòng chọn phòng học!" }]}
                                    >
                                        <Select showSearch placeholder="Chọn phòng học">
                                            {rooms.map((room) => (
                                                <Option key={room.id} value={room.id}>
                                                    {room.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>
                </Card>

                {/* Kết Quả Lịch Học */}
                {scheduleData.length > 0 && (
                    <>
                        <h3 className="text-lg font-semibold mb-4">Kết Quả Lịch Học</h3>
                        <Table columns={columns} dataSource={scheduleData} pagination={false} />
                    </>
                )}

                {/* Nút Hành Động */}
                <Form.Item>
                    <Space style={{ display: "flex", justifyContent: "flex-end" }}>
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
