import {
  CloseCircleOutlined,
  CloseOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Input, Modal, Space, Tag } from "antd";
import React from "react";

export const AddModuleModal = ({ open, onClose, onOk }) => {
  return (
    <Modal
      onCancel={onClose}
      title={<div className="text-title text-lg font-medium">Thêm Module</div>}
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
      <div className="pt-4 px-1">
        <Input placeholder="Tiêu Đề Mô Tả" />
      </div>
    </Modal>
  );
};
