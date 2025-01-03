import React from "react";
import { Link } from "react-router-dom";

const AsideTeacher = () => {
  return (
    <aside className="p-4 bg-gray-100">

      <div className="flex items-center mb-6">
        <img
          alt="Logo"
          className="mr-2"
          width="200"
          height="40"
          src="https://caodang.fpt.edu.vn/wp-content/uploads/logo-3.png"
        />
      </div>
      <div className="mb-4">
        <h2 className="mb-2 font-semibold">Trang chủ</h2>
        <nav className="space-y-3">
          <Link to="home" className="flex items-center p-2 text-gray-700 hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-3 text-teal-500 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
        <h2 className="mb-2 font-semibold">Danh sách lớp học & điểm danh</h2>
        <nav className="space-y-3">
          <Link to="listclasslesson" className="flex items-center p-2 text-gray-700 hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-3 text-red-500 transition-transform transform group-hover:rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

          <Link to="timetable" className="flex items-center p-2 text-gray-700 hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-3 text-orange-500 transition-transform transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

