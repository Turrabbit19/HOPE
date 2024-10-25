import { Button, Card, Space, Tag } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ClassStudentDetail = () => {
    const navigate = useNavigate();
    const { classId } = useParams();

    return (
        <div className="pt-6 px-4">
            <div className="flex gap-3 w-52">
                <div className="text-title text-lg font-medium">
                    Danh Sách Lịch Học
                </div>
                <img src="/assets/svg/reload.svg" alt="" />
            </div>
            <div className="flex justify-between items-center mt-4">
                <Space>
                    {" "}
                    <Button
                        onClick={() => {
                            navigate(
                                `/admin/class-student/${classId}/schedule/add-series`
                            );
                        }}
                        style={{
                            color: "#7017E2",
                            borderColor: "#7017E2",
                        }}
                    >
                        Cấu Hình Hàng Loạt{" "}
                    </Button>
                    <Button
                        onClick={() => {
                            navigate(
                                `/admin/class-student/${classId}/schedule/add-manual`
                            );
                        }}
                        style={{
                            color: "#7017E2",
                            borderColor: "#7017E2",
                        }}
                    >
                        Cấu Hình Thủ Công{" "}
                    </Button>
                </Space>
                <div className="text-sm font-semibold">6 items</div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <Card
                    title={
                        <div className="text-primary font-semibold">
                            Buổi 01: ...
                        </div>
                    }
                >
                    <div className="flex justify-between">
                        <div className="flex justify-between gap-8">
                            {" "}
                            <Space>
                                <span className="text-grey">Ngày: </span>{" "}
                                <span>10/06/2024</span>
                            </Space>
                            <Space>
                                <span className="text-grey">Thời gian</span>{" "}
                                <span>22:00 ~ 23:00</span>
                            </Space>
                            <Space>
                                <span className="text-grey">
                                    Link Học Trực Tuyến:{" "}
                                </span>{" "}
                                <a
                                    href="https://meet.google.com/iue-fgfz-fgk"
                                    className="text-primary"
                                >
                                    https://meet.google.com/iue-fgfz-fgk
                                </a>
                            </Space>
                        </div>
                        <Space>
                            <Tag
                                style={{
                                    borderRadius: "100px",
                                    width: "120px",
                                    height: "26px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                // icon={}
                                color="success"
                            >
                                <div className="flex gap-1 items-center">
                                    <img src="/assets/svg/language.svg" />
                                    Đã Triển Khai{" "}
                                </div>
                            </Tag>
                            <Tag
                                style={{
                                    borderRadius: "100px",
                                    width: "100px",
                                    height: "26px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                // icon={}
                                color="blue"
                            >
                                <div className="flex gap-1 items-center">
                                    <img src="/assets/svg/language-blue.svg" />
                                    Chờ Học
                                </div>
                            </Tag>
                        </Space>
                    </div>
                </Card>
                <Card
                    title={
                        <div className="text-primary font-semibold">
                            Buổi 02: ...
                        </div>
                    }
                >
                    <div className="flex justify-between">
                        <div className="flex justify-between gap-8">
                            {" "}
                            <Space>
                                <span className="text-grey">Ngày: </span>{" "}
                                <span>10/06/2024</span>
                            </Space>
                            <Space>
                                <span className="text-grey">Thời gian</span>{" "}
                                <span>22:00 ~ 23:00</span>
                            </Space>
                            <Space>
                                <span className="text-grey">
                                    Link Học Trực Tuyến:{" "}
                                </span>{" "}
                                <a
                                    href="https://meet.google.com/iue-fgfz-fgk"
                                    className="text-primary"
                                >
                                    https://meet.google.com/iue-fgfz-fgk
                                </a>
                            </Space>
                        </div>
                        <Space>
                            <Tag
                                style={{
                                    borderRadius: "100px",
                                    width: "120px",
                                    height: "26px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                // icon={}
                                color="success"
                            >
                                <div className="flex gap-1 items-center">
                                    <img src="/assets/svg/language.svg" />
                                    Đã Triển Khai{" "}
                                </div>
                            </Tag>
                            <Tag
                                style={{
                                    borderRadius: "100px",
                                    width: "100px",
                                    height: "26px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                // icon={}
                                color="blue"
                            >
                                <div className="flex gap-1 items-center">
                                    <img src="/assets/svg/language-blue.svg" />
                                    Chờ Học
                                </div>
                            </Tag>
                        </Space>
                    </div>
                </Card>
            </div>
        </div>
    );
};
