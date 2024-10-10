import React from 'react';

export default function StudentDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-xl font-semibold mb-4 bg-white sticky top-0 z-10 p-4">Trang chủ</h1>
      {/* Thông tin sinh viên */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Thông tin sinh viên</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Mã SV:</strong> PH44354</p>
              <p><strong>Họ và tên:</strong> Trần Đức Khang</p>
              <p><strong>Ngày sinh:</strong> 19/09/2004</p>
              <p><strong>Giới tính:</strong> Nam</p>
              <p><strong>Email:</strong> Khangtdph44354@fpt.edu.vn</p>
            </div>
            <div>
              <p><strong>Số điện thoại:</strong> 0386598511</p>
              <p><strong>Địa chỉ:</strong> 2/235 Lê Hồng Phong, Vĩ Hoàng, TP Nam Định, Nam Định</p>
              <p><strong>Dân tộc:</strong> Kinh</p>
              <p><strong>Trạng thái học:</strong> Đang học</p>
            </div>
          </div>
        </div>

        {/* Nhắc nhở */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">TĐK</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">Nhắc nhở mới chưa xem</h3>
                <div className="flex items-center mt-2">
                  <span className="text-4xl font-bold mr-2">1</span>
                </div>
                <button className="text-blue-500 underline hover:text-blue-700 transition duration-200">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Lịch học và lịch thi */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition duration-300">
              <h3 className="font-semibold">Lịch học trong tuần</h3>
              <div className="flex items-center mt-2">
                <span className="text-4xl font-bold mr-2">0</span>
              </div>
              <button className="text-blue-500 underline hover:text-blue-700 transition duration-200">
                Xem chi tiết
              </button>
            </div>
            <div className="bg-orange-100 p-6 rounded-lg shadow-md hover:bg-orange-200 transition duration-300">
              <h3 className="font-semibold">Lịch thi trong tuần</h3>
              <div className="flex items-center mt-2">
                <span className="text-4xl font-bold mr-2">0</span>
              </div>
              <button className="text-blue-500 underline hover:text-blue-700 transition duration-200">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin khóa học */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Thông tin khóa học</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p><strong>Ngành:</strong> Lập trình Web</p>
          </div>
          <div>
            <p><strong>Bậc đào tạo:</strong> Cao đẳng (2,5 năm)</p>
          </div>
          <div>
            <p><strong>Niên khóa:</strong> K18.3</p>
          </div>
        </div>
      </div>

      {/* Điểm danh */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Điểm danh</h2>
          <select className="border rounded p-2 focus:ring focus:border-blue-300">
            <option value="fall2024">Học kỳ Fall 2024</option>
          </select>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Tên môn học</th>
              <th className="p-2 border">Quá trình</th>
              <th className="p-2 border">Điểm danh</th>
              <th className="p-2 border">Vắng</th>
              <th className="p-2 border">Còn</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="p-2 border">Lập trình PHP3</td>
              <td className="p-2 border">-</td>
              <td className="p-2 border">10</td>
              <td className="p-2 border">2</td>
              <td className="p-2 border">5</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-2 border">Khởi sự doanh nghiệp</td>
              <td className="p-2 border">-</td>
              <td className="p-2 border">11</td>
              <td className="p-2 border">3</td>
              <td className="p-2 border">3</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-2 border">JS nâng cao</td>
              <td className="p-2 border">-</td>
              <td className="p-2 border">13</td>
              <td className="p-2 border">0</td>
              <td className="p-2 border">4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
