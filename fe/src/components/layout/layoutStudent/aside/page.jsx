import React from "react";
import { Link, useLocation } from "react-router-dom";

const AsideClient = () => {
  return (
    <aside className="p-6 bg-white shadow-lg h-screen transition-all duration-300 ease-in-out hover:shadow-xl border-r border-black">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img
          alt="Logo"
          className="mr-2 transition-transform duration-300 ease-in-out hover:scale-105"
          width="120"
          height="48"
          src="/public/assets/img/download (10).jpg"
        />
      </div>

      {/* Trang chủ */}
      <div className="mb-6">
        <h2 className="mb-3 font-semibold text-gray-800 text-lg">Trang chủ</h2>
        <nav className="space-y-2">
          <NavLink to="home" icon="dashboard" color="#34D399">
            Trang chủ
          </NavLink>
          <NavLink to="statistics-semester" icon="calendar" color="#F59E0B">
            Thống kê điểm danh
          </NavLink>
          <NavLink to="notification" icon="bell" color="#FFCC00">
            Thông báo
          </NavLink>
        </nav>
      </div>

      {/* Lịch học */}
      <div className="mb-6">
        <h2 className="mb-3 font-semibold text-gray-800 text-lg">Góc học tập</h2>
        <nav className="space-y-2">
          <NavLink to="schedule" icon="calendar" color="#FF3B30">
            Lịch học
          </NavLink>
          <NavLink to="class-registration" icon="plus" color="#1D4ED8">
            Đăng kí lịch học
          </NavLink>
          <NavLink to="sub-majors" icon="book-open" color="#10B981">
            Đăng kí chuyên nghành hẹp
          </NavLink>
          <NavLink to="syllabus" icon="book" color="#F59E0B">
            Giáo trình
          </NavLink>
          <NavLink to="tuition-fee" icon="credit-card" color="#0EA5E9">
            Học phí
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

const NavLink = ({ to, icon, children, color }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center p-2 text-gray-700 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-900 group ${
        isActive ? 'bg-gray-100 text-gray-900' : ''
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={`p-2 rounded-md bg-white shadow-sm group-hover:shadow-md transition-all duration-200 ease-in-out mr-3 ${
        isActive ? 'shadow-md' : ''
      }`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ease-in-out ${
            isActive ? 'scale-110' : 'group-hover:scale-110'
          }`}
        >
          {getIcon(icon)}
        </svg>
      </span>
      <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{children}</span>
    </Link>
  );
};

const getIcon = (icon) => {
  switch (icon) {
    case "dashboard":
      return <><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></>;
    case "calendar":
      return <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></>;
    case "bell":
      return <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></>;
    case "plus":
      return <><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></>;
    case "book-open":
      return <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></>;
    case "book":
      return <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></>;
    case "credit-card":
      return <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></>;
    default:
      return null;
  }
};

export default AsideClient;

