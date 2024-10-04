import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Pagination, Row, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export const SubjectManager = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="flex gap-3 w-52">
          <div className="text-title text-lg font-medium">Quản Lý Môn Học</div>
          <img src="/assets/svg/reload.svg" alt="" />
        </div>
        <Button
          type="default"
          icon={<img src="/assets/svg/filter.svg" />}
          style={{ color: "#1167B4", borderColor: "#1167B4" }}
        >
          Bộ Lọc
        </Button>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            navigate("/admin/subject/add");
          }}
          style={{
            color: "#7017E2",
            borderColor: "#7017E2",
          }}
        >
          Tạo Mới
        </Button>
        <div className="text-sm font-semibold">3 môn học</div>
      </div>
      <div className="mt-4 md:grid grid-cols-2 gap-14">
        <Card
          title={
            <div className="flex justify-between">
              <div className="flex gap-2">
                <img src="/assets/svg/ic-class.svg" alt="" />{" "}
                <span className="text-primary text-sm">Môn Học 01</span>
              </div>
              <img src="/assets/svg/ic-card-option.svg" alt="" />
            </div>
          }
          style={{ width: "651px", height: "350px" }}
        >
          <Row gutter={50}>
            <Col span={12}>
              <img src="/assets/img/class-image.png" alt="" />
              <div className="mt-2">
                <div>
                  <span className="text-grey">Code </span>{" "}
                  <span className="font-semibold">0000000001</span>
                </div>
                <div className="mt-2">
                  <span className="text-grey">Description: </span>{" "}
                  <span className="font-semibold">
                    The Nagasaki Lander is the trademarked name of several
                    series of Nagasaki sport bikes. The Nagasaki Lander is the
                    trademarked name of several series of ...
                  </span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <Tag
                style={{
                  borderRadius: "100px",
                  width: "100px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                }}
                // icon={}
                color="success"
              >
                <div className="flex gap-1 items-center">
                  <img src="/assets/svg/language.svg" />
                  Hoạt Động
                </div>
              </Tag>
            </Col>
          </Row>
          <div
            onClick={() => {
              navigate("/admin/subject/THBTK112");
            }}
            className="cursor-pointer"
          >
            <Divider />
            <div className="flex justify-center gap-2">
              <img src="/assets/svg/setting.svg" alt="" /> <span>Quản Lý</span>
            </div>
          </div>
        </Card>
        <Card
          title={
            <div className="flex justify-between">
              <div className="flex gap-2">
                <img src="/assets/svg/ic-class.svg" alt="" />{" "}
                <span className="text-primary text-sm">Môn Học 01</span>
              </div>
              <img src="/assets/svg/ic-card-option.svg" alt="" />
            </div>
          }
          style={{ width: "651px", height: "350px" }}
        >
          <Row gutter={50}>
            <Col span={12}>
              <img src="/assets/img/class-image.png" alt="" />
              <div className="mt-2">
                <div>
                  <span className="text-grey">Code </span>{" "}
                  <span className="font-semibold">0000000001</span>
                </div>
                <div className="mt-2">
                  <span className="text-grey">Description: </span>{" "}
                  <span className="font-semibold">
                    The Nagasaki Lander is the trademarked name of several
                    series of Nagasaki sport bikes. The Nagasaki Lander is the
                    trademarked name of several series of ...
                  </span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <Tag
                style={{
                  borderRadius: "100px",
                  width: "100px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                }}
                // icon={}
                color="success"
              >
                <div className="flex gap-1 items-center">
                  <img src="/assets/svg/language.svg" />
                  Hoạt Động
                </div>
              </Tag>
            </Col>
          </Row>
          <div
            onClick={() => {
              navigate("/admin/subject/THBTK112");
            }}
            className="cursor-pointer"
          >
            <Divider />
            <div className="flex justify-center gap-2">
              <img src="/assets/svg/setting.svg" alt="" /> <span>Quản Lý</span>
            </div>
          </div>
        </Card>
        <Card
          title={
            <div className="flex justify-between">
              <div className="flex gap-2">
                <img src="/assets/svg/ic-class.svg" alt="" />{" "}
                <span className="text-primary text-sm">Môn Học 01</span>
              </div>
              <img src="/assets/svg/ic-card-option.svg" alt="" />
            </div>
          }
          style={{ width: "651px", height: "350px" }}
        >
          <Row gutter={50}>
            <Col span={12}>
              <img src="/assets/img/class-image.png" alt="" />
              <div className="mt-2">
                <div>
                  <span className="text-grey">Code </span>{" "}
                  <span className="font-semibold">0000000001</span>
                </div>
                <div className="mt-2">
                  <span className="text-grey">Description: </span>{" "}
                  <span className="font-semibold">
                    The Nagasaki Lander is the trademarked name of several
                    series of Nagasaki sport bikes. The Nagasaki Lander is the
                    trademarked name of several series of ...
                  </span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <Tag
                style={{
                  borderRadius: "100px",
                  width: "100px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                }}
                // icon={}
                color="success"
              >
                <div className="flex gap-1 items-center">
                  <img src="/assets/svg/language.svg" />
                  Hoạt Động
                </div>
              </Tag>
            </Col>
          </Row>
          <div
            onClick={() => {
              navigate("/admin/subject/THBTK112");
            }}
            className="cursor-pointer"
          >
            <Divider />
            <div className="flex justify-center gap-2">
              <img src="/assets/svg/setting.svg" alt="" /> <span>Quản Lý</span>
            </div>
          </div>
        </Card>
      </div>
      <Pagination
        className="mt-8"
        align="center"
        defaultCurrent={1}
        total={50}
      />
    </div>
  );
};
