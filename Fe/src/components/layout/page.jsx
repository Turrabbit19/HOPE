import React, { useState } from "react";
import { Layout } from "antd";
import Aside from "./aside/page";
import HeaderComponent from "./header/page";
import Content from "./content/page";

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Aside collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Nội dung chính */}
            <Layout
                style={{
                    marginLeft: collapsed ? 80 : 250, // Điều chỉnh chiều rộng dựa trên trạng thái của Aside
                    transition: "all 0.2s",
                }}
            >
                <HeaderComponent
                    style={{
                        background: "#fff",
                        padding: 0,
                    }}
                >
                    {/* Header có thể đặt thêm nội dung nếu cần */}
                </HeaderComponent>
                <Layout>
                    <Content />
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
