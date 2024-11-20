import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isBetween from "dayjs/plugin/isBetween"; // Import the isBetween plugin
import { Button, Calendar, Modal, Typography, Card, Divider } from "antd";
import { Link, useParams } from "react-router-dom";
import { BookOutlined, UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import instance from "../../../../config/axios";

dayjs.extend(isBetween);
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
    console.log(id);

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
        return <div>Loading...</div>; 
    }

    const startDate = dayjs(classData.start_date, "DD/MM/YYYY");
    const endDate = dayjs(classData.end_date, "DD/MM/YYYY");
    const daysOfWeek = classData.days_of_week.map(day => Object.keys(day)[0]);

    const isHighlighted = (date) => {
        const dayOfWeek = date.day();
        const isInDateRange = date.isBetween(startDate, endDate, 'day', '[]');
        const isValidDayOfWeek = daysOfWeek.includes(dayjs().day(dayOfWeek).format('dddd'));

        return isInDateRange && isValidDayOfWeek;
    };

    const dateCellRender = (value) => {
        if (isHighlighted(value)) {
            return <div style={{ backgroundColor: '#1890ff', color: 'white', padding: '5px', borderRadius: '50%' }}>
                {value.date()}
            </div>;
        }
        return <div>{value.date()}</div>;
    };

    return (
        <div>
            <div>Môn học: {classData.subject_name}</div>
            <Calendar
                dateCellRender={dateCellRender}
                value={currentMonth}
            />

            <div className="flex justify-end mt-6">
                <Button type="primary">
                    <Link to={`edit`}>Sửa lịch học</Link>
                </Button>
            </div>
        </div>
    );
};

export default ScheduleDetail;
