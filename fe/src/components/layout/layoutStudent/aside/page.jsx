import React from "react";
import { Link } from "react-router-dom";

const AsideClient = () => {
  return (
    <aside className=" p-4 bg-gray-100">
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
        <h2 className="mb-2 text font-semibold">Trang chủ</h2>
        <nav className="space-y-2">
          <Link to="home">
            <a
              href="#"
              className="flex items-center p-2 text text-gray-700 hover:bg-gray-200"
            >
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
                className="w-5 h-5 mr-2"
              >
                <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                <rect width="7" height="5" x="3" y="16" rx="1"></rect>
              </svg>
              Trang chủ
            </a>
          </Link>
          <Link to="notification">
            <a
              href="#"
              className="flex items-center p-2 text text-gray-700 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFCC00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 mr-2"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
              Thông báo
            </a>
          </Link>
        </nav>
      </div>
      <div className="mb-4">
        <h2 className="mb-2 text font-semibold">Lịch học</h2>
        <nav className="space-y-2">
          <Link
            to="schedule"
            className="flex items-center p-2 text text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition duration-300"
          >
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
              className="w-5 h-5 mr-2"
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
            className="flex items-center p-2 text text-gray-700 hover:bg-gray-200"
          >
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
              className="w-5 h-5 mr-2"
            >
              <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
              <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
              <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
              <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
            </svg>
            Đăng kí lịch học
          </Link>

          <Link
            to="sub-majors"
            className="flex items-center p-2 text text-gray-700 hover:bg-gray-200"
          >
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
              className="w-5 h-5 mr-2"
            >
              <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
              <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
              <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
              <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
            </svg>
            Đăng kí chuyên nghành hẹp
          </Link>
          <Link
            to="syllabus"
            className="flex items-center p-2 text text-gray-700 hover:bg-gray-200"
          >
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
              className="w-5 h-5 mr-2"
            >
              <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
              <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
              <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
              <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
            </svg>
            Giáo trình
          </Link>
        </nav>
      </div>
      <div>
        {/* <h2 className="mb-2 text font-semibold">PEOPLES</h2> */}
        <nav className="space-y-2">
          {/* <a
            href="#"
            className="flex items-center p-2 text text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF2D55"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M14 14c-3 0-4 1-4 1v2"></path>
              <path d="M10 10a4 4 0 0 0 2-4"></path>
            </svg>
            User
          </a> */}
          {/* <a
                        href="#"
                        className="flex items-center p-2 text text-gray-700 hover:bg-gray-200"
                    >
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
                            className="w-5 h-5 mr-2"
                        >
                            <path d="M21 4H7l-3 6v2l3 6h14l3-6V10l-3-6Z"></path>
                            <path d="M16 8v4"></path>
                            <path d="M8 8v4"></path>
                        </svg>
                        Users
                    </a> */}
        </nav>
      </div>
    </aside>
  );
};

export default AsideClient;
