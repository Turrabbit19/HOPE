import React from "react";
import HeaderAdmin from "./header";
import { Layout } from "antd";
import AsideAdmin from "./aside";
import ContentAdmin from "./content";
import { Outlet } from "react-router-dom";
import List from "../../../pages/admin/list";

const LayoutAdmin = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <HeaderAdmin />
            <Layout className="">
                <AsideAdmin />
                <Layout
                    className=""
                    style={{
                        padding: "0 24px 24px",
                    }}
                >
                    <ContentAdmin />
                </Layout>
            </Layout>
        </Layout>
    );
};
export default LayoutAdmin;
