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
  AreaChartOutlined,
  FormOutlined,
  BarsOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const AsideAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigates = [
    {
      name: "Quản lý Cán Bộ",
      link: "/admin/admin-manager",
      icon: <UserOutlined />,
    },
    {
      name: "Quản lý Sinh viên",
      link: "/admin/all-student",
      icon: <TeamOutlined />,
    },
    {
      name: "Quản lý Giảng viên",
      link: "/admin/teacher-manager",
      icon: <UserOutlined />,
    },
  ];

  const study_manager = [
    {
      name: "Quản lý ngành học",
      link: "/admin/majors",

      icon: <BookOutlined />,
    },
    {
      name: "Quản lý môn học",
      link: "/admin/list-subject",
      icon: <ReadOutlined />,
    },
    {
      name: "Quản lý khóa học",
      link: "/admin/list-course",
      icon: <DatabaseOutlined />,
    },
    {
      name: "Quản lý kỳ học",
      link: "/admin/list-semesters",
      icon: <CalendarOutlined />,
    },

    {
      name: "Quản lý lớp học",
      link: "/admin/classrooms",
      icon: <ReadOutlined />,
    },
    {
      name: "Quản lý phòng học",
      link: "/admin/list-rooms",
      icon: <HomeOutlined />,
    },
  ];

  const schedules = [
    {
      name: "Kế hoạch học tập",
      link: "/admin/list-syllabus",
      icon: <BookFilled />,
    },
    {
      name: "Quản lý lịch học",
      link: "/admin/list-schedule",
      icon: <ReadOutlined />,
    },
  ];

  const statistical_report = [
    {
      name: "Sinh viên - Khóa học",
      link: "/admin/statistical-report",
      icon: <UserOutlined />,
    },
    {
      name: "Sinh viên - Giảng viên",
      link: "/admin/statistical-report/teacher-student",
      icon: <TeamOutlined />,
    },
  ];

  const { Sider } = Layout;

  const items2 = [
    {
      key: "sub1",
      icon: <AreaChartOutlined />,
      label: <Link to="/admin/statistical-report">Thống kê</Link>,
    },
    {
      key: "sub2",
      icon: <BarsOutlined />,
      label: "Quản lý chương trình dạy",
      children: study_manager.map((item, index) => ({
        key: `sub2-${index + 1}`,
        icon: item.icon,
        label: <Link to={item.link}>{item.name}</Link>,
      })),
    },
    {
      key: "sub3",
      icon: <FormOutlined />,
      label: "Kế hoạch và lịch học",
      children: schedules.map((item, index) => ({
        key: `sub3-${index + 1}`,
        icon: item.icon,
        label: <Link to={item.link}>{item.name}</Link>,
      })),
    },
    {
      key: "sub4",
      icon: <TeamOutlined />,
      label: "Quản lý nhân lực",
      children: navigates.map((item, index) => ({
        key: `sub4-${index + 1}`,
        icon: item.icon,
        label: <Link to={item.link}>{item.name}</Link>,
      })),
    },

    {
      key: "sub5",
      icon: <BellOutlined />,
      label: <Link to="/admin/list-sections">Quản lý thông báo</Link>,
    },
    {
      key: "sub5",
      icon: <BellOutlined />,
      label: <Link to="/admin/tuition-fee">Quản lý học phí</Link>,
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
        icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
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
