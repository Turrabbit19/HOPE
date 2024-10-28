'use client'

import React, { useState } from 'react'
import { addWeeks, subWeeks, format, startOfWeek, endOfWeek } from 'date-fns'
import { vi } from 'date-fns/locale'
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

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']
  const shifts = [1, 2, 3, 4, 5, 6]

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-xl p-8 transition-all duration-300 ease-in-out">
      {/* Header with Week Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center justify-center bg-blue-500 text-white rounded-full shadow-lg p-1 space-x-2 w-fit">
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-full hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Tuần trước"
          >
            &#8592;
          </button>

          <button
            onClick={handleGoToCurrentWeek}
            className="flex items-center px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="text-lg" aria-hidden="true">&#128197;</span>
            <span className="ml-2">Tuần hiện tại</span>
          </button>

          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Tuần sau"
          >
            &#8594;
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="dayFilter" className="text-sm font-medium text-gray-700">
            Lọc theo ngày:
          </label>
          <select
            id="dayFilter"
            value={selectedDay}
            onChange={handleDayChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm"
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
      <div className="text-center font-bold text-xl text-blue-700 bg-blue-100 py-3 px-4 rounded-lg shadow-inner">
        Tuần: {format(startOfCurrentWeek, 'dd/MM/yyyy', { locale: vi })} - {format(endOfCurrentWeek, 'dd/MM/yyyy', { locale: vi })}
      </div>

      {/* Display Based on Day Filter */}
      {selectedDay ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {shifts.map(shift => (
            <div
              key={shift}
              className="border p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 relative bg-white transform hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 bg-blue-500 text-white px-3 py-1 text-sm font-semibold rounded-br-lg rounded-tl-lg">
                Ca {shift}
              </div>
              <ProductCard 
                day={selectedDay} 
                shift={shift} 
                isBottomRow={shift === 5 || shift === 6}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b p-3 text-left text-sm font-semibold text-gray-700">
                  Ca học
                </th>
                {daysOfWeek.map((day, index) => (
                  <th
                    key={index}
                    className="border-b p-3 text-left text-sm font-semibold text-gray-700"
                  >
                    <div className="flex flex-col">
                      <span>{day}</span>
                      <span className="text-xs text-blue-500 font-normal">
                        {format(addWeeks(startOfCurrentWeek, index), 'dd/MM', { locale: vi })}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift, shiftIndex) => (
                <tr key={shift} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="border-b p-3 text-gray-700 font-medium">
                    {`Ca ${shift}`}
                  </td>
                  {daysOfWeek.map((day, dayIndex) => (
                    <td key={day} className="border-b p-3 text-center">
                      {dayIndex !== 6 && (
                        <ProductCard 
                          day={day} 
                          shift={shift} 
                          isBottomRow={shift === 5 || shift === 6}
                        />
                      )}
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