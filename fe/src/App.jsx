import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Sider } = Layout;
const items1 = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            background: "black"
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
              background: "black"
            }}
          />
        </Header>
        <Layout>
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
          <Layout
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Quản lý lịch học</Breadcrumb.Item>
              <Breadcrumb.Item>Lịch học</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: "100vh",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <div className="container mx-auto">
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                  <div className="grid grid-cols-8 gap-1 p-4 border-b border-gray-200 text-center font-bold text-gray-700 ">
                    <div>Ca học</div>
                    <div>Thứ 2</div>
                    <div>Thứ 3</div>
                    <div>Thứ 4</div>
                    <div>Thứ 5</div>
                    <div>Thứ 6</div>
                    <div>Thứ 7</div>
                    <div>Chủ nhật</div>
                  </div>
                  <div className="block md:hidden p-4">
                    <div className="flex flex-col gap-1 p-4">
                      <div className="font-bold text-gray-700">Thứ 2</div>
                      <div className="font-bold text-gray-700">Thứ 3</div>
                      <div className="font-bold text-gray-700">Thứ 4</div>
                      <div className="font-bold text-gray-700">Thứ 5</div>
                      <div className="font-bold text-gray-700">Thứ 6</div>
                      <div className="font-bold text-gray-700">Thứ 7</div>
                      <div className="font-bold text-gray-700">Chủ nhật</div>
                    </div>
                  </div>
                </div>
                <div className="grid-cols-7 gap-1 p-4 flex flex-col ml-7">
                  <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
                    Ca 1
                  </div>
                  <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
                    Ca 2
                  </div>
                  <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
                    Ca 3
                  </div>
                  <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
                    Ca 4
                  </div>
                  <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
                    Ca 5
                  </div>
                  <div className="bg-white font-bold text-gray-700 shadow-md w-[75px] h-[50px] leading-[50px] text-center border border-gray-300 rounded-lg">
                    Ca 6
                  </div>
                  
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
