import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, MessageCircle, BarChart2, Maximize, Minimize, X, Book, LogOut } from 'lucide-react';

export default function HeaderClient() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const notificationRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const notificationTimerRef = useRef(null);

  const unreadNotificationsCount = notifications.filter(
    (n) => n.status !== "Đã xem"
  ).length;

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");
    if (loginSuccess) {
      setSuccessMessage(loginSuccess);
      setShowSuccessNotification(true);
      localStorage.removeItem("loginSuccess");

      // Set timeout to hide notification after 2 seconds
      notificationTimerRef.current = setTimeout(() => {
        setShowSuccessNotification(false);
        setSuccessMessage("");
      }, 2000);
    }

    // Cleanup function to clear timeout on unmount
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, [notificationTimerRef]); // Add notificationTimerRef to dependency array

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setSelectedNotification(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

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
        throw new Error("Không thể tải thông báo");
      }

      const data = await response.json();
      setNotifications(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setSelectedNotification(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    console.log("Đã đăng xuất và xóa token");
    navigate("/login");
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/student/notification/${id}`,
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

      const updatedNotification = await response.json();

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, status: "Đã xem" }
            : notification
        )
      );
      setSelectedNotification(null);
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã xem:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    if (notification.status !== "Đã xem") {
      await markAsRead(notification.id);
    }
  };

  return (
    <>
      {showSuccessNotification && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center"
          style={{ transform: showSuccessNotification ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          <div className="bg-white text-emerald-500 px-16 py-14 rounded-xl shadow-xl flex items-center space-x-8 max-w-3xl w-full transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-center bg-emerald-100 p-6 rounded-full">
              <svg
                className="w-12 h-12 text-emerald-500 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-2xl font-medium flex-grow">{successMessage}</p>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="text-emerald-500 hover:text-emerald-700 focus:outline-none transition-colors duration-200"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}




      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-300 to-blue-500 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <Book className="h-8 w-8" />
          <h1 className="text-2xl font-bold">EduPortal</h1>
        </div>

        <div className="flex items-center space-x-6">
          <button className="hover:bg-blue-700 p-2 rounded-full transition duration-300 ease-in-out">
            <img
              src="https://flagcdn.com/w20/vn.png"
              width="20"
              alt="vn flag"
              className="rounded"
            />
          </button>
          <div className="relative">
            <button
              ref={buttonRef}
              className="hover:bg-blue-700 p-2 rounded-full transition duration-300 ease-in-out relative"
              onClick={toggleNotifications}
            >
              <Bell className="h-6 w-6" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div
                ref={notificationRef}
                className="absolute right-0 mt-2 w-[480px] min-w-[400px] bg-white text-gray-800 border rounded-md shadow-lg z-10"
              >
                <div className="p-4 border-b bg-blue-50">
                  <h3 className="text-xl font-semibold text-blue-800">Thông báo</h3>
                  <p className="text-base text-blue-600">
                    Bạn có {unreadNotificationsCount} thông báo chưa đọc
                  </p>
                </div>
                <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  {isLoading ? (
                    <p className="text-center text-gray-500">Đang tải thông báo...</p>
                  ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                  ) : notifications.length === 0 ? (
                    <p className="text-center text-gray-500">Không có thông báo mới</p>
                  ) : selectedNotification ? (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-blue-800 text-lg">{selectedNotification.notification}</h4>
                        <button
                          onClick={() => setSelectedNotification(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-lg mb-2 text-gray-600">{selectedNotification.description}</p>
                      {selectedNotification.status !== "Đã xem" && (
                        <button
                          onClick={() => markAsRead(selectedNotification.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start space-x-4 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition duration-300 ease-in-out"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div
                          className={`w-3 h-3 mt-2 rounded-full ${notification.status === "Đã xem" ? "bg-gray-300" : "bg-blue-500"
                            }`}
                        />
                        <div className="flex-1">
                          <p className={`text-lg font-medium ${notification.status === "Đã xem" ? "text-gray-600" : "text-blue-800"
                            }`}>
                            {notification.notification}
                          </p>
                          <p className="text-xl text-gray-500">
                            {notification.description.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="hover:bg-blue-700 p-2 rounded-full transition duration-300 ease-in-out">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button className="hover:bg-blue-700 p-2 rounded-full transition duration-300 ease-in-out">
            <BarChart2 className="h-6 w-6" />
          </button>
          <button
            className="hover:bg-blue-700 p-2 rounded-full transition duration-300 ease-in-out"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-6 w-6" />
            ) : (
              <Maximize className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-400 hover:bg-red-600 px-4 py-2 rounded-full transition duration-300 ease-in-out"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </header>
    </>
  );
}

