import {
  CloseOutlined,
  SaveFilled,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Input, Row, Space } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddModuleModal } from "../../../components/modals/AddModuleModal";

export const Document = () => {
  const navigate = useNavigate();
  const [openAddModuleModal, setOpenAddModuleModal] = useState(false);
  return (
    <div className="px-4 pt-4">
      <AddModuleModal
        open={openAddModuleModal}
        onClose={() => {
          setOpenAddModuleModal(false);
        }}
      />
      <div className="flex justify-between">
        <div className="flex gap-3 w-52">
          <div className="text-title text-lg">Thông Tin Giáo Trình</div>
        </div>
        <Space size="large">
          <CloseOutlined
            onClick={() => {
              navigate("/admin/class-student");
            }}
            className="cursor-pointer"
          />
          <SaveFilled className="cursor-pointer" />
        </Space>
      </div>
      <Card className="mt-4">
        <div className="flex justify-between">
          <span className="text-primary font-medium text-base">
            Module #1: Lý thuyết 22 lá Ẩn chính của Tarot
          </span>
          <Space>
            <img src="/assets/svg/edit.svg" alt="" />
            <img src="/assets/svg/delete.svg" alt="" />
          </Space>
        </div>
        <Input
          className="mt-4"
          placeholder="Nội dung buổi 01"
          suffix={<DeleteOutlined className="text-xl" />}
        />
        <Input
          className="mt-16"
          placeholder="Nội dung buổi 02"
          suffix={<DeleteOutlined className="text-xl" />}
        />
        <Input
          className="mt-16"
          placeholder="Nội dung buổi 03"
          suffix={<DeleteOutlined className="text-xl" />}
        />
        <div className="flex justify-end mt-8">
          {" "}
          <Button
            onClick={() => {}}
            type="default"
            style={{ color: "#1167B4", borderColor: "#1167B4" }}
          >
            Thêm Buổi Học{" "}
          </Button>
        </div>
      </Card>
      <Card className="mt-4">
        <div className="flex justify-between">
          <span className="text-primary font-medium text-base">
            Module #1: Lý thuyết 22 lá Ẩn chính của Tarot
          </span>
          <Space>
            <img src="/assets/svg/edit.svg" alt="" />
            <img src="/assets/svg/delete.svg" alt="" />
          </Space>
        </div>
        <Input
          className="mt-4"
          placeholder="Nội dung buổi 01"
          suffix={<DeleteOutlined className="text-xl" />}
        />
        <Input
          className="mt-16"
          placeholder="Nội dung buổi 02"
          suffix={<DeleteOutlined className="text-xl" />}
        />
        <Input
          className="mt-16"
          placeholder="Nội dung buổi 03"
          suffix={<DeleteOutlined className="text-xl" />}
        />
        <div className="flex justify-end mt-8">
          {" "}
          <Button
            onClick={() => {}}
            type="default"
            style={{ color: "#1167B4", borderColor: "#1167B4" }}
          >
            Thêm Buổi Học{" "}
          </Button>
        </div>
      </Card>
      <div className="flex justify-end mt-8">
        {" "}
        <Button
          onClick={() => {
            setOpenAddModuleModal(true);
          }}
          type="default"
          style={{ color: "#1167B4", borderColor: "#1167B4" }}
        >
          Thêm Module{" "}
        </Button>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <Button
          style={{ backgroundColor: "#795548", color: "white" }}
          onClick={() => {}}
          icon={<CloseOutlined />}
        >
          Hủy Bỏ
        </Button>
        <Button icon={<SaveOutlined />} type="primary">
          Lưu Lại
        </Button>
      </div>
    </div>
  );
};
