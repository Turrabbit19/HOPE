import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    DatePicker,
    TimePicker,
    Checkbox,
    Row,
    Col,
    Space,
    Select,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Testing = () => {
    const [form] = Form.useForm();
    const [learningMethod, setLearningMethod] = useState(null);

    const handleFinish = (values) => {
        console.log("Form values: ", values);
    };

    const handleLearningMethodChange = (value) => {
        setLearningMethod(value);
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Cấu Hình Thông Tin</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                {/* Ngày Bắt Đầu, Ngày Kết Thúc */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Ngày Bắt Đầu" name="startDate">
                            <DatePicker
                                format="DD-MM-YYYY"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Ngày Kết Thúc" name="endDate">
                            <DatePicker
                                format="DD-MM-YYYY"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 1: Khóa Học, Kỳ Học, Ngành Học */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Khóa Học" name="course">
                            <Select
                                showSearch
                                placeholder="Chọn khóa học"
                                optionFilterProp="children"
                            >
                                <Option value="course1">Khóa 1</Option>
                                <Option value="course2">Khóa 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Kỳ Học" name="semester">
                            <Select
                                showSearch
                                placeholder="Chọn kỳ học"
                                optionFilterProp="children"
                            >
                                <Option value="semester1">Kỳ 1</Option>
                                <Option value="semester2">Kỳ 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Ngành Học" name="major">
                            <Select
                                showSearch
                                placeholder="Chọn ngành học"
                                optionFilterProp="children"
                            >
                                <Option value="major1">Ngành 1</Option>
                                <Option value="major2">Ngành 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 2: Môn Học, Lớp Học */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Môn Học" name="subject">
                            <Select
                                showSearch
                                placeholder="Chọn môn học"
                                optionFilterProp="children"
                            >
                                <Option value="subject1">Môn 1</Option>
                                <Option value="subject2">Môn 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Lớp Học" name="class">
                            <Select
                                showSearch
                                placeholder="Chọn lớp học"
                                optionFilterProp="children"
                            >
                                <Option value="class1">Lớp 1</Option>
                                <Option value="class2">Lớp 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 3: Thứ Trong Tuần */}
                <Form.Item label="Thời Gian Lặp" name="repeatDays">
                    <Checkbox.Group style={{ width: "50%" }}>
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

                {/* Hàng 4: Ca Học */}
                <Form.Item label="Ca Học" name="session">
                    <Select
                        showSearch
                        placeholder="Chọn ca học"
                        optionFilterProp="children"
                    >
                        <Option value="morning">Sáng</Option>
                        <Option value="afternoon">Chiều</Option>
                        <Option value="evening">Tối</Option>
                    </Select>
                </Form.Item>

                {/* Hàng 5: Giảng Viên, Hình Thức Học */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Giảng Viên" name="teacher">
                            <Select
                                showSearch
                                placeholder="Chọn giảng viên"
                                optionFilterProp="children"
                            >
                                <Option value="teacher1">Giảng viên 1</Option>
                                <Option value="teacher2">Giảng viên 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Hình Thức Học" name="learningMethod">
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

                {/* Link Học Trực Tuyến/Phòng học trực tiếp */}
                {learningMethod === "online" && (
                    <Form.Item label="Link Học Trực Tuyến" name="classLink">
                        <Input
                            placeholder="Link phòng học"
                            prefix={<LinkOutlined />}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                )}
                {learningMethod === "offline" && (
                    <Form.Item label="Phòng Học Trực Tiếp" name="classRoom">
                        <Select
                            showSearch
                            placeholder="Chọn phòng học"
                            optionFilterProp="children"
                        >
                            <Option value="room1">Phòng 101</Option>
                            <Option value="room2">Phòng 102</Option>
                        </Select>
                    </Form.Item>
                )}

                {/* Tạo Danh Sách Lịch Học */}
                <Button type="dashed" className="w-full mb-6">
                    Tạo Danh Sách Lịch Học
                </Button>

                {/* Kết Quả Lịch Học */}
                <h3 className="text-lg font-semibold mb-4">Kết Quả Lịch Học</h3>
                {[1, 2, 3].map((session) => (
                    <Row gutter={16} key={session} className="mb-4">
                        <Col span={6}>
                            <Form.Item
                                label={`Buổi ${session} - Ngày`}
                                name={`date_${session}`}
                            >
                                <DatePicker
                                    format="DD-MM-YYYY"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="T.Gian bắt đầu"
                                name={`startTime_${session}`}
                            >
                                <TimePicker
                                    format="HH:mm"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="T.Gian kết thúc"
                                name={`endTime_${session}`}
                            >
                                <TimePicker
                                    format="HH:mm"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Link học trực tuyến"
                                name={`link_${session}`}
                            >
                                <Input
                                    placeholder="Link học trực tuyến"
                                    prefix={<LinkOutlined />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                ))}

                {/* Nút Hành Động */}
                <Form.Item>
                    <Space
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Button type="default">Hủy Bỏ</Button>
                        <Button type="primary" htmlType="submit">
                            Lưu Lại
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Testing;
