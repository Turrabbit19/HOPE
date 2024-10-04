import {
  CloseOutlined,
  SaveFilled,
  SaveOutlined,
  DeleteOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Input, Row, Space } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddModuleModal } from "../../../components/modals/AddModuleModal";

export const Exercise = () => {
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
          <div className="text-title text-lg">Hệ thống điểm và bài tập</div>
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
        <div
          style={{ border: "1px solid #f0f0f0" }}
          className="flex justify-between py-3 px-2"
        >
          <span
            className="text-primary font-semibold cursor-pointer"
            onClick={() => {
              navigate("/admin/subject/THBTK112/exercise/quizz/abc");
            }}
          >
            Quiz 1
          </span>
          <Space size="large">
            <span
              className="text-grey cursor-pointer"
              onClick={() => {
                navigate("/admin/subject/THBTK112/exercise/quizz/abc");
              }}
            >
              Ẩn/Hiện/Sửa
            </span>
            <DeleteOutlined className="text-red-500 text-xl" />
          </Space>
        </div>
        <div
          style={{ border: "1px solid #f0f0f0" }}
          className="flex justify-between py-3 px-2 mt-4 rounded-md"
        >
          <span
            className="text-primary font-semibold cursor-pointer"
            onClick={() => {
              navigate("/admin/subject/THBTK112/exercise/quizz/abc");
            }}
          >
            Quiz 2
          </span>
          <Space size="large">
            <span
              className="text-grey cursor-pointer"
              onClick={() => {
                navigate("/admin/subject/THBTK112/exercise/quizz/abc");
              }}
            >
              Ẩn/Hiện/Sửa
            </span>
            <DeleteOutlined className="text-red-500 text-xl" />
          </Space>
        </div>
        <div
          style={{ border: "1px solid #f0f0f0" }}
          className="flex justify-between py-3 px-2 mt-4 rounded-md"
        >
          <span
            className="text-primary font-semibold cursor-pointer"
            onClick={() => {
              navigate("/admin/subject/THBTK112/exercise/quizz/abc");
            }}
          >
            Quiz 3
          </span>
          <Space size="large">
            <span
              className="text-grey cursor-pointer"
              onClick={() => {
                navigate("/admin/subject/THBTK112/exercise/quizz/abc");
              }}
            >
              Ẩn/Hiện/Sửa
            </span>
            <DeleteOutlined className="text-red-500 text-xl" />
          </Space>
        </div>
        <div
          style={{ border: "1px solid #f0f0f0" }}
          className="flex justify-between py-3 px-2 mt-4 rounded-md"
        >
          <span
            className="text-primary font-semibold cursor-pointer"
            onClick={() => {
              navigate("/admin/subject/THBTK112/exercise/quizz/abc");
            }}
          >
            Quiz 4
          </span>
          <Space size="large">
            <span
              className="text-grey cursor-pointer"
              onClick={() => {
                navigate("/admin/subject/THBTK112/exercise/quizz/abc");
              }}
            >
              Ẩn/Hiện/Sửa
            </span>
            <DeleteOutlined className="text-red-500 text-xl" />
          </Space>
        </div>
        <div className="flex justify-end mt-8">
          {" "}
          <Button
            onClick={() => {}}
            type="default"
            style={{ color: "#1167B4", borderColor: "#1167B4" }}
          >
            Tạo thêm Quiz{" "}
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
