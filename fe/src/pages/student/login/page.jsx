"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Lightbulb, Users } from "lucide-react";

export default function SchoolLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      console.log("Token found in storage:", token);
      redirectToRolePage(role);
    }

    return () => {
      window.removeEventListener("beforeunload", clearToken);
    };
  }, []);



  const redirectToRolePage = (role) => {
    if (role === "Sinh viên") {
      navigate("/student/home");
    } else if (role === "Quản trị viên") {
      navigate("/admin");
    } else if (role === "Giảng viên") {
      navigate("/teacher/home");
    } else {
      navigate("/");
    }
  };

  const handleLogin = async (rememberMe) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.errors
            ? typeof data.errors === "object"
              ? Object.values(data.errors).join(", ")
              : data.errors
            : data.error || "Đăng nhập thất bại";
        setError(errorMessage);
        setShowErrorPopup(true);
        return;
      }

      console.log("Login successful, received token:", data.token);

      // Lưu token vào localStorage tạm thời
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user_id", data.user.id);

      // Nếu không chọn "Ghi nhớ đăng nhập", thêm sự kiện để xóa token khi rời trang
      if (!rememberMe) {
        window.addEventListener("beforeunload", clearToken);
      }

      redirectToRolePage(data.user.role);
    } catch (err) {
      console.error("Error during login:", err);
      setError("Có lỗi xảy ra trong quá trình đăng nhập");
      setShowErrorPopup(true);
    }
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setShowErrorPopup(false);

    const rememberMe = document.getElementById("rememberMe").checked;

    handleLogin(rememberMe);
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-600 to-indigo-800">
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-lg font-bold mb-4">Lỗi Đăng Nhập</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={closeErrorPopup}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Left side - Enhanced Illustration and Text */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white">
        <h2 className="text-4xl font-bold mb-6">
          Chào mừng đến với Hệ thống Giáo dục
        </h2>
        <p className="text-xl mb-12 text-center">
          Nơi kiến thức được chia sẻ và phát triển
        </p>
        <div className="grid grid-cols-3 gap-8 w-full max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white text-blue-600 rounded-full p-4 mb-4">
              <Book size={40} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Học tập</h3>
            <p className="text-sm">
              Tiếp cận nguồn tài liệu phong phú và đa dạng
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-white text-blue-600 rounded-full p-4 mb-4">
              <Lightbulb size={40} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sáng tạo</h3>
            <p className="text-sm">Phát triển ý tưởng và kỹ năng mới</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-white text-blue-600 rounded-full p-4 mb-4">
              <Users size={40} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Kết nối</h3>
            <p className="text-sm">Tương tác với giảng viên và bạn học</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-lg p-12 bg-white rounded-lg shadow-lg mx-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Đăng nhập hệ thống
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8" autoComplete="on">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm hidden">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-lg"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
