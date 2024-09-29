import { CloseOutlined, SaveFilled, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export const AddClassStudent = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex gap-3 w-52">
          <div className="text-title text-lg">Tạo Mới Lớp Học</div>
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
      <Card>
        <div>
          <span className="text-primary font-medium text-base">Tổng Quan</span>
        </div>
        <Row gutter={40} className="mt-4">
          <Col span={12}>
            <Input size="large" placeholder="Mã" />
            <Input size="large" className="mt-14 h-10" placeholder="Tên" />
            <Input.TextArea
              className="mt-10"
              size="large"
              placeholder="Mô tả"
            />
          </Col>
          <Col span={12}>
            <div className="flex justify-between">
              <span>Logo</span>
              <Space>
                <img src="/assets/svg/img_small.svg" alt="" />
                <img src="/assets/svg/trash.svg" alt="" />
              </Space>
            </div>
            <div>
              <Card>
                <div className="flex justify-center">
                  <img src="/assets/svg/img_preview.svg" alt="" />
                </div>
              </Card>
              <Card className="mt-2">
                <div className="flex items-center gap-3">
                  <img src="/assets/svg/img_small.svg" alt="" />
                  <span>
                    https://static.vcid.org/sso-avatar/556e90c4-1923-47e1-8b6c-4ee0919d01eb/300-bai-code-thieu-thi.jpg
                  </span>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Card>
      <div className="flex justify-center gap-4 mt-8">
        <Button
          style={{ backgroundColor: "#795548", color: "white" }}
          onClick={() => {
            navigate("/admin/class-student");
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
