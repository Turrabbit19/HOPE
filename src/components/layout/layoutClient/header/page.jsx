import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Bell, MessageCircle, BarChart2, Maximize, Minimize, X } from "lucide-react"

export default function HeaderClient() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const notificationRef = useRef(null)
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  const unreadNotificationsCount = notifications.filter(n => n.status !== 'Đã xem').length

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
        setSelectedNotification(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      const response = await fetch('http://127.0.0.1:8000/api/student/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Không thể tải thông báo')
      }

      const data = await response.json()
      setNotifications(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setSelectedNotification(null)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    console.log("Đã đăng xuất và xóa token")
    navigate("/login")
  }

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      const response = await fetch(`http://127.0.0.1:8000/api/student/notification/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái thông báo')
      }

      const updatedNotification = await response.json()

      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, status: 'Đã xem' } : notification
        )
      )
      setSelectedNotification(null)
    } catch (err) {
      console.error('Lỗi khi đánh dấu đã xem:', err)
    }
  }

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification)
    if (notification.status !== 'Đã xem') {
      await markAsRead(notification.id)
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex items-center w-1/3">
        <div className="relative w-full max-w-sm">
          <input
            type="search"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center justify-center w-1/3">
        <span className="text-sm font-medium">Academic Year: 2024 / 2025</span>
      </div>
      <div className="flex items-center justify-end w-1/3 space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <img
            src="https://flagcdn.com/w20/vn.png"
            width="20"
            alt="vn flag"
            className="rounded-sm"
          />
        </button>
        <div className="relative">
          <button
            ref={buttonRef}
            className="p-2 hover:bg-gray-100 rounded-full border relative"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-10"
            >
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Thông báo</h3>
                <p className="text-sm text-gray-500">Bạn có {unreadNotificationsCount} thông báo chưa đọc</p>
              </div>
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <p className="text-center text-gray-500">Đang tải thông báo...</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : notifications.length === 0 ? (
                  <p className="text-center text-gray-500">Không có thông báo mới</p>
                ) : selectedNotification ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{selectedNotification.notification}</h4>
                      <button onClick={() => setSelectedNotification(null)} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm mb-2">{selectedNotification.description}</p>
                    {selectedNotification.status !== 'Đã xem' && (
                      <button
                        onClick={() => markAsRead(selectedNotification.id)}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-4 cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                      <div className={`w-2 h-2 mt-2 rounded-full ${notification.status === 'Đã xem' ? 'bg-gray-300' : 'bg-blue-500'}`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${notification.status === 'Đã xem' ? 'text-gray-600' : 'text-gray-900'}`}>{notification.notification}</p>
                        <p className="text-xs text-gray-500">{notification.description.substring(0, 50)}...</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full border">
          <MessageCircle className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full border">
          <BarChart2 className="h-5 w-5 text-gray-600" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-full border"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5 text-gray-600" />
          ) : (
            <Maximize className="h-5 w-5 text-gray-600" />
          )}
        </button>
        <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full border flex items-center">
          <span className="mr-2 text-gray-600">Đăng xuất</span>
        </button>
      </div>
    </header>
  )
}