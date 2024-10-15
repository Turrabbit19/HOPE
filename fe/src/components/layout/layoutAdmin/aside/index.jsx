import React, { useState } from "react";
import { Layout, Menu, theme, Button } from "antd";
import { Link } from "react-router-dom";
import {
    DoubleLeftOutlined,
    DoubleRightOutlined,
    UserOutlined,
    BookOutlined,
    TeamOutlined,
    HomeOutlined,
    CalendarOutlined,
    BookFilled,
    ReadOutlined,
    BellOutlined,
} from "@ant-design/icons";

const AsideAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navigates = [
        // {
        //     name: "Quản lý sinh viên",
        //     link: "/admin/student_manager",
        //     icon: <UserOutlined />,
        // },
        // {
        //     name: "Tất cả sinh viên",
        //     link: "/admin/all-student",
        //     icon: <TeamOutlined />,
        // },
        // {
        //     name: "Quản lý giảng viên",
        //     link: "/admin/teacher-manager",
        //     icon: <UserOutlined />,
        // },
        {
            name: "Quản lý người dùng",
            link: "/admin/list-users",
            icon: <TeamOutlined />,
        },
    ];

    const study_manager = [
        {
            name: "Quản lý ngành học",
            link: "/admin/teaching",
            icon: <BookOutlined />,
        },
        {
            name: "Quản lý môn học",
            link: "/admin/list-subject",
            icon: <ReadOutlined />,
        },
        {
            name: "Kế hoạch học tập",
            link: "/admin/list-syllabus",
            icon: <BookFilled />,
        },
        {
            name: "Quản lý khóa học",
            link: "/admin/list-course",
            icon: <BookOutlined />,
        },
        {
            name: "Quản lý kỳ học",
            link: "/admin/list-semesters",
            icon: <CalendarOutlined />,
        },
        {
            name: "Quản lý phòng học",
            link: "/admin/list-rooms",
            icon: <HomeOutlined />,
        },
        {
            name: "Quản lý lớp học",
            link: "/admin/classrooms",
            icon: <ReadOutlined />,
        },
    ];

    const { Sider } = Layout;

    const items2 = [
        {
            key: "sub1",
            icon: <BookOutlined />,
            label: "Quản lý chương trình dạy",
            children: study_manager.map((item, index) => ({
                key: `sub1-${index + 1}`,
                icon: item.icon,
                label: <Link to={item.link}>{item.name}</Link>,
            })),
        },
        {
            key: "sub2",
            icon: <TeamOutlined />,
            label: "Quản lý nhân lực",
            children: navigates.map((item, index) => ({
                key: `sub2-${index + 1}`,
                icon: item.icon,
                label: <Link to={item.link}>{item.name}</Link>,
            })),
        },

        {
            key: "sub3",
            icon: <BellOutlined />,
            label: <Link to="/admin/list-sections">Quản lý thông báo</Link>,
        },
    ];

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Sider
            width={250}
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
