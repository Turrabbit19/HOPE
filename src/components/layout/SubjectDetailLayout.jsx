import { Col, Row, Space } from "antd";
import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

export const SubjectDetailLayout = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  return (
    <Row style={{ height: "100vh", marginTop: "-32px" }}>
      <Col span={4}>
        <div className="pt-2 px-4">
          <div className="text-title text-base font-medium">
            Quản Lý Môn Học
          </div>
          <div>MH00001</div>
          <div className="mt-4">
            <div className="text-grey font-semibold">Management:</div>
            <Space
              onClick={() => {
                navigate("/admin/subject/" + subjectId);
              }}
              className="mt-4 cursor-pointer"
            >
              {" "}
              <img src="/assets/svg/book.svg" alt="" />
              <span className="text-primary font-semibold">
                Thông Tin Marketing
              </span>
            </Space>
            <Space
              onClick={() => {
                navigate(`/admin/subject/${subjectId}/sell-info`);
              }}
              className="mt-4 cursor-pointer"
            >
              {" "}
              <img src="/assets/svg/book.svg" alt="" />
              <span className="text-primary font-semibold">
                Thông Tin Bán Hàng
              </span>
            </Space>
            <Space
              onClick={() => {
                navigate(`/admin/subject/${subjectId}/document`);
              }}
              className="mt-4 cursor-pointer"
            >
              {" "}
              <img src="/assets/svg/book.svg" alt="" />
              <span className="text-primary font-semibold">
                Thông Tin Giáo Trình
              </span>
            </Space>
            <Space
              onClick={() => {
                navigate(`/admin/subject/${subjectId}/resource`);
              }}
              className="mt-4 cursor-pointer"
            >
              {" "}
              <img src="/assets/svg/book.svg" alt="" />
              <span className="text-primary font-semibold">
                Bài Giảng & Tài Nguyên
              </span>
            </Space>
            <Space
              onClick={() => {
                navigate(`/admin/subject/${subjectId}/exercise`);
              }}
              className="mt-4 cursor-pointer"
            >
              {" "}
              <img src="/assets/svg/book.svg" alt="" />
              <span className="text-primary font-semibold">
                Hệ Thống Điểm Và Bài Tập
              </span>
            </Space>
          </div>

          <div className="mt-4">
            <div className="text-grey font-semibold">Cài Đặt:</div>
            <div>
              {" "}
              <Space className="mt-4 cursor-pointer">
                {" "}
                <img src="/assets/svg/group.svg" alt="" />
                <span className="text-primary font-semibold">Unit Info</span>
              </Space>
            </div>
            <div>
              <Space className="mt-4 cursor-pointer">
                {" "}
                <img src="/assets/svg/lock.svg" alt="" />
                <span className="text-primary font-semibold">Lock Unit</span>
              </Space>
            </div>
            <Space className="mt-4 cursor-pointer">
              {" "}
              <img src="/assets/svg/cancel.svg" alt="" />
              <span className="text-primary font-semibold">Close Unit</span>
            </Space>
          </div>
        </div>
      </Col>
      <Col className="bg-[#F5F5F5]" span={20}>
        <Outlet />
      </Col>
    </Row>
  );
};
