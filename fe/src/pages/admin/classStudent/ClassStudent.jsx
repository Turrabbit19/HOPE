import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Pagination, Row, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ClassStudent = () => {
    const navigate = useNavigate();
    return (
        <div className="p-4">
            <div className="flex justify-between">
                <div className="flex gap-3 w-52">
                    <div className="text-title text-lg font-medium">
                        Quản Lý Lớp Học
                    </div>
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
                        navigate("/admin/class-student/add");
                    }}
                    style={{
                        color: "#7017E2",
                        borderColor: "#7017E2",
                    }}
                >
                    Tạo Mới
                </Button>
                <div className=" font-semibold">3 lớp học</div>
            </div>
            <div className="mt-4 md:grid grid-cols-2 gap-14">
                <Card
                    title={
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <img src="/assets/svg/ic-class.svg" alt="" />{" "}
                                <span className="text-primary ">
                                    K11 Khóa Học Tìm Hiểu Bản Thân 2
                                </span>
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
                                    <span className="text-grey">Mã Lớp: </span>{" "}
                                    <span className="font-semibold">
                                        THBTK112
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-grey">Tên Môn: </span>{" "}
                                    <span className="font-semibold">
                                        Tìm Hiểu Bản Thân
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-grey">Mã Môn: </span>{" "}
                                    <span className="font-semibold">
                                        PDP001
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
                            navigate("/admin/class-student/THBTK112");
                        }}
                        className="cursor-pointer"
                    >
                        <Divider />
                        <div className="flex justify-center gap-2">
                            <img src="/assets/svg/setting.svg" alt="" />{" "}
                            <span>Quản Lý</span>
                        </div>
                    </div>
                </Card>
                <Card
                    title={
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <img src="/assets/svg/ic-class.svg" alt="" />
                                <span className="text-primary ">
                                    K11 Khóa Học Tìm Hiểu Bản Thân 2
                                </span>
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
                                    <span className="text-grey">Mã Lớp: </span>{" "}
                                    <span className="font-semibold">
                                        THBTK112
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-grey">Tên Môn: </span>{" "}
                                    <span className="font-semibold">
                                        Tìm Hiểu Bản Thân
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-grey">Mã Môn: </span>{" "}
                                    <span className="font-semibold">
                                        PDP001
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
                    <div className="cursor-pointer">
                        <Divider />
                        <div
                            onClick={() => {
                                navigate("/admin/class-student/THBTK112");
                            }}
                            className="flex justify-center gap-2"
                        >
                            <img src="/assets/svg/setting.svg" alt="" />{" "}
                            <span>Quản Lý</span>
                        </div>
                    </div>
                </Card>
                <Card
                    title={
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <img src="/assets/svg/ic-class.svg" alt="" />{" "}
                                <span className="text-primary ">
                                    K11 Khóa Học Tìm Hiểu Bản Thân 2
                                </span>
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
                                    <span className="text-grey">Mã Lớp: </span>{" "}
                                    <span className="font-semibold">
                                        THBTK112
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-grey">Tên Môn: </span>{" "}
                                    <span className="font-semibold">
                                        Tìm Hiểu Bản Thân
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-grey">Mã Môn: </span>{" "}
                                    <span className="font-semibold">
                                        PDP001
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
                    <div className="cursor-pointer">
                        <Divider />
                        <div
                            onClick={() => {
                                navigate("/admin/class-student/THBTK112");
                            }}
                            className="flex justify-center gap-2"
                        >
                            <img src="/assets/svg/setting.svg" alt="" />{" "}
                            <span>Quản Lý</span>
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
