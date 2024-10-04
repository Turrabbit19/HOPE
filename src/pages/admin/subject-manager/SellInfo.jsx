import { CloseOutlined, SaveFilled, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Input, Row, Space } from "antd";
import React from "react";

export const SellInfo = () => {
  return (
    <div className="px-4 pt-4">
      <div className="flex justify-between">
        <div className="flex gap-3 w-52">
          <div className="text-title text-lg">Thông Tin Bán Hàng</div>
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
        <div>
          <span className="text-primary font-medium text-base">
            Giá Niêm Yết
          </span>
        </div>
        <Input className="mt-4" placeholder="Giá niêm yết" />
      </Card>
      <Row gutter={32} className="mt-8">
        <Col span={12}>
          <Card>
            <div>
              <span className="text-primary font-medium text-base">
                #1. Thanh Toán Một Lần{" "}
              </span>
            </div>
            <Input className="mt-4" placeholder="Giá ưu đãi" />
            <DatePicker
              className="mt-16 w-full"
              placeholder="Ngày kết thúc ưu đãi"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <div>
              <span className="text-primary font-medium text-base">
                #2. Thanh Toán Theo Lộ Trình Học{" "}
              </span>
            </div>
            <Input className="mt-4" placeholder="Tổng giá" />
            <Input className="mt-8" placeholder="Lần 1" />
            <Input className="mt-8" placeholder="Lần 2" />
            <Input className="mt-8" placeholder="Lần 3" />
          </Card>
        </Col>
      </Row>
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
