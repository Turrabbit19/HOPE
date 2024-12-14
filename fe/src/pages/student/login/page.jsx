"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Lightbulb, Users } from "lucide-react";

export default function SchoolLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        if (data.errors) {
          const errorMessage =
            typeof data.errors === "object"
              ? Object.values(data.errors).join(", ")
              : data.errors;
          setError(errorMessage);
        } else {
          setError(data.error || "Đăng nhập thất bại");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user_id", data.user.id);

      const userRole = data.user.role;

      if (userRole === "Sinh viên") {
        navigate("/student/home");
      } else if (userRole === "Quản trị viên") {
        navigate("/admin");
      } else if (userRole === "Giảng viên") {
        navigate("/teacher/home");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Có lỗi xảy ra trong quá trình đăng nhập");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-600 to-indigo-800">
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-lg"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <img
                  src="data:image/png;base64,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"
                  alt="Google"
                  className="h-5 w-5"
                />
              </button>
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <img
                  src="data:image/png;base64,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"
                  alt="Facebook"
                  className="h-5 w-5"
                />
              </button>
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <img
                  src="data:image/png;base64,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"
                  alt="Twitter"
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
