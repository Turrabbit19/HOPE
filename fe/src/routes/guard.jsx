import React from "react";
import { Navigate } from "react-router-dom";

const Guard = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem("role");

    if (!userRole || !allowedRoles.includes(userRole)) {
        if (userRole === "Sinh viên") {
            return <Navigate to="/student/home" />;
        }
        if (userRole === "Giảng viên") {
            return <Navigate to="/teacher/home" />;
        }
        if (userRole === "Quản trị viên") {
            return <Navigate to="/admin" />;
        }
    }

    return children;
};

export default Guard;