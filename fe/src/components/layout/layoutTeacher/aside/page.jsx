import React from "react";
import { Link } from "react-router-dom";

const AsideTeacher = () => {
  return (
    <aside className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 shadow-lg rounded-lg">
      <div className="flex items-center mb-8">
        <img
          alt="Logo"
          className="mr-2"
          width="180"
          height="40"
          src="https://caodang.fpt.edu.vn/wp-content/uploads/logo-3.png"
        />
      </div>
      <div className="mb-6">
        <h2 className="mb-3 text-xl font-bold text-gray-700">Trang chủ</h2>
        <nav className="space-y-3">
          <Link to="home" className="group flex items-center p-3 rounded-lg hover:bg-teal-100 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34D399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3 transition-transform transform group-hover:scale-110"
            >
              <rect width="7" height="9" x="3" y="3" rx="1"></rect>
              <rect width="7" height="5" x="14" y="3" rx="1"></rect>
              <rect width="7" height="9" x="14" y="12" rx="1"></rect>
              <rect width="7" height="5" x="3" y="16" rx="1"></rect>
            </svg>
            <span className="text-gray-800 font-medium group-hover:text-teal-600">
              Trang chủ
            </span>
          </Link>
        </nav>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-xl font-bold text-gray-700">Danh sách lớp học</h2>
        <nav className="space-y-3">
          <Link to="listclasslesson" className="group flex items-center p-3 rounded-lg hover:bg-red-100 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3 transition-transform transform group-hover:rotate-12"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M10 4v4"></path>
              <path d="M2 8h20"></path>
              <path d="M6 4v4"></path>
            </svg>
            <span className="text-gray-800 font-medium group-hover:text-red-600">
              Danh sách lớp học
            </span>
          </Link>

          <Link to="timetable" className="group flex items-center p-3 rounded-lg hover:bg-orange-100 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF9500"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3 transition-transform transform group-hover:translate-x-1"
            >
              <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
              <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
              <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
              <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
            </svg>
            <span className="text-gray-800 font-medium group-hover:text-orange-600">
              Lịch dạy
            </span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default AsideTeacher;
