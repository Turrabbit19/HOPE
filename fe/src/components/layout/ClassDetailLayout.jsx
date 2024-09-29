import { Col, Row, Space } from "antd";
import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

export const ClassDetailLayout = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    return (
        <Row style={{ height: "100vh", marginTop: "-32px" }}>
            <Col span={4}>
                <div className="pt-2 px-4">
                    <div className="text-title text-base font-medium">
                        Quản Lý Lớp Học
                    </div>
                    <div>CLA101</div>
                    <div className="mt-4">
                        <div className="text-grey font-semibold">
                            Thông Tin Lịch Học
                        </div>
                        <Space
                            onClick={() => {
                                navigate("/admin/class-student/" + classId);
                            }}
                            className="mt-4 cursor-pointer"
                        >
                            <img src="/assets/svg/calendar.svg" alt="" />
                            <span className="text-primary font-semibold">
                                Lịch Học
                            </span>
                        </Space>
                    </div>
                    <div className="mt-4">
                        <div className="text-grey font-semibold">
                            Thông Tin Tài Khoản
                        </div>
                        <Space
                            onClick={() => {
                                navigate(
                                    `/admin/class-student/${classId}/account-manage`
                                );
                            }}
                            className="mt-4 cursor-pointer"
                        >
                            {" "}
                            <img src="/assets/svg/manage-acount.svg" alt="" />
                            <span className="text-primary font-semibold">
                                Tài Khoản
                            </span>
                        </Space>
                    </div>
                    <div className="mt-4">
                        <div className="text-grey font-semibold">
                            Thông Tin Tài Nguyên
                        </div>
                        <Space
                            onClick={() => {
                                navigate(
                                    `/admin/class-student/${classId}/resource`
                                );
                            }}
                            className="mt-4 cursor-pointer"
                        >
                            {" "}
                            <img src="/assets/svg/book.svg" alt="" />
                            <span className="text-primary font-semibold">
                                Bài Giảng & Tài Nguyên
                            </span>
                        </Space>
                    </div>
                    <div className="mt-4">
                        <div className="text-grey font-semibold">
                            Thông Tin Bài Tập
                        </div>
                        <Space className="mt-4 cursor-pointer">
                            {" "}
                            <img src="/assets/svg/calendar.svg" alt="" />
                            <span className="text-primary font-semibold">
                                Bài Tập
                            </span>
                        </Space>
                    </div>
                    <div className="mt-4">
                        <div className="text-grey font-semibold">Cài Đặt:</div>
                        <Space className="mt-4 cursor-pointer">
                            {" "}
                            <img src="/assets/svg/group.svg" alt="" />
                            <span className="text-primary font-semibold">
                                Thông Tin Lớp Học
                            </span>
                        </Space>
                        <Space className="mt-4 cursor-pointer">
                            {" "}
                            <img src="/assets/svg/lock.svg" alt="" />
                            <span className="text-primary font-semibold">
                                Khóa Lớp Học
                            </span>
                        </Space>
                        <Space className="mt-4 cursor-pointer">
                            {" "}
                            <img src="/assets/svg/cancel.svg" alt="" />
                            <span className="text-primary font-semibold">
                                Đóng Lớp Học
                            </span>
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
