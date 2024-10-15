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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button onClick={handlePreviousWeek} className="p-2 bg-gray-200 rounded">&lt;</button>
          <button onClick={handleGoToCurrentWeek} className="p-2 bg-blue-200 rounded">Tuần hiện tại</button>
          <button onClick={handleNextWeek} className="p-2 bg-gray-200 rounded">&gt;</button>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="dayFilter" className="text-sm font-medium">Lọc theo ngày:</label>
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

      <div className="text-center font-semibold">
        Tuần: {format(startOfCurrentWeek, 'dd/MM/yyyy')} - {format(endOfCurrentWeek, 'dd/MM/yyyy')}
      </div>

      {selectedDay ? (
        <div className="grid grid-cols-3 gap-4 justify-center">
          {shifts.map(shift => (
            <div key={shift} className="border p-4 rounded shadow relative">
              <div className="absolute top-0 left-0 bg-gray-200 px-2 py-1 text-xs font-semibold rounded-br">
                Ca {shift}
              </div>
              <ProductCard day={selectedDay} shift={shift} />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100">Ca học</th>
                {daysOfWeek.map((day, index) => (
                  <th key={index} className="border p-2 bg-gray-100">
                    {index === 6 ? 'Chủ Nhật' : `Thứ ${index + 2}`} ({format(addWeeks(startOfCurrentWeek, index), 'dd/MM')})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift} className="odd:bg-gray-50 even:bg-white">
                  <td className="border p-2">{`Ca ${shift}`}</td>
                  {daysOfWeek.map((day, index) => (
                    <td key={day} className="border p-2 text-center">
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