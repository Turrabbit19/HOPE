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
  Upload,
} from "antd";

import React, { useState } from "react";

export const AddTeacherModal = ({ open, onClose, onOk }) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [loading, setLoading] = useState(false);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <Modal
      onCancel={onClose}
      title={
        <div className="text-title text-2xl font-medium">Thêm giáo viên</div>
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
          <div className="flex justify-start">
            {" "}
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your dob!",
                },
              ]}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
              >
                {uploadButton}
              </Upload>{" "}
            </Form.Item>
          </div>
          <Row gutter={30}>
            <Col span={12}>
              {" "}
              <Form.Item
                label="Tên"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your dob!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={1}>Nam</Radio>
                  <Radio value={2}>Nữ</Radio>
                </Radio.Group>{" "}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="dob"
                rules={[
                  {
                    required: true,
                    message: "Please input your dob!",
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item
                label="Dân tộc"
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
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};
