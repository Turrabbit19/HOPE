import { Pagination, Row, Form, Input, Button, Modal, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ListCourse = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const allCourses = [
        { id: 1, name: "Math" },
        { id: 2, name: "Physics" },
        { id: 3, name: "Chemistry" },
        { id: 4, name: "History" },
        { id: 5, name: "Biology" },
        { id: 6, name: "Geography" },
    ];

    useEffect(() => {
        setFilteredCourses(allCourses);
    }, []);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        form.resetFields();
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        console.log("Form data:", values);
        togglePopup();
    };

    const handleSearch = (value) => {
        setSearchValue(value);

        if (value.trim() === "") {
            setFilteredCourses(allCourses);
        } else {
            const filtered = allCourses.filter((course) =>
                course.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    };

    return (
        <>
            <div className="listCourse">
                <div className="container">
                    <div className="flex gap-4 row-cols-2 relative">
                        {/* SideBar */}
                        <Row className="col-2 g-x-4 mt-1">
                            <div className="flex flex-col">
                                <div>
                                    <h1 className="flex items-center text-[18px] gap-3 text-[#1167B4] font-bold">
                                        Q.lý Chuyên Ngành
                                    </h1>
                                    <p className="text-[15px] font-semibold italic my-2">
                                        Lập trình web
                                    </p>
                                </div>
                                {/* Content */}
                                <div className="flex-1">
                                    {/* Management */}
                                    <div className="my-8">
                                        <h3 className="text-[#9E9E9E] text-[16px] font-bold">
                                            Quản Lý:
                                        </h3>
                                        <div className="ml-8">
                                            <button className="flex gap-4 my-10">
                                                <img
                                                    src="/assets/svg/book.svg"
                                                    alt=""
                                                />
                                                <p className="text-[#1167B4] text-[16px] font-bold">
                                                    Danh Sách Môn Học
                                                </p>
                                            </button>
                                            <div className="flex gap-4">
                                                <img
                                                    src="/assets/svg/cart.svg"
                                                    alt=""
                                                />
                                                <Link
                                                    to={"/"}
                                                    className="text-[#1167B4] text-[16px] font-bold"
                                                >
                                                    Thông Tin Bán Hàng
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Setting */}
                                    <div className="my-8 pt-3">
                                        <h3 className="text-[#9E9E9E] text-[16px] font-bold">
                                            Cài Đặt:
                                        </h3>
                                        <div className="ml-8">
                                            <div className="flex gap-4 my-10">
                                                <img
                                                    src="/assets/svg/cart.svg"
                                                    alt=""
                                                />
                                                <Link
                                                    to={"/"}
                                                    className="text-[#1167B4] text-[16px] font-bold"
                                                >
                                                    Khóa Chuyên Ngành
                                                </Link>
                                            </div>
                                            <div className="flex gap-4">
                                                <img
                                                    src="/assets/svg/cart.svg"
                                                    alt=""
                                                />
                                                <Link
                                                    to={"/"}
                                                    className="text-[#1167B4] text-[16px] font-bold"
                                                >
                                                    Đóng
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Row>

                        {/* Item */}
                        <div className="col-10">
                            <div>
                                <div className="flex justify-between">
                                    <h1 className="flex gap-2 pb-5 items-center text-[#7017E2] text-[20px] font-semibold">
                                        Danh Sách Môn Học
                                        <button>
                                            <img
                                                src="/assets/svg/reload.svg"
                                                alt="reload..."
                                            />
                                        </button>
                                    </h1>

                                    <Input.Search
                                        placeholder="Tìm kiếm môn học..."
                                        onSearch={handleSearch}
                                        style={{ width: 200 }}
                                        allowClear
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={togglePopup}
                                        className="btn btn--outline text-[#7017E2]"
                                    >
                                        <img
                                            src="/assets/svg/plus.svg"
                                            alt=""
                                        />
                                        Thêm Môn Học
                                    </button>
                                    <span className="font-bold text-[14px] text-[#000]">
                                        {filteredCourses.length} items
                                    </span>
                                </div>
                            </div>

                            {/* List Course Item */}
                            <div className="row row-cols-2 g-3">
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course) => (
                                        <div className="col" key={course.id}>
                                            <div className="listCourse__item ">
                                                <div className="listCourse__item-top flex justify-between items-center">
                                                    <h2 className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                        <img
                                                            src="/assets/svg/share.svg"
                                                            alt=""
                                                        />
                                                        Môn Học :
                                                        <span>
                                                            {course.name}
                                                        </span>
                                                    </h2>
                                                    <button>
                                                        <img
                                                            src="/assets/svg/more_detail.svg"
                                                            alt=""
                                                        />
                                                    </button>
                                                </div>

                                                <div className="listCourse__item-body">
                                                    <div className="flex gap-8">
                                                        <div className="listCourse__item-status_group">
                                                            <div className="flex gap-2 listCourse__item-status">
                                                                <span className="ml-3 text-[#9E9E9E]">
                                                                    Trạng thái :
                                                                </span>

                                                                <div className="flex gap-1 bg-[#44cc151a]">
                                                                    <img
                                                                        className="fill-current svg-green"
                                                                        src="/assets/svg/status.svg"
                                                                        alt=""
                                                                    />
                                                                    <span className="text-[#44CC15] text-[12px]">
                                                                        Kích
                                                                        Hoạt
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <p className="text-[#9E9E9E] mt-3 ml-3">
                                                                Code:
                                                                <span className="text-black ml-2">
                                                                    COURSE_
                                                                    {course.id}
                                                                </span>
                                                            </p>

                                                            <p className="text-[#9E9E9E] mt-3 ml-3">
                                                                Tín chỉ :
                                                                <span className="text-black ml-2">
                                                                    3
                                                                </span>
                                                            </p>

                                                            <div className="text-[#9E9E9E] gap-2 mt-3 ml-3 flex">
                                                                <span className="flex-shrink-0">
                                                                    Mô tả :
                                                                </span>
                                                                <span className="text-black ml-2 line-clamp-2">
                                                                    lorem ipsum
                                                                    dolor sit
                                                                    amet lorem
                                                                    ipsum dolor
                                                                    sit amet
                                                                    lorem ipsum
                                                                    dolor sit
                                                                    amet lorem
                                                                    ipsum dolor
                                                                    sit amet
                                                                    lorem ipsum
                                                                    dolor sit
                                                                    amet lorem
                                                                    ipsum dolor
                                                                    sit amet
                                                                    lorem ipsum
                                                                    dolor sit
                                                                    amet lorem
                                                                    ipsum dolor
                                                                    sit amet
                                                                    lorem ipsum
                                                                    dolor sit
                                                                    amet lorem
                                                                    ipsum dolor
                                                                    sit amet
                                                                    lorem ipsum
                                                                    dolor sit
                                                                    amet
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="listCourse__item-bottom">
                                                    <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                        <img
                                                            src="/assets/svg/eye.svg"
                                                            alt=""
                                                        />
                                                        Chi Tiết
                                                    </button>

                                                    <button
                                                        className="text-[#FF5252] font-bold flex items-center gap-2 justify-center"
                                                        onClick={showModal}
                                                    >
                                                        <img
                                                            src="/assets/svg/remove.svg"
                                                            alt=""
                                                        />
                                                        Xóa khỏi Danh Sách
                                                    </button>
                                                </div>
                                            </div>
                                            <Modal
                                                title="Delete Confirmation"
                                                visible={isModalVisible}
                                                onCancel={handleCancel}
                                                footer={[
                                                    <Button
                                                        key="cancel"
                                                        onClick={handleCancel}
                                                    >
                                                        Cancel
                                                    </Button>,
                                                    <Button
                                                        key="confirm"
                                                        type="primary"
                                                        danger
                                                    >
                                                        Delete
                                                    </Button>,
                                                ]}
                                            >
                                                <p>
                                                    Are you sure you want to
                                                    delete this course{" "}
                                                    {course.name}?
                                                </p>
                                            </Modal>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center">
                                        <p className="text-red-500 font-bold text-lg">
                                            Không tìm thấy môn học
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
                    </div>

                    {/* Popup Modal */}
                    <Modal
                        visible={isPopupVisible}
                        onCancel={togglePopup}
                        footer={null}
                        centered
                        width={600}
                    >
                        <div className="createCourseForm pb-6">
                            <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
                                Tạo Môn Học Mới
                            </h3>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleFormSubmit}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Mã Môn Học"
                                    name="code"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập mã môn học!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Code" />
                                </Form.Item>

                                <Form.Item
                                    label="Tên Môn Học"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập tên môn học!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Tên" />
                                </Form.Item>

                                <Form.Item
                                    label="Mô tả"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mô tả!",
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Mô tả"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Tín chỉ"
                                    name="credit"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập Tín chỉ!",
                                        },
                                        {
                                            min: 0,
                                            message: "Tín chỉ phải lớn hơn 0",
                                        },
                                    ]}
                                >
                                    <InputNumber />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Tạo Môn Học
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default ListCourse;
