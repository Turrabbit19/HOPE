import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/page";
import DashboardPage from "../pages/dashboard/page";
import LoginPage from "../pages/auth/login/page";

const isAuthenticated = true;

// Cấu hình các route
const Router = createBrowserRouter([
    {
        path: "/",
        element: isAuthenticated ? (
            <Navigate to="/dashboard" />
        ) : (
            <Navigate to="/login" />
        ),
    },

    {
        path: "/dashboard",
        element: isAuthenticated ? <MainLayout /> : <Navigate to="/login" />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
        ],
    },

    {
        path: "/login",
        element: <LoginPage />,
    },
]);

export default Router;
