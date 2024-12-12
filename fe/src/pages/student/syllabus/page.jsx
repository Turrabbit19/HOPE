'use client'

import { useEffect, useState } from 'react'

export default function Syllabus() {
  const [curriculumData, setCurriculumData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Curriculum')

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
                        <a href="#" className="text-blue-600 hover:underline text-xl">
                          {subject.name}
                        </a>
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
    </div>
  )
}

