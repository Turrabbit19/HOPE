'use client'

import React, { useState, useEffect } from 'react'
import { addWeeks, subWeeks, format, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import ProductCard from './ProductCard'

export default function DashboardActions() {
  const [currentWeek, setCurrentWeek] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState('')

  const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']
  const shifts = [1, 2, 3, 4, 5, 6]

  const availableClasses = {
    'Thứ 2': [1, 3, 5],
    'Thứ 3': [2, 4, 6],
    'Thứ 4': [1, 3, 5],
    'Thứ 5': [2, 4, 6],
    'Thứ 6': [1, 3, 5],
    'Thứ 7': [2, 4],
    'Chủ Nhật': []
  }

  useEffect(() => {
    setSelectedDay(getCurrentDay())
  }, [])

  const getCurrentDay = () => {
    const today = new Date().getDay()
    return daysOfWeek[today === 0 ? 6 : today - 1]
  }

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
    setSelectedDay(getCurrentDay())
  }

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const endOfCurrentWeek = endOfWeek(currentWeek, { weekStartsOn: 1 })

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 w-full">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGoToCurrentWeek}
              className="px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-200"
            >
              Tuần hiện tại
            </button>
          </div>

          <select
            onChange={handleDayChange}
            value={selectedDay}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-700"
          >
            <option value="">Tất cả các ngày</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>
                {day} {day === getCurrentDay() ? '(Hôm nay)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mb-6 bg-white shadow-sm rounded-lg p-4 bg-blue-100">
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Previous week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">Tuần hiện tại</span>
            <div className="text-center font-bold text-xl text-gray-700">
              {format(startOfCurrentWeek, 'dd/MM/yyyy', { locale: vi })} - {format(endOfCurrentWeek, 'dd/MM/yyyy', { locale: vi })}
            </div>
          </div>
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Next week"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {selectedDay ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {shifts.map(shift => (
              <div key={shift} className="bg-white shadow-sm rounded-lg p-6 relative border border-gray-200">
                <div className="absolute top-0 left-0 bg-blue-700 text-white px-3 py-1 text-sm font-semibold rounded-br-lg rounded-tl-lg">
                  Ca {shift}
                </div>
                {(availableClasses[selectedDay] || []).includes(shift) ? (
                  <ProductCard
                    day={selectedDay}
                    shift={shift}
                    isBottomRow={shift === 5 || shift === 6}
                  />
                ) : (
                  <div className="text-gray-400 text-center">Không có lớp</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                    Ca học
                  </th>
                  {daysOfWeek.map((day, index) => (
                    <th
                      key={index}
                      className="p-3 text-left text-sm font-semibold text-gray-700 border border-gray-200"
                    >
                      <div className="flex flex-col">
                        <span>{day}</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {format(addDays(startOfCurrentWeek, index), 'dd/MM', { locale: vi })}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, shiftIndex) => (
                  <tr key={shift} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 text-gray-700 font-medium border border-gray-200">
                      {`Ca ${shift}`}
                    </td>
                    {daysOfWeek.map((day, dayIndex) => (
                      <td key={day} className="p-3 text-center border border-gray-200">
                        {(availableClasses[day] || []).includes(shift) ? (
                          <ProductCard
                            day={day}
                            shift={shift}
                            isBottomRow={shift === 5 || shift === 6}
                          />
                        ) : (
                          <div className="text-gray-400">Trống</div>
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
    </div>
  )
}