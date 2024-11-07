import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Giả sử đây là hàm để xử lý đăng nhập
        // Kiểm tra xác thực thành công
        const isAuthenticated = true; // Giả định đăng nhập thành công

        if (isAuthenticated) {
            // Điều hướng đến Dashboard sau khi đăng nhập thành công
            navigate("/dashboard");
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
