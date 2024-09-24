import React from "react";

import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
const { Content } = Layout;
const ContentStudent = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: "100vh",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
      // className="flex justify-center items-center"
    >
      <Outlet/>
    </Content>
  );
};

export default ContentStudent;
