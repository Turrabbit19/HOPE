import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Thay thế Link bằng NavLink
import { Modal, Button, message, Alert, Descriptions, Empty } from "antd";
import instance from "../../../../config/axios";

const AsideTeacher = () => {
    const [notifications, setNotifications] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeLink, setActiveLink] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get(
                    `teacher/noti-change-schedule`
                );
                setNotifications(data || {});
                console.log(data);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async () => {
        try {
            const { data } = await instance.post(
                `teacher/accept-change-schedule`,
                notifications
            );
            setNotifications(data);
            handleCloseModal();
            message.success("Yêu cầu đã được gửi lên quản lý");
        } catch (error) {
            console.log(error.message);
            message.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const hasNotifications = Object.keys(notifications).length > 0;

    return (
        <aside className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-lg min-h-screen p-6 border-r border-black transition-all duration-300 ease-in-out ">
            {/* Logo */}
            <div className="flex items-center mb-8">
                <img
                    src="/public/assets/img/download (10).jpg"
                    alt="Logo"
                    width={50}
                />
            </div>

            {/* Trang chủ */}
            <div className="mb-6">
                <h2 className="mb-3 font-semibold text-gray-800 text-3xl">
                    Trang chủ
                </h2>
                <nav className="space-y-2">
                    <NavLink
                        to="home"
                        className={({ isActive }) =>
                            `flex items-center p-2 text-gray-700 rounded-lg transition-all duration-200 ease-in-out ${
                                isActive
                                    ? "bg-gray-100 text-gray-900 shadow-md"
                                    : "hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                            } group relative overflow-hidden`
                        }
                        onClick={() => setActiveLink("/home")}
                        aria-current={
                            activeLink === "/home" ? "page" : undefined
                        }
                    >
                        <span
                            className={`p-2 rounded-md bg-white shadow-sm transition-all duration-200 ease-in-out mr-3 ${
                                activeLink === "/home"
                                    ? "bg-gray-300 shadow-md"
                                    : "group-hover:shadow-md"
                            }`}
                        >
                            {/* Dashboard Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#34D399"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ease-in-out ${
                                    activeLink === "/home"
                                        ? "scale-110"
                                        : "group-hover:scale-110"
                                }`}
                            >
                                <rect
                                    width="7"
                                    height="9"
                                    x="3"
                                    y="3"
                                    rx="1"
                                ></rect>
                                <rect
                                    width="7"
                                    height="5"
                                    x="14"
                                    y="3"
                                    rx="1"
                                ></rect>
                                <rect
                                    width="7"
                                    height="9"
                                    x="14"
                                    y="12"
                                    rx="1"
                                ></rect>
                                <rect
                                    width="7"
                                    height="5"
                                    x="3"
                                    y="16"
                                    rx="1"
                                ></rect>
                            </svg>
                        </span>
                        <span
                            className={`font-medium ${
                                activeLink === "/home" ? "font-semibold" : ""
                            }`}
                        >
                            Trang chủ
                        </span>
                    </NavLink>
                </nav>
            </div>

            {/* Danh sách lớp học */}
            <div className="mb-6">
                <h2 className="mb-3 font-semibold text-gray-800 text-3xl">
                    Danh sách lớp học
                </h2>
                <nav className="space-y-2">
                    <NavLink
                        to="listclasslesson"
                        className={({ isActive }) =>
                            `flex items-center p-2 text-gray-700 rounded-lg transition-all duration-200 ease-in-out ${
                                isActive
                                    ? "bg-gray-100 text-gray-900 shadow-md"
                                    : "hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                            } group relative overflow-hidden`
                        }
                        onClick={() => setActiveLink("/listclasslesson")}
                        aria-current={
                            activeLink === "/listclasslesson"
                                ? "page"
                                : undefined
                        }
                    >
                        <span
                            className={`p-2 rounded-md bg-white shadow-sm transition-all duration-200 ease-in-out mr-3 ${
                                activeLink === "/listclasslesson"
                                    ? "bg-gray-300 shadow-md"
                                    : "group-hover:shadow-md"
                            }`}
                        >
                            {/* Book Open Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ease-in-out ${
                                    activeLink === "/listclasslesson"
                                        ? "scale-110"
                                        : "group-hover:scale-110"
                                }`}
                            >
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </span>
                        <span
                            className={`font-medium ${
                                activeLink === "/listclasslesson"
                                    ? "font-semibold"
                                    : ""
                            }`}
                        >
                            Danh sách lớp học
                        </span>
                    </NavLink>
                </nav>
            </div>

            {/* Lịch dạy */}
            <div className="mb-6">
                <h2 className="mb-3 font-semibold text-gray-800 text-3xl">
                    Lịch dạy
                </h2>
                <nav className="space-y-2">
                    <NavLink
                        to="timetable"
                        className={({ isActive }) =>
                            `flex items-center p-2 text-gray-700 rounded-lg transition-all duration-200 ease-in-out ${
                                isActive
                                    ? "bg-gray-100 text-gray-900 shadow-md"
                                    : "hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                            } group relative overflow-hidden`
                        }
                        onClick={() => setActiveLink("/timetable")}
                        aria-current={
                            activeLink === "/timetable" ? "page" : undefined
                        }
                    >
                        <span
                            className={`p-2 rounded-md bg-white shadow-sm transition-all duration-200 ease-in-out mr-3 ${
                                activeLink === "/timetable"
                                    ? "bg-gray-300 shadow-md"
                                    : "group-hover:shadow-md"
                            }`}
                        >
                            {/* Calendar Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#F59E0B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ease-in-out ${
                                    activeLink === "/timetable"
                                        ? "scale-110"
                                        : "group-hover:scale-110"
                                }`}
                            >
                                <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
                                <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
                                <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
                                <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
                            </svg>
                        </span>
                        <span
                            className={`font-medium ${
                                activeLink === "/timetable"
                                    ? "font-semibold"
                                    : ""
                            }`}
                        >
                            Lịch dạy
                        </span>
                    </NavLink>
                </nav>
            </div>

            {/* Thông báo đổi lịch */}
            {hasNotifications && (
                <button
                    onClick={handleOpenModal}
                    className="flex items-center p-2 text-gray-700 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm group relative overflow-hidden"
                >
                    <span className="p-2 rounded-md bg-gray-300 shadow-md transition-all duration-200 ease-in-out mr-3">
                        {/* Bell Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFCC00"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="scale-110"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </span>
                    <span className="font-medium">Thông báo đổi lịch</span>
                </button>
            )}

            {/* Modal for Notifications */}
            <Modal
                title={
                    <div className="text-center">
                        <h2 className="mb-1">Thông báo đổi lịch</h2>
                        <p className="text-sm text-gray-600">
                            Thông tin chi tiết về lịch học mới
                        </p>
                    </div>
                }
                visible={isModalVisible}
                onOk={handleSubmit}
                okText="Chấp nhận"
                onCancel={handleCloseModal}
                centered
            >
                {notifications && Object.keys(notifications).length > 0 ? (
                    <div className="mt-4">
                        <Alert
                            message="Bạn có một yêu cầu thay đổi lịch học!"
                            type="warning"
                            showIcon
                            className="mb-4"
                        />
                        <Descriptions
                            bordered
                            column={1}
                            size="small"
                            labelStyle={{ width: "30%", fontWeight: "bold" }}
                            contentStyle={{ width: "70%" }}
                        >
                            <Descriptions.Item label="Phòng">
                                {notifications.room_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ca học">
                                {notifications.shift_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Môn học">
                                {notifications.subject_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày">
                                {notifications.date}
                            </Descriptions.Item>
                            <Descriptions.Item label="Người yêu cầu">
                                {notifications.requester_name}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                ) : (
                    <Empty description="Không có thông tin." />
                )}
            </Modal>
        </aside>
    );
};

export default AsideTeacher;
