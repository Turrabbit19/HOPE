import React from "react";
import { Link } from "react-router-dom";

const AsideClient = () => {
  return (
    <aside className="p-4 bg-gray-100">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <img
          alt="Logo"
          className="mr-2"
          width="200"
          height="40"
          src="https://caodang.fpt.edu.vn/wp-content/uploads/logo-3.png"
        />
      </div>

      {/* Trang chủ */}
      <div className="mb-4">
        <h2 className="mb-2 font-semibold">Trang chủ</h2>
        <nav className="space-y-2">
          <Link
            to="home"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34D399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3"
            >
              <rect width="7" height="9" x="3" y="3" rx="1"></rect>
              <rect width="7" height="5" x="14" y="3" rx="1"></rect>
              <rect width="7" height="9" x="14" y="12" rx="1"></rect>
              <rect width="7" height="5" x="3" y="16" rx="1"></rect>
            </svg>
            Trang chủ
          </Link>
          <Link
            to="statistics-semester"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3"
            >
              <rect x="4" y="4" width="16" height="16" rx="2"></rect>
              <path d="M9 4v16"></path>
              <path d="M15 4v16"></path>
            </svg>
            Thống kê điểm danh
          </Link>
          <Link
            to="notification"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFCC00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
              <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
              <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
              <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
            </svg>
            Thông báo
          </Link>
        </nav>
      </div>

      {/* Lịch học */}
      <div className="mb-4">
        <h2 className="mb-2 font-semibold">Góc học tập</h2>
        <nav className="space-y-2">
          <Link
            to="schedule"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M10 4v4"></path>
              <path d="M2 8h20"></path>
              <path d="M6 4v4"></path>
            </svg>
            Lịch học
          </Link>
          <Link
            to="class-registration"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1D4ED8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3"
            >
              <path d="M3 12h18"></path>
              <path d="M12 3v18"></path>
            </svg>
            Đăng kí lịch học
          </Link>
          <Link
            to="sub-majors"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Đăng kí chuyên nghành hẹp
          </Link>
          <Link
            to="syllabus"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3"
            >
              <rect x="4" y="4" width="16" height="16" rx="2"></rect>
              <path d="M9 4v16"></path>
              <path d="M15 4v16"></path>
            </svg>
            Giáo trình
          </Link>

          <Link
            to="tuition"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-3"
            >
              <path d="M3 12h18"></path>
              <path d="M12 3v18"></path>
            </svg>
            Học phí
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default AsideClient;
