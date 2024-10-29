import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Button } from "antd";
import { Link } from "react-router-dom";
dayjs.locale("vi");

const classesData = [
    {
        id: 1,
        name: "Lớp A",
        subject: "Nhập môn lập trình",
        schedule: {
            days: [1, 3, 5],
            startDate: "2024-10-01",
            endDate: "2024-12-31",
            totalSessions: 17,
        },
    },
    {
        id: 2,
        name: "Lớp B",
        subject: "Toán cơ bản",
        schedule: {
            days: [1, 2, 3],
            startDate: "2024-11-01",
            endDate: "2025-01-31",
            totalSessions: 20,
        },
    },
];

const ScheduleDetail = () => {
    const [selectedClassId, setSelectedClassId] = useState(classesData[0].id);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [completedSessions, setCompletedSessions] = useState(0);

    const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
    const { schedule } = selectedClass;
    const start = dayjs(schedule.startDate);
    const end = dayjs(schedule.endDate);

    const daysInMonth = Array.from(
        { length: currentMonth.daysInMonth() },
        (_, i) => currentMonth.startOf("month").add(i, "day")
    );

    const isClassDay = (date) => {
        return (
            date.isAfter(start.subtract(1, "day")) &&
            date.isBefore(end.add(1, "day")) &&
            schedule.days.includes(date.day())
        );
    };

    useEffect(() => {
        const today = dayjs().startOf("day");
        let count = 0;
        let current = start.clone();

        while (current.isBefore(today) && current.isBefore(end.add(1, "day"))) {
            if (schedule.days.includes(current.day())) {
                count += 1;
            }
            current = current.add(1, "day");
        }

        setCompletedSessions(count);
    }, [selectedClass]);

    const handlePreviousMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, "month"));
    };

    return (
        <div>
            <div className="p-8 bg-white shadow-lg mx-auto w-full ">
                <Button>
                    <Link to="/admin/list-schedule">Quay lại</Link>
                </Button>
                <div className="mb-8 flex flex-col items-center gap-6">
                    <select
                        value={selectedClassId}
                        onChange={(e) =>
                            setSelectedClassId(Number(e.target.value))
                        }
                        className="p-3 border border-gray-300 rounded-lg shadow-sm text-lg w-72"
                    >
                        {classesData.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} - {cls.subject}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handlePreviousMonth}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-lg hover:bg-gray-300"
                        >
                            Tháng Trước
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-2xl">
                                Tháng {currentMonth.format("MM")}
                            </span>
                            <span className="font-bold text-xl text-gray-600">
                                Năm {currentMonth.format("YYYY")}
                            </span>
                        </div>
                        <button
                            onClick={handleNextMonth}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-lg hover:bg-gray-300"
                        >
                            Tháng Kế Tiếp
                        </button>
                    </div>
                    <span className="font-bold text-xl text-gray-700">
                        Đã hoàn thành: {completedSessions}/
                        {selectedClass.schedule.totalSessions} buổi
                    </span>
                </div>
                <div className="grid grid-cols-7 gap-4 text-center font-semibold mb-4">
                    {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(
                        (day, index) => (
                            <div key={index} className="text-gray-600 text-lg">
                                {day}
                            </div>
                        )
                    )}
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {daysInMonth.map((date, index) => (
                        <div
                            key={index}
                            className={`p-4 border rounded-lg text-center ${
                                isClassDay(date)
                                    ? date.isBefore(dayjs(), "day")
                                        ? "bg-green-200"
                                        : "bg-blue-100"
                                    : "bg-gray-100"
                            }`}
                        >
                            <p
                                className={`font-bold text-xl ${
                                    isClassDay(date)
                                        ? "text-black"
                                        : "text-gray-400"
                                }`}
                            >
                                {date.date()}
                            </p>
                            {isClassDay(date) && (
                                <p className="text-sm mt-2">
                                    {date.isBefore(dayjs(), "day")
                                        ? "Đã học"
                                        : "Chưa học"}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <Button type="primary">
                    <Link to={`edit`}>Sửa lịch học</Link>
                </Button>
            </div>
        </div>
    );
};

export default ScheduleDetail;
