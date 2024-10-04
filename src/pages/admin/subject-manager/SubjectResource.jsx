import { SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Input, Row, Space } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddModuleModal } from "../../../components/modals/AddModuleModal";

export const SubjectResource = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 pt-4">
      <div className="flex justify-between">
        <div className="flex gap-3 w-52">
          <div className="text-title text-lg">Bài Giảng & Tài Nguyên</div>
        </div>
      </div>
      <div className="text-primary font-medium text-base mt-4">
        Module #1: Lý thuyết 22 lá Ẩn chính của Tarot
      </div>
      <Card className="mt-4">
        <div className="flex justify-between">
          <span className="text-primary font-medium text-base">
            Buổi 1: Nguồn gốc phương pháp và cấu trúc của Matrix of Destiny{" "}
          </span>
        </div>
        <Form.Item
          label="Link video bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="File slide bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input />
        </Form.Item>
        <Form.Item label="#1. File cài đặt" layout="vertical" className="mt-4">
          <Input />
        </Form.Item>
        <Form.Item label="#2. Link mua bài" layout="vertical" className="mt-4">
          <Input />
        </Form.Item>
      </Card>
      <Card className="mt-4">
        <div className="flex justify-between">
          <span className="text-primary font-medium text-base">
            Buổi 2: Phương pháp thiết lập Sơ đồ Ma Trận Vận Mệnh (Matrix of
            Destiny) và cách xuất kết quả trên Hệ thống học viện{" "}
          </span>
        </div>
        <Form.Item
          label="Link video bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="File slide bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input />
        </Form.Item>
      </Card>
      <div className="text-primary font-medium text-base mt-4">
        Module 2: Lý thuyết 22 lá Ẩn chính của Tarot{" "}
      </div>
      <Card className="mt-4">
        <div className="flex justify-between">
          <span className="text-primary font-medium text-base">
            Buổi 1: Nguồn gốc phương pháp và cấu trúc của Matrix of Destiny{" "}
          </span>
        </div>
        <Form.Item
          label="Link video bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="File slide bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input />
        </Form.Item>
      </Card>
      <Card className="mt-4">
        <div className="flex justify-between">
          <span className="text-primary font-medium text-base">
            Buổi 2: Phương pháp thiết lập Sơ đồ Ma Trận Vận Mệnh (Matrix of
            Destiny) và cách xuất kết quả trên Hệ thống học viện{" "}
          </span>
        </div>
        <Form.Item
          label="Link video bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="File slide bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input />
        </Form.Item>
      </Card>
      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={() => {
            navigate("edit");
          }}
          icon={<SaveOutlined />}
          type="primary"
        >
          Chỉnh Sửa{" "}
        </Button>
      </div>
    </div>
  );
};
