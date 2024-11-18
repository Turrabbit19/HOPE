// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./authContext";

const AuthProvider = ({ children }) => {
    // Kiểm tra xem có token trong localStorage hay không để xác định trạng thái xác thực
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("authToken")
    );

    // Hàm đăng nhập: lưu token vào localStorage và cập nhật trạng thái xác thực
    const login = (token) => {
        localStorage.setItem("authToken", token);
        setIsAuthenticated(true);
    };

    // Hàm đăng xuất: xóa token khỏi localStorage và cập nhật trạng thái xác thực
    const logout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    // Lắng nghe sự thay đổi của localStorage để cập nhật trạng thái xác thực khi có thay đổi từ các tab khác
    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem("authToken"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
