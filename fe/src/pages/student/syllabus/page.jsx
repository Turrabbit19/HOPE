'use client'

import { useEffect, useState } from 'react'
import { X, Book, Calendar, User, MapPin, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react'

function SubjectDetailsModal({ subject, isOpen, onClose }) {
  if (!isOpen || !subject) return null

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Có mặt':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'Vắng':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <HelpCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{subject.subject.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">Thông tin chung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="flex items-center"><Book className="w-5 h-5 mr-2 text-blue-500" /> <strong>Mã lớp:</strong> {subject.classroom.code}</p>
              <p className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-500" /> <strong>Số tín chỉ:</strong> {subject.subject.credit}</p>
              <p className="flex items-center"><User className="w-5 h-5 mr-2 text-blue-500" /> <strong>Hình thức học:</strong> {subject.subject.form}</p>
            </div>
            <p className="mt-4"><strong>Mô tả:</strong> {subject.subject.description}</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Lịch học</h3>
            {subject.schedule.map((schedule, index) => (
              <div key={index} className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-gray-600" /> <strong>Thời gian:</strong> {schedule.start_date} - {schedule.end_date}</p>
                  <p className="flex items-center"><Clock className="w-5 h-5 mr-2 text-gray-600" /> <strong>Ca học:</strong> {schedule.shift_name}</p>
                  <p className="flex items-center"><User className="w-5 h-5 mr-2 text-gray-600" /> <strong>Giảng viên:</strong> {schedule.teacher_name}</p>
                  <p className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-gray-600" /> <strong>Phòng:</strong> {schedule.room}</p>
                </div>
                <p className="mt-2"><strong>Các ngày trong tuần:</strong> {schedule.days_of_week.map(day => Object.values(day)[0]).join(', ')}</p>
              </div>
            ))}
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 text-green-800">Thống kê điểm danh</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <p><strong>Tổng số buổi:</strong> {subject.statistics.total_lessons}</p>
              <p><strong>Số buổi đã tham gia:</strong> {subject.statistics.attended_lessons}</p>
              <p><strong>Tỷ lệ tham gia:</strong> {subject.statistics.attendance_rate}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{width: subject.statistics.attendance_rate}}
              ></div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Chi tiết các buổi học</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subject.schedule[0].lessons.map((lesson, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-lg">{lesson.name}</strong>
                    {getStatusIcon(lesson.status)}
                  </div>
                  <p className="text-sm text-gray-600">Ngày: {lesson.date}</p>
                  <p className="text-sm text-gray-600">Trạng thái: {lesson.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Syllabus() {
  const [curriculumData, setCurriculumData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Curriculum')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tabs = [
    { id: 'Curriculum', label: 'Curriculum', icon: '📚' },
    { id: 'Overview', label: 'Overview', icon: 'ℹ️' },
    { id: 'PLOs', label: 'PLOs', icon: '🎯' },
    { id: 'PLOMappings', label: 'PLO Mappings', icon: '🔗' },
    { id: 'Subjects', label: 'Subjects', icon: '📑' },
    { id: 'Statistics', label: 'Statistics', icon: '📊' },
  ]

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://127.0.0.1:8000/api/student/syllabus', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch curriculum data')
        }

        const data = await response.json()
        setCurriculumData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCurriculum()
  }, [])

  const fetchSubjectDetails = async (subjectId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://127.0.0.1:8000/api/student/syllabus/${subjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch subject details')
      }

      const data = await response.json()
      setSelectedSubject(data.data)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Error fetching subject details:', err)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl">{error}</div>
  }

  return (
    <div className="container mx-auto p-4 text-base">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b text-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Curriculum Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {curriculumData?.data.map((semester) => (
          <div key={semester.order} className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="bg-blue-50 p-4 flex justify-between items-center">
              <h2 className="font-medium text-3xl">Học kỳ {semester.order}</h2>
              <span className="text-3xl text-gray-600">{semester.subjects.length} môn</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xl">STT</th>
                    <th className="py-3 px-4 text-left text-xl">Môn học</th>
                    <th className="py-3 px-4 text-center text-xl">Tín chỉ</th>
                    <th className="py-3 px-4 text-center text-xl">Hình thức</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.subjects.map((subject, index) => (
                    <tr key={subject.id} className="border-t">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => fetchSubjectDetails(subject.id)}
                          className="text-blue-600 hover:underline text-xl text-left"
                        >
                          {subject.name}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center text-xl">{subject.credit}</td>
                      <td className="py-3 px-4 text-center text-xl">
                        <span className={`${
                          subject.form === 'ONL' ? 'text-green-600' : 'text-red-600'
                        } font-medium`}>
                          {subject.form}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <SubjectDetailsModal
        subject={selectedSubject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

