'use client'

import React, { useState } from 'react'
import { addWeeks, subWeeks, format, startOfWeek, endOfWeek } from 'date-fns'
import ProductCard from './ProductCard'

export default function DashboardActions() {
  const [currentWeek, setCurrentWeek] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState('')

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value)
  }

  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1))
  }

  const handlePreviousWeek = () => {
    setCurrentWeek(prevWeek => subWeeks(prevWeek, 1))
  }

  const handleGoToCurrentWeek = () => {
    setCurrentWeek(new Date())
  }

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const endOfCurrentWeek = endOfWeek(currentWeek, { weekStartsOn: 1 })

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const shifts = [1, 2, 3, 4, 5, 6]

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg p-6">
      {/* Header with Week Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200"
          >
            &lt;
          </button>
          <button
            onClick={handleGoToCurrentWeek}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Tuần hiện tại
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200"
          >
            &gt;
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="dayFilter" className="text-sm font-medium">
            Lọc theo ngày:
          </label>
          <select
            id="dayFilter"
            value={selectedDay}
            onChange={handleDayChange}
            className="p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          >
            <option value="">Tất cả</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Week Range Display */}
      <div className="text-center font-semibold text-lg text-gray-700">
        Tuần: {format(startOfCurrentWeek, 'dd/MM/yyyy')} - {format(endOfCurrentWeek, 'dd/MM/yyyy')}
      </div>

      {/* Display Based on Day Filter */}
      {selectedDay ? (
        <div className="grid grid-cols-3 gap-6 mt-6">
          {shifts.map(shift => (
            <div
              key={shift}
              className="border p-4 rounded shadow-lg hover:shadow-xl transition duration-300 relative bg-gray-50"
            >
              <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded-br">
                Ca {shift}
              </div>
              <ProductCard day={selectedDay} shift={shift} />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-3 bg-gray-100 text-left text-sm font-semibold">
                  Ca học
                </th>
                {daysOfWeek.map((day, index) => (
                  <th
                    key={index}
                    className="border p-3 bg-gray-100 text-left text-sm font-semibold"
                  >
                    {index === 6 ? 'Chủ Nhật' : `Thứ ${index + 2}`} <br />
                    <span className="text-xs text-gray-500">
                      {format(addWeeks(startOfCurrentWeek, index), 'dd/MM')}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                  <td className="border p-3 text-gray-700 font-medium">
                    {`Ca ${shift}`}
                  </td>
                  {daysOfWeek.map((day, index) => (
                    <td key={day} className="border p-3 text-center">
                      {index !== 6 && <ProductCard day={day} shift={shift} />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
