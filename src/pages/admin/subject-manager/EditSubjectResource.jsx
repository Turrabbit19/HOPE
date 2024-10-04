import {
  CloseOutlined,
  SaveFilled,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Input, Row, Space } from "antd";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditSubjectResource = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
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
          <Input suffix={<DeleteOutlined className="text-xl" />} />
        </Form.Item>
        <Form.Item
          label="File slide bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input suffix={<DeleteOutlined className="text-xl" />} />
        </Form.Item>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="#1. Tên tài nguyên"
              layout="vertical"
              className="mt-4"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="#1. Link tài nguyên"
              layout="vertical"
              className="mt-4"
            >
              <Input suffix={<DeleteOutlined className="text-xl" />} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="#1. Tên tài nguyên"
              layout="vertical"
              className="mt-4"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="#1. Link tài nguyên"
              layout="vertical"
              className="mt-4"
            >
              <Input suffix={<DeleteOutlined className="text-xl" />} />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end mt-8">
          {" "}
          <Button
            onClick={() => {}}
            type="default"
            style={{ color: "#1167B4", borderColor: "#1167B4" }}
          >
            Thêm Tài Nguyên{" "}
          </Button>
        </div>
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
          <Input suffix={<DeleteOutlined className="text-xl" />} />
        </Form.Item>
        <Form.Item
          label="File slide bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input suffix={<DeleteOutlined className="text-xl" />} />
        </Form.Item>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="#1. Tên tài nguyên"
              layout="vertical"
              className="mt-4"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="#1. Link tài nguyên"
              layout="vertical"
              className="mt-4"
            >
              <Input suffix={<DeleteOutlined className="text-xl" />} />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end mt-8">
          {" "}
          <Button
            onClick={() => {}}
            type="default"
            style={{ color: "#1167B4", borderColor: "#1167B4" }}
          >
            Thêm Tài Nguyên{" "}
          </Button>
        </div>
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
          <Input suffix={<DeleteOutlined className="text-xl" />} />
        </Form.Item>
        <Form.Item
          label="File slide bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input suffix={<DeleteOutlined className="text-xl" />} />
        </Form.Item>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="#1. Tên tài nguyên"
              layout="vertical"
              className="mt-4"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="#1. Link tài nguyên"
              layout="vertical"
              className="mt-4"
            >
              <Input suffix={<DeleteOutlined className="text-xl" />} />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end mt-8">
          {" "}
          <Button
            onClick={() => {}}
            type="default"
            style={{ color: "#1167B4", borderColor: "#1167B4" }}
          >
            Thêm Tài Nguyên{" "}
          </Button>
        </div>
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
          <Input suffix={<DeleteOutlined className="text-xl" />} />
        </Form.Item>
        <Form.Item
          label="File slide bài giảng"
          layout="vertical"
          className="mt-4"
        >
          <Input suffix={<DeleteOutlined className="text-xl" />} />
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="#1. Tên tài nguyên"
                layout="vertical"
                className="mt-4"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label="#1. Link tài nguyên"
                layout="vertical"
                className="mt-4"
              >
                <Input suffix={<DeleteOutlined className="text-xl" />} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <div className="flex justify-end mt-8">
          {" "}
          <Button
            onClick={() => {}}
            type="default"
            style={{ color: "#1167B4", borderColor: "#1167B4" }}
          >
            Thêm Tài Nguyên{" "}
          </Button>
        </div>
      </Card>
      <div className="flex justify-center gap-4 mt-8">
        <Button
          style={{ backgroundColor: "#795548", color: "white" }}
          onClick={() => {
            navigate(`/admin/subject/${subjectId}/resource`);
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
