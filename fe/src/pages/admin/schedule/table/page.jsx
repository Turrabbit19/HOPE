import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Select, Input, Button, DatePicker } from "antd";

export default function TestNew() {
  const [rooms, setRooms] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [date, setDate] = useState(() => moment());
  const [teacherCode, setTeacherCode] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("all");

  const fetchRooms = async () => {
    try {
      const params = {
        room: selectedRoom !== "all" ? selectedRoom : undefined,
      };
      const response = await axios.get(
        "http://localhost:8000/api/admin/rooms",
        { params }
      );
      setRooms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleRoomChange = (value) => {
    setSelectedRoom(value);
    fetchRooms();
  };

  const fetchShifts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/shifts"
      );
      setShifts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const params = {
        date: date.format("YYYY-MM-DD"),
        teacher_code: teacherCode,
      };

      const response = await axios.get(
        "http://localhost:8000/api/admin/all-schedules",
        { params }
      );

      const schedulesArray = Object.values(response.data.data || []);
      setSchedules(schedulesArray);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchShifts();
  }, [selectedRoom]);

  useEffect(() => {
    fetchSchedules();
  }, [date, teacherCode]);

  const handleDateChange = (value) => {
    setDate(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Chưa tới":
        return "bg-gray-200 text-yellow-800";
      case "Đang trong thời gian":
        return "bg-yellow-200 text-green-800";
      case "Đã xong":
        return "bg-green-200 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header Controls */}
      <div className="flex gap-6 mb-10 items-center">
        <Select
          value={selectedRoom}
          onChange={handleRoomChange}
          options={[
            { label: "Tất cả khu", value: "all" },
            ...Array.from(
              new Set(rooms.map((room) => room.name.charAt(0)))
            ).map((char) => ({
              label: char,
              value: char,
            })),
          ]}
          className="shadow-md border border-gray-300 rounded-md"
          style={{ width: "10%" }} // Có thể điều chỉnh width nếu cần
        />

        <DatePicker
          value={date}
          onChange={handleDateChange}
          format="DD-MM-YYYY"
          className="shadow-md border border-gray-300 rounded-md"
        />
        <Input
          placeholder="Tên đăng nhập của giảng viên"
          value={teacherCode}
          onChange={(e) => setTeacherCode(e.target.value)}
          className="flex-1 border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="primary"
          onClick={fetchSchedules} // Trigger fetchSchedules when filter button is clicked
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium shadow-md transition duration-200 ease-in-out"
        >
          Lọc dữ liệu
        </Button>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-lg">
        <table className="min-w-full table-auto bg-white border-separate border-spacing-2 border border-slate-500 rounded-lg">
          {/* Time Slots Header */}
          <thead>
            <tr className="text-center bg-indigo-100 text-indigo-700 border-b border-gray-300">
              <th className="p-4 font-medium text-gray-700 border border-gray-300">
                Phòng
              </th>
              {shifts.length > 0 &&
                shifts.map((shift, i) => (
                  <th key={i} className="p-4 font-medium text-gray-700">
                    <div>{shift.name}</div>
                    <div className="text-base text-gray-500">
                      {shift.start_time} - {shift.end_time}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 &&
              rooms.map((room) => (
                <tr key={room.id} className="text-center bg-white border-b">
                  <td className="p-4 font-medium text-gray-700 border border-gray-300">
                    {room.name}
                  </td>

                  {shifts.length > 0 &&
                    shifts.map((shift, i) => {
                      const scheduleForShift = schedules.find(
                        (schedule) =>
                          schedule.room_id === room.id &&
                          schedule.shift_id === shift.id
                      );
                      return (
                        <td
                          key={i}
                          className={`p-4 ${
                            scheduleForShift
                              ? getStatusColor(scheduleForShift.status)
                              : "text-gray-500"
                          }`}
                        >
                          {scheduleForShift ? (
                            <div className="space-y-2">
                              <div className="font-bold text-2xl text-gray-900">
                                {scheduleForShift.teacher}
                              </div>
                              <div className="text-md text-gray-700">
                                {scheduleForShift.subject}
                              </div>
                              <div className="font-bold text-xl text-gray-800">
                                {scheduleForShift.class}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Trống</span>
                          )}
                        </td>
                      );
                    })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
