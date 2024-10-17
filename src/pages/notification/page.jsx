import React, { useState } from 'react'
import { Bell, X } from "lucide-react"

// Mảng thông báo mẫu
const sampleNotifications = [
  { id: 1, message: "Bạn có một tin nhắn mới", isRead: false, timestamp: "5 phút trước", content: "John Doe đã gửi cho bạn một tin nhắn mới. Nhấp vào đây để xem." },
  { id: 2, message: "Đơn hàng của bạn đã được giao", isRead: true, timestamp: "2 giờ trước", content: "Đơn hàng #12345 của bạn đã được giao thành công. Cảm ơn bạn đã mua hàng!" },
  { id: 3, message: "Cập nhật bảo mật mới", isRead: false, timestamp: "1 ngày trước", content: "Chúng tôi đã cập nhật chính sách bảo mật. Vui lòng xem lại để biết thêm chi tiết." },
  { id: 4, message: "Ưu đãi đặc biệt cho bạn", isRead: true, timestamp: "3 ngày trước", content: "Nhân dịp sinh nhật của bạn, chúng tôi tặng bạn mã giảm giá 20% cho đơn hàng tiếp theo!" },
]

function Popup({ notification, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{notification.message}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-2">{notification.content}</p>
        <p className="text-sm text-gray-500">{notification.timestamp}</p>
      </div>
    </div>
  )
}

export default function NotificationPage() {
  const [filter, setFilter] = useState('all')
  const [selectedNotification, setSelectedNotification] = useState(null)
  
  // Lọc thông báo dựa trên bộ lọc hiện tại
  const filteredNotifications = sampleNotifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'read') return notification.isRead
    if (filter === 'unread') return !notification.isRead
    return true
  })

  // Đếm số lượng thông báo cho mỗi loại
  const countAll = sampleNotifications.length
  const countRead = sampleNotifications.filter(n => n.isRead).length
  const countUnread = sampleNotifications.filter(n => !n.isRead).length

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification)
  }

  const closePopup = () => {
    setSelectedNotification(null)
  }

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Thông báo</h2>
        <div className="flex space-x-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({countAll})
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'read' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter('read')}
          >
            Đã đọc ({countRead})
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter('unread')}
          >
            Chưa đọc ({countUnread})
          </button>
        </div>
        {filteredNotifications.length === 0 ? (
          <p className="text-center text-gray-500">Không có thông báo nào</p>
        ) : (
          <ul className="space-y-4">
            {filteredNotifications.map(notification => (
              <li 
                key={notification.id} 
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleNotificationClick(notification)}
              >
                <Bell className={`w-6 h-6 ${notification.isRead ? 'text-gray-400' : 'text-blue-500'}`} />
                <div className="flex-1">
                  <p className={`${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500">{notification.timestamp}</p>
                </div>
                {!notification.isRead && (
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">Mới</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedNotification && (
        <Popup notification={selectedNotification} onClose={closePopup} />
      )}
    </div>
  )
}