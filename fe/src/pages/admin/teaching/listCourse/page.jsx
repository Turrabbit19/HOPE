import {
    Pagination,
    Row,
    Form,
    Input,
    Button,
    Modal,
    InputNumber,
    Select,
    Popconfirm,
    Col,
    message,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const semesterData = {
    1: { majors: ["Lập trình Web", "Thiết kế đồ họa", "An ninh mạng"] },
    2: { majors: ["Kinh tế", "Tài chính", "Quản lý dự án"] },
    3: { majors: ["Y học", "Dược học", "Điều dưỡng"] },
};

const semesters = Object.keys(semesterData);
const ListCourse = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [form] = Form.useForm();
    const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
    const [majors, setMajors] = useState(semesterData[selectedSemester].majors);
    const [selectedMajor, setSelectedMajor] = useState(majors[0]);
    const [additionalVariants, setAdditionalVariants] = useState([
        { semester: selectedSemester, major: selectedMajor },
    ]);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

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

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        form.resetFields();
        setAdditionalVariants([
            {
                semester: semesters[0],
                major: semesterData[semesters[0]].majors[0],
            },
        ]);
    };

    const handleFormSubmit = (values) => {
        console.log("Form data:", values, "Variants:", additionalVariants);

        const formData = {
            ...values,
            variants: additionalVariants,
        };

        console.log("Form data:", formData);
    };

    const handleSemesterChange = (value, index) => {
        const newMajors = semesterData[value].majors;
        const updatedVariants = [...additionalVariants];
        updatedVariants[index].semester = value;
        updatedVariants[index].major = newMajors[0];
        setMajors(newMajors);
        setAdditionalVariants(updatedVariants);
    };

    const handleMajorChange = (value, index) => {
        const updatedVariants = [...additionalVariants];
        updatedVariants[index].major = value;
        setAdditionalVariants(updatedVariants);
    };

    const handleAddVariant = () => {
        setAdditionalVariants([
            ...additionalVariants,
            {
                semester: semesters[0],
                major: semesterData[semesters[0]].majors[0],
            },
        ]);
    };

    const confirm = (e) => {
        console.log(e);
        message.success("Xóa thành công !");
    };
    const cancel = (e) => {
        console.log(e);
        // message.error("Click on No");
    };
    const openEditModal = (course) => {
        setEditingCourse(course);
        setIsEditModalVisible(true);
        form.setFieldsValue({
            code: course.code,
            name: course.name,
            description: course.description,
            credit: course.credit,
        });
    };

    const closeEditModal = () => {
        setIsEditModalVisible(false);
        form.resetFields();
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
                                            <div className="flex mt-10 gap-4">
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
                                                    to={"/admin/teaching"}
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
                                        style={{ width: 300 }}
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

                                                <div className="listCourse__item-bottom teaching__card-bottom ">
                                                    <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                        <img
                                                            src="/assets/svg/eye.svg"
                                                            alt=""
                                                        />
                                                        Chi Tiết
                                                    </button>

                                                    <Popconfirm
                                                        title="Xóa môn học"
                                                        description={`Bạn có chắc chắn muốn xóa môn học ${course.name} không? `}
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
                                                            openEditModal(
                                                                course
                                                            )
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

                    {/* Popup Modal Form Add */}
                    <Modal
                        open={isPopupVisible}
                        onCancel={togglePopup}
                        footer={null}
                        centered
                        width={1000}
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
                                <Row gutter={24}>
                                    <Col span={14}>
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
                                            <Input placeholder="Mã môn học" />
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
                                                    message:
                                                        "Vui lòng nhập mô tả!",
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
                                                    message:
                                                        "Vui lòng nhập Tín chỉ!",
                                                },
                                                {
                                                    pattern:
                                                        /^(?!0)\d(\.\d+)?$/,
                                                    message:
                                                        "Tín chỉ phải là số dương.",
                                                },
                                                {
                                                    validator: (_, value) => {
                                                        if (
                                                            value &&
                                                            (value < 0 ||
                                                                value >= 8)
                                                        ) {
                                                            return Promise.reject(
                                                                new Error(
                                                                    "Tín chỉ phải nhỏ hơn 8."
                                                                )
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                placeholder="Tín chỉ"
                                                min={0}
                                                max={8}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={10}>
                                        <Form.Item label="Kỳ học và Ngành học">
                                            {additionalVariants.map(
                                                (variant, index) => (
                                                    <Row
                                                        key={index}
                                                        gutter={16}
                                                        style={{
                                                            marginBottom: 16,
                                                        }}
                                                    >
                                                        <Col span={12}>
                                                            <Select
                                                                value={
                                                                    variant.semester
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    handleSemesterChange(
                                                                        value,
                                                                        index
                                                                    )
                                                                }
                                                                options={semesters.map(
                                                                    (
                                                                        semester
                                                                    ) => ({
                                                                        label: `Kỳ ${semester}`,
                                                                        value: semester,
                                                                    })
                                                                )}
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Select
                                                                value={
                                                                    variant.major
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    handleMajorChange(
                                                                        value,
                                                                        index
                                                                    )
                                                                }
                                                                options={majors.map(
                                                                    (
                                                                        major
                                                                    ) => ({
                                                                        label: major,
                                                                        value: major,
                                                                    })
                                                                )}
                                                            />
                                                        </Col>
                                                    </Row>
                                                )
                                            )}

                                            <Button onClick={handleAddVariant}>
                                                Thêm Biến Thể
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div className="flex justify-center items-center mt-4">
                                    <Button type="primary" htmlType="submit">
                                        Tạo Môn Học
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Modal>

                    {/* Popup Modal Form Edit */}
                    <Modal
                        open={isEditModalVisible}
                        onCancel={closeEditModal}
                        footer={null}
                        centered
                        width={1000}
                    >
                        <div className="createCourseForm pb-6">
                            <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
                                Sửa Môn Học
                            </h3>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={(values) =>
                                    handleEditFormSubmit(
                                        values,
                                        editingCourse.id
                                    )
                                }
                                autoComplete="off"
                            >
                                <Row gutter={24}>
                                    <Col span={14}>
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
                                            <Input placeholder="Mã môn học" />
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
                                                    message:
                                                        "Vui lòng nhập mô tả!",
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
                                                    message:
                                                        "Vui lòng nhập Tín chỉ!",
                                                },
                                                {
                                                    pattern:
                                                        /^(?!0)\d(\.\d+)?$/,
                                                    message:
                                                        "Tín chỉ phải là số dương.",
                                                },
                                                {
                                                    validator: (_, value) => {
                                                        if (
                                                            value &&
                                                            (value < 0 ||
                                                                value >= 8)
                                                        ) {
                                                            return Promise.reject(
                                                                new Error(
                                                                    "Tín chỉ phải nhỏ hơn 8."
                                                                )
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                placeholder="Tín chỉ"
                                                min={0}
                                                max={8}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={10}>
                                        <Form.Item label="Kỳ học và Ngành học">
                                            {additionalVariants.map(
                                                (variant, index) => (
                                                    <Row
                                                        key={index}
                                                        gutter={16}
                                                        style={{
                                                            marginBottom: 16,
                                                        }}
                                                    >
                                                        <Col span={12}>
                                                            <Select
                                                                value={
                                                                    variant.semester
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    handleSemesterChange(
                                                                        value,
                                                                        index
                                                                    )
                                                                }
                                                                options={semesters.map(
                                                                    (
                                                                        semester
                                                                    ) => ({
                                                                        label: `Kỳ ${semester}`,
                                                                        value: semester,
                                                                    })
                                                                )}
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Select
                                                                value={
                                                                    variant.major
                                                                }
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    handleMajorChange(
                                                                        value,
                                                                        index
                                                                    )
                                                                }
                                                                options={majors.map(
                                                                    (
                                                                        major
                                                                    ) => ({
                                                                        label: major,
                                                                        value: major,
                                                                    })
                                                                )}
                                                            />
                                                        </Col>
                                                    </Row>
                                                )
                                            )}

                                            <Button onClick={handleAddVariant}>
                                                Thêm biến thể
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div className="flex justify-center items-center mt-4">
                                    <Button type="primary" htmlType="submit">
                                        Lưu Thay Đổi
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default ListCourse;
