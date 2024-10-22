import {
  CloseCircleOutlined,
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
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
  Select,
  Upload,
} from "antd";

import React, { useState } from "react";

export const ChangeRoleModal = ({ open, onClose, onOk }) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      onCancel={onClose}
      title={
        <div className="text-title text-2xl font-medium">
          Điền thông tin học sinh
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
          <Button
            onClick={() => {
              onOk();
            }}
            icon={<SaveOutlined />}
            type="primary"
          >
            Lưu Lại
          </Button>
        </div>
      }
      open={open}
      width={651}
    >
      <div className="pt-4 pl-16 mt-16">
        <Form
          name="basic"
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={30}>
            <Col span={12}>
              {" "}
              <Form.Item
                label="Mã sinh viên"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your dob!",
                  },
                ]}
              >
                <Input />
              </Form.Item>{" "}
              <Form.Item
                label="Lớp"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your dob!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Khoá học"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your dob!",
                  },
                ]}
              >
                <Select />
              </Form.Item>
              <Form.Item
                label="Ngành học"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your dob!",
                  },
                ]}
              >
                <Select />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};
