// src/routes/page.jsx
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/page";
import LoginPage from "../pages/auth/login/page";
import OfficerPage from "../pages/dashboard/page";
import { AuthContext } from "../context/authContext";

const Router = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Routes>
                {/* Route gốc */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/officer" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Route đăng nhập */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/officer" replace />
                        ) : (
                            <LoginPage />
                        )
                    }
                />

                {/* Route bảo vệ /officer */}
                <Route
                    path="/officer"
                    element={
                        isAuthenticated ? (
                            <MainLayout />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                >
                    {/* Các route con của /officer */}
                    <Route index element={<OfficerPage />} />
                    {/* Thêm các route con khác nếu cần */}

                    <Route path="student">
                        {/* <Route index element={<StudentPage />} /> */}

                        {/* <Route path="add" element={<AddStudentPage />} /> */}

                        {/* Bạn có thể thêm các route con khác của /officer/student tại đây */}
                    </Route>
                </Route>

                {/* Thêm các route khác nếu cần */}
                {/* Ví dụ: Trang 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
