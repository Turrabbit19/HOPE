'use client'

import React, { useState, useEffect } from 'react'
import { Search, Book, X, ChevronRight, Loader2, GraduationCap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function SubMajorsList() {
    const [subMajors, setSubMajors] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubMajor, setSelectedSubMajor] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
    const [registrationStatus, setRegistrationStatus] = useState(null)
    const [registeredSubMajors, setRegisteredSubMajors] = useState([])
    const [isEligible, setIsEligible] = useState(true)

    const fetchSubMajors = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('No token found. Please log in again.')
            }

            const response = await fetch('http://127.0.0.1:8000/api/student/sub-majors', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                if (response.status === 403) {
                    const data = await response.json()
                    setError(data.message || 'Không thể truy cập danh sách chuyên ngành hẹp')
                    setSubMajors([])
                    setIsEligible(false)
                    setIsLoading(false)
                    return
                }
                throw new Error('Failed to fetch sub-majors. Please check your network connection.')
            }

            const data = await response.json()
            setSubMajors(data.data)
            setIsEligible(true)
        } catch (err) {
            setError(err.message)
            console.error('Error fetching sub-majors:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSubMajors()
    }, [])

    const filteredSubMajors = subMajors.filter(subMajor =>
        subMajor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subMajor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subMajor.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSubMajorClick = (subMajor) => {
        setSelectedSubMajor(subMajor)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        if (!registeredSubMajors.includes(selectedSubMajor.id)) {
            setRegistrationStatus(null)
        }
        setTimeout(() => setSelectedSubMajor(null), 300)
    }

    const handleRegister = () => {
        setIsConfirmationOpen(true)
    }

    const confirmRegistration = async () => {
        setIsConfirmationOpen(false)
        setRegistrationStatus('loading')

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('No token found. Please log in again.')
            }

            const response = await fetch(`http://127.0.0.1:8000/api/student/sub-majors/${selectedSubMajor.id}/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Your session has expired. Please log in again.')
                }
                throw new Error('Failed to register for sub-major. Please try again later.')
            }

            setRegistrationStatus('success')
            setRegisteredSubMajors(prev => [...prev, selectedSubMajor.id])

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (err) {
            setRegistrationStatus('error')
            console.error('Registration error:', err)
        }
    }

    const getRandomColor = () => {
        const colors = ['bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500']
        return colors[Math.floor(Math.random() * colors.length)]
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
                <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
                <p className="mt-6 text-2xl font-semibold text-blue-800 animate-pulse">Đang tải dữ liệu...</p>
            </div>
        )
    }

    if (error && error !== 'Bạn đã đăng kí chuyên nghành hẹp rồi') {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 to-pink-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center">
                    <AlertCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4 text-green-600">Thông báo</h2>
                    <p className="text-xl mb-6 text-gray-700">{error}</p>
                    {/* <button
                        onClick={fetchSubMajors}
                        className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                        <RefreshCw className="mr-2" size={20} />
                        Thử lại
                    </button> */}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-8xl mx-auto">
                <h1 className="text-5xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">
                    Danh sách chuyên ngành hẹp
                </h1>

                <div className="mb-12 relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, tên hoặc mô tả..."
                        className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                        <Search className="text-purple-500" size={28} />
                    </div>
                </div>

                {!isEligible && (
                    <div className="flex justify-center items-center">
                        <div className="w-full max-w-5xl mt-8 text-center bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 border-l-4 border-yellow-500 p-8 rounded-lg shadow-lg animate-fade-in">
                            <div className="flex items-center justify-center space-x-4">
                                <AlertCircle className="w-10 h-10 text-yellow-600" />
                                <p className="text-yellow-700 font-semibold text-lg">
                                    {error || 'Chưa đến kỳ đăng ký chuyên ngành hẹp'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center">
                        <div className="w-full max-w-5xl mt-8 text-center bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 border-l-4 border-yellow-500 p-8 rounded-lg shadow-lg animate-fade-in">
                            <div className="flex items-center justify-center space-x-4">
                                <AlertCircle className="w-10 h-10 text-yellow-600" />
                                <p className="text-yellow-700 font-semibold text-lg">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredSubMajors.map((subMajor) => (
                            <div
                                key={subMajor.id}
                                className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                                onClick={() => handleSubMajorClick(subMajor)}
                            >
                                <div className={`${getRandomColor()} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                                    <GraduationCap size={32} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3 text-gray-800">{subMajor.name}</h2>
                                <p className="text-sm font-medium text-purple-600 mb-3">Mã: {subMajor.code}</p>
                                <p className="text-gray-600 line-clamp-3 mb-4">{subMajor.description}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Book size={16} className="mr-1 text-blue-500" />
                                        {subMajor.courses ? subMajor.courses.length : 'N/A'} môn học
                                    </span>
                                    <ChevronRight size={20} className="text-purple-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredSubMajors.length === 0 && !error && (
                    <div className="text-center mt-16 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                        <p className="text-3xl font-bold mb-4 text-purple-600">Không tìm thấy kết quả phù hợp</p>
                        <p className="text-xl text-gray-600">Vui lòng thử lại với từ khóa khác</p>
                    </div>
                )}

                {error === 'Bạn đã đăng kí chuyên nghành hẹp rồi' && (
                    <div className="flex justify-center items-center ">
                        <div className="w-full max-w-5xl mt-8 text-center bg-gradient-to-r from-green-200 via-green-100 to-green-200 border-l-4 border-green-500 p-8 rounded-lg shadow-lg animate-fade-in">
                            <div className="flex items-center justify-center space-x-4">
                                <svg
                                    className="w-10 h-10 text-green-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5 6a9 9 0 11-6-15.874A9 9 0 0114 21.016V21.01z"
                                    />
                                </svg>
                                <p className="text-green-700 font-semibold text-lg">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>

                )}


                {isModalOpen && selectedSubMajor && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                        <div
                            className={`bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{selectedSubMajor.name}</h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                                    <X size={32} />
                                </button>
                            </div>
                            <p className="text-xl text-purple-600 font-semibold mb-4">Mã: {selectedSubMajor.code}</p>
                            <p className="text-gray-700 mb-8 text-lg leading-relaxed">{selectedSubMajor.description}</p>
                            <h3 className="text-2xl font-bold mb-6 text-blue-600">Danh sách môn học</h3>
                            <ul className="space-y-4 mb-8">
                                {selectedSubMajor.courses && selectedSubMajor.courses.length > 0 ? (
                                    selectedSubMajor.courses.map((course, index) => (
                                        <li key={index} className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-xl shadow-md">
                                            <div className="flex items-center">
                                                <Book size={24} className="text-purple-500 mr-4" />
                                                <div>
                                                    <p className="font-semibold text-lg text-gray-800">{course.name}</p>
                                                    <p className="text-sm text-gray-600">Mã: {course.code} | Số tín chỉ: {course.credits}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 italic text-center text-lg">Chưa có thông tin về các môn học</li>
                                )}
                            </ul>
                            {registeredSubMajors.includes(selectedSubMajor.id) ? (
                                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
                                    <div className="flex items-center">
                                        <CheckCircle className="mr-2" />
                                        <p className="font-semibold">Bạn đã đăng ký thành công chuyên ngành hẹp này!</p>
                                    </div>
                                </div>
                            ) : registrationStatus === 'success' ? (
                                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
                                    <div className="flex items-center">
                                        <CheckCircle className="mr-2" />
                                        <p className="font-semibold">Đăng ký thành công!</p>
                                    </div>
                                </div>
                            ) : registrationStatus === 'error' ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                                    <div className="flex items-center">
                                        <AlertCircle className="mr-2" />
                                        <p className="font-semibold">Đăng ký thất bại. Vui lòng thử lại sau.</p>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleRegister}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 rounded-full text-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                                >
                                    {registrationStatus === 'loading' ? (
                                        <Loader2 className="animate-spin mx-auto" size={24} />
                                    ) : (
                                        'Đăng ký chuyên ngành'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {isConfirmationOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Xác nhận đăng ký</h3>
                            <p className="text-lg text-gray-600 mb-6">
                                Bạn có chắc chắn muốn đăng ký chuyên ngành {selectedSubMajor.name}?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setIsConfirmationOpen(false)}
                                    className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition-colors duration-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmRegistration}
                                    className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

