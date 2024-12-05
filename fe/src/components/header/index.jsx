import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import instance from "../../config/axios";
// import ThemeToggleButton from "../../theme/themeToggleButton";

const HeaderLandingPage = () => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const showLoading = () => {
        setOpen(true);
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 1500);
    };
    const onFinish = async (credentialResponse) => {
        try {
            console.log("Google Credential:", credentialResponse.credential);
            const { data } = await instance.post("google-login", {
                credential: credentialResponse.credential,
            });
            console.log("Server Response:", data);
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <>
            <Modal
                title={<p>Đăng nhập</p>}
                footer={null}
                loading={loading}
                open={open}
                width={600}
                onCancel={() => setOpen(false)}
            >
                <Form
                    className="flex flex-col justify-center items-center mt-10"
                    name="basic"
                    // style={{
                    //   maxWidth: 500,
                    // }}

                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                        style={{
                            width: 450,
                        }}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                        style={{
                            width: 450,
                        }}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex gap-1 ">
                            <GoogleOAuthProvider clientId="727074021020-s38ks3vfp5kb1iugpsj275fldko3h8fp.apps.googleusercontent.com">
                                <GoogleLogin
                                    onSuccess={onFinish}
                                    onError={() => {
                                        console.log("Login Failed");
                                    }}
                                ></GoogleLogin>
                            </GoogleOAuthProvider>

                            <Button
                                className="bg-black text-white font-bold"
                                htmlType="submit"
                                style={{ width: 100, height: 40 }}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
            <header className="w-full max-w-[1140px] mx-auto h-[50px] flex items-center justify-end  relative z-50">
                <nav className="flex">
                    <Button type="primary" onClick={showLoading}>
                        Cán bộ đào tạo
                    </Button>
                    {/* <ThemeToggleButton></ThemeToggleButton> */}
                    <span>Giảng viên</span>
                    <span>Phụ huynh</span>
                    <span>Sinh viên</span>
                </nav>
            </header>
        </>
    );
};

export default HeaderLandingPage;

