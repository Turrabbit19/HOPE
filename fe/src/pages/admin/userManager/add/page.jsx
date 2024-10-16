import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    DatePicker,
    Radio,
    Select,
    Upload,
    Row,
    Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const UserAdd = () => {
    const [role, setRole] = useState(""); // Không có vai trò nào chọn ban đầu

    // Xử lý khi thay đổi vai trò
    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const onFinish = (values) => {
        console.log("Form Values:", values);
    };

    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ gender: true }}
            style={{ maxWidth: 1000, margin: "0 auto" }}
        >
            <h2 className="syllabus-title">Thêm Mới User</h2>

            {/* Dùng Row và Col để chia làm 2 cột */}
            <Row gutter={16}>
                <Col span={12}>
                    {/* Họ Tên */}
                    <Form.Item
                        label="Họ Tên"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập họ tên!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập họ tên" />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    {/* Số điện thoại */}
                    <Form.Item
                        label="Số Điện Thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    {/* Dân tộc */}
                    <Form.Item
                        label="Dân Tộc"
                        name="ethnicity"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập dân tộc!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập dân tộc" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    {/* Ngày sinh */}
                    <Form.Item
                        label="Ngày Sinh"
                        name="dob"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày sinh!",
                            },
                        ]}
                    >
                        <DatePicker format="DD/MM/YYYY" />
                    </Form.Item>

                    {/* Giới tính */}
                    <Form.Item label="Giới Tính" name="gender">
                        <Radio.Group>
                            <Radio value={true}>Nam</Radio>
                            <Radio value={false}>Nữ</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* Địa chỉ */}
                    <Form.Item
                        label="Địa Chỉ"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập địa chỉ!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    {/* Avatar Upload */}
                    <Form.Item label="Avatar" name="avatar">
                        <Upload listType="picture" maxCount={1}>
                            <Button icon={<UploadOutlined />}>
                                Tải lên Avatar
                            </Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>

            {/* Vai trò */}
            <Form.Item
                label="Vai Trò"
                name="role"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
                <Radio.Group onChange={handleRoleChange}>
                    <Radio value="student">Sinh Viên</Radio>
                    <Radio value="teacher">Giáo Viên</Radio>
                    <Radio value="admin">Cán Bộ</Radio>
                    <Radio value="admin1">Quản Trị Viên</Radio>
                </Radio.Group>
            </Form.Item>

            {/* Các trường hiển thị theo vai trò */}
            {role === "student" && (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mã Sinh Viên"
                            name="student_code"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mã sinh viên!",
                                },
                            ]}
                        >
                            <Input placeholder="Nhập mã sinh viên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Chuyên Ngành"
                            name="major"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn chuyên ngành!",
                                },
                            ]}
                        >
                            <Select placeholder="Chọn chuyên ngành">
                                <Option value="CNTT">
                                    Công Nghệ Thông Tin
                                </Option>
                                <Option value="KinhTe">Kinh Tế</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                            <Select placeholder="Chọn khóa học">
                                <Option value="KH1">Khóa Học 1</Option>
                                <Option value="KH2">Khóa Học 2</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            )}

            {role === "teacher" && (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mã Giáo Viên"
                            name="teacher_code"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mã giáo viên!",
                                },
                            ]}
                        >
                            <Input placeholder="Nhập mã giáo viên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Chuyên Ngành Dạy"
                            name="major"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn chuyên ngành!",
                                },
                            ]}
                        >
                            <Select placeholder="Chọn chuyên ngành">
                                <Option value="CNTT">
                                    Công Nghệ Thông Tin
                                </Option>
                                <Option value="KinhTe">Kinh Tế</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            )}

            {/* Mật khẩu */}
            {/* <Form.Item
                label="Mật Khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
                <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item> */}

            <div className="flex items-center justify-center">
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm Mới
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default UserAdd;
