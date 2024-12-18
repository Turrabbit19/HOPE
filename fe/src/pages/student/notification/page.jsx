"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, AlertCircle, RefreshCw, Check } from 'lucide-react';

// Utility function to strip HTML tags
const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

// Popup Component
function Popup({ notification, onClose, onMarkAsRead }) {
    useEffect(() => {
        if (notification.status !== "Đã xem") {
            onMarkAsRead(notification.id);
        }
    }, [notification]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-10 max-w-xl w-full mx-6 shadow-2xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-105 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-4xl font-extrabold text-gradient tracking-tight">
                {stripHtml(notification.notification)}
            </h3>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition-all duration-300 transform hover:rotate-90"
                aria-label="Close Popup"
            >
                <X className="w-8 h-8" />
            </button>
        </div>
        <div
            className="text-gray-700 mb-6 text-lg leading-relaxed font-medium"
            dangerouslySetInnerHTML={{
                __html: notification.description || "Không có mô tả",
            }}
        />
        <p className="text-lg text-gray-600 font-semibold">
            Trạng thái: 
            <span className={`font-bold text-${notification.status === 'Hoàn thành' ? 'green' : 'red'}-500`}>
                {notification.status}
            </span>
        </p>
    </div>
</div>

    

    );
}

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); // Thêm state để quản lý thông báo lỗi

    // Fetch notifications from the API
    const fetchNotifications = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Không tìm thấy token xác thực");
            }

            const response = await fetch(
                "http://127.0.0.1:8000/api/student/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Token không hợp lệ hoặc đã hết hạn");
                }
                throw new Error("Không thể tải thông báo");
            }

            const data = await response.json();
            setNotifications(data.data);
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tải thông báo");
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Không tìm thấy token xác thực");
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/student/notification/${notificationId}?status=Đã xem`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Không thể cập nhật trạng thái thông báo");
            }

            // Assuming the API returns the updated notification
            const updatedNotification = await response.json();
            console.log("Notification marked as read:", updatedNotification);

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, status: "Đã xem" }
                        : notification
                )
            );

            if (selectedNotification && selectedNotification.id === notificationId) {
                setSelectedNotification((prev) => ({
                    ...prev,
                    status: "Đã xem",
                }));
            }

            setErrorMessage(null); // Xóa thông báo lỗi nếu thành công
        } catch (err) {
            console.error("Lỗi khi đánh dấu đã xem:", err);
            setErrorMessage("Không thể cập nhật trạng thái thông báo. Vui lòng thử lại sau.");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filteredNotifications = notifications.filter((notification) => {
        if (filter === "all") return true;
        if (filter === "read") return notification.status === "Đã xem";
        if (filter === "unread") return notification.status !== "Đã xem";
        return true;
    });

    const countAll = notifications.length;
    const countRead = notifications.filter((n) => n.status === "Đã xem").length;
    const countUnread = notifications.filter(
        (n) => n.status !== "Đã xem"
    ).length;

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        if (notification.status !== "Đã xem") {
            markAsRead(notification.id);
        }
    };

    // Handle closing the popup
    const closePopup = () => {
        setSelectedNotification(null);
    };

    const handleMarkAsRead = async (notificationId) => {
        console.log("Handling mark as read:", notificationId);
        await markAsRead(notificationId);
        closePopup();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6">
                <div className="flex items-center justify-center mb-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <p className="text-xl font-semibold text-red-500 mb-4">
                    {error}
                </p>
                <button
                    onClick={fetchNotifications}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center mx-auto"
                >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Thông báo</h2>
                <div className="flex space-x-2 mb-6">
                    <button
                        className={`px-4 py-2 rounded-md ${filter === "all"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setFilter("all")}
                    >
                        Tất cả ({countAll})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${filter === "read"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setFilter("read")}
                    >
                        Đã đọc ({countRead})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${filter === "unread"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setFilter("unread")}
                    >
                        Chưa đọc ({countUnread})
                    </button>
                </div>
                {filteredNotifications.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Không có thông báo nào
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {filteredNotifications.map((notification) => (
                            <li
                                key={notification.id}
                                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                onClick={() =>
                                    handleNotificationClick(notification)
                                }
                            >
                                <Bell
                                    className={`w-6 h-6 ${notification.status === "Đã xem"
                                        ? "text-gray-400"
                                        : "text-blue-500"
                                        }`}
                                />
                                <div className="flex-1">
                                    <p
                                        className={`${notification.status === "Đã xem"
                                            ? "text-gray-600"
                                            : "text-gray-900 font-medium"
                                            }`}
                                        dangerouslySetInnerHTML={{
                                            __html: stripHtml(
                                                notification.notification
                                            ),
                                        }}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Trạng thái: {notification.status}
                                    </p>
                                </div>
                                {notification.status !== "Đã xem" && (
                                    <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                                        Mới
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedNotification && (
                <Popup
                    notification={selectedNotification}
                    onClose={closePopup}
                    onMarkAsRead={handleMarkAsRead}
                />
            )}
            {errorMessage && ( // Thêm hiển thị thông báo lỗi
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

