import {
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    ExportOutlined,
    EyeOutlined,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Radio, Row, Space } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useState } from "react";
import { ConfirmModal } from "../../../../components/modals/ConfirmModal";
import { AddAllUserModal } from "../../../../components/modals/AddAllUserModal";
import { UserDetail } from "../../../../components/modals/UserDetail";
import { EditUserModal } from "../../../../components/modals/EditUserModal";
import { ChangeRoleModal } from "../../../../components/modals/ChangeRoleModal";

const AllUser = () => {
    const [openAdduserModal, setOpenAdduserModal] = useState(false);
    const [openEdituserModal, setOpenEdituserModal] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openChangeRoleModal, setOpenChangeRoleModal] = useState(false);
    const [value, setValue] = useState("teacher");

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
            <ChangeRoleModal
                open={openChangeRoleModal}
                onClose={() => {
                    setOpenChangeRoleModal(false);
                }}
                onOk={() => {
                    setValue("student");
                    setOpenChangeRoleModal(false);
                }}
            />
            <AddAllUserModal
                open={openAdduserModal}
                onClose={() => {
                    setOpenAdduserModal(false);
                }}
            />
            <EditUserModal
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
            <UserDetail
                open={openDetail}
                onClose={() => {
                    setOpenDetail(false);
                }}
            />
            <div className="flex justify-between">
                <div className="text-3xl font-medium">Tất cả người dùng</div>{" "}
                <Space>
                    <Button icon={<ExportOutlined />}>Export</Button>{" "}
                    <Button
                        onClick={() => {
                            setOpenAdduserModal(true);
                        }}
                        icon={<PlusOutlined />}
                        type="primary"
                    >
                        Thêm người dùng
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
                            avatar={<Avatar src={user.avatar || ""} />}
                            title={user.name}
                            description={
                                <div>
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
                                    <Row className="mt-4">
                                        <Radio.Group
                                            onChange={(e) => {
                                                if (
                                                    e.target.value === "student"
                                                ) {
                                                    setOpenChangeRoleModal(
                                                        true
                                                    );
                                                } else {
                                                    setValue(e.target.value);
                                                }
                                            }}
                                            value={value}
                                        >
                                            <Radio value={"student"}>
                                                Học sinh
                                            </Radio>
                                            <Radio value={"teacher"}>
                                                Giáo viên
                                            </Radio>
                                        </Radio.Group>
                                    </Row>
                                </div>
                            }
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AllUser;
