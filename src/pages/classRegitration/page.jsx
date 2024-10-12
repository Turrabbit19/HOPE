import React, { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, Users, Clock } from 'lucide-react'

const courses = [
  { id: '1', name: 'Nhập môn lập trình', code: 'NMLT', credits: 4 },
  { id: '2', name: 'Lập trình PHP 3', code: 'LTPHP3', credits: 3 },
  { id: '3', name: 'Lập trình PHP 2', code: 'LTPHP2', credits: 3 },
]

const classOptions = {
  '1': [
    { id: '1', code: 'NMLT.01', enrollment: '40/40', instructor: 'khanhpq01', days: '2,4,6', time: '7:00 - 9:00', status: 'Hết chỗ' },
    { id: '2', code: 'NMLT.02', enrollment: '30/40', instructor: 'baovv04', days: '3,5,7', time: '9:00 - 11:00', status: 'Còn chỗ' },
    { id: '3', code: 'NMLT.03', enrollment: '32/40', instructor: 'khangtd01', days: '2,4,6', time: '12:00 - 14:00', status: 'Còn chỗ' },
  ],
  '2': [
    { id: '4', code: 'LTPHP3.01', enrollment: '35/40', instructor: 'thuannn', days: '2,4,6', time: '13:00 - 15:00', status: 'Còn chỗ' },
    { id: '5', code: 'LTPHP3.02', enrollment: '38/40', instructor: 'hoanglm', days: '3,5,7', time: '15:00 - 17:00', status: 'Còn chỗ' },
  ],
  '3': [
    { id: '6', code: 'LTPHP2.01', enrollment: '33/40', instructor: 'ducnv', days: '2,4,6', time: '9:00 - 11:00', status: 'Còn chỗ' },
    { id: '7', code: 'LTPHP2.02', enrollment: '40/40', instructor: 'thanhnt', days: '3,5,7', time: '13:00 - 15:00', status: 'Hết chỗ' },
  ],
}

export default function ScheduleRegistration() {
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [selectedClasses, setSelectedClasses] = useState([])

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }

  const toggleClassSelection = (classId) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    )
  }

  const getRandomColor = () => {
    const colors = ['bg-pink-100', 'bg-100', 'bg-indigo-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-100 to-pink-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-800 drop-shadow-lg">Đăng ký môn học</h1>
      <div className="space-y-6">
        {courses.map(course => (
          <div key={course.id} className="border-2 border-300 rounded-xl overflow-hidden shadow-lg">
            <div 
              className={`p-4 flex justify-between items-center cursor-pointer transition-colors duration-300 ${expandedCourse === course.id ? 'bg-200' : 'bg-white hover:bg-100'}`}
              onClick={() => toggleCourse(course.id)}
            >
              <div>
                <h2 className="text-xl font-semibold text-800">{course.name}</h2>
                <p className="text-sm text-600">
                  <span className="inline-flex items-center mr-4"><BookOpen size={16} className="mr-1" /> Mã môn: {course.code}</span>
                  <span className="inline-flex items-center"><Users size={16} className="mr-1" /> Tín chỉ: {course.credits}</span>
                </p>
              </div>
              {expandedCourse === course.id ? <ChevronUp className="text-800" /> : <ChevronDown className="text-800" />}
            </div>
            {expandedCourse === course.id && (
              <div className="p-4 bg-white">
                <h3 className="font-semibold mb-4 text-lg text-800">Chọn lớp học</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-200">
                        <th className="p-2 text-left text-800">STT</th>
                        <th className="p-2 text-left text-800">Lớp học</th>
                        <th className="p-2 text-left text-800">Số lượng</th>
                        <th className="p-2 text-left text-800">Giảng viên</th>
                        <th className="p-2 text-left text-800">Thứ</th>
                        <th className="p-2 text-left text-800">Ca học</th>
                        <th className="p-2 text-left text-800">Thời gian</th>
                        <th className="p-2 text-left text-800">Trạng thái</th>
                        <th className="p-2 text-left text-800">Chọn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classOptions[course.id].map((option, index) => (
                        <tr key={option.id} className={`${getRandomColor()} transition-colors duration-300 hover:bg-200`}>
                          <td className="p-2 text-800">{index + 1}</td>
                          <td className="p-2 text-800 font-medium">{option.code}</td>
                          <td className="p-2 text-800">{option.enrollment}</td>
                          <td className="p-2 text-800">{option.instructor}</td>
                          <td className="p-2 text-800">{option.days}</td>
                          <td className="p-2 text-800">{index + 1}</td>
                          <td className="p-2 text-800">
                            <span className="inline-flex items-center">
                              <Clock size={16} className="mr-1" />
                              {option.time}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${option.status === 'Còn chỗ' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                              {option.status}
                            </span>
                          </td>
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={selectedClasses.includes(option.id)}
                              onChange={() => toggleClassSelection(option.id)}
                              disabled={option.status === 'Hết chỗ'}
                              className="form-checkbox h-5 w-5 text-600 rounded focus:ring-500 border-300"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button 
          className="bg-600 hover:bg-700 text-black font-bold py-2 px-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
          onClick={() => console.log('Đăng ký clicked')}
        >
          Đăng ký
        </button>
      </div>
    </div>
  )
}