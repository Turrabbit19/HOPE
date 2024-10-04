import { CloseOutlined, SaveFilled, SaveOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Input, Space, Tag, TimePicker } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
export const AddScheduleManual = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-6 px-4">
      <div className="flex justify-between">
        <div className="flex gap-3 w-52">
          <div className="text-title text-lg">Cấu Hình Thủ Công</div>
        </div>
        <Space size="large">
          <CloseOutlined onClick={() => {}} className="cursor-pointer" />
          <SaveFilled className="cursor-pointer" />
        </Space>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <Card
          title={<div className="text-primary font-semibold">Buổi 01: ...</div>}
        >
          <div className="flex justify-between gap-10">
            {" "}
            <DatePicker
              placeholder="Ngày"
              className="w-72"
              onChange={(value, dateString) => {
                console.log("Selected Time: ", value);
                console.log("Formatted Selected Time: ", dateString);
              }}
            />
            <TimePicker className="w-48" placeholder="T.Gian bắt đầu" />
            <TimePicker className="w-48" placeholder="T.Gian kết thúc" />
            <Input className="w-72" placeholder="Link Học Trực Tuyến" />
          </div>
        </Card>
        <Card
          title={<div className="text-primary font-semibold">Buổi 02: ...</div>}
        >
          <div className="flex justify-between gap-10">
            {" "}
            <DatePicker
              placeholder="Ngày"
              className="w-72"
              onChange={(value, dateString) => {
                console.log("Selected Time: ", value);
                console.log("Formatted Selected Time: ", dateString);
              }}
            />
            <TimePicker className="w-48" placeholder="T.Gian bắt đầu" />
            <TimePicker className="w-48" placeholder="T.Gian kết thúc" />
            <Input className="w-72" placeholder="Link Học Trực Tuyến" />
          </div>
        </Card>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <Button
          style={{ backgroundColor: "#795548", color: "white" }}
          onClick={() => {
            navigate("");
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
