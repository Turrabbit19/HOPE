'use client'

import { useState, useEffect } from 'react'

export default function SchoolLogin() {
  const [isStudent, setIsStudent] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
      <div className={`bg-white p-8 rounded-lg shadow-2xl w-96 max-w-md transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className={`w-20 h-20 bg-blue-500 rounded-full overflow-hidden transform transition-all duration-700 ${isLoaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'}`}>
              {/* Placeholder for logo */}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Trường Đại học XYZ</h1>
          <p className="text-gray-600">Hệ thống đăng nhập</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-md p-1 relative overflow-hidden">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 relative overflow-hidden ${
              isStudent ? 'text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setIsStudent(true)}
          >
            <span className="relative z-10">Sinh viên</span>
            {isStudent && (
              <span className="absolute inset-0 bg-blue-500 animate-ripple"></span>
            )}
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 relative overflow-hidden ${
              !isStudent ? 'text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setIsStudent(false)}
          >
            <span className="relative z-10">Giảng viên</span>
            {!isStudent && (
              <span className="absolute inset-0 bg-blue-500 animate-ripple"></span>
            )}
          </button>
        </div>

        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
              {isStudent ? 'Mã số sinh viên' : 'Mã số giảng viên'}
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform focus:scale-105"
              placeholder={isStudent ? 'Nhập mã số sinh viên' : 'Nhập mã số giảng viên'}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform focus:scale-105"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 hover:shadow-lg"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline hover:text-blue-700 transition-colors duration-300">
            Quên mật khẩu?
          </a>
        </div>
      </div>
      <footer className="mt-8 text-center text-white text-sm">
        <p>&copy; 2024 Trường Đại học XYZ. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  )
}