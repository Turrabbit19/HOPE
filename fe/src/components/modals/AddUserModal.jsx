import {
  CloseCircleOutlined,
  CloseOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Input, Modal, Space, Tag } from "antd";
import React from "react";

export const AddUserModal = ({
  open,
  onClose,
  onOk,
}) => {
  return (
    <Modal
      onCancel={onClose}
      title={
        <div className="text-title text-lg font-medium">Thêm Tài Khoản</div>
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
        <Input placeholder="Nhập số điện thoại" />
        <div className="text-xs text-grey mt-2 px-4">
          Nhập chính xác số điện thoại để tìm kiếm Tài khoản
        </div>
        <div className="mt-4">
          <Tag
            closeIcon={<CloseCircleOutlined style={{ fontSize: "15px" }} />}
            color="#0000001A"
            style={{ borderRadius: "100px", height: "32px" }}
            className="flex justify-center items-center w-fit"
            onClose={console.log}
          >
            <Avatar className="w-5 h-5" />
            <span className="text-xs ml-2 text-[black]">Nguyễn Văn A</span>
          </Tag>
        </div>
        <div style={{ height: "200px" }}>
          <div
            className="mt-2 py-2 px-4 flex justify-between items-center"
            style={{ border: "1px solid #f0f0f0" }}
          >
            <Space>
              <Avatar />
              <div>
                <div className="text-primary text-base font-medium">
                  Nguyễn Văn A
                </div>
                <div>
                  <span className="text-grey">Điện Thoại:</span>
                  <span>0978123123</span>
                </div>
              </div>
            </Space>
            <Button
              className="w-fit text-xs"
              style={{ color: "#1167B4", borderColor: "#1167B4" }}
            >
              Lựa Chọn{" "}
            </Button>
          </div>
          <div className="text-grey mt-4">
            Số điện thoại không tồn tại. Mời bạn kiểm tra lại số điện thoại hoặc
            tạo nhanh tài khoản.
          </div>
          <div className="flex justify-center">
            <Button
              className="w-fit mt-4"
              style={{ color: "#1167B4", borderColor: "#1167B4" }}
            >
              Tạo Nhanh Tài Khoản{" "}
            </Button>{" "}
          </div>
        </div>
      </div>
    </Modal>
  );
};
