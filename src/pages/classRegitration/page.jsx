'use client'

import React, { useState, useMemo } from 'react'
import { BookOpen, Users, Clock, CheckCircle } from 'lucide-react'

// Danh sách các khóa học
const courses = [
  { id: '1', name: 'Nhập môn lập trình', code: 'NMLT', credits: 4 },
  { id: '2', name: 'Lập trình PHP 3', code: 'LTPHP3', credits: 3 },
  { id: '3', name: 'Lập trình PHP 2', code: 'LTPHP2', credits: 3 },
  { id: '4', name: 'Cơ sở dữ liệu', code: 'CSDL', credits: 3 },
  { id: '5', name: 'Lập trình web', code: 'LTWEB', credits: 3 },
  { id: '6', name: 'Khoa học máy tính', code: 'KHMT', credits: 3 },
]

// Thông tin các lớp học và ca học
const classOptions = {
  '1': [
    { id: '1-1', code: 'Lớp 1A', instructor: 'Giáo viên A', room: '101', registeredStudents: 25, timeSlots: [{ id: '1', available: true }, { id: '2', available: true }] },
    { id: '1-2', code: 'Lớp 1B', instructor: 'Giáo viên B', room: '102', registeredStudents: 30, timeSlots: [{ id: '3', available: true }] },
  ],
  '2': [
    { id: '2-1', code: 'Lớp 2A', instructor: 'Giáo viên C', room: '201', registeredStudents: 0, timeSlots: [{ id: '4', available: false }] },
    { id: '2-2', code: 'Lớp 2B', instructor: 'Giáo viên D', room: '202', registeredStudents: 10, timeSlots: [{ id: '5', available: true }] },
  ],
  '3': [
    { id: '3-1', code: 'Lớp 3A', instructor: 'Giáo viên E', room: '301', registeredStudents: 5, timeSlots: [{ id: '6', available: true }] },
    { id: '3-2', code: 'Lớp 3B', instructor: 'Giáo viên F', room: '302', registeredStudents: 0, timeSlots: [] },
  ],
  '4': [
    { id: '4-1', code: 'Lớp 4A', instructor: 'Giáo viên G', room: '401', registeredStudents: 15, timeSlots: [{ id: '1', available: true }] },
    { id: '4-2', code: 'Lớp 4B', instructor: 'Giáo viên H', room: '402', registeredStudents: 20, timeSlots: [{ id: '2', available: true }] },
  ],
  '5': [
    { id: '5-1', code: 'Lớp 5A', instructor: 'Giáo viên I', room: '501', registeredStudents: 8, timeSlots: [{ id: '3', available: true }] },
    { id: '5-2', code: 'Lớp 5B', instructor: 'Giáo viên J', room: '502', registeredStudents: 0, timeSlots: [] },
  ],
  '6': [
    { id: '6-1', code: 'Lớp 6A', instructor: 'Giáo viên K', room: '601', registeredStudents: 18, timeSlots: [{ id: '4', available: true }] },
    { id: '6-2', code: 'Lớp 6B', instructor: 'Giáo viên L', room: '602', registeredStudents: 25, timeSlots: [{ id: '5', available: true }] },
  ],
};

export default function CourseRegistration() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Thời gian ca học cố định
  const availableTimeSlots = useMemo(() => {
    if (!selectedCourse) return []
    return Array.from({ length: 6 }, (_, index) => ({
      id: (index + 1).toString(),
      time: `Ca ${index + 1}`,
      available: true,
    }))
  }, [selectedCourse])

  const availableClasses = useMemo(() => {
    if (!selectedCourse || !selectedTimeSlot) return []
    // Lọc lớp học theo ca học đã chọn
    return classOptions[selectedCourse].filter(classOption => 
      classOption.timeSlots.some(slot => slot.id === selectedTimeSlot.id && slot.available)
    )
  }, [selectedCourse, selectedTimeSlot])

  const selectCourse = (courseId) => {
    setSelectedCourse(courseId)
    setSelectedTimeSlot(null)
    setSelectedClass(null)
  }

  const selectTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setSelectedClass(null)
  }

  const selectClass = (classId) => {
    setSelectedClass(classId)
  }

  const handleRegister = () => {
    if (selectedCourse && selectedTimeSlot && selectedClass) {
      setShowConfirmation(true)
    } else {
      alert('Vui lòng chọn môn học, ca học và lớp học trước khi đăng ký.')
    }
  }

  const confirmRegistration = () => {
    console.log('Đăng ký thành công:', { course: selectedCourse, timeSlot: selectedTimeSlot, class: selectedClass })
    setShowConfirmation(false)
    // Gửi dữ liệu đăng ký đến backend tại đây
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-100 to-white min-h-screen w-full">
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Đăng ký môn học
            </span>
          </h1>

          {/* Chọn môn học */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chọn môn học</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <button
                  key={course.id}
                  onClick={() => selectCourse(course.id)}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    selectedCourse === course.id
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                  }`}
                >
                  <h3 className="font-bold text-lg">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="inline-flex items-center mr-4">
                      <BookOpen size={16} className="mr-1" /> Mã môn: {course.code}
                    </span>
                    <span className="inline-flex items-center">
                      <Users size={16} className="mr-1" /> Tín chỉ: {course.credits}
                    </span>
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Chọn ca học */}
          {selectedCourse && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Chọn ca học</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {availableTimeSlots.map((slot) => {
                  // Kiểm tra xem ca học có lớp nào khả dụng không
                  const isDisabled = !classOptions[selectedCourse].some(classOption => 
                    classOption.timeSlots.some(timeSlot => timeSlot.id === slot.id && timeSlot.available)
                  );
                  return (
                    <button
                      key={slot.id}
                      onClick={() => !isDisabled && selectTimeSlot(slot)}
                      disabled={isDisabled}
                      className={`w-full h-auto flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                        selectedTimeSlot && selectedTimeSlot.id === slot.id
                          ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                          : isDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                      }`}
                    >
                      <Clock size={24} />
                      <span className="mt-2">{slot.time}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chọn lớp học */}
          {selectedCourse && selectedTimeSlot && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Chọn lớp học</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableClasses.map(classOption => (
                  <button
                    key={classOption.id}
                    onClick={() => selectClass(classOption.id)}
                    className={`p-4 rounded-lg transition-all duration-200 ${
                      selectedClass === classOption.id
                        ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                        : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                    }`}
                  >
                    <h3 className="font-bold text-lg">{classOption.code}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="inline-flex items-center mr-4">
                        <Users size={16} className="mr-1" /> Số sinh viên đã đăng ký: {classOption.registeredStudents}
                      </span>
                      <span className="inline-flex items-center">
                        <Clock size={16} className="mr-1" /> Phòng học: {classOption.room}
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nút đăng ký */}
          <div className="mt-8">
            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {/* Xác nhận đăng ký */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Xác nhận đăng ký</h2>
            <p className="mb-4">Bạn có chắc chắn muốn đăng ký môn học này?</p>
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
