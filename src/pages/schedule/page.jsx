import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { addWeeks, subWeeks, format, startOfWeek, endOfWeek } from 'date-fns';

const DashboardActions = () => {
    const [currentWeek, setCurrentWeek] = useState(() => {
        const date = new Date();
        return isNaN(date) ? new Date() : date; // Đảm bảo giá trị là hợp lệ
    });
    const [selectedDay, setSelectedDay] = useState('');

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const handleNextWeek = () => {
        setCurrentWeek(prevWeek => {
            const nextWeek = addWeeks(prevWeek, 1);
            return isNaN(nextWeek) ? prevWeek : nextWeek; // Kiểm tra giá trị hợp lệ
        });
    };

    const handlePreviousWeek = () => {
        setCurrentWeek(prevWeek => {
            const previousWeek = subWeeks(prevWeek, 1);
            return isNaN(previousWeek) ? prevWeek : previousWeek; // Kiểm tra giá trị hợp lệ
        });
    };

    const handleGoToCurrentWeek = () => {
        setCurrentWeek(new Date());
    };

    const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(currentWeek, { weekStartsOn: 1 });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <button onClick={handlePreviousWeek} className="p-2 bg-gray-300 rounded">{'<'}</button>
                    <button onClick={handleGoToCurrentWeek} className="p-2 bg-blue-300 rounded">Tuần hiện tại</button>
                    <button onClick={handleNextWeek} className="p-2 bg-gray-300 rounded">{'>'}</button>
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="dayFilter" className="mr-2">Lọc theo ngày:</label>
                    <select
                        id="dayFilter"
                        value={selectedDay}
                        onChange={handleDayChange}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Tất cả</option>
                        {daysOfWeek.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="text-center mb-4">
                <strong>Tuần:</strong> {format(startOfCurrentWeek, 'dd/MM/yyyy')} - {format(endOfCurrentWeek, 'dd/MM/yyyy')}
            </div>

            <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 p-2">Ca học</th>
                        {daysOfWeek.map((day, index) => (
                            <th key={index} className="border border-gray-300 p-2">
                                {index === 6 ? 'Chủ Nhật' : `Thứ ${index + 2}`} ({format(addWeeks(startOfCurrentWeek, index), 'dd/MM')})
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3, 4, 5, 6].map(shift => (
                        <tr key={shift} className="odd:bg-gray-50 even:bg-white">
                            <td className="border border-gray-300 p-2">{`Ca ${shift}`}</td>
                            {daysOfWeek.map((day, index) => (
                                <td key={day} className="border border-gray-300 p-2 text-center">
                                    {index !== 6 && (selectedDay === '' || selectedDay === day) ? (
                                        <ProductCard day={day} />
                                    ) : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardActions;
