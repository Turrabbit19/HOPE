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
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const Testing = () => {
    const [semesters, setSemesters] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingSemester, setEditingSemester] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchSemesters = async () => {
            const data = [
                {
                    id: 1,
                    name: "Kỳ 1",
                    startDate: "2024-01-01",
                    endDate: "2024-04-30",
                    status: "Đang diễn ra",
                },
                {
                    id: 2,
                    name: "Kỳ 2",
                    startDate: "2024-05-01",
                    endDate: "2024-08-31",
                    status: "Chờ diễn ra",
                },
                {
                    id: 3,
                    name: "Kỳ 3",
                    startDate: "2024-09-01",
                    endDate: "2024-12-31",
                    status: "Chờ diễn ra",
                },
            ];
            setSemesters(data);
        };

        fetchSemesters();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    const filteredSemesters = semesters.filter((semester) =>
        semester.name.toLowerCase().includes(searchTerm)
    );

    const showEditModal = (semester) => {
        setEditingSemester(semester);
        form.setFieldsValue({
            name: semester.name,
            startDate: moment(semester.startDate),
            endDate: moment(semester.endDate),
            status: semester.status,
        });
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setEditingSemester(null);
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleModalOk = async () => {
        const values = await form.validateFields();
        if (editingSemester) {
            setSemesters(
                semesters.map((semester) =>
                    semester.id === editingSemester.id
                        ? { ...semester, ...values }
                        : semester
                )
            );
        } else {
            setSemesters([
                ...semesters,
                { id: semesters.length + 1, ...values },
            ]);
        }
        handleModalCancel();
    };

    const handleModalCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
    };

    const confirmDelete = (id) => {
        setSemesters(semesters.filter((semester) => semester.id !== id));
    };

    return (
        <div className="test__list">
            <div className="row row-cols-2 g-3">
                <div className="col-12">
                    <div>
                        <div className=" justify-between flex">
                            <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                                Quản Lý Kỳ Học
                                <button>
                                    <img
                                        src="/assets/svg/reload.svg"
                                        alt="reload..."
                                    />
                                </button>
                            </h1>

                            <div>
                                <Input.Search
                                    placeholder="Tìm kiếm kỳ học..."
                                    onSearch={handleSearch}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    style={{ width: 300 }}
                                    allowClear
                                />
                            </div>
                        </div>

                        <div className=" flex justify-between items-center mt-6">
                            <Button
                                onClick={showAddModal}
                                className="btn btn--outline text-[#7017E2]"
                            >
                                <PlusOutlined />
                                Tạo mới
                            </Button>

                            <span className="font-bold text-[14px] text-[#000]">
                                {filteredSemesters.length} items
                            </span>
                        </div>
                    </div>
                    <div className="row row-cols-2 g-3">
                        {filteredSemesters.length > 0 ? (
                            filteredSemesters.map((semester) => (
                                <div className="col" key={semester.id}>
                                    <div className="teaching__card">
                                        <div className="teaching__card-top">
                                            <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                Chuyên ngành:{" "}
                                                <p className="text-red-300 uppercase ml-2 font-bold">
                                                    {semester.name}
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
                                                            {semester.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày bắt đầu:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {semester.startDate}
                                                    </p>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày kết thúc:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {semester.endDate}
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
                                                Quản Lý Kỳ Học
                                            </Link>
                                            <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/eye.svg"
                                                    alt="detail"
                                                />
                                                Chi Tiết
                                            </button>
                                            <Popconfirm
                                                title="Xóa kỳ học"
                                                onConfirm={() =>
                                                    confirmDelete(semester.id)
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
                                                    showEditModal(semester)
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
                                    Không tìm thấy kỳ học
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
                        editingSemester
                            ? "Sửa Thông Tin Kỳ Học"
                            : "Thêm Mới Kỳ Học"
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
                            label="Tên Kỳ Học"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên kỳ học!",
                                },
                            ]}
                        >
                            <Input placeholder="Nhập tên kỳ học" />
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
                                <Option value="Đang diễn ra">
                                    Đang diễn ra
                                </Option>
                                <Option value="Chờ diễn ra">Chờ diễn ra</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item className="pt-6">
                            <Space
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    {editingSemester ? "Cập Nhật" : "Thêm Mới"}
                                </Button>
                                <Button onClick={handleModalCancel}>Hủy</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Testing;
