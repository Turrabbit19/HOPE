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
    Menu,
    Dropdown,
} from "antd";
import { EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const semesterData = {
    1: { majors: ["Lập trình Web", "Thiết kế đồ họa", "An ninh mạng"] },
    2: { majors: ["Kinh tế", "Tài chính", "Quản lý dự án"] },
    3: { majors: ["Y học", "Dược học", "Điều dưỡng"] },
};

const schedules = ["18.3", "17.3", "19.1"];
const semesters = Object.keys(semesterData);
const ListSubject = () => {
    // State để quản lý giá trị tìm kiếm và danh sách khóa học đã lọc
    const [searchValue, setSearchValue] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);

    // State cho popup tạo khóa học mới
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [form] = Form.useForm();

    // State cho lựa chọn kỳ học và ngành học
    const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
    const [majors, setMajors] = useState(semesterData[selectedSemester].majors);
    const [selectedMajor, setSelectedMajor] = useState(majors[0]);
    const [selectedSchedule, setSelectedSchedule] = useState(schedules[0]);

    // State cho các biến thể được thêm vào
    const [additionalVariants, setAdditionalVariants] = useState([
        {
            major: selectedMajor,
            schedule: selectedSchedule,
            semester: selectedSemester,
        },
    ]);

    // State cho modal chỉnh sửa khóa học
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    // Danh sách tất cả các khóa học có sẵn
    const allCourses = [
        { id: 1, name: "Math" },
        { id: 2, name: "Physics" },
        { id: 3, name: "Chemistry" },
        { id: 4, name: "History" },
        { id: 5, name: "Biology" },
        { id: 6, name: "Geography" },
    ];

    const MoreMenu = (
        <Menu>
            <Menu.Item key="1">Lớp học</Menu.Item>
            <Menu.Item key="2">Ca học</Menu.Item>
        </Menu>
    );

    // Thiết lập danh sách khóa học đã lọc khi component được mount
    useEffect(() => {
        setFilteredCourses(allCourses);
    }, []);

    // Hàm xử lý tìm kiếm
    const handleSearch = (event) => {
        const value = event.target.value; // Lấy giá trị từ input
        setSearchValue(value);

        if (value.trim() === "") {
            // Nếu input trống, hiển thị tất cả các khóa học
            setFilteredCourses(allCourses);
        } else {
            // Lọc khóa học theo tên
            const filtered = allCourses.filter((course) =>
                course.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    };

    // Hàm toggle hiển thị popup thêm khóa học
    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible); // Đảo ngược trạng thái hiển thị
        form.resetFields(); // Reset các trường trong form
        setAdditionalVariants([
            // Thiết lập lại các biến thể
            {
                major: majors[0],
                schedule: schedules[0],
                semester: semesters[0],
            },
        ]);
    };

    // Hàm xử lý khi form được gửi
    const handleFormSubmit = (values) => {
        console.log("Form data:", values, "Variants:", additionalVariants);

        const formData = {
            ...values,
            variants: additionalVariants,
        };

        console.log("Form data:", formData);
    };

    // Hàm xử lý thay đổi ngành học
    const handleMajorChange = (value, index) => {
        const updatedVariants = [...additionalVariants]; // Sao chép danh sách biến thể hiện tại
        updatedVariants[index].major = value; // Cập nhật ngành học
        setAdditionalVariants(updatedVariants); // Cập nhật state với danh sách biến thể mới
    };

    // Hàm xử lý thay đổi lịch học
    const handleScheduleChange = (value, index) => {
        const updatedVariants = [...additionalVariants];
        updatedVariants[index].schedule = value; // Cập nhật lịch học
        setAdditionalVariants(updatedVariants);
    };

    // Hàm xử lý thay đổi kỳ học
    const handleSemesterChange = (value, index) => {
        const updatedVariants = [...additionalVariants];
        updatedVariants[index].semester = value; // Cập nhật kỳ học
        setAdditionalVariants(updatedVariants);
    };

    // Hàm thêm biến thể mới
    const handleAddVariant = () => {
        setAdditionalVariants([
            // Thêm một biến thể mới vào danh sách
            ...additionalVariants,
            {
                major: majors[0],
                schedule: schedules[0],
                semester: semesters[0],
            },
        ]);
    };

    // Hàm xác nhận xóa khóa học
    const confirm = (e) => {
        console.log(e);
        message.success("Xóa thành công !"); // Hiển thị thông báo thành công
    };

    // Hàm hủy xác nhận xóa
    const cancel = (e) => {
        console.log(e);
        // message.error("Click on No");
    };

    // Hàm mở modal chỉnh sửa khóa học
    const openEditModal = (course) => {
        setEditingCourse(course); // Lưu khóa học hiện tại để chỉnh sửa
        setIsEditModalVisible(true); // Hiển thị modal chỉnh sửa
        form.setFieldsValue({
            // Thiết lập các trường trong form với dữ liệu của khóa học
            code: course.code,
            name: course.name,
            description: course.description,
            credit: course.credit,
        });
    };

    // Hàm đóng modal chỉnh sửa khóa học
    const closeEditModal = () => {
        setIsEditModalVisible(false); // Ẩn modal chỉnh sửa
        form.resetFields(); // Reset các trường trong form
    };

    // State cho modal lọc khóa học
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Hàm hiển thị modal lọc khóa học
    const handleShowModalFilter = () => {
        setIsModalVisible(true);
    };

    // Hàm xử lý khi nhấn OK trong modal lọc
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                console.log("Selected Filters:", values); // In ra các bộ lọc đã chọn
                // Xử lý lọc ở đây
                setIsModalVisible(false); // Đóng modal sau khi xử lý xong
            })
            .catch((info) => {
                console.log("Validate Failed:", info); // Xử lý lỗi xác thực
            });
    };

    // Hàm hủy bỏ việc hiển thị modal
    const handleCancel = () => {
        setIsModalVisible(false); // Ẩn modal lọc
    };
    return (
        <>
            <div className="listCourse">
                <div className="">
                    <div className="flex gap-4 row-cols-2 relative">
                        {/* Item */}
                        <div className="col-12">
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
                                        onChange={handleSearch} // Sử dụng onChange để gọi hàm tìm kiếm
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
                                    <div className="flex gap-6 items-center">
                                        <span className="font-bold text-[14px] text-[#000]">
                                            {filteredCourses.length} items
                                        </span>

                                        <Button
                                            type="primary"
                                            onClick={handleShowModalFilter}
                                        >
                                            Lọc Khóa Học
                                        </Button>
                                    </div>
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
                                                    <Dropdown
                                                        overlay={MoreMenu}
                                                        trigger={["click"]}
                                                    >
                                                        <Button
                                                            icon={
                                                                <MoreOutlined />
                                                            }
                                                        />
                                                    </Dropdown>
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
                                                    <Link
                                                        to={`detail/${course.id}`}
                                                        className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                                                    >
                                                        <img
                                                            src="/assets/svg/eye.svg"
                                                            alt=""
                                                        />
                                                        Chi Tiết
                                                    </Link>

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
                        <div className="createScheduleForm pb-6">
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
                                    <Col span={16}>
                                        {/* Mã môn học */}
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

                                        {/* Tên môn học */}
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

                                        {/* Mô tả môn học */}
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

                                        {/* Tín chỉ */}
                                        <Form.Item
                                            label="Tín chỉ"
                                            name="credit"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng nhập tín chỉ!",
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

                                    {/* Ngành học */}
                                    <Col span={8}>
                                        <Form.Item
                                            label="Ngành Học"
                                            name="majors"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn ngành học!",
                                                },
                                            ]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Chọn ngành học"
                                                options={majors.map(
                                                    (major) => ({
                                                        label: major,
                                                        value: major,
                                                    })
                                                )}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Nút tạo môn học */}
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
                                    <Col span={16}>
                                        {/* Mã môn học */}
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

                                        {/* Tên môn học */}
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

                                        {/* Mô tả môn học */}
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

                                        {/* Tín chỉ */}
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

                                    <Col span={8}>
                                        {/* Ngành học */}
                                        <Form.Item
                                            label="Ngành học"
                                            name="majors"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn ít nhất một ngành học!",
                                                },
                                            ]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Chọn ngành học"
                                                options={majors.map(
                                                    (major) => ({
                                                        label: major,
                                                        value: major,
                                                    })
                                                )}
                                            />
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

                    {/* Modal Filter */}
                    <Modal
                        title="Lọc Khóa Học"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                label="Chọn Ngành Học"
                                name="major"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn ngành học!",
                                    },
                                ]}
                            >
                                <Select placeholder="Chọn ngành học">
                                    <Option value="computer-science">
                                        Khoa học máy tính
                                    </Option>
                                    <Option value="data-science">
                                        Khoa học dữ liệu
                                    </Option>
                                    <Option value="web-development">
                                        Phát triển web
                                    </Option>
                                    <Option value="graphic-design">
                                        Thiết kế đồ họa
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Chọn Kỳ Học"
                                name="semester"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn kỳ học!",
                                    },
                                ]}
                            >
                                <Select placeholder="Chọn kỳ học">
                                    <Option value="semester1">Kỳ 1</Option>
                                    <Option value="semester2">Kỳ 2</Option>
                                    <Option value="semester3">Kỳ 3</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default ListSubject;
