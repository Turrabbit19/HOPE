'use client'

import React, { useState, useMemo } from 'react'
import { BookOpen, Users, Clock, CheckCircle } from 'lucide-react'

const courses = [
  { id: '1', name: 'Nhập môn lập trình', code: 'NMLT', credits: 4 },
  { id: '2', name: 'Lập trình PHP 3', code: 'LTPHP3', credits: 3 },
  { id: '3', name: 'Lập trình PHP 2', code: 'LTPHP2', credits: 3 },
]

const classOptions = {
  '1': [
    { id: '1', code: 'NMLT.01', instructor: 'khanhpq01', timeSlots: [
      { day: '2', time: '7:00 - 9:00', available: false },
      { day: '3', time: '7:00 - 9:00', available: true },
      { day: '4', time: '7:00 - 9:00', available: false },
      { day: '5', time: '7:00 - 9:00', available: true },
      { day: '6', time: '7:00 - 9:00', available: false },
      { day: '7', time: '7:00 - 9:00', available: true },
    ]},
    { id: '2', code: 'NMLT.02', instructor: 'baovv04', timeSlots: [
      { day: '2', time: '9:00 - 11:00', available: true },
      { day: '3', time: '9:00 - 11:00', available: true },
      { day: '4', time: '9:00 - 11:00', available: false },
      { day: '5', time: '9:00 - 11:00', available: true },
      { day: '6', time: '9:00 - 11:00', available: true },
      { day: '7', time: '9:00 - 11:00', available: false },
    ]},
    { id: '5', code: 'NMLT.03', instructor: 'minhhn', timeSlots: [
      { day: '2', time: '13:00 - 15:00', available: true },
      { day: '3', time: '13:00 - 15:00', available: false },
      { day: '4', time: '13:00 - 15:00', available: true },
      { day: '5', time: '13:00 - 15:00', available: false },
      { day: '6', time: '13:00 - 15:00', available: true },
      { day: '7', time: '13:00 - 15:00', available: false },
    ]},
  ],
  '2': [
    { id: '3', code: 'LTPHP3.01', instructor: 'thuannn', timeSlots: [
      { day: '2', time: '13:00 - 15:00', available: true },
      { day: '3', time: '13:00 - 15:00', available: false },
      { day: '4', time: '13:00 - 15:00', available: true },
      { day: '5', time: '13:00 - 15:00', available: false },
      { day: '6', time: '13:00 - 15:00', available: true },
      { day: '7', time: '13:00 - 15:00', available: false },
    ]},
    { id: '6', code: 'LTPHP3.02', instructor: 'hoangtv', timeSlots: [
      { day: '2', time: '15:00 - 17:00', available: true },
      { day: '3', time: '15:00 - 17:00', available: true },
      { day: '4', time: '15:00 - 17:00', available: false },
      { day: '5', time: '15:00 - 17:00', available: true },
      { day: '6', time: '15:00 - 17:00', available: false },
      { day: '7', time: '15:00 - 17:00', available: true },
    ]},
  ],
  '3': [
    { id: '4', code: 'LTPHP2.01', instructor: 'ducnv', timeSlots: [
      { day: '2', time: '9:00 - 11:00', available: true },
      { day: '3', time: '9:00 - 11:00', available: true },
      { day: '4', time: '9:00 - 11:00', available: false },
      { day: '5', time: '9:00 - 11:00', available: true },
      { day: '6', time: '9:00 - 11:00', available: false },
      { day: '7', time: '9:00 - 11:00', available: true },
    ]},
    { id: '7', code: 'LTPHP2.02', instructor: 'anhhn', timeSlots: [
      { day: '2', time: '10:00 - 12:00', available: false },
      { day: '3', time: '10:00 - 12:00', available: true },
      { day: '4', time: '10:00 - 12:00', available: true },
      { day: '5', time: '10:00 - 12:00', available: false },
      { day: '6', time: '10:00 - 12:00', available: true },
      { day: '7', time: '10:00 - 12:00', available: false },
    ]},
  ],
  '4': [
    { id: '8', code: 'HTPT.01', instructor: 'sonnt', timeSlots: [
      { day: '2', time: '14:00 - 16:00', available: true },
      { day: '3', time: '14:00 - 16:00', available: false },
      { day: '4', time: '14:00 - 16:00', available: true },
      { day: '5', time: '14:00 - 16:00', available: false },
      { day: '6', time: '14:00 - 16:00', available: true },
      { day: '7', time: '14:00 - 16:00', available: false },
    ]},
  ],
};


export default function CourseRegistration() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const availableTimeSlots = useMemo(() => {
    if (!selectedCourse) return []
    const allTimeSlots = classOptions[selectedCourse].flatMap(classOption => 
      classOption.timeSlots.map((slot, index) => ({
        ...slot,
        id: `${classOption.id}-${index}`,
        classId: classOption.id
      }))
    )
    return allTimeSlots.filter((slot, index, self) => 
      index === self.findIndex(t => t.day === slot.day && t.time === slot.time && t.available)
    )
  }, [selectedCourse])

  const availableClasses = useMemo(() => {
    if (!selectedCourse || !selectedTimeSlot) return []
    return classOptions[selectedCourse].filter(classOption => 
      classOption.timeSlots.some(slot => 
        slot.day === selectedTimeSlot.day && 
        slot.time === selectedTimeSlot.time && 
        slot.available
      )
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
    // Here you would typically send the registration data to your backend
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
          
          {/* Course Selection */}
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

          {/* Time Slot Selection */}
          {selectedCourse && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Chọn ca học</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {availableTimeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => selectTimeSlot(slot)}
                    className={`w-full h-auto flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                      selectedTimeSlot && selectedTimeSlot.day === slot.day && selectedTimeSlot.time === slot.time
                        ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                        : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                    }`}
                  >
                    <div className="font-medium text-lg">Thứ {slot.day}</div>
                    <div className="text-sm flex items-center mt-1">
                      <Clock size={14} className="mr-1" />
                      {slot.time}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Class Selection */}
          {selectedTimeSlot && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Chọn lớp học</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableClasses.map((classOption) => (
                  <button
                    key={classOption.id}
                    onClick={() => selectClass(classOption.id)}
                    className={`p-4 rounded-lg transition-all duration-200 ${
                      selectedClass === classOption.id
                        ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                        : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                    }`}
                  >
                    <div className="font-medium text-lg">{classOption.code}</div>
                    <div className="text-sm text-gray-600 mt-1">{classOption.instructor}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Register Button */}
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleRegister}
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Xác nhận đăng ký</h2>
            <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn đăng ký lớp này không?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmRegistration}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
              >
                <CheckCircle size={18} className="mr-2" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}