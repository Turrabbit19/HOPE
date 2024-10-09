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
    message,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Teach = () => {
    const [majors, setMajors] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingMajor, setEditingMajor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [form] = Form.useForm();
    const itemsPerPage = 6; // Giới hạn 6 mục mỗi trang

    useEffect(() => {
        const fetchMajors = async () => {
            const data = [
                {
                    id: 1,
                    name: "Công nghệ thông tin",
                    code: "CNTT01",
                    status: "Đang hoạt động",
                    description: "qbfjasfklasfasfasf công nghệ thông tin",
                },
                {
                    id: 2,
                    name: "Quản trị kinh doanh",
                    code: "QTKD01",
                    status: "Sắp bắt đầu",
                    description: "qbfjasfklasfasfasf quản trị kinh doanh",
                },
                {
                    id: 3,
                    name: "Quản trị kinh doanh",
                    code: "QTKD01",
                    status: "Sắp bắt đầu",
                    description: "qbfjasfklasfasfasf quản trị kinh doanh",
                },
                {
                    id: 4,
                    name: "Quản trị kinh doanh",
                    code: "QTKD01",
                    status: "Sắp bắt đầu",
                    description: "qbfjasfklasfasfasf quản trị kinh doanh",
                },
                {
                    id: 5,
                    name: "Quản trị kinh doanh",
                    code: "QTKD01",
                    status: "Sắp bắt đầu",
                    description: "qbfjasfklasfasfasf quản trị kinh doanh",
                },
                {
                    id: 6,
                    name: "Quản trị kinh doanh",
                    code: "QTKD01",
                    status: "Sắp bắt đầu",
                    description: "qbfjasfklasfasfasf quản trị kinh doanh",
                },
                {
                    id: 7,
                    name: "Quản trị kinh doanh",
                    code: "QTKD01",
                    status: "Sắp bắt đầu",
                    description: "qbfjasfklasfasfasf quản trị kinh doanh",
                },
                // Thêm các mục khác vào đây
            ];
            setMajors(data);
        };

        fetchMajors();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    const filteredMajors = majors
        .filter((major) => major.name.toLowerCase().includes(searchTerm))
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // Phân trang

    const showEditModal = (major) => {
        setEditingMajor(major);
        form.setFieldsValue({
            name: major.name,
            code: major.code,
            status: major.status,
            description: major.description,
        });
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setEditingMajor(null);
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleModalOk = async () => {
        const values = await form.validateFields();
        if (editingMajor) {
            setMajors(
                majors.map((major) =>
                    major.id === editingMajor.id
                        ? { ...major, ...values }
                        : major
                )
            );
        } else {
            setMajors([...majors, { id: majors.length + 1, ...values }]);
        }
        handleModalCancel();
    };

    const handleModalCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
    };

    const confirmDelete = (id) => {
        setMajors(majors.filter((major) => major.id !== id));
        message.success("Xóa thành công!");
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="row row-cols-2 g-3">
            <div className="col-12">
                <div className="col-12">
                    <div className="justify-between flex">
                        <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                            Quản Lý Chuyên Ngành
                            <button>
                                <img
                                    src="/assets/svg/reload.svg"
                                    alt="reload..."
                                />
                            </button>
                        </h1>

                        <div>
                            <Input.Search
                                placeholder="Tìm kiếm chuyên ngành..."
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
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
                            {majors.length} items
                        </span>
                    </div>
                </div>
                <div className="row row-cols-2 g-3">
                    {filteredMajors.length > 0 ? (
                        filteredMajors.map((major) => (
                            <div className="col" key={major.id}>
                                <div className="teaching__card">
                                    <div className="teaching__card-top">
                                        <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                            <img
                                                src="/assets/svg/share.svg"
                                                alt=""
                                            />
                                            Tên chuyên ngành:{" "}
                                            <p className="text-red-300 uppercase ml-2 font-bold">
                                                {major.name}
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
                                                    Mã chuyên ngành:
                                                </p>
                                                <p className="font-bold text-[#000]">
                                                    {major.code}
                                                </p>
                                            </div>
                                            <div className="flex gap-6">
                                                <p className="text-[#9E9E9E]">
                                                    Trạng thái :
                                                </p>
                                                <div className="teaching__card-status">
                                                    <img
                                                        className="svg-green"
                                                        src="/assets/svg/status.svg"
                                                        alt=""
                                                    />
                                                    <span className="text-[#44CC15] text-[12px]">
                                                        {major.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-6">
                                                <p className="text-[#9E9E9E]">
                                                    Mô tả:
                                                </p>
                                                <p className="text-black ml-2 line-clamp-2">
                                                    {major.description}
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
                                            Quản Lý Chuyên Ngành
                                        </Link>

                                        <Popconfirm
                                            title="Xóa chuyên ngành"
                                            onConfirm={() =>
                                                confirmDelete(major.id)
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
                                            onClick={() => showEditModal(major)}
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
                                Không tìm thấy chuyên ngành
                            </p>
                        </div>
                    )}
                </div>
                <Pagination
                    align="center"
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={majors.length}
                    onChange={handlePageChange}
                    className="mt-6"
                />
            </div>

            <Modal
                title={
                    editingMajor
                        ? "Sửa Thông Tin Chuyên Ngành"
                        : "Thêm Mới Chuyên Ngành"
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
                    style={{ padding: "20px" }}
                    autoComplete="off"
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 26 }}
                    initialValues={{ remember: true }}
                >
                    <div className="pb-6  teaching__add   ">
                        <div className="col">
                            <div className="teaching_add-form-left ">
                                <h1 className="text-[#1167B4] text-[20px] mt-4 font-semibold">
                                    Tổng quan
                                </h1>

                                <div className="teaching__add-form-group mt-14">
                                    <Form.Item
                                        name="code"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng điền vào trường này",
                                            },
                                            {
                                                min: 4,
                                                message:
                                                    "Mã chương trình phải có ít nhất 4 ký tự",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Code"
                                            className="input_form"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="teaching__add-form-group mt-14">
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng điền vào trường này",
                                            },
                                            {
                                                min: 6,
                                                message:
                                                    "Mã chương trình phải có ít nhất 4 ký tự",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Tên chuyên ngành"
                                            className="input_form"
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="teaching_add-form-left">
                                <div className="teaching__add-form-group ">
                                    <Form.Item
                                        name="description"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng điền vào trường này",
                                            },
                                        ]}
                                    >
                                        <Input.TextArea
                                            placeholder="Mô tả"
                                            rows={8}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center items-center gap-4 mt-16">
                        <button type="reset" className="btn btn--cancel">
                            Reset
                        </button>
                        <button className="btn btn--primary">
                            {editingMajor ? "Lưu" : "Thêm mới"}
                        </button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Teach;
