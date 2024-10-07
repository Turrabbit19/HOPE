import React, { useState } from "react";
import { Layout, Menu, theme, Button } from "antd";
import { Link } from "react-router-dom";
import {
    DoubleLeftOutlined,
    DoubleRightOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";

const AsideAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navigates = [
        { name: "Quản lý sinh viên", link: "/admin/student_manager" },
        { name: "Quản lý giảng viên", link: "/admin/teacher-manager" },
    ];

    const study_manager = [
        { name: "Quản lý khóa học", link: "/admin/list-courses" },
        { name: "Quản lý kỳ học", link: "/admin/list-semesters" },
        { name: "Quản lý ngành học", link: "/admin/teaching" },
        { name: "Quản lý môn học", link: "/admin/list-subject" },
        { name: "Quản lý lớp học", link: "/admin/classrooms" },
        { name: "Quản lý phòng học", link: "/admin/list-rooms" },
    ];

    const { Sider } = Layout;

    const items2 = [
        {
            key: "sub1",
            label: "Quản lý chương trình dạy",
            children: study_manager.map((item, index) => ({
                key: `sub1-${index + 1}`,
                label: <Link to={item.link}>{item.name}</Link>,
            })),
        },
        {
            key: "sub2",
            label: "Quản lý nhân lực",
            children: navigates.map((item, index) => ({
                key: `sub2-${index + 1}`,
                label: <Link to={item.link}>{item.name}</Link>,
            })),
        },

        {
            key: "sub3",
            label: <Link to="/admin/majors">Quản lý ngành học</Link>,
        },
        {
            key: "sub4",
            label: <Link to="/admin/courses">Quản lý khóa học</Link>,
        },
        {
            key: "sub5",
            label: <Link to="/admin/semesters">Quản lý kỳ học</Link>,
        },
        {
            key: "sub6",
            label: <Link to="/admin/subjects">Quản lý môn học</Link>,
        },
    ];

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Sider
            width={250}
            collapsible
            collapsed={collapsed}
            style={{
                background: colorBgContainer,
            }}
        >
            <Button
                type="text"
                icon={
                    collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    marginBottom: 16,
                    width: "100%",
                }}
            />
            <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{
                    height: "100%",
                    borderRight: 0,
                }}
                items={items2}
            />
        </Sider>
    );
};

export default AsideAdmin;
