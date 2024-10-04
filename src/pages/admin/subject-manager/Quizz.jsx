import {
  CloseOutlined,
  SaveFilled,
  SaveOutlined,
  DeleteOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Input, Row, Space } from "antd";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddQuizzModal } from "../../../components/modals/AddQuizzModal";

export const Quizz = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [openAddModuleModal, setOpenAddModuleModal] = useState(false);
  return (
    <div className="px-4 pt-4">
      <AddQuizzModal
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
      <div className="mt-2">
        <span className="text-primary text-base font-medium">Quiz 1</span>
      </div>
      <Card className="mt-4">
        <div className="mt-2 flex justify-between">
          <span className="text-primary text-base font-medium">
            Câu hỏi 1: Nguồn gốc phương pháp và cấu trúc của Matrix of Destiny
          </span>
          <Space size="large">
            <span className="text-primary text-base font-medium">
              Trọng số:
            </span>
            <span className="text-primary text-base font-medium">30% </span>
          </Space>
          <Space size="large">
            <span className="text-grey">Ẩn/Hiện/Sửa</span>
            <DeleteOutlined className="text-red-500 text-xl" />
          </Space>
        </div>
        <div
          style={{ border: "1px solid #f0f0f0" }}
          className="flex justify-between py-3 px-2 mt-8"
        >
          <span className="text-primary font-semibold">Đáp án 1</span>
          <Space size="large">
            <span className="text-grey">Sửa</span>
            <DeleteOutlined className="text-red-500 text-xl" />
          </Space>
        </div>
        <div
          style={{ border: "1px solid #f0f0f0" }}
          className="flex justify-between py-3 px-2 mt-4 rounded-md"
        >
          <span className="text-primary font-semibold">Đáp án 2</span>
          <Space size="large">
            <span className="text-grey">Sửa</span>
            <DeleteOutlined className="text-red-500 text-xl" />
          </Space>
        </div>
        <div
          style={{ border: "1px solid #f0f0f0" }}
          className="flex justify-between py-3 px-2 mt-4 rounded-md"
        >
          <span className="text-primary font-semibold">Đáp án 3</span>
          <Space size="large">
            <span className="text-grey">Sửa</span>
            <DeleteOutlined className="text-red-500 text-xl" />
          </Space>
        </div>
        <div
          style={{ border: "1px solid #f0f0f0" }}
          className="flex justify-between py-3 px-2 mt-4 rounded-md"
        >
          <span className="text-primary font-semibold">Đáp án 4</span>
          <Space size="large">
            <span className="text-grey">Sửa</span>
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
            Thêm đáp án{" "}
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
          Thêm câu hỏi{" "}
        </Button>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <Button
          style={{ backgroundColor: "#795548", color: "white" }}
          onClick={() => {
            navigate(`/admin/subject/${subjectId}/exercise`);
          }}
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
