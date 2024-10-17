import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Button,
    Popconfirm,
    Modal,
    Form,
    Input,
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS cho React Quill
import moment from "moment";
import instance from "../../../../config/axios";

const ListSections = () => {
    // Khai báo các state cần thiết
    const [sections, setSections] = useState([]);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // State cho các modal
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isNotificationModalVisible, setIsNotificationModalVisible] =
        useState(false);
    const [isAddNotificationModalVisible, setIsAddNotificationModalVisible] =
        useState(false);
    const [isEditNotificationModalVisible, setIsEditNotificationModalVisible] =
        useState(false);

    // State cho việc chỉnh sửa và lựa chọn
    const [editingSection, setEditingSection] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [editingNotification, setEditingNotification] = useState(null);

    const [description, setDescription] = useState("");
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);

    // Khởi tạo form của Ant Design
    const [form] = Form.useForm();
    const [notificationForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const pageSize = 4; // Số danh mục hiển thị mỗi trang

    // Lấy danh sách khóa học
    useEffect(() => {
        // Giả lập việc lấy dữ liệu khóa học từ API
        setCourses([
            { id: 1, name: "Khóa Học 18.1" },
            { id: 2, name: "Khóa Học 17.3" },
        ]);
    }, []);

    // Lấy danh sách danh mục
    const fetchSections = useCallback(async () => {
        try {
            const response = await instance.get("admin/sections");
            const sectionsData =
                response.data.data || response.data.sections || response.data;

            if (Array.isArray(sectionsData)) {
                setSections(sectionsData);
            } else {
                console.error("Dữ liệu danh mục không hợp lệ:", sectionsData);
                setSections([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            message.error("Không thể tải danh mục, vui lòng thử lại!");
        }
    }, []);

    // Gọi hàm fetchSections khi component được mount
    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    // Hàm xử lý tìm kiếm danh mục
    const handleSearch = useCallback((value) => {
        setSearchTerm(value.toLowerCase());
    }, []);

    // Lọc danh mục dựa trên từ khóa tìm kiếm
    const filteredSections = useMemo(() => {
        return sections.filter((section) =>
            (section.name || section.sectionName || "")
                .toLowerCase()
                .includes(searchTerm)
        );
    }, [sections, searchTerm]);

    // Reset trang hiện tại khi tìm kiếm thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Tính toán các danh mục sẽ hiển thị trên trang hiện tại
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredSections.slice(startIndex, endIndex);
    }, [filteredSections, currentPage, pageSize]);

    // Hàm xử lý khi thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Hiển thị modal chỉnh sửa danh mục
    const showEditModal = useCallback(
        (section) => {
            setEditingSection(section);
            form.setFieldsValue({
                name: section.name || section.sectionName,
            });
            setIsEditModalVisible(true);
        },
        [form]
    );

    // Hiển thị modal thêm mới danh mục
    const showAddModal = useCallback(() => {
        setEditingSection(null);
        form.resetFields();
        setIsAddModalVisible(true);
    }, [form]);

    // Thêm mới danh mục
    const addCategory = useCallback(
        async (values) => {
            try {
                await instance.post("admin/sections", {
                    name: values.name,
                });
                await fetchSections();
                message.success("Thêm danh mục thành công!");
                handleModalCancel();
            } catch (error) {
                console.error("Lỗi khi thêm danh mục:", error);
                message.error("Không thể thêm danh mục, vui lòng thử lại!");
            }
        },
        [fetchSections]
    );

    // Chỉnh sửa danh mục
    const editCategory = useCallback(
        async (values) => {
            try {
                await instance.put(`admin/sections/${editingSection.id}`, {
                    name: values.name,
                });
                await fetchSections();
                message.success("Cập nhật danh mục thành công!");
                handleModalCancel();
            } catch (error) {
                console.error("Lỗi khi cập nhật danh mục:", error);
                message.error("Không thể cập nhật danh mục, vui lòng thử lại!");
            }
        },
        [editingSection, fetchSections]
    );

    // Xử lý khi nhấn nút OK trong modal thêm/sửa danh mục
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingSection) {
                // Nếu đang chỉnh sửa danh mục
                await editCategory(values);
            } else {
                // Nếu đang thêm mới danh mục
                await addCategory(values);
            }
        } catch (errorInfo) {
            console.error("Lỗi khi xác thực form:", errorInfo);
            message.error("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    };

    // Hủy modal thêm/sửa danh mục
    const handleModalCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
        form.resetFields();
    };

    // Xác nhận xóa danh mục
    const confirmDelete = useCallback(
        async (id) => {
            try {
                await instance.delete(`admin/sections/${id}`);
                await fetchSections();
                message.success("Xóa danh mục thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
                message.error("Không thể xóa danh mục, vui lòng thử lại!");
            }
        },
        [fetchSections]
    );

    // Hiển thị danh sách thông báo của một danh mục
    const showNotifications = useCallback(async (section) => {
        setSelectedSection(section);
        try {
            const response = await instance.get(
                `admin/section/${section.id}/notifications`
            );
            const notificationsData =
                response.data.data ||
                response.data.notifications ||
                response.data;
            setNotifications(notificationsData);
            setIsNotificationModalVisible(true);
        } catch (error) {
            console.error("Lỗi khi tải thông báo:", error);
            message.error("Không thể tải thông báo, vui lòng thử lại!");
        }
    }, []);

    // Hiển thị modal thêm mới thông báo
    const showAddNotificationModal = useCallback(
        (section) => {
            setSelectedSection(section);
            notificationForm.resetFields();
            setDescription("");
            setIsAddNotificationModalVisible(true);
        },
        [notificationForm]
    );

    // Thêm mới thông báo
    const handleAddNotification = useCallback(async () => {
        try {
            const values = await notificationForm.validateFields();
            const notificationData = {
                name: values.name,
                description: description,
                section_id: selectedSection.id,
                courses: values.courses.map((courseId) => ({ id: courseId })), // Đảm bảo định dạng đúng
            };

            await instance.post(
                `admin/section/${selectedSection.id}/addNotice`,
                notificationData
            );
            message.success("Thêm thông báo thành công!");
            setIsAddNotificationModalVisible(false);
            await showNotifications(selectedSection); // Cập nhật danh sách thông báo
        } catch (error) {
            message.error("Không thể thêm thông báo, vui lòng thử lại!");
        }
    }, [notificationForm, description, selectedSection, showNotifications]);

    // Hủy modal thêm mới thông báo
    const handleNotificationModalCancel = () => {
        setIsAddNotificationModalVisible(false);
    };

    // Hủy modal danh sách thông báo
    const handleNotificationListCancel = () => {
        setIsNotificationModalVisible(false);
    };

    // Cấu hình module cho ReactQuill để hỗ trợ chỉnh sửa nâng cao
    const quillModules = useMemo(
        () => ({
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
        }),
        []
    );

    // Cấu hình format cho ReactQuill để hỗ trợ định dạng phức tạp
    const quillFormats = useMemo(
        () => [
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
        ],
        []
    );

    // Hàm xử lý khi bấm "Xem thêm" trong thông báo
    const toggleExpanded = useCallback((notificationId) => {
        setExpandedNotificationId((prevId) =>
            prevId === notificationId ? null : notificationId
        );
    }, []);

    // Khi nhấn vào nút "Sửa" thông báo
    const handleEditNotification = useCallback(
        (notification) => {
            setEditingNotification(notification);
            editForm.setFieldsValue({
                name: notification.name,
                description: notification.description,
                courses: notification.courses.map((course) => course.id), // Đảm bảo đây là mảng các ID
            });
            setIsEditNotificationModalVisible(true);
        },
        [editForm]
    );

    // Hủy modal sửa thông báo
    const handleEditNotificationCancel = () => {
        setIsEditNotificationModalVisible(false);
    };

    // Cập nhật thông báo sau khi chỉnh sửa
    const handleUpdateNotification = useCallback(async () => {
        try {
            const values = await editForm.validateFields();
            const notificationData = {
                name: values.name,
                description: values.description,
                courses: values.courses.map((courseId) => ({ id: courseId })), // Sửa lại định dạng đúng
            };

            await instance.put(
                `admin/notifications/${editingNotification.id}`,
                notificationData
            );
            message.success("Thông báo đã được cập nhật thành công!");
            setIsEditNotificationModalVisible(false);
            await showNotifications(selectedSection); // Cập nhật danh sách thông báo
        } catch (error) {
            console.error("Lỗi khi cập nhật thông báo:", error);
            message.error("Không thể cập nhật thông báo, vui lòng thử lại!");
        }
    }, [editForm, editingNotification, selectedSection, showNotifications]);

    // Xóa thông báo
    const handleDeleteNotification = useCallback(async (id) => {
        try {
            await instance.delete(`admin/notifications/${id}`);
            message.success("Thông báo đã được xóa thành công!");
            // Cập nhật danh sách thông báo
            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (notification) => notification.id !== id
                )
            );
        } catch (error) {
            console.error("Lỗi khi xóa thông báo:", error);
            message.error("Không thể xóa thông báo, vui lòng thử lại!");
        }
    }, []);

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
                        {currentItems.length > 0 ? (
                            currentItems.map((section) => (
                                <div className="col" key={section.id}>
                                    <div className="teaching__card">
                                        <div className="teaching__card-top">
                                            <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                Thông báo danh mục:
                                                <p className="text-red-300 uppercase ml-2 font-bold">
                                                    {section.name ||
                                                        section.sectionName}
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
                                                    onClick={() =>
                                                        showAddNotificationModal(
                                                            section
                                                        )
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
                                                            {section.status ||
                                                                "Đang hoạt động"}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày khởi tạo:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {section.creationDate ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày bắt đầu:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {section.startDate ||
                                                            "N/A"}
                                                    </p>
                                                </div> */}
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
            {/* Component Pagination đã được cập nhật */}
            <Pagination
                className="mt-12"
                align="center"
                total={filteredSections.length}
                current={currentPage}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false} // Ẩn thay đổi kích thước trang
            />

            {/* Modal Danh Sách Thông Báo */}
            <Modal
                title={
                    <h3 className="text-4xl font-bold text-gray-900">
                        Danh mục thông báo:{" "}
                        <span className="text-blue-600">
                            {selectedSection?.name ||
                                selectedSection?.sectionName ||
                                "Thông báo"}
                        </span>
                    </h3>
                }
                open={isNotificationModalVisible}
                onCancel={handleNotificationListCancel}
                footer={null}
                centered
                width={900}
                bodyStyle={{
                    padding: "10px 20px",
                    backgroundColor: "#fff",
                    borderRadius: "15px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
                className="rounded-lg shadow-xl transition-transform duration-300"
            >
                <div className="overflow-y-auto max-h-[90vh]">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="bg-white p-8 mb-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                                style={{
                                    border: "1px solid #E5E7EB",
                                    fontSize: "18px",
                                    lineHeight: "1.8",
                                    backgroundColor: "#f9f9f9",
                                    padding: "20px",
                                }}
                            >
                                {/* Tiêu đề thông báo */}
                                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                                    <span className="text-blue-600 mr-2">
                                        Tiêu đề:
                                    </span>
                                    {notification.name}
                                </h2>

                                {/* Nội dung thông báo */}
                                <div className="text-2xl text-gray-700 mb-4 leading-relaxed">
                                    <span className="font-semibold text-blue-600">
                                        Nội dung:{" "}
                                    </span>
                                    <p
                                        className={`mt-2 overflow-hidden ${
                                            expandedNotificationId ===
                                            notification.id
                                                ? ""
                                                : "line-clamp-2"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: notification.description,
                                        }}
                                    ></p>

                                    {/* Nút "Xem thêm" */}
                                    {notification.description.length > 100 && (
                                        <button
                                            className="text-blue-600 font-semibold mt-2"
                                            onClick={() =>
                                                toggleExpanded(notification.id)
                                            }
                                        >
                                            {expandedNotificationId ===
                                            notification.id
                                                ? "Thu gọn"
                                                : "Xem thêm"}
                                        </button>
                                    )}
                                </div>

                                {/* Khóa học */}
                                <div className="mt-4 text-2xl text-gray-700 mb-4">
                                    <span className="font-semibold text-blue-600">
                                        Khóa học:{" "}
                                    </span>
                                    {notification.courses &&
                                    notification.courses.length > 0 ? (
                                        <ul className="list-disc list-inside text-gray-600 mt-2">
                                            {notification.courses.map(
                                                (course) => (
                                                    <li key={course.id}>
                                                        {course.name}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">
                                            Không có khóa học nào.
                                        </p>
                                    )}
                                </div>

                                {/* Ngày khởi tạo */}
                                <div className="py-4 text-2xl text-gray-700">
                                    <span className="font-semibold text-blue-600">
                                        Ngày khởi tạo:{" "}
                                    </span>
                                    <p>
                                        {moment(notification.created_at).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </p>
                                </div>

                                {/* Nút Sửa và Xóa */}
                                <div className="flex justify-end mt-6 space-x-4">
                                    {/* Nút Sửa */}
                                    <Button
                                        className="mr-4"
                                        type="primary"
                                        style={{
                                            backgroundColor: "#007BFF",
                                            borderColor: "#007BFF",
                                            borderRadius: "8px",
                                            padding: "10px 20px",
                                            fontSize: "16px",
                                        }}
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
                                        <Button
                                            danger
                                            style={{
                                                borderRadius: "8px",
                                                padding: "10px 20px",
                                                fontSize: "16px",
                                                borderColor: "#FF4D4F",
                                                color: "#FF4D4F",
                                            }}
                                        >
                                            Xóa
                                        </Button>
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
                        name="name"
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

            {/* Modal Thêm Mới Thông Báo */}
            <Modal
                title="Thêm Mới Thông Báo"
                open={isAddNotificationModalVisible}
                onCancel={handleNotificationModalCancel}
                footer={null}
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
                        >
                            {courses.map((course) => (
                                <Select.Option
                                    key={course.id}
                                    value={course.id}
                                >
                                    {course.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Nội dung">
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            placeholder="Nhập nội dung thông báo"
                            modules={quillModules}
                            formats={quillFormats}
                            style={{
                                height: "250px",
                                marginBottom: "50px",
                            }}
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

            {/* Modal Sửa Thông Báo */}
            <Modal
                title="Sửa Thông Báo"
                open={isEditNotificationModalVisible}
                onCancel={handleEditNotificationCancel}
                footer={null}
                centered
                width={600}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        label="Tiêu đề"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tiêu đề thông báo" />
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
                        >
                            {courses.map((course) => (
                                <Select.Option
                                    key={course.id}
                                    value={course.id}
                                >
                                    {course.name}
                                </Select.Option>
                            ))}
                        </Select>
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
                        <ReactQuill
                            value={editForm.getFieldValue("description")}
                            onChange={(value) =>
                                editForm.setFieldsValue({ description: value })
                            }
                            placeholder="Nhập nội dung thông báo"
                            modules={quillModules}
                            formats={quillFormats}
                            style={{
                                height: "250px",
                                marginBottom: "50px",
                            }}
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
                            onClick={handleEditNotificationCancel}
                            style={{ marginRight: 8 }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleUpdateNotification}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ListSections;
