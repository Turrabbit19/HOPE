import React from "react";
import PropTypes from "prop-types";
import { Layout, Menu, Button } from "antd";
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
} from "@ant-design/icons";

const Aside = ({ collapsed, setCollapsed }) => {
    const navigates = [
        {
            name: "Quản lý sinh viên",
            link: "/officer/student_manager",
            icon: <UserOutlined />,
        },
        {
            name: "Tất cả sinh viên",
            link: "/officer/all-student",
            icon: <TeamOutlined />,
        },
        {
            name: "Quản lý giảng viên",
            link: "/officer/teacher-manager",
            icon: <UserOutlined />,
        },
        {
            name: "Quản lý người dùng",
            link: "/officer/all-user",
            icon: <TeamOutlined />,
        },
    ];

    const study_manager = [
        {
            name: "Quản lý ngành học",
            link: "/officer/majors",
            icon: <BookOutlined />,
        },
        {
            name: "Quản lý môn học",
            link: "/officer/list-subjects",
            icon: <ReadOutlined />,
        },
        {
            name: "Kế hoạch học tập",
            link: "/officer/list-syllabus",
            icon: <BookFilled />,
        },
        {
            name: "Quản lý khóa học",
            link: "/officer/list-course",
            icon: <BookOutlined />,
        },
        {
            name: "Quản lý kỳ học",
            link: "/officer/list-semesters",
            icon: <CalendarOutlined />,
        },
        {
            name: "Quản lý phòng học",
            link: "/officer/list-rooms",
            icon: <HomeOutlined />,
        },
        {
            name: "Quản lý lớp học",
            link: "/officer/classrooms",
            icon: <ReadOutlined />,
        },
    ];

    const { Sider } = Layout;

    const menuItems = [
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
    ];

    return (
        <Sider
            width={250}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{
                color: "#fff",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <Button
                type="text"
                icon={
                    collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    margin: "16px auto",
                    width: "100%",
                    color: "#fff",
                    backgroundColor: "#1890ff",
                    border: "none",
                }}
            />
            <Menu
                theme="dark"
                mode="inline"
                defaultOpenKeys={["sub1"]}
                items={menuItems}
                style={{
                    borderRight: 0,
                }}
            />
        </Sider>
    );
};
Aside.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    setCollapsed: PropTypes.func.isRequired,
};

export default Aside;
