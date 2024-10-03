import {
    Button,
    Form,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Select,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Teach = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);

    const confirm = (e) => {
        console.log(e);
        message.success("Xóa thành công !");
    };

    const cancel = (e) => {
        console.log(e);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            const data = [
                {
                    id: 1,
                    name: "Thiết kế website",
                    status: "Kích hoạt",
                    description:
                        "Học cách thiết kế và phát triển website với các công cụ hiện đại.",
                    code: "WEB001",
                },
                {
                    id: 2,
                    name: "Lập trình Java",
                    status: "Kích hoạt",
                    description:
                        "Khoá học cơ bản và nâng cao về lập trình Java.",
                    code: "JAVA002",
                },
                {
                    id: 3,
                    name: "Phân tích dữ liệu",
                    status: "Chờ kích hoạt",
                    description:
                        "Học cách phân tích và xử lý dữ liệu với các phương pháp hiện đại.",
                    code: "DATA003",
                },
                {
                    id: 4,
                    name: "Thiết kế đồ họa",
                    status: "Kích hoạt",
                    description:
                        "Học cách sử dụng các phần mềm thiết kế đồ họa chuyên nghiệp.",
                    code: "DESIGN004",
                },
                {
                    id: 5,
                    name: "Khoa học máy tính",
                    status: "Kích hoạt",
                    description:
                        "Khoá học về các nguyên lý và công nghệ cơ bản của khoa học máy tính.",
                    code: "CS005",
                },
                {
                    id: 6,
                    name: "Quản trị mạng",
                    status: "Chờ kích hoạt",
                    description:
                        "Học cách quản lý và bảo trì hệ thống mạng máy tính.",
                    code: "NETWORK006",
                },
            ];
            setCourses(data);
            setFilteredCourses(data);
        };

        fetchCourses();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value; // Lấy giá trị từ input
        const filtered = courses.filter((course) =>
            course.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values) => {
        console.log("New Item Data:", values);
        setIsModalVisible(false);
    };

    const showEditModal = (course) => {
        setCurrentCourse(course);
        setIsEditModalVisible(true);
    };

    const handleEditOk = () => {
        setIsEditModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const onEditFinish = (values) => {
        console.log("Edit Item Data:", values);
        setIsEditModalVisible(false);
    };
    const onChange = (value) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        console.log("search:", value);
    };

    return (
        <>
            <div className="teaching">
                <div className="container">
                    <div className="row justify-between">
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
                                placeholder="Tìm kiếm môn học..."
                                onChange={handleSearch} // Sử dụng onChange để gọi hàm tìm kiếm
                                style={{ width: 300 }}
                                allowClear
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <Button
                            onClick={showModal}
                            className="btn btn--outline text-[#7017E2]"
                        >
                            <PlusOutlined />
                            Tạo mới
                        </Button>

                        <span className="font-bold text-[14px] text-[#000]">
                            {filteredCourses.length} items
                        </span>
                    </div>

                    {/* Hiển thị danh sách ngành học */}
                    <div className="row row-cols-2 g-3">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <div className="col" key={course.id}>
                                    <div className="teaching__card">
                                        <div className="teaching__card-top">
                                            <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                Chuyên ngành:{" "}
                                                <p className="text-red-300 uppercase ml-2 font-bold">
                                                    {course.name}
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
                                                        Trạng thái :
                                                    </p>
                                                    <div className="teaching__card-status">
                                                        <img
                                                            className="svg-green"
                                                            src="/assets/svg/status.svg"
                                                            alt=""
                                                        />
                                                        <span className="text-[#44CC15] text-[12px]">
                                                            {course.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Code :
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {course.code}
                                                    </p>
                                                </div>
                                                <div className="text-[#9E9E9E] gap-2 mt-3 flex">
                                                    <span className="flex-shrink-0">
                                                        Mô tả :
                                                    </span>
                                                    <span className="text-black ml-2 line-clamp-2">
                                                        {course.description}
                                                    </span>
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
                                                    alt="Quản lý chương trình dạy"
                                                />
                                                Quản Lý Chương Trình Dạy
                                            </Link>

                                            <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/eye.svg"
                                                    alt=""
                                                />
                                                Chi Tiết
                                            </button>

                                            <Popconfirm
                                                title="Xóa môn học"
                                                description={`Bạn có chắc chắn muốn xóa ngành học ${course.name} không? `}
                                                onConfirm={confirm}
                                                onCancel={cancel}
                                                okText="Có"
                                                cancelText="Không"
                                            >
                                                <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                    <img
                                                        src="/assets/svg/remove.svg"
                                                        alt=""
                                                    />
                                                    Xóa khỏi Danh Sách
                                                </button>
                                            </Popconfirm>

                                            <button
                                                className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                                                onClick={() =>
                                                    showEditModal(course)
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
                                    Không tìm thấy ngành học
                                </p>
                            </div>
                        )}
                    </div>

                    <Pagination
                        className="mt-12"
                        align="center"
                        defaultCurrent={1}
                        total={filteredCourses.length}
                    />

                    <Modal
                        title="Thêm Mới Ngành Học"
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        width={1000}
                    >
                        <Form
                            autoComplete="off"
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 26 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <div className="flex row-cols-2 pb-6 justify-between items-end teaching__add   ">
                                <div className="col-6">
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

                                        <div className="teaching__add-form-group mt-14 mb-8">
                                            <Form.Item
                                                name="status"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Vui lòng điền vào trường này",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Chọn trạng thái"
                                                    optionFilterProp="label"
                                                    onChange={onChange}
                                                    onSearch={onSearch}
                                                    options={[
                                                        {
                                                            value: "Kích Hoạt",
                                                            label: "Kích Hoạt",
                                                        },
                                                        {
                                                            value: "Chưa Kích Hoạt",
                                                            label: "Chưa Kích Hoạt",
                                                        },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-5">
                                    <div className="teaching_add-form-lef">
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
                                <button
                                    type="reset"
                                    className="btn btn--cancel"
                                >
                                    Reset
                                </button>
                                <button className="btn btn--primary">
                                    Thêm mới
                                </button>
                            </div>
                        </Form>
                    </Modal>

                    <Modal
                        title="Sửa Ngành Học"
                        open={isEditModalVisible}
                        onOk={handleEditOk}
                        onCancel={handleEditCancel}
                        footer={null}
                        width={1000}
                    >
                        <Form
                            autoComplete="off"
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 26 }}
                            onFinish={onEditFinish}
                            initialValues={currentCourse}
                        >
                            <div className="flex row-cols-2 pb-6 justify-between items-end teaching__add   ">
                                <div className="col-6">
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

                                        <div className="teaching__add-form-group mt-14 mb-8">
                                            <Form.Item
                                                name="status"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Vui lòng điền vào trường này",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Chọn trạng thái"
                                                    optionFilterProp="label"
                                                    onChange={onChange}
                                                    onSearch={onSearch}
                                                    options={[
                                                        {
                                                            value: "Kích Hoạt",
                                                            label: "Kích Hoạt",
                                                        },
                                                        {
                                                            value: "Chưa Kích Hoạt",
                                                            label: "Chưa Kích Hoạt",
                                                        },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-5">
                                    <div className="teaching_add-form-lef">
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
                                <button
                                    type="reset"
                                    className="btn btn--cancel"
                                >
                                    Reset
                                </button>
                                <button className="btn btn--primary">
                                    Lưu Lại
                                </button>
                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default Teach;
