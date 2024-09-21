import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";

const AsideAdmin = () => {
  const navigates = [
    { name: "Quản lý sinh viên", link: "/admin/student-manager" },
    { name: "Quản lý giảng viên", link: "/admin/teacher-manager" }
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
      label: (
        <Link to="/admin/majors">Quản lý ngành học</Link>
      )
    },
    {
      key: "sub3",
      label: (
        <Link to="/admin/courses">Quản lý khóa học</Link>
      )
    },
    {
      key: "sub4",
      label: (
        <Link to="/admin/semesters">Quản lý kỳ học</Link>
      )
    }
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Sider
      width={300}
      style={{
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
