import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  theme,
  Button,
  Modal,
  Popconfirm,
  notification,
} from "antd";
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
  DollarOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import instance from "../../../../config/axios";
import moment from "moment";

const AsideAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(
          `admin/schedule/getChangeScheduleTeacher`
        );
        setNotifications(data);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  const onHandleSubmit = async (index) => {
    try {
      const { data } = await instance.post(
        `admin/schedule/acceptHandleChangeSchedule`,
        { index: index }
      );
      setNotifications(data);
      notification.success({ message: "Thay đổi ngày dạy thành công" });
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const onHandleRefuse = async (index) => {
    try {
      const { data } = await instance.post(
        `admin/schedule/refuseHandleChangeSchedule`,
        { index: index }
      );
      setNotifications(data);
      notification.success({ message: "Hủy bỏ đổi ngày dạy thành công" });
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
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
      name: "Quản lý khóa sinh viên",
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
      key: "sub6",
      icon: <DollarOutlined />,
      label: <Link to="/admin/tuition-fee">Quản lý học phí</Link>,
    },
    {
      key: "sub7",
      icon: <AlertOutlined />,
      label: (
        <button onClick={handleShowModal}>
          Quản lý thay đổi lịch{" "}
          <sup className="text-xl text-blue-500">{notifications.length}</sup>
        </button>
      ),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
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
      <Modal
        title="Quản lý thay đổi lịch"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {notifications.list && notifications.list.length > 0 ? (
          notifications.list.map((item, index) => (
            <div style={{ textAlign: "left" }} key={index}>
              {item.old_date ? (
                <>
                  <p>
                    <strong>Người yêu cầu:</strong> {item.requester_name}
                  </p>
                  <p>
                    <strong>Môn học:</strong> {item.subject_name}
                  </p>
                  <p>
                    <strong>Ngày cũ:</strong> {item.old_date}
                  </p>
                  <p>
                    <strong>Ngày mới:</strong>{" "}
                    {item.new_date || "Không có thông tin"}
                  </p>
                  <p>
                    <strong>Thời gian yêu cầu:</strong>{" "}
                    {item.time_request || "Không có thông tin"}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Môn học:</strong> {item.subject_name}
                  </p>
                  <p>
                    <strong>Phòng:</strong> {item.room_name}
                  </p>
                  <p>
                    <strong>Ngày:</strong> {item.date}
                  </p>
                  <p>
                    <strong>Người yêu cầu:</strong>{" "}
                    {item.requester_name || "N/A"}
                  </p>
                  <p>
                    <strong>Thời gian yêu cầu:</strong> {item.time_request}
                  </p>
                  <p>
                    <strong>Giảng viên mới:</strong>{" "}
                    {item.new_teacher_name || "N/A"}
                  </p>{" "}
                </>
              )}
              <div className="flex gap-2 justify-end">
                <Popconfirm
                  title="Bạn có chắc muốn hủy yêu cầu này không?"
                  onConfirm={() => onHandleRefuse(index)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button danger>Hủy bỏ</Button>
                </Popconfirm>
                <Popconfirm
                  title="Bạn có chắc muốn chấp nhận yêu cầu này không?"
                  onConfirm={() => onHandleSubmit(index)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="primary">Chấp nhận</Button>
                </Popconfirm>
              </div>
            </div>
          ))
        ) : (
          <p>Không có thông báo thay đổi lịch.</p>
        )}
      </Modal>
    </>
  );
};

export default AsideAdmin;
