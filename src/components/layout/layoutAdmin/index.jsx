import React, { useState } from "react";
import HeaderAdmin from "./header";
import { Layout } from "antd";
import AsideAdmin from "./aside";
import ContentAdmin from "./content";
import { Outlet } from "react-router-dom";
import List from "../../../pages/admin/list";

const LayoutAdmin = () => {
    const [isAsideVisible, setIsAsideVisible] = useState(false);

    const toggleAside = () => {
        setIsAsideVisible(!isAsideVisible);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <HeaderAdmin toggleAside={toggleAside} />
            <Layout style={{ position: "relative" }}>
                {isAsideVisible && <AsideAdmin />}
                <Layout
                    style={{
                        padding: "0 12px 12px",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <ContentAdmin />
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
