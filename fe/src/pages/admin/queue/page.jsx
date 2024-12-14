import React, { useState } from "react";

const RegisterClass = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/admin/register-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          userId: "12345",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Đăng ký thành công!");
      } else {
        alert(result.error || "Đăng ký thất bại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi kết nối tới server!");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div>
      {/* Nút đăng ký */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Đăng ký
      </button>

      {/* Modal xác nhận */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Xác nhận đăng ký</h2>
            <p className="mb-6">Bạn có chắc chắn muốn đăng ký?</p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleRegister}
                className={`px-4 py-2 rounded text-white ${
                  loading ? "bg-gray-400" : "bg-green-500"
                }`}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterClass;
