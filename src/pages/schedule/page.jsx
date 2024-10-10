// DashboardActions.jsx
import React from 'react';
import ProductCard from './ProductCard';

const DashboardActions = () => {
    return (
        
        <div className="max-h-[500px] overflow-y-auto"> {/* Thiết lập chiều cao tối đa và cuộn dọc cho div */}
         <h1 className="text-xl font-semibold mb-4 bg-white sticky top-0 z-10 p-4">Time Table</h1>
            <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 sticky top-[56px] z-10">
                    <tr>
                        <th className="border border-gray-300 p-2">Ca học</th>
                        <th className="border border-gray-300 p-2">Thứ Hai</th>
                        <th className="border border-gray-300 p-2">Thứ Ba</th>
                        <th className="border border-gray-300 p-2">Thứ Tư</th>
                        <th className="border border-gray-300 p-2">Thứ Năm</th>
                        <th className="border border-gray-300 p-2">Thứ Sáu</th>
                        <th className="border border-gray-300 p-2">Thứ Bảy</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Monday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Tuesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Wednesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Thursday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Friday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Saturday" /></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">2</td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Monday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Tuesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Wednesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Thursday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Friday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Saturday" /></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">3</td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Monday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Tuesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Wednesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Thursday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Friday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Saturday" /></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">4</td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Monday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Tuesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Wednesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Thursday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Friday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Saturday" /></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">5</td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Monday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Tuesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Wednesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Thursday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Friday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Saturday" /></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">6</td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Monday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Tuesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Wednesday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Thursday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Friday" /></td>
                        <td className="border border-gray-300 p-2"><ProductCard day="Saturday" /></td>
                    </tr>
                    {/* Thêm các hàng khác cho các ca học khác ở đây nếu cần */}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardActions;
