// src/components/layout/content/page.jsx
import React from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";

const { Content: AntContent } = Layout;

const CustomContent = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <AntContent
            style={{
                padding: 22,
                margin: "18px 6px 0 6px",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                minHeight: "calc(100vh - 64px - 18px)", // Tính toán chiều cao cho phù hợp
                boxSizing: "border-box",
            }}
        >
            <Outlet />
        </AntContent>
    );
};

export default CustomContent;
