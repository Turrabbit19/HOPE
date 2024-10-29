'use client'

import { useState } from 'react'

export default function ProductCard({ 
  day, 
  shift, 
  subject = "Toán học", 
  room = "101", 
  instructor = "Nguyễn Văn A", 
  additionalInfo, 
  isBottomRow 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative p-4 rounded-lg shadow-sm transition-all duration-300 bg-white hover:bg-gray-100 bordered"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <p className="text-sm font-semibold">Môn học: {subject}</p>
        <p className="text-sm">Phòng: {room}</p>
        <div className="flex items-center mt-2">
        </div>
      </div>

      {isHovered && (
        <div className={`absolute ${isBottomRow ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-64 p-4 bg-white rounded-lg shadow-lg z-10`}>
          <h3 className="font-semibold text-lg mb-2">Thông tin chi tiết</h3>
          <p className="text-sm">Ngày: {day}</p>
          <p className="text-sm">Ca: {shift}</p>
          {additionalInfo?.time && <p className="text-sm">Thời gian: {additionalInfo.time}</p>}
          {additionalInfo?.class && <p className="text-sm">Lớp: {additionalInfo.class}</p>}
          {additionalInfo?.session && <p className="text-sm">Buổi: {additionalInfo.session}</p>}
          <p className="text-sm">Môn học: {subject}</p>
          <p className="text-sm">Phòng: {room}</p>
          <p className="text-sm">Giảng viên: {instructor}</p>
        </div>
      )}
    </div>
  )
}