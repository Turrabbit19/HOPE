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
    Pagination,
    Row,
    Col,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const ListRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchRooms = async () => {
            const data = [
                {
                    id: 1,
                    roomName: "Phòng 101",
                    creationDate: "2024-01-01",
                    startDate: "2024-01-05",
                    status: "Đang hoạt động",
                },
                {
                    id: 2,
                    roomName: "Phòng 202",
                    creationDate: "2024-02-01",
                    startDate: "2024-02-05",
                    status: "Ngừng hoạt động",
                },
                {
                    id: 3,
                    roomName: "Phòng 303",
                    creationDate: "2024-03-01",
                    startDate: "2024-03-05",
                    status: "Đang hoạt động",
                },
            ];
            setRooms(data);
        };

        fetchRooms();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    const filteredRooms = rooms.filter((room) =>
        room.roomName.toLowerCase().includes(searchTerm)
    );

    const showEditModal = (room) => {
        setEditingRoom(room);
        form.setFieldsValue({
            roomName: room.roomName,
            creationDate: moment(room.creationDate),
            startDate: moment(room.startDate),
            status: room.status,
        });
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setEditingRoom(null);
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleModalOk = async () => {
        const values = await form.validateFields();
        if (editingRoom) {
            setRooms(
                rooms.map((room) =>
                    room.id === editingRoom.id ? { ...room, ...values } : room
                )
            );
        } else {
            setRooms([...rooms, { id: rooms.length + 1, ...values }]);
        }
        handleModalCancel();
    };

    const handleModalCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
    };

    const confirmDelete = (id) => {
        setRooms(rooms.filter((room) => room.id !== id));
    };

    return (
        <div className="test__list">
            <div className="row row-cols-2 g-3">
                <div className="col-12">
                    <div>
                        <div className="justify-between flex">
                            <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                                Quản Lý Phòng Học
                                <button>
                                    <img
                                        src="/assets/svg/reload.svg"
                                        alt="reload..."
                                    />
                                </button>
                            </h1>

                            <div>
                                <Input.Search
                                    placeholder="Tìm kiếm phòng học..."
                                    onSearch={handleSearch}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    style={{ width: 300 }}
                                    allowClear
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <Button
                                onClick={showAddModal}
                                className="btn btn--outline text-[#7017E2]"
                            >
                                <PlusOutlined />
                                Tạo mới
                            </Button>

                            <span className="font-bold text-[14px] text-[#000]">
                                {filteredRooms.length} items
                            </span>
                        </div>
                    </div>
                    <div className="row row-cols-2 g-3">
                        {filteredRooms.length > 0 ? (
                            filteredRooms.map((room) => (
                                <div className="col" key={room.id}>
                                    <div className="teaching__card">
                                        <div className="teaching__card-top">
                                            <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                Tên phòng học:{" "}
                                                <p className="text-red-300 uppercase ml-2 font-bold">
                                                    {room.roomName}
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
                                                        Trạng thái:
                                                    </p>
                                                    <div className="teaching__card-status">
                                                        <img
                                                            className="svg-green"
                                                            src="/assets/svg/status.svg"
                                                            alt="status"
                                                        />
                                                        <span className="text-[#44CC15] text-[12px]">
                                                            {room.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày khởi tạo:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {room.creationDate}
                                                    </p>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày bắt đầu:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {room.startDate}
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
                                                Quản Lý Phòng Học
                                            </Link>
                                            <button
                                                className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                                                onClick={() =>
                                                    showEditModal(room)
                                                }
                                            >
                                                <EditOutlined />
                                                Chỉnh sửa
                                            </button>
                                            <Popconfirm
                                                title="Xóa phòng học"
                                                onConfirm={() =>
                                                    confirmDelete(room.id)
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
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="text-center">
                                    Không tìm thấy phòng học nào!
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Pagination
                className="mt-12"
                align="center"
                total={filteredRooms.length}
                defaultPageSize={6}
                defaultCurrent={1}
            />
            <Modal
                title={
                    editingRoom
                        ? "Sửa Thông Tin phòng Học"
                        : "Thêm Mới phòng Học"
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
                        label="Tên Phòng Học"
                        name="roomName"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên phòng học!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên phòng học" />
                    </Form.Item>

                    <Form.Item
                        label="Ngày Bắt Đầu"
                        name="startDate"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày bắt đầu!",
                            },
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày Kết Thúc"
                        name="endDate"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày kết thúc!",
                            },
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Trạng Thái"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="Đang diễn ra">Đang diễn ra</Option>
                            <Option value="Ngừng diễn ra">Ngừng diễn ra</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button onClick={handleModalCancel}>Hủy</Button>
                            <Button type="primary" htmlType="submit">
                                {editingRoom ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ListRooms;
