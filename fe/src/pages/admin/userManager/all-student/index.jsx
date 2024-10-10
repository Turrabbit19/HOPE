import {
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    ExportOutlined,
    EyeOutlined,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Row, Space } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useState } from "react";
import { AddStudentModal } from "../../../../components/modals/AddStudentModal";
import { ConfirmModal } from "../../../../components/modals/ConfirmModal";
import { StudentDetailModal } from "../../../../components/modals/StudentDetailModal";
import { EditStudentModal } from "../../../../components/modals/EditStudentModal";

const AllStudent = () => {
    const [openAdduserModal, setOpenAdduserModal] = useState(false);
    const [openEdituserModal, setOpenEdituserModal] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const listUser = [
        {
            avatar: "",
            name: "Nguyễn Văn A",
            email: "abc@gmail.com",
            phone: "01234567890",
            dob: "23/9/2005",
            gender: true,
            ethnicity: "Kinh",
            address: "Thạch Thất, Hà Nội",
        },
        {
            avatar: "",
            name: "Nguyễn Văn A",
            email: "abc@gmail.com",
            phone: "01234567890",
            dob: "23/9/2005",
            gender: true,
            ethnicity: "Kinh",
            address: "Thạch Thất, Hà Nội",
        },
        {
            avatar: "",
            name: "Nguyễn Văn A",
            email: "abc@gmail.com",
            phone: "01234567890",
            dob: "23/9/2005",
            gender: true,
            ethnicity: "Kinh",
            address: "Thạch Thất, Hà Nội",
        },
        {
            avatar: "",
            name: "Nguyễn Văn A",
            email: "abc@gmail.com",
            phone: "01234567890",
            dob: "23/9/2005",
            gender: true,
            ethnicity: "Kinh",
            address: "Thạch Thất, Hà Nội",
        },
        {
            avatar: "",
            name: "Nguyễn Văn A",
            email: "abc@gmail.com",
            phone: "01234567890",
            dob: "23/9/2005",
            gender: true,
            ethnicity: "Kinh",
            address: "Thạch Thất, Hà Nội",
        },
        {
            avatar: "",
            name: "Nguyễn Văn A",
            email: "abc@gmail.com",
            phone: "01234567890",
            dob: "23/9/2005",
            gender: true,
            ethnicity: "Kinh",
            address: "Thạch Thất, Hà Nội",
        },
    ];
    return (
        <div className="p-2">
            <AddStudentModal
                open={openAdduserModal}
                onClose={() => {
                    setOpenAdduserModal(false);
                }}
            />
            <EditStudentModal
                open={openEdituserModal}
                onClose={() => {
                    setOpenEdituserModal(false);
                }}
            />
            <ConfirmModal
                open={openConfirmModal}
                onClose={() => {
                    setOpenConfirmModal(false);
                }}
                message={
                    <div className="text-xl">
                        Bạn có chắc chắn muốn tiếp tục xoá ?
                    </div>
                }
            />
            <StudentDetailModal
                open={openDetail}
                onClose={() => {
                    setOpenDetail(false);
                }}
            />
            <div className="flex justify-between">
                <div className="text-3xl font-medium">Tất cả học sinh</div>{" "}
                <Space>
                    <Button icon={<ExportOutlined />}>Export</Button>{" "}
                    <Button
                        onClick={() => {
                            setOpenAdduserModal(true);
                        }}
                        icon={<PlusOutlined />}
                        type="primary"
                    >
                        Thêm học sinh
                    </Button>
                </Space>{" "}
            </div>

            <div className="mt-8 grid xl:grid-cols-3 lg:grid-cols-3 gap-16 ml-24">
                {listUser.map((user) => (
                    <Card
                        style={{ width: 300 }}
                        // cover={
                        //   <img
                        //     alt="example"
                        //     src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        //   />
                        // }
                        actions={[
                            <EyeOutlined
                                className="cursor-pointer"
                                onClick={() => {
                                    setOpenDetail(true);
                                }}
                                key="setting"
                            />,
                            <EditOutlined
                                className="cursor-pointer"
                                onClick={() => {
                                    setOpenEdituserModal(true);
                                }}
                                key="edit"
                            />,
                            <DeleteOutlined
                                onClick={() => {
                                    setOpenConfirmModal(true);
                                }}
                                className="cursor-pointer"
                                key="ellipsis"
                            />,
                        ]}
                    >
                        <Meta
                            avatar={
                                <Avatar
                                    src={
                                        user.avatar ||
                                        "https://api.dicebear.com/7.x/miniavs/svg?seed=8"
                                    }
                                />
                            }
                            title={user.name}
                            description={
                                <Row>
                                    <Col
                                        className="text-black font-medium"
                                        span={12}
                                    >
                                        <div>email</div>
                                        <div>số điện thoại</div>
                                        <div>ngày sinh</div>
                                    </Col>
                                    <Col span={12}>
                                        <div>{user.email}</div>
                                        <div>{user.phone}</div>
                                        <div>{user.dob}</div>
                                    </Col>
                                </Row>
                            }
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AllStudent;
