import React, { useState } from 'react'
import { Bell } from "lucide-react"

// Mảng thông báo mẫu
const sampleNotifications = [
  { id: 1, message: "Bạn có một tin nhắn mới", isRead: false, timestamp: "5 phút trước" },
  { id: 2, message: "Đơn hàng của bạn đã được giao", isRead: true, timestamp: "2 giờ trước" },
  { id: 3, message: "Cập nhật bảo mật mới", isRead: false, timestamp: "1 ngày trước" },
  { id: 4, message: "Ưu đãi đặc biệt cho bạn", isRead: true, timestamp: "3 ngày trước" },
]

export default function NotificationPage() {
  const [filter, setFilter] = useState('all')
  
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

  return (
    <div className="w-full  mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
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
              <li key={notification.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
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
    </div>
  )
}