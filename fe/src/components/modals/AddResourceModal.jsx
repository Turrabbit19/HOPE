import {
  CloseCircleOutlined,
  CloseOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Input, Modal, Space, Tag } from "antd";
import React from "react";

export const AddResourceModal = ({ open, onClose, onOk }) => {
  return (
    <Modal
      onCancel={onClose}
      title={
        <div className="text-title text-lg font-medium">Thêm Tài Nguyên</div>
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
      <div className="pt-4 px-1">
        <Input.Search placeholder="Nhập tên Tài Nguyên/Bài Giảng" />
        <Input.Search
          className="mt-10"
          placeholder="Chọn loại Tài Nguyên/Bài Giảng"
        />

        <div style={{ height: "200px" }}>
          <div className="flex justify-between mt-10">
            <span>Tải Tài Nguyên/Bài Giảng</span>
            <Space>
              <img width={20} src="/assets/img/resource-image.png" alt="" />
              <img width={20} src="/assets/svg/trash.svg" alt="" />
            </Space>
          </div>
          <div
            className="mt-2 py-2 px-4 flex justify-center items-center"
            style={{ border: "1px solid #f0f0f0" }}
          >
            <img width={80} src="/assets/img/resource-image.png" alt="" />
          </div>
        </div>
      </div>
    </Modal>
  );
};
