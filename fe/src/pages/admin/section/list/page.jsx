import React, { useState, useEffect } from "react";
import {
    Button,
    Popconfirm,
    Modal,
    Form,
    Input,
    Space,
    Pagination,
    message,
    Tooltip,
    Select,
} from "antd";
import {
    EditOutlined,
    PlusOutlined,
    PlusCircleOutlined,
    BugOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS cho React Quill

const ListSections = () => {
    const [sections, setSections] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isAddNotificationModalVisible, setIsAddNotificationModalVisible] =
        useState(false);
    const [isNotificationModalVisible, setIsNotificationModalVisible] =
        useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null); // Danh mục đã chọn
    const [searchTerm, setSearchTerm] = useState("");
    const [form] = Form.useForm();
    const [notificationForm] = Form.useForm();
    const [description, setDescription] = useState("");
    const [notifications, setNotifications] = useState([]); // Thông báo thuộc danh mục

    useEffect(() => {
        const fetchSections = async () => {
            const data = [
                {
                    id: 1,
                    sectionName: "Học Tập",
                    creationDate: "2024-01-01",
                    startDate: "2024-01-05",
                    status: "Đang hoạt động",
                },
                {
                    id: 2,
                    sectionName: "Học Phí",
                    creationDate: "2024-02-01",
                    startDate: "2024-02-05",
                    status: "Ngừng hoạt động",
                },
                {
                    id: 3,
                    sectionName: "Thi Cử",
                    creationDate: "2024-03-01",
                    startDate: "2024-03-05",
                    status: "Đang hoạt động",
                },
            ];
            setSections(data);
        };

        fetchSections();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    const filteredSections = sections.filter((section) =>
        section.sectionName.toLowerCase().includes(searchTerm)
    );

    const showEditModal = (section) => {
        setEditingSection(section);
        form.setFieldsValue({
            sectionName: section.sectionName,
        });
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setEditingSection(null);
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingSection) {
                // Sửa danh mục
                setSections(
                    sections.map((section) =>
                        section.id === editingSection.id
                            ? { ...section, sectionName: values.sectionName }
                            : section
                    )
                );
                message.success("Cập nhật danh mục thành công!");
            } else {
                // Thêm mới danh mục
                setSections([
                    ...sections,
                    {
                        id: sections.length + 1,
                        sectionName: values.sectionName,
                        creationDate: moment().format("YYYY-MM-DD"),
                        startDate: moment().format("YYYY-MM-DD"),
                        status: "Đang hoạt động",
                    },
                ]);
                message.success("Thêm danh mục thành công!");
            }
            handleModalCancel();
        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
            message.error("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    };

    const handleModalCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
        form.resetFields();
    };

    const confirmDelete = (id) => {
        setSections(sections.filter((section) => section.id !== id));
        message.success("Xóa danh mục thành công!"); // Thông báo xóa thành công
    };

    const showAddNotificationModal = () => {
        notificationForm.resetFields();
        setDescription(""); // Reset description khi mở popup
        setIsAddNotificationModalVisible(true);
    };

    const handleAddNotification = async () => {
        try {
            const values = await notificationForm.validateFields();
            const notificationData = {
                ...values,
                description,
                courses: values.courses, // Lưu thông tin các khóa học đã chọn
            };
            console.log("Notification Data:", notificationData);
            message.success("Thêm thông báo thành công!");
            setIsAddNotificationModalVisible(false);
        } catch (errorInfo) {
            console.log("Failed:", errorInfo);
            message.error("Vui lòng điền đầy đủ thông tin!");
        }
    };

    const handleNotificationModalCancel = () => {
        setIsAddNotificationModalVisible(false);
    };

    // Hiển thị danh sách thông báo
    const showNotifications = (section) => {
        setSelectedSection(section);
        setNotifications([
            {
                id: 1,
                title: "Thông báo 1",
                description: "Chi tiết thông báo 1",
            },
            {
                id: 2,
                title: "Thông báo 2",
                description: "Chi tiết thông báo 2",
            },
        ]);
        setIsNotificationModalVisible(true);
    };

    const handleNotificationListCancel = () => {
        setIsNotificationModalVisible(false);
    };

    // Cấu hình module cho ReactQuill để hỗ trợ chỉnh sửa nâng cao
    const quillModules = {
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    // Cấu hình format cho ReactQuill để hỗ trợ định dạng phức tạp
    const quillFormats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
        "color",
        "background",
        "align",
        "script",
    ];

    // SỬA XÓA THÔNG BÁO
    const [isEditNotificationModalVisible, setIsEditNotificationModalVisible] =
        useState(false);
    const [editForm] = Form.useForm();
    const [editingNotification, setEditingNotification] = useState(null);

    // Khi nhấn vào nút "Sửa"
    const handleEditNotification = (notification) => {
        setEditingNotification(notification);
        editForm.setFieldsValue({
            title: notification.title,
            description: notification.description,
        });
        setIsEditNotificationModalVisible(true);
    };

    // Khi nhấn "Hủy" trong modal sửa
    const handleEditNotificationCancel = () => {
        setIsEditNotificationModalVisible(false);
    };

    // Khi nhấn "Cập nhật" để lưu thay đổi
    const handleUpdateNotification = () => {
        editForm.validateFields().then((values) => {
            // Cập nhật thông báo trong danh sách
            const updatedNotifications = notifications.map((notification) =>
                notification.id === editingNotification.id
                    ? { ...notification, ...values }
                    : notification
            );
            setNotifications(updatedNotifications);
            message.success("Thông báo đã được cập nhật thành công!");
            setIsEditNotificationModalVisible(false);
        });
    };

    // Khi nhấn "Xóa"
    const handleDeleteNotification = (id) => {
        const updatedNotifications = notifications.filter(
            (notification) => notification.id !== id
        );
        setNotifications(updatedNotifications);
        message.success("Thông báo đã được xóa thành công!");
    };

    return (
        <div className="test__list">
            <div className="row row-cols-2 g-3">
                <div className="col-12">
                    <div>
                        <div className="justify-between flex">
                            <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                                Quản Lý danh mục
                                <button>
                                    <img
                                        src="/assets/svg/reload.svg"
                                        alt="reload..."
                                    />
                                </button>
                            </h1>

                            <div>
                                <Input.Search
                                    placeholder="Tìm kiếm danh mục..."
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
                                {filteredSections.length} items
                            </span>
                        </div>
                    </div>
                    <div className="row row-cols-2 g-3">
                        {filteredSections.length > 0 ? (
                            filteredSections.map((section) => (
                                <div className="col" key={section.id}>
                                    <div className="teaching__card">
                                        <div className="teaching__card-top">
                                            <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                Thông báo danh mục:{" "}
                                                <p className="text-red-300 uppercase ml-2 font-bold">
                                                    {section.sectionName}
                                                </p>
                                            </h2>
                                            <Tooltip
                                                title="Thêm mới thông báo"
                                                className="mr-4"
                                            >
                                                <Button
                                                    icon={
                                                        <PlusCircleOutlined />
                                                    }
                                                    onClick={
                                                        showAddNotificationModal
                                                    }
                                                />
                                            </Tooltip>
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
                                                            {section.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày khởi tạo:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {section.creationDate}
                                                    </p>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày bắt đầu:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {section.startDate}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="teaching__card-bottom">
                                            <button
                                                className="flex items-center gap-3 text-[#1167B4] font-bold"
                                                onClick={() =>
                                                    showNotifications(section)
                                                }
                                            >
                                                <BugOutlined />
                                                Quản lý Thông Báo
                                            </button>
                                            <button
                                                className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                                                onClick={() =>
                                                    showEditModal(section)
                                                }
                                            >
                                                <EditOutlined />
                                                Chỉnh sửa
                                            </button>
                                            <Popconfirm
                                                title="Xóa danh mục"
                                                onConfirm={() =>
                                                    confirmDelete(section.id)
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
                                    Không tìm thấy danh mục nào!
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Pagination
                className="mt-12"
                align="center"
                total={filteredSections.length}
                defaultPageSize={6}
                defaultCurrent={1}
            />

            {/* LIST THÔNG BÁO */}
            <Modal
                title={
                    <h3 className="text-2xl font-semibold ">
                        Danh mục thông báo :
                        <span className="text-[#1167B4]">
                            {" "}
                            {selectedSection?.sectionName || "Thông báo"}
                        </span>
                    </h3>
                }
                open={isNotificationModalVisible}
                onCancel={handleNotificationListCancel}
                footer={null}
                centered
                width={700}
                bodyStyle={{ padding: "20px 30px", backgroundColor: "#fafafa" }}
                className="rounded-lg shadow-lg"
            >
                <div className="overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="bg-white p-8 mb-8 rounded-lg shadow-lg"
                            >
                                {/* Tiêu đề thông báo */}
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    <span className="text-blue-600 mr-2">
                                        Tiêu đề:{" "}
                                    </span>
                                    {notification.title}
                                </h2>
                                {/* Nội dung thông báo */}
                                <div className="text-2xl text-gray-700">
                                    <span className="font-semibold text-blue-600">
                                        Nội dung:
                                    </span>
                                    <p className="mt-4">
                                        {notification.description}
                                    </p>
                                </div>
                                {/* Nút Sửa và Xóa */}
                                <div className="flex justify-end mt-6">
                                    {/* Nút Sửa */}
                                    <Button
                                        className="mr-4"
                                        type="primary"
                                        onClick={() =>
                                            handleEditNotification(notification)
                                        }
                                    >
                                        Sửa
                                    </Button>

                                    {/* Nút Xóa */}
                                    <Popconfirm
                                        title="Bạn có chắc chắn muốn xóa thông báo này?"
                                        onConfirm={() =>
                                            handleDeleteNotification(
                                                notification.id
                                            )
                                        }
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <Button type="danger">Xóa</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-xl text-gray-500">
                            Không có thông báo nào trong danh mục này
                        </p>
                    )}
                </div>
            </Modal>
            {/* Modal Thêm/Sửa Danh Mục */}
            <Modal
                title={editingSection ? "Sửa Danh Mục" : "Thêm Mới Danh Mục"}
                open={isAddModalVisible || isEditModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                centered
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Danh Mục"
                        name="sectionName"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên danh mục!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingTop: "20px",
                        }}
                    >
                        <Button
                            onClick={handleModalCancel}
                            style={{ marginRight: 8 }}
                        >
                            Hủy
                        </Button>
                        <Button type="primary" onClick={handleModalOk}>
                            {editingSection ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                title="Thêm Mới Thông Báo"
                open={isAddNotificationModalVisible}
                onCancel={handleNotificationModalCancel}
                footer={null} // Loại bỏ footer mặc định
                centered
                width={700}
            >
                <Form form={notificationForm} layout="vertical">
                    <Form.Item
                        label="Tiêu đề"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập Tiêu đề!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập Tiêu đề" />
                    </Form.Item>

                    {/* Trường Khóa Học dạng Multiple Select */}
                    <Form.Item
                        label="Khóa Học"
                        name="courses"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ít nhất một khóa học!",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn khóa học"
                            allowClear
                            style={{ width: "100%" }}
                            options={[
                                { value: "course1", label: "Khóa Học 18.1" },
                                { value: "course2", label: "Khóa Học 17.3" },
                                { value: "course3", label: "Khóa Học 16.5" },
                                { value: "course4", label: "Khóa Học 15.6" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="Nội dung">
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            placeholder="Nhập nội dung thông báo"
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: "250px", marginBottom: "50px" }}
                        />
                    </Form.Item>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingTop: "20px",
                        }}
                    >
                        <Button
                            onClick={handleNotificationModalCancel}
                            style={{ marginRight: 8 }}
                        >
                            Hủy
                        </Button>
                        <Button type="primary" onClick={handleAddNotification}>
                            Tạo mới
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* SỬA THÔNG BÁO  */}
            {/* Modal Sửa Thông Báo */}
            <Modal
                title="Sửa Thông Báo"
                open={isEditNotificationModalVisible}
                onCancel={handleEditNotificationCancel}
                onOk={handleUpdateNotification} // Hàm cập nhật thông báo
                centered
                width={600}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tiêu đề thông báo" />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập nội dung!",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập nội dung thông báo"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ListSections;
