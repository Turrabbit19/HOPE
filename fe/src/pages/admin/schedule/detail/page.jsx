import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Button, Modal, Typography, Card, Divider } from "antd";
import { Link, useParams } from "react-router-dom";
import { BookOutlined, UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import instance from "../../../../config/axios";

dayjs.locale("vi");

const { Title, Paragraph, Text } = Typography;

const ScheduleDetail = () => {
    const [selectedClassId, setSelectedClassId] = useState(1);

    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [completedSessions, setCompletedSessions] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [classData, setClassData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const { data } = await instance.get(`admin/schedules/${id}`);
                setClassData(data.data);
            } catch (error) {
                console.error("Error fetching class data", error);
            }
        };
        fetchClassData();
    }, [id]);

    if (!classData) {
        return <div>Loading...</div>; // Hiển thị khi dữ liệu đang tải
    }

    const { start_date, end_date, days_of_week, totalSessions, subject_name } = classData;

    const schedule = {
        startDate: start_date,
        endDate: end_date,
        days: days_of_week.map((day) => {
            const key = Object.keys(day)[0];
            switch (key) {
                case "Thứ 2":
                    return 1;
                case "Thứ 3":
                    return 2;
                case "Thứ 4":
                    return 3;
                case "Thứ 5":
                    return 4;
                case "Thứ 6":
                    return 5;
                case "Thứ 7":
                    return 6;
                case "Chủ nhật":
                    return 0;
                default:
                    return null;
            }
        }),
    };

    const start = dayjs(schedule.startDate);
    const end = dayjs(schedule.endDate);

    // Tính tất cả các ngày trong tháng hiện tại

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

    const classDaysInRange = () => {
        let classDays = [];
        let currentDay = start;

        while (currentDay.isBefore(end)) {
            if (schedule.days.includes(currentDay.day())) {
                classDays.push(currentDay);
            }
            currentDay = currentDay.add(1, "day");
        }

        return classDays;
    };

    const getSessionDetails = (date) => {
        return {
            sessionName: `Buổi học ngày ${date.format("DD/MM/YYYY")}`,
            content: `Giới thiệu về môn học ${subject_name}.`,
            instructor: classData.teacher_name || "Chưa có giảng viên",
            classPeriod: `Ca học: ${classData.shift_name}`,
            room: classData.room_name,

        };
    };

    const onDateClick = (date) => {
        if (isClassDay(date)) {
            const sessionDetails = getSessionDetails(date);
            setSelectedSession(sessionDetails);
            setIsModalVisible(true);
        }
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, "month"));
    };

    return (
        <div>
            <div className="p-8 bg-white shadow-lg mx-auto w-full">

                <Button>
                    <Link to="/admin/list-schedule">Quay lại</Link>
                </Button>
                <div className="mb-8 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handlePreviousMonth}
                            className="px-6 py-3  text-gray-700 rounded-lg text-lg hover:bg-gray-300 bg-blue-300"

                        >
                            Tháng Trước
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-2xl">
                                Tháng {currentMonth.format("MM")}
                            </span>
                            <span className="font-bold text-xl text-gray-600 ">
                                Năm {currentMonth.format("YYYY")}
                            </span>
                        </div>
                        <button
                            onClick={handleNextMonth}
                            className="px-6 py-3  bg-blue-300 text-gray-700 rounded-lg text-lg hover:bg-gray-300"

                        >
                            Tháng Kế Tiếp
                        </button>
                    </div>
                    <span className="font-bold text-xl text-gray-700">
                        Đã hoàn thành: {completedSessions}/{totalSessions} buổi
                    </span>
                </div>

                <div className="grid grid-cols-7 gap-4 text-center font-semibold mb-4">
                    {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
                        <div key={index} className="text-gray-600 text-lg">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-4">
                    {daysInMonth.map((date, index) => {
                        const isDayClassDay = isClassDay(date);
                        const isPastClass = date.isBefore(dayjs(), "day");

                        return (
                            <div
                                key={index}
                                className={`p-4 border rounded-lg text-center cursor-pointer transition duration-200 ease-in-out transform hover:-translate-y-1 ${
                                         isPastClass
                                            ? "bg-green-200 hover:bg-green-300"
                                            : isDayClassDay
                                            ? "bg-blue-100 hover:bg-blue-200"
                                            : "bg-gray-100"
                                        
                                }`}
                                onClick={() => onDateClick(date)}
                            >
                                <p
                                    className={`font-bold text-xl ${
                                        isDayClassDay ? "text-black" : "text-gray-400"
                                    }`}
                                >
                                    {date.date()}
                                </p>
                                {isDayClassDay && (
                                    <p className="text-sm mt-2">
                                        {isPastClass ? "Đã học" : "Chưa học"}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

            <div className="flex justify-end mt-6">
                <Button type="primary">
                    <Link to={`edit`}>Sửa lịch học</Link>
                </Button>
            </div>


            <Modal
                title={<Title level={4}>{selectedSession?.sessionName}</Title>}
                visible={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                footer={[<Button key="back" onClick={() => setIsModalVisible(false)}>Đóng</Button>]}

            >
                <Card bordered={false}>
                    <Paragraph>
                        <BookOutlined style={{ marginRight: 8 }} />
                        <Text strong>Nội dung:</Text> {selectedSession?.content}
                    </Paragraph>
                    <Divider />
                    <Paragraph>
                        <UserOutlined style={{ marginRight: 8 }} />
                        <Text strong>Giảng viên:</Text> {selectedSession?.instructor}

                    </Paragraph>
                    <Divider />
                    <Paragraph>
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        <Text strong>Ca học:</Text> {selectedSession?.classPeriod}
                    </Paragraph>
                    <Paragraph>
                        <Text strong>Phòng học:</Text> {selectedSession?.room}

                    </Paragraph>
                </Card>
            </Modal>
        </div>
    );
};

export default ScheduleDetail;
