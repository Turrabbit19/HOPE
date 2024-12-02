"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Lightbulb, Users } from 'lucide-react';

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
        <h2 className="text-4xl font-bold mb-6">Chào mừng đến với Hệ thống Giáo dục</h2>
        <p className="text-xl mb-12 text-center">Nơi kiến thức được chia sẻ và phát triển</p>
        <div className="grid grid-cols-3 gap-8 w-full max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white text-blue-600 rounded-full p-4 mb-4">
              <Book size={40} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Học tập</h3>
            <p className="text-sm">Tiếp cận nguồn tài liệu phong phú và đa dạng</p>
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
                  src="/placeholder.svg?height=24&width=24"
                  alt="Google"
                  className="h-5 w-5"
                />
              </button>
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="Facebook"
                  className="h-5 w-5"
                />
              </button>
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <img
                  src="/placeholder.svg?height=24&width=24"
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

