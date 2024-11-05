'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, Users, Clock, CheckCircle } from 'lucide-react'

export default function CourseRegistration() {
  const [schedules, setSchedules] = useState([])
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [registeredCourses, setRegisteredCourses] = useState([])

  useEffect(() => {
    fetchSchedules()
    fetchRegisteredCourses()
  }, [])

  const fetchSchedules = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      const response = await fetch('http://127.0.0.1:8000/api/student/schedules', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Không thể tải lịch học')
      }

      const data = await response.json()
      setSchedules(data.data)
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải lịch học')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRegisteredCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      // Giả sử có một API endpoint để lấy danh sách các khóa học đã đăng ký
      const response = await fetch('http://127.0.0.1:8000/api/student/registered-courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Không thể tải danh sách khóa học đã đăng ký')
      }

      const data = await response.json()
      setRegisteredCourses(data.data.map(course => course.id))
    } catch (err) {
      console.error('Lỗi khi tải danh sách khóa học đã đăng ký:', err)
    }
  }

  const handleRegister = () => {
    if (selectedSchedule) {
      setShowConfirmation(true)
    } else {
      alert('Vui lòng chọn một khóa học trước khi đăng ký.')
    }
  }

  const confirmRegistration = async () => {
    if (!selectedSchedule) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      const response = await fetch(`http://localhost:8000/api/student/schedule/${selectedSchedule.id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Không thể đăng ký khóa học')
      }

      alert('Đăng ký thành công!')
      setShowConfirmation(false)
      setSelectedSchedule(null)
      setRegisteredCourses([...registeredCourses, selectedSchedule.id])
      fetchSchedules() // Cập nhật lại danh sách lịch học
    } catch (err) {
      alert(err.message || 'Đã xảy ra lỗi trong quá trình đăng ký')
    }
  }

  if (isLoading) return <div className="text-center mt-8">Đang tải...</div>
  if (error) return <div className="text-center mt-8 text-red-500">Lỗi: {error}</div>

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-100 to-white min-h-screen w-full">
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Đăng ký khóa học
            </span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {schedules.map(schedule => {
              const isRegistered = registeredCourses.includes(schedule.id)
              return (
                <button
                  key={schedule.id}
                  onClick={() => !isRegistered && setSelectedSchedule(schedule)}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    isRegistered
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : selectedSchedule?.id === schedule.id
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                  }`}
                  disabled={isRegistered}
                >
                  <h3 className="font-bold text-lg">{schedule.subject_name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="inline-flex items-center mr-4">
                      <BookOpen size={16} className="mr-1" /> Khóa học: {schedule.course_name}
                    </span>
                    <span className="inline-flex items-center">
                      <Clock size={16} className="mr-1" /> Ca: {schedule.shift_name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="inline-flex items-center mr-4">
                      <Users size={16} className="mr-1" /> Phòng: {schedule.room_name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Bắt đầu: {schedule.start_date} - Kết thúc: {schedule.end_date}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Ngày học: {schedule.days_of_week.map(day => `Thứ ${Object.values(day)[0]}`).join(', ')}
                  </p>
                  {isRegistered && (
                    <p className="text-sm text-green-600 mt-2 font-semibold">
                      <CheckCircle size={16} className="inline mr-1" /> Đã đăng ký
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              disabled={!selectedSchedule || registeredCourses.includes(selectedSchedule.id)}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Xác nhận đăng ký</h2>
            <p className="mb-4">Bạn có chắc chắn muốn đăng ký khóa học này?</p>
            <button 
              onClick={confirmRegistration}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Xác nhận
            </button>
            <button 
              onClick={() => setShowConfirmation(false)}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}