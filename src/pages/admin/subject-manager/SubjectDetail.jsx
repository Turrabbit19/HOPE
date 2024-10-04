import { Button, Card, Col, Input, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useNavigate } from "react-router-dom";

const SubjectDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-4 px-4">
      <div>
        <span className="text-title text-lg font-medium">
          Thông Tin Môn Học
        </span>
      </div>
      <Card className="mt-4">
        <div>
          <span className="text-primary font-medium text-base">Tổng Quan</span>
        </div>
        <Row gutter={48} className="mt-4">
          <Col span={12}>
            <Input placeholder="Code" />
            <Input className="mt-10" placeholder="Tên" />
            <TextArea className="mt-10" placeholder="Mô tả" />
            <Input
              className="mt-10"
              placeholder="Chọn hình thức học online/offline"
            />
          </Col>
          <Col span={12}>
            <div>Logo</div>
            <img src="/assets/img/class-image.png" alt="" />
            <Card className="mt-4">
              <Space>
                {" "}
                <img width={40} src="/assets/svg/img_small.svg" alt="" />
                <div className="truncate w-80">
                  https://static.vcid.org/sso-avatar/556e90c4-1923-47e1-8b6c-4ee0919d01eb/300-bai-code-thieu-thi.jpg
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
      <Card className="mt-4">
        <div>
          <span className="text-base text-primary font-medium">
            Thông Tin Mô Tả
          </span>
        </div>
        <div className="flex justify-between mt-4">
          <span className="text-base font-medium">#1. Nội Dung Môn Học</span>
          <Space>
            <img src="/assets/svg/edit.svg" alt="" />
            <img src="/assets/svg/delete.svg" alt="" />
          </Space>
        </div>
        <TextArea placeholder="Mô tả" className="mt-4" />
        <div className="flex justify-between mt-16">
          <span className="text-base font-medium">#2. Lợi Ích Môn Học</span>
          <Space>
            <img src="/assets/svg/edit.svg" alt="" />
            <img src="/assets/svg/delete.svg" alt="" />
          </Space>
        </div>
        <TextArea placeholder="Mô tả" className="mt-4" />
      </Card>
      <Row gutter={24}>
        <Col span={12}>
          <Card className="mt-4">
            <span className="text-primary font-medium text-base">
              Thông Tin Giảng Viên #1
            </span>
            <Input className="mt-2" placeholder="Tên" />
            <Input className="mt-10" placeholder="Vị trí" />
            <TextArea
              className="mt-16"
              placeholder="Bằng cấp, Chứng chỉ, Thành tích,..."
            />

            <div className="mt-4">Avatar</div>
            <img src="/assets/img/class-image.png" alt="" />
            <Card className="mt-4">
              <Space>
                {" "}
                <img width={40} src="/assets/svg/img_small.svg" alt="" />
                <div className="truncate w-80">
                  https://static.vcid.org/sso-avatar/556e90c4-1923-47e1-8b6c-4ee0919d01eb/300-bai-code-thieu-thi.jpg{" "}
                </div>
              </Space>
            </Card>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="mt-4">
            <span className="text-primary font-medium text-base">
              Thông Tin Giảng Viên #1
            </span>
            <Input className="mt-2" placeholder="Tên" />
            <Input className="mt-10" placeholder="Vị trí" />
            <TextArea
              className="mt-16"
              placeholder="Bằng cấp, Chứng chỉ, Thành tích,..."
            />

            <div className="mt-4">Avatar</div>
            <img src="/assets/img/class-image.png" alt="" />
            <Card className="mt-4">
              <Space>
                {" "}
                <img width={40} src="/assets/svg/img_small.svg" alt="" />
                <div className="truncate w-80">
                  https://static.vcid.org/sso-avatar/556e90c4-1923-47e1-8b6c-4ee0919d01eb/300-bai-code-thieu-thi.jpg{" "}
                </div>
              </Space>
            </Card>
          </Card>
        </Col>
      </Row>
      <div className="mt-4 mb-4 flex justify-center">
        <Button
          onClick={() => {
            navigate("edit");
          }}
          type="primary"
        >
          Chỉnh Sửa
        </Button>
      </div>
    </div>
  );
};

export default SubjectDetail;
