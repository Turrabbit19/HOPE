// src/config/axios.js
import axios from "axios";

// Tạo một instance của Axios với baseURL
const instance = axios.create({
    baseURL: "http://localhost:8000/api/",
});

// Thêm một interceptor để chèn token vào header Authorization trước khi gửi yêu cầu
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken"); // Lấy token từ localStorage
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // Thêm token vào header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm một interceptor để xử lý lỗi toàn cục (ví dụ: 401 Unauthorized)
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("Interceptor response error:", error.response);
        if (
            error.response &&
            error.response.status === 401 &&
            error.config.url !== "login" // Kiểm tra nếu không phải yêu cầu đến /login
        ) {
            console.log("Unauthorized access detected. Redirecting to /login.");
            localStorage.removeItem("authToken");
            window.location.href = "/login"; // Thay đổi đường dẫn nếu cần
        }
        return Promise.reject(error);
    }
);

export default instance;
