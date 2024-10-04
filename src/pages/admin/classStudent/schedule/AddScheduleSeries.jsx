import { CloseOutlined, SaveFilled, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Tag,
  TimePicker,
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
export const AddScheduleSeries = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-6 px-4">
      <div className="flex justify-between">
        <div className="flex gap-3 w-52">
          <div className="text-title text-lg">Cấu Hình Hàng Loạt</div>
        </div>
        <Space size="large">
          <CloseOutlined onClick={() => {}} className="cursor-pointer" />
          <SaveFilled className="cursor-pointer" />
        </Space>
      </div>
      <Card
        title={
          <div className="text-primary font-semibold">Cấu Hình Thông Tin</div>
        }
      >
        <div>
          <div className="text-base font-medium">Thời Gian Khóa Học:</div>
          <Row gutter={50} className="mt-4">
            <Col span={12}>
              <DatePicker
                className="w-full"
                placeholder="Ngày bắt đầu (Buổi 01)"
              />{" "}
            </Col>
            <Col span={12}>
              <DatePicker
                className="w-full"
                placeholder="Ngày kết thúc (Buổi 17)"
              />
            </Col>
          </Row>
        </div>
        <div className="mt-10">
          <div className="text-base font-medium">Thời Gian Lặp:</div>
          <div className="flex gap-8 mt-4">
            {" "}
            <Checkbox>Thứ 2</Checkbox> <Checkbox>Thứ 3</Checkbox>{" "}
            <Checkbox>Thứ 4</Checkbox> <Checkbox>Thứ 5</Checkbox>{" "}
            <Checkbox>Thứ 6</Checkbox> <Checkbox>Thứ 7</Checkbox>{" "}
            <Checkbox>Chủ Nhật</Checkbox>{" "}
          </div>
          <Select className="w-1/2 mt-4">
            <Select.Option value="sample">Lặp lại hàng tuần</Select.Option>
          </Select>
          <div className="px-4">
            <span className="text-xs text-grey">
              Lựa chọn thời gian lặp lại theo mong muốn (Ví dụ: mỗi thứ 2, thứ 6
              hàng tuần)
            </span>
          </div>
        </div>
        <div className="mt-10">
          <div className="text-base font-medium">
            Link Học Trực Tuyến/ Phòng học trực tiếp
          </div>
          <Input className="mt-4" placeholder="Link Học Trực Tuyến" />
        </div>
        <Button
          className=" mt-20"
          type="default"
          style={{ color: "#1167B4", borderColor: "#1167B4" }}
        >
          Tạo Danh Sách Lịch Học{" "}
        </Button>
      </Card>

      <Card
        title={
          <div className="text-primary font-semibold">Kết Quả Lịch Học</div>
        }
        className="mt-4 flex flex-col gap-4"
      >
        <i className="font-medium text-base">Buổi 01: ...</i>
        <div className="flex justify-between gap-10 mt-2">
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
