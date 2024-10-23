'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, Users, Clock, CheckCircle } from 'lucide-react'

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
  ],
}

export default function CourseRegistration() {
  const [expandedCourses, setExpandedCourses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const toggleCourse = (courseId) => {
    setExpandedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
    setSelectedClass(null)
    setSelectedTimeSlot(null)
  }

  const selectClass = (classId) => {
    setSelectedClass(classId)
    setSelectedTimeSlot(null)
  }

  const selectTimeSlot = (slotId) => {
    setSelectedTimeSlot(slotId)
  }

  const handleRegister = () => {
    if (selectedClass && selectedTimeSlot) {
      setShowConfirmation(true)
    } else {
      alert('Vui lòng chọn lớp học và ca học trước khi đăng ký.')
    }
  }

  const confirmRegistration = () => {
    console.log('Đăng ký thành công:', { class: selectedClass, timeSlot: selectedTimeSlot })
    setShowConfirmation(false)
    // Here you would typically send the registration data to your backend
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-100 to-white mx-auto w-full max-w-full">
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="mx-auto w-full max-w-full">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Đăng ký môn học
            </span>
          </h1>
          <div className="space-y-8">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl w-full">
                <div 
                  className={`p-6 cursor-pointer transition-colors duration-300 ${expandedCourses.includes(course.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{course.name}</h2>
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="inline-flex items-center mr-4"><BookOpen size={16} className="mr-1" /> Mã môn: {course.code}</span>
                        <span className="inline-flex items-center"><Users size={16} className="mr-1" /> Tín chỉ: {course.credits}</span>
                      </p>
                    </div>
                    {expandedCourses.includes(course.id) ? <ChevronUp className="text-gray-400" size={24} /> : <ChevronDown className="text-gray-400" size={24} />}
                  </div>
                </div>
                {expandedCourses.includes(course.id) && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h3 className="font-semibold mb-4 text-lg text-gray-800">Chọn lớp học</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classOptions[course.id].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => selectClass(option.id)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${selectedClass === option.id ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500' : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'}`}
                        >
                          <div className="font-medium text-lg">{option.code}</div>
                          <div className="text-sm text-gray-600 mt-1">{option.instructor}</div>
                        </button>
                      ))}
                    </div>
                    {selectedClass && (
                      <div className="mt-8">
                        <h4 className="font-semibold mb-4 text-lg text-gray-800">Chọn ca học</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          {classOptions[course.id]
                            .find(c => c.id === selectedClass).timeSlots
                            .map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => selectTimeSlot(`${selectedClass}-${index}`)}
                                disabled={!slot.available}
                                className={`w-full h-auto flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${selectedTimeSlot === `${selectedClass}-${index}` ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500' : slot.available ? 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                              >
                                <div className="font-medium text-lg">Thứ {slot.day}</div>
                                <div className="text-sm flex items-center mt-1">
                                  <Clock size={14} className="mr-1" />
                                  {slot.time}
                                </div>
                                <span className={`mt-2 text-xs px-2 py-1 rounded-full ${slot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {slot.available ? "Còn chỗ" : "Hết chỗ"}
                                </span>
                              </button>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
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