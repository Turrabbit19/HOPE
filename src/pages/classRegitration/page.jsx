'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, Users, Clock, AlertCircle, Link as LinkIcon, CheckCircle } from 'lucide-react'

const SHIFTS = [
  { id: 1, name: 'Ca 1', time: '7:00 - 9:00' },
  { id: 2, name: 'Ca 2', time: '9:15 - 11:15' },
  { id: 3, name: 'Ca 3', time: '11:45 - 13:45' },
  { id: 4, name: 'Ca 4', time: '14:00 - 16:00' },
  { id: 5, name: 'Ca 5', time: '16:15 - 18:15' },
  { id: 6, name: 'Ca 6', time: '18:30 - 20:30' },
]

export default function CourseRegistration() {
  const [subjects, setSubjects] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedShift, setSelectedShift] = useState(null)
  const [selectedClassroom, setSelectedClassroom] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (selectedSubject?.id && selectedShift?.id) {
      console.log('Selected subject and shift:', { 
        subjectId: selectedSubject.id, 
        shiftId: selectedShift.id 
      });
      fetchClassrooms(selectedSubject.id, selectedShift.id)
    }
  }, [selectedSubject, selectedShift])

  useEffect(() => {
    console.log('Classrooms state updated:', classrooms);
  }, [classrooms]);

  const fetchSubjects = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      const response = await fetch('http://127.0.0.1:8000/api/student/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Không thể tải danh sách môn học')
      }

      const data = await response.json()
      console.log('Subjects data received:', data);
      setSubjects(data.data || [])
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách môn học')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClassrooms = async (subjectId, shiftId) => {
    console.log('Fetching classrooms with:', { subjectId, shiftId });
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      const url = `http://127.0.0.1:8000/api/student/subject/${subjectId}/shift/${shiftId}/classrooms`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Không thể tải danh sách lớp học')
      }

      const data = await response.json()
      console.log('Raw classrooms data received:', data);
    
      if (data && data.data && Array.isArray(data.data)) {
        setClassrooms(data.data)
        console.log('Classrooms set:', data.data);
      } else {
        console.error('Unexpected data structure:', data);
        setClassrooms([])
      }
    } catch (err) {
      console.error('Error in fetchClassrooms:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách lớp học')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = () => {
    if (selectedClassroom) {
      setShowConfirmation(true)
    } else {
      alert('Vui lòng chọn một lớp học trước khi đăng ký.')
    }
  }

  const confirmRegistration = async () => {
    if (!selectedClassroom) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Không tìm thấy token xác thực')
      }

      const response = await fetch(`http://localhost:8000/api/student/schedule/${selectedClassroom.id}/register`, {
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
      setSelectedClassroom(null)
      fetchSubjects() 
    } catch (err) {
      alert(err.message || 'Đã xảy ra lỗi trong quá trình đăng ký')
    }
  }

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-100 to-white min-h-screen w-full">
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Đăng ký khóa học
            </span>
          </h1>

          {isLoading && (
            <div className="text-center mt-8">
              <Clock className="animate-spin h-8 w-8 mx-auto text-blue-500" />
              <p className="mt-2">Đang tải...</p>
            </div>
          )}

          {error && (
            <div className="text-center mt-8 text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto" />
              <p className="mt-2">Lỗi: {error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {/* <div className="mb-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold">Debug Info:</h3>
                <p>Selected Subject: {selectedSubject ? JSON.stringify(selectedSubject) : 'None'}</p>
                <p>Selected Shift: {selectedShift ? JSON.stringify(selectedShift) : 'None'}</p>
                <p>Classrooms Count: {classrooms.length}</p>
                <p>Classrooms Data: {JSON.stringify(classrooms)}</p>
              </div> */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => {
                      console.log('Setting selected subject:', subject);
                      setSelectedSubject(subject)
                      setSelectedShift(null)
                      setClassrooms([])
                    }}
                    className={`p-4 rounded-lg transition-all duration-200 relative ${
                      selectedSubject?.id === subject.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                    }`}
                  >
                    <h3 className="font-bold text-lg">{subject.name}</h3>
                    <p className={`text-sm mt-2 ${selectedSubject?.id === subject.id ? 'text-blue-100' : 'text-gray-600'}`}>
                      <span className="inline-flex items-center mr-4">
                        <BookOpen size={16} className="mr-1" /> Mã môn: {subject.code}
                      </span>
                    </p>
                    {selectedSubject?.id === subject.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedSubject && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Chọn ca học</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SHIFTS.map(shift => (
                      <button
                        key={shift.id}
                        onClick={() => {
                          console.log('Setting selected shift:', shift);
                          setSelectedShift(shift);
                          setClassrooms([]);
                        }}
                        className={`p-4 rounded-lg transition-all duration-200 ${
                          selectedShift?.id === shift.id
                            ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                            : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                        }`}
                      >
                        <h3 className="font-bold text-lg">{shift.name}</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          <Clock size={16} className="inline mr-1" /> {shift.time}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {classrooms.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Chọn lớp học</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classrooms.map(classroom => (
                      <button
                        key={classroom.id}
                        onClick={() => setSelectedClassroom(classroom)}
                        className={`p-4 rounded-lg transition-all duration-200 ${
                          selectedClassroom?.id === classroom.id
                            ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                            : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow'
                        }`}
                      >
                        <h3 className="font-bold text-lg">{classroom.classroom}</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          <Users size={16} className="inline mr-1" /> Sĩ số: {classroom.students}/{classroom.max_students}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          <Clock size={16} className="inline mr-1" /> Bắt đầu: {classroom.start_date}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Phòng: {classroom.room}
                        </p>
                        {classroom.link !== "NULL" && (
                          <p className="text-sm text-blue-600 mt-2">
                            <LinkIcon size={16} className="inline mr-1" />
                            <a href={classroom.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Link lớp học
                            </a>
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          Ngày học: {classroom.days_of_week.map(day => `Thứ ${Object.values(day)[0]}`).join(', ')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleRegister}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedClassroom}
                >
                  Đăng ký
                </button>
              </div>
            </>
          )}
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