import React from "react";
import { Layout, Input, Avatar, Badge, Typography, Space } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const Header = () => {
    return (
        <AntHeader
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                backgroundColor: "#fff",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                borderBottom: "1px solid #e0e0e0",
                height: "64px",
            }}
        >
            {/* Logo hoặc tên ứng dụng */}
            <Typography.Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                Quản trị hệ thống
            </Typography.Title>

            {/* Thanh tìm kiếm */}
            <Input
                placeholder="Search..."
                style={{
                    maxWidth: 400,
                    borderRadius: "8px",
                }}
            />

            {/* Biểu tượng thông báo và Avatar */}
            <Space size="middle">
                <Badge count={5} offset={[-2, 2]}>
                    <BellOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                </Badge>
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: "#87d068",
                    }}
                />
            </Space>
        </AntHeader>
    );
};

export default Header;
