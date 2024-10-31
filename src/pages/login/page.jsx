'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SchoolLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Kiểm tra nếu người dùng đã đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting login with email:', email);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (!response.ok) {
            if (data.errors) {
                const errorMessage = typeof data.errors === 'object'
                    ? Object.values(data.errors).join(', ')
                    : data.errors;
                setError(errorMessage);
            } else {
                setError(data.error || 'Đăng nhập thất bại');
            }
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);

        const userRole = data.user.role;
        console.log('User role:', userRole);

        if (userRole === 'Sinh viên') {
          navigate('/home'); // Điều hướng đến trang sinh viên
      } else {
          navigate('/'); // Điều hướng đến trang khác nếu là vai trò khác
      }
    } catch (err) {
        console.error('Error during login:', err);
        setError('Có lỗi xảy ra trong quá trình đăng nhập');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 max-w-md transform transition-all duration-700">
        <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">Đăng nhập</h1>
        {error && <p className="text-red-500 mb-4 text-center">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
}
