import React, { useState, useEffect } from "react";
import {
    Button,
    Popconfirm,
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    Space,
    message,
    Pagination,
    Checkbox,
    Radio,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const ClassRoom = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchClassrooms = async () => {
            const data = [
                {
                    id: 1,
                    name: "WEB209.16",
                    nameSubject: "reactjs",
                    students: 35,
                    status: "Đang học",
                    createdDate: "2024-01-01",
                },
                {
                    id: 2,
                    name: "WEB101.01",
                    nameSubject: "php",
                    students: 40,
                    status: "Sắp bắt đầu",
                    createdDate: "2024-02-01",
                },
                {
                    id: 3,
                    name: "WEB101.02",
                    nameSubject: "java",
                    students: 30,
                    status: "Hoàn thành",
                    createdDate: "2024-03-01",
                },
            ];
            setClassrooms(data);
        };

        fetchClassrooms();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    const filteredClassrooms = classrooms.filter((classroom) =>
        classroom.name.toLowerCase().includes(searchTerm)
    );

    const showEditModal = (classroom) => {
        setEditingClassroom(classroom);
        form.setFieldsValue({
            name: classroom.name,
            nameSubject: classroom.nameSubject,
            students: classroom.students,
            status: classroom.status,
            createdDate: moment(classroom.createdDate),
        });
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setEditingClassroom(null);
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleModalOk = async () => {
        const values = await form.validateFields();
        if (editingClassroom) {
            setClassrooms(
                classrooms.map((classroom) =>
                    classroom.id === editingClassroom.id
                        ? { ...classroom, ...values }
                        : classroom
                )
            );
        } else {
            setClassrooms([
                ...classrooms,
                { id: classrooms.length + 1, ...values },
            ]);
        }
        handleModalCancel();
    };

    const handleModalCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
    };

    const confirmDelete = (id) => {
        setClassrooms(classrooms.filter((classroom) => classroom.id !== id));
        message.success("Xóa thành công !");
    };

    return (
        <div className="row row-cols-2 g-3">
            <div className="col-12">
                <div className="col-12">
                    <div className="col-12 justify-between flex">
                        <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                            Quản Lý Lớp Học
                            <button>
                                <img
                                    src="/assets/svg/reload.svg"
                                    alt="reload..."
                                />
                            </button>
                        </h1>

                        <div>
                            <Input.Search
                                placeholder="Tìm kiếm lớp học..."
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: 300 }}
                                allowClear
                            />
                        </div>
                    </div>

                    <div className="col-12 flex justify-between items-center mt-6">
                        <Button
                            onClick={showAddModal}
                            className="btn btn--outline text-[#7017E2]"
                        >
                            <PlusOutlined />
                            Tạo mới
                        </Button>

                        <span className="font-bold text-[14px] text-[#000]">
                            {filteredClassrooms.length} items
                        </span>
                    </div>
                </div>
                <div className="row row-cols-2 g-3">
                    {filteredClassrooms.length > 0 ? (
                        filteredClassrooms.map((classroom) => (
                            <div className="col" key={classroom.id}>
                                <div className="teaching__card">
                                    <div className="teaching__card-top">
                                        <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                            <img
                                                src="/assets/svg/share.svg"
                                                alt=""
                                            />
                                            Tên lớp:{" "}
                                            <p className="text-red-300 uppercase ml-2 ">
                                                {classroom.name}
                                            </p>
                                        </h2>
                                        <button>
                                            <img
                                                src="/assets/svg/more_detail.svg"
                                                alt=""
                                            />
                                        </button>
                                    </div>

                                    <div className="teaching__card-body">
                                        <div className="mt-6 flex flex-col gap-8 pb-6">
                                            <div className="flex gap-6">
                                                <p className="text-[#9E9E9E]">
                                                    Tên môn:
                                                </p>
                                                <p className=" text-[#000]">
                                                    {classroom.nameSubject}
                                                </p>
                                            </div>
                                            <div className="flex gap-6">
                                                <p className="text-[#9E9E9E]">
                                                    Học sinh:
                                                </p>
                                                <p className=" text-[#000]">
                                                    {classroom.students}
                                                </p>
                                            </div>
                                            <div className="flex gap-6">
                                                <p className="text-[#9E9E9E]">
                                                    Trạng thái:
                                                </p>
                                                <p className=" text-[#000]">
                                                    {classroom.status}
                                                </p>
                                            </div>
                                            <div className="flex gap-6">
                                                <p className="text-[#9E9E9E]">
                                                    Ngày khởi tạo:
                                                </p>
                                                <p className=" text-[#000]">
                                                    {classroom.createdDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="teaching__card-bottom">
                                        <Link
                                            to="list"
                                            className="flex items-center gap-3 text-[#1167B4] font-bold"
                                        >
                                            <img
                                                src="/assets/svg/setting.svg"
                                                alt="setting"
                                            />
                                            Quản Lý Lớp Học
                                        </Link>
                                        <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                            <img
                                                src="/assets/svg/eye.svg"
                                                alt="detail"
                                            />
                                            Chi Tiết
                                        </button>
                                        <Popconfirm
                                            title="Xóa lớp học"
                                            onConfirm={() =>
                                                confirmDelete(classroom.id)
                                            }
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/remove.svg"
                                                    alt="remove"
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </Popconfirm>

                                        <button
                                            className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                                            onClick={() =>
                                                showEditModal(classroom)
                                            }
                                        >
                                            <EditOutlined />
                                            Sửa Thông Tin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-red-500 font-bold text-lg">
                                Không tìm thấy lớp học
                            </p>
                        </div>
                    )}
                </div>

                <Pagination
                    className="mt-12"
                    align="center"
                    defaultCurrent={1}
                    total={50}
                />
            </div>

            <Modal
                title={
                    editingClassroom
                        ? "Sửa Thông Tin Lớp Học"
                        : "Thêm Mới Lớp Học"
                }
                open={isEditModalVisible || isAddModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                centered
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleModalOk}
                    style={{ padding: "0 20px" }}
                >
                    <Form.Item
                        label="Tên Môn"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên môn!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên môn" />
                    </Form.Item>

                    <Form.Item
                        label="Mã Môn"
                        name="nameSubject"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mã môn!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập mã môn" />
                    </Form.Item>

                    <Form.Item
                        label="Học sinh (max-40)"
                        name="students"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số lượng học sinh!",
                            },
                            {
                                type: "number",
                                min: 1,
                                max: 40,
                                message: "Số lượng học sinh không quá 40!",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Nhập số lượng học sinh"
                        />
                    </Form.Item>

                    {/* Trạng thái chuyển sang Checkbox Group */}
                    {/* <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái!",
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="Sắp bắt đầu">Sắp bắt đầu</Radio>
                            <Radio value="Đang học">Đang học</Radio>
                            <Radio value="Hoàn thành">Hoàn thành</Radio>
                        </Radio.Group>
                    </Form.Item> */}

                    <Space
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Button onClick={handleModalCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            {editingClassroom ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </div>
    );
};

export default ClassRoom;
