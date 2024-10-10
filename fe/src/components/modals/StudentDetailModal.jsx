import {
  CloseCircleOutlined,
  CloseOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Input,
  Modal,
  Space,
  Tag,
  Checkbox,
  Form,
  DatePicker,
  Radio,
  Row,
  Col,
} from "antd";

import React from "react";

export const StudentDetailModal = ({ open, onClose, onOk, message }) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const user = {
    avatar: "",
    name: "Nguyễn Văn A",
    email: "abc@gmail.com",
    phone: "01234567890",
    dob: "23/9/2005",
    gender: true,
    ethnicity: "Kinh",
    address: "Thạch Thất, Hà Nội",
    msv: "123123",
    major: "CNTT",
  };
  return (
    <Modal
      onCancel={onClose}
      title={
        <div className="text-title text-2xl font-medium">
          Thông tin sinh viên
        </div>
      }
      footer={
        <div className="flex justify-end gap-4 mt-8">
          <Button
            style={{ backgroundColor: "#795548", color: "white" }}
            onClick={() => {
              onClose();
            }}
            icon={<CloseOutlined />}
          >
            Hủy Bỏ
          </Button>
          <Button icon={<SaveOutlined />} type="primary">
            Tiếp tục
          </Button>
        </div>
      }
      open={open}
      width={651}
    >
      <div className="pt-4 pl-16 mt-16">
        <div className="flex justify-center">
          <Avatar icon={<UserOutlined />} />
        </div>
        <div className="text-xl text-center mt-4 font font-medium">
          {user.name}-{user.msv}
        </div>
        <div className="text-xl text-center mt-4 font font-medium">
          Chuyên ngành: {user.major}
        </div>
        <Row className="mt-4" gutter={30}>
          <Col
            className="flex flex-col items-end justify-end text-left"
            span={12}
          >
            <div className="w-1/2">
              {" "}
              <div>Email</div>
              <div>Số Điện Thoại</div>
              <div>Ngày Sinh</div>
              <div>Giới tính</div>
              <div>Dân Tộc</div>
              <div>Địa chỉ</div>
            </div>
          </Col>
          <Col span={12}>
            <div>{user.email}</div>
            <div>{user.phone}</div>
            <div>{user.dob}</div>
            <div>{user.gender ? "Nam" : "Nữ"}</div>
            <div>{user.ethnicity}</div>
            <div>{user.address}</div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
