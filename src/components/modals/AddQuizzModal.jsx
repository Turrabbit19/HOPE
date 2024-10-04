import {
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Input, Modal, Space, Tag } from "antd";
import React from "react";

export const AddQuizzModal = ({ open, onClose, onOk }) => {
  return (
    <Modal
      onCancel={onClose}
      title={<div className="text-title text-lg font-medium">Thêm Quizz</div>}
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
        <div className="flex justify-between gap-6 mt-4">
          <Input placeholder="Điền câu hỏi" />
          <Input placeholder="Nhập trọng số (%)" className="w-4/6" />
          <DeleteOutlined className="text-red-500 text-xl" />
        </div>
        <div className="flex justify-between gap-6 mt-8">
          <Input placeholder="Đáp án 1" />
          <Input placeholder="Nhập số điểm" className="w-4/6" />
          <DeleteOutlined className="text-red-500 text-xl" />
        </div>
        <div className="flex justify-between gap-6 mt-8">
          <Input placeholder="Đáp án 1" />
          <Input placeholder="Nhập số điểm" className="w-4/6" />
          <DeleteOutlined className="text-red-500 text-xl" />
        </div>
        <div className="flex justify-between gap-6 mt-8">
          <Input placeholder="Đáp án 1" />
          <Input placeholder="Nhập số điểm" className="w-4/6" />
          <DeleteOutlined className="text-red-500 text-xl" />
        </div>
        <div className="flex justify-end mt-8">
          {" "}
          <Button
            onClick={() => {
              setOpenAddModuleModal(true);
            }}
            type="default"
            style={{ color: "#1167B4", borderColor: "#1167B4" }}
          >
            Thêm câu hỏi{" "}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
