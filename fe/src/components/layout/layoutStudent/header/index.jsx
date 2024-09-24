import React from "react";
import { Layout, Menu } from "antd";
const HeaderStudent = () => {
  const { Header } = Layout;
  const items1 = ["1", "2", "3"].map((key) => ({
    key,
    label: `nav ${key}`,
  }));
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        background: "black",
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items1}
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          alignItems: "center",
          background: "black",
        }}
      />
    </Header>
  );
};

export default HeaderStudent;
