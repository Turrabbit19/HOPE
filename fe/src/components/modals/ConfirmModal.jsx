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
} from "antd";

import React from "react";

export const ConfirmModal = ({ open, onClose, onOk, message }) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      onCancel={onClose}
      title={<div className="text-title text-2xl font-medium">Thông báo</div>}
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
      <div className="pt-4 pl-16 mt-16">{message}</div>
    </Modal>
  );
};
