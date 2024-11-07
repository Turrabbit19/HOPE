// src/pages/auth/login/page.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Typography, notification } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import instance from "../../../config/axios";
import { AuthContext } from "../../../context/authContext";

const { Title } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Sử dụng AuthContext

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await instance.post("login", values);
            const { token } = response.data;

            // Sử dụng hàm login từ AuthContext
            login(token);
            console.log("Token đã lưu:", localStorage.getItem("authToken"));

            // Hiển thị thông báo đăng nhập thành công
            notification.success({
                message: "Đăng nhập thành công",
                description: "Bạn đã đăng nhập thành công vào hệ thống.",
                placement: "topRight",
                duration: 3,
                onClose: () => {
                    navigate("/officer", { replace: true });
                },
            });
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            let description =
                "Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.";

            if (error.response && error.response.data) {
                const { status, data } = error.response;

                if (status === 401) {
                    if (data.errors && data.errors.email) {
                        const errorMessage = data.errors.email[0];
                        if (
                            errorMessage ===
                            "Thông tin đăng nhập không chính xác."
                        ) {
                            description = "Email hoặc mật khẩu không đúng.";
                        } else {
                            description = errorMessage;
                        }
                    } else {
                        description = "Thông tin đăng nhập không chính xác.";
                    }
                } else if (status === 429) {
                    // Too Many Requests
                    if (data.errors && data.errors.email) {
                        const errorMessage = data.errors.email[0];
                        description = errorMessage; // Sử dụng thông báo từ backend
                    } else {
                        description =
                            "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau.";
                    }
                } else if (status >= 500) {
                    // Lỗi máy chủ
                    description = "Lỗi máy chủ. Vui lòng thử lại sau.";
                } else {
                    description = data.message || description;
                }
            }

            notification.error({
                message: "Đăng nhập thất bại",
                description: description,
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                width: "100%",
                backgroundColor: "#f0f2f5",
            }}
        >
            {/* Phần hình ảnh bên trái */}
            <div
                style={{
                    flex: 1,
                    backgroundColor: "#3b5998",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    color: "#ffffff",
                }}
            >
                <img
                    src="https://i.pinimg.com/736x/72/8b/32/728b328fc23fe339a9f4ab83a703ac1b.jpg"
                    alt="Illustration"
                    style={{
                        width: "80%",
                        maxHeight: "calc(100vh - 100px)",
                        marginBottom: "30px",
                        borderRadius: "10px",
                    }}
                />
            </div>

            {/* Phần form đăng nhập bên phải */}
            <div
                style={{
                    flex: 1,
                    backgroundColor: "#ffffff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                }}
            >
                <Title
                    level={2}
                    style={{
                        color: "#333",
                        marginBottom: "20px",
                        fontSize: "28px",
                    }}
                >
                    Xin chào bạn!
                </Title>

                <Form
                    onFinish={onFinish}
                    style={{ width: "100%", maxWidth: "350px" }}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập email đại học của bạn!",
                                type: "email",
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            size="large"
                            style={{
                                height: "50px",
                                borderRadius: "8px",
                                padding: "0 15px",
                                fontSize: "16px",
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu của bạn!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            size="large"
                            style={{
                                height: "50px",
                                borderRadius: "8px",
                                padding: "0 15px",
                                fontSize: "16px",
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Checkbox style={{ color: "#666" }}>
                                Ghi nhớ đăng nhập
                            </Checkbox>
                            <a
                                href="#"
                                style={{ color: "#3b5998", fontSize: "14px" }}
                            >
                                Quên mật khẩu?
                            </a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                width: "100%",
                                height: "50px",
                                backgroundColor: "#f0b90b",
                                borderColor: "#f0b90b",
                                borderRadius: "8px",
                                fontSize: "16px",
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>

                <Button
                    type="default"
                    icon={<GoogleOutlined />}
                    style={{
                        width: "100%",
                        height: "50px",
                        maxWidth: "350px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        marginTop: "15px",
                        color: "#666",
                        borderColor: "#ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    Đăng nhập bằng Google
                </Button>
            </div>
        </div>
    );
};

export default LoginPage;
