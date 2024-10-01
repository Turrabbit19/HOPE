import React from "react";

import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";

const AsideAdmin = () => {
    const navigates = [
        { name: "Quản lý sinh viên", link: "/admin/student_manager" },
        { name: "Quản lý giảng viên", link: "/admin/teacher-manager" },
    ];
    const { Sider } = Layout;

    const items2 = [
        {
            key: "sub1",
            label: "Quản lý nhân lực",
            children: navigates.map((item, index) => ({
                key: `sub1-${index + 1}`,
                label: <Link to={item.link}>{item.name}</Link>,
            })),
        },
        {
            key: "sub2",
            label: <Link to="/admin/majors">Quản lý ngành học</Link>,
        },
        {
            key: "sub3",
            label: <Link to="/admin/courses">Quản lý khóa học</Link>,
        },
        {
            key: "sub4",
            label: <Link to="/admin/semesters">Quản lý kỳ học</Link>,
        },
        {
            key: "sub5",
            label: <Link to="/admin/subjects">Quản lý môn học</Link>,
        },
        {
            key: "sub6",
            label: <Link to="/admin/teaching">Quản lý Chuyên Ngành Học</Link>,
        },
        {
            key: "sub7",
            label: <Link to="/admin/class-student">Quản lý lớp học</Link>,
        },
    ];

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Sider
            className="aside-overlay open close"
            width={300}
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 999,
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                background: colorBgContainer,
            }}
        >
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
