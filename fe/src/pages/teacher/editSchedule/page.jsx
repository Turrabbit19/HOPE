import React, { useEffect, useState } from "react";
import {
    Select,
    Button,
    message,
    DatePicker,
    Row,
    Col,
    Card,
    Typography,
    Space,
    Descriptions,
} from "antd";
import { useLocation } from "react-router-dom";
import instance from "../../../config/axios";
import { Book, Calendar, Clock, Info, MapPin } from "lucide-react";
import moment from "moment";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

const EditScheduleComponent = () => {
    const location = useLocation();
    const { schedule } = location.state;
    const [view, setView] = useState(null);
    const [teacherData, setTeacherData] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("/");
        return `${year}/${month}/${day}`;
    };

    const fetchTeacherData = async () => {
        try {
            const response = await instance.post(
                "http://127.0.0.1:8000/api/teacher/getAbc",
                {
                    shift_id: schedule.shift_id,
                    date: formatDate(schedule.lesson.date),
                }
            );
            setTeacherData(response.data || []);
        } catch (error) {
            setTeacherData([]);
        }
    };

    const fetchDatePicker = async () => {
        try {
            const response = await instance.get(`teacher/max-date-schedule`);
            setMaxDate(dayjs(response.data));
        } catch (error) {
            // Handle error if needed
        }
    };

    const handleSubmitRequest = async () => {
        if (!selectedTeacher) {
            message.error("Vui lòng chọn giảng viên trước khi gửi yêu cầu.");
            return;
        }
        try {
            const response = await instance.post(
                "http://127.0.0.1:8000/api/teacher/changeTeacher",
                {
                    schedule_id: schedule.id,
                    shift_name: schedule.shift_name,
                    room_name: schedule.room_name,
                    new_teacher: selectedTeacher,
                    subject_name: schedule.subject_name,
                    date: formatDate(schedule.lesson.date),
                }
            );
            if (response.data.success) {
                message.success("Yêu cầu thay đổi giảng viên đã được gửi.");
            } else {
                message.error("Có lỗi xảy ra khi gửi yêu cầu.");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi gửi yêu cầu.");
        }
    };

    const handleSubmitRequestChangeDate = async () => {
        if (!selectedDate) {
            message.error("Vui lòng chọn ngày trước khi gửi yêu cầu.");
            return;
        }
        try {
            await instance.post("teacher/handle-change-date", {
                schedule_id: schedule.id,
                old_date: schedule.lesson?.date,
                new_date: selectedDate.format("YYYY/MM/DD"),
                subject_name: schedule.subject_name,
            });
            message.success("Yêu cầu thay đổi lịch dạy đã được gửi.");
        } catch (error) {
            message.error("Có lỗi xảy ra khi gửi yêu cầu.");
        }
    };

    const onChangeDatePicker = (date) => {
        setSelectedDate(date);
    };

    const disabledDate = (current) => {
        return current && current < dayjs(maxDate).startOf("day");
    };

    useEffect(() => {
        if (view === "change-teacher") {
            fetchTeacherData();
        } else if (view === "change-schedule") {
            fetchDatePicker();
        }
    }, [view]);

    const renderContent = () => {
        switch (view) {
            case "change-teacher":
                return (
                    <Card className="mt-4">
                        <Title level={5}>Chọn giảng viên</Title>
                        <Select
                            showSearch
                            style={{ width: "100%", marginTop: 8 }}
                            placeholder="Chọn giảng viên"
                            optionFilterProp="children"
                            onChange={setSelectedTeacher}
                            filterOption={(input, option) =>
                                (option?.children || "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        >
                            {teacherData.length > 0 ? (
                                teacherData.map((teacher) => (
                                    <Option key={teacher.id} value={teacher.id}>
                                        {teacher.name} ({teacher.teacher_code})
                                    </Option>
                                ))
                            ) : (
                                <Option disabled>
                                    Không có giảng viên nào
                                </Option>
                            )}
                        </Select>
                        <Button
                            type="primary"
                            onClick={handleSubmitRequest}
                            className="mt-4 w-100"
                        >
                            Gửi yêu cầu
                        </Button>
                    </Card>
                );
            case "change-schedule":
                return (
                    <Card className="mt-4">
                        <Title level={5}>Đổi ngày dạy</Title>
                        <DatePicker
                            style={{ width: "100%", marginTop: 8 }}
                            placeholder="Chọn ngày mới"
                            onChange={onChangeDatePicker}
                            disabledDate={disabledDate}
                            format="DD/MM/YYYY"
                        />
                        <Button
                            type="primary"
                            onClick={handleSubmitRequestChangeDate}
                            className="mt-4 w-100"
                        >
                            Gửi yêu cầu
                        </Button>
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
                Chỉnh sửa lịch dạy
            </Title>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card>
                        <Title level={4}>Chi tiết lịch dạy</Title>
                        <Descriptions
                            column={1}
                            bordered
                            size="small"
                            style={{ marginTop: 16 }}
                        >
                            <Descriptions.Item label="Môn học">
                                {schedule.subject_name || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ca học">
                                {schedule.shift_name || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phòng học">
                                {schedule.room_name || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiết học">
                                {schedule.lesson?.name || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nội dung">
                                {schedule.lesson?.description || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày">
                                {schedule.lesson?.date || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                {schedule.lesson?.status || "N/A"}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card>
                        <Title level={4}>Hình thức</Title>
                        <Space wrap style={{ marginTop: 16 }}>
                            <Button
                                type={
                                    view === "change-teacher"
                                        ? "primary"
                                        : "default"
                                }
                                onClick={() => setView("change-teacher")}
                            >
                                Thay đổi giảng viên
                            </Button>
                            <Button
                                type={
                                    view === "change-schedule"
                                        ? "primary"
                                        : "default"
                                }
                                onClick={() => setView("change-schedule")}
                            >
                                Thay đổi lịch dạy
                            </Button>
                        </Space>
                        {renderContent()}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EditScheduleComponent;
