import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Thay thế Link bằng NavLink
import { Modal, Button, message, Alert, Descriptions } from "antd";
import instance from "../../../../config/axios";

const AsideTeacher = () => {
    const [notifications, setNotifications] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);

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
        }
    };

    const hasNotifications = Object.keys(notifications).length > 0;

    return (
        <aside className="p-4 bg-gray-100">
            <div className="flex items-center mb-6">
                <img
                    alt="Logo"
                    className="mr-2"
                    width="50"
                    height="40"
                    src="/public/assets/img/download (10).jpg"
                />
            </div>
            <div className="mb-4">
                <h2 className="mb-2 font-semibold">Trang chủ</h2>
                <nav className="space-y-3">
                    <NavLink
                        to="home"
                        className={({ isActive }) =>
                            `flex items-center p-2 text-gray-700 hover:bg-gray-200 ${
                                isActive ? "bg-gray-200" : ""
                            }`
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 mr-3 text-teal-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                        <span className="text-gray-800 font-medium group-hover:text-teal-600">
                            Trang chủ
                        </span>
                    </NavLink>
                </nav>
            </div>

            <div className="mb-6">
                <h2 className="mb-2 font-semibold">
                    Danh sách lớp học & điểm danh
                </h2>
                <nav className="space-y-3">
                    <NavLink
                        to="listclasslesson"
                        className={({ isActive }) =>
                            `flex items-center p-2 text-gray-700 hover:bg-gray-200 ${
                                isActive ? "bg-gray-200" : ""
                            }`
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 mr-3 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <rect
                                x="2"
                                y="4"
                                width="20"
                                height="16"
                                rx="2"
                            ></rect>
                            <path d="M10 4v4"></path>
                            <path d="M2 8h20"></path>
                            <path d="M6 4v4"></path>
                        </svg>
                        <span className="text-gray-800 font-medium group-hover:text-red-600">
                            Danh sách lớp học
                        </span>
                    </NavLink>

                    <NavLink
                        to="timetable"
                        className={({ isActive }) =>
                            `flex items-center p-2 text-gray-700 hover:bg-gray-200 ${
                                isActive ? "bg-gray-200" : ""
                            }`
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 mr-3 text-orange-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
                            <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
                            <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
                            <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
                        </svg>
                        <span className="text-gray-800 font-medium group-hover:text-orange-600">
                            Lịch dạy
                        </span>
                    </NavLink>

                    {hasNotifications && (
                        <button
                            onClick={handleOpenModal}
                            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 mr-3 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
                                <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
                                <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
                                <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
                            </svg>
                            <span className="text-gray-800 font-medium group-hover:text-orange-600">
                                Thông báo đổi lịch
                            </span>
                        </button>
                    )}
                </nav>
            </div>

            <Modal
                title={
                    <div style={{ textAlign: "center", margin: 0 }}>
                        <h2 style={{ marginBottom: 4 }}>Thông báo đổi lịch</h2>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#666",
                            }}
                        >
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
                {notifications ? (
                    <div style={{ marginTop: 16 }}>
                        <Alert
                            message="Bạn có một yêu cầu thay đổi lịch học!"
                            type="warning"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                        <Descriptions
                            bordered
                            column={1}
                            size="small"
                            labelStyle={{ width: "30%", fontWeight: "bold" }}
                            contentStyle={{ width: "80%" }}
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
