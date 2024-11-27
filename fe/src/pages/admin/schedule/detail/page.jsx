import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import instance from "../../../../config/axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
        vi: vi,
    },
});

const ScheduleDetail = () => {
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const { id } = useParams();
    const { subjectId, majorId } = useLocation().state || {};
    console.log(subjectId, majorId);
    const generateEvents = (scheduleData) => {
        const events = [];
        const currentDate = new Date();

        if (
            scheduleData &&
            scheduleData.start_date &&
            scheduleData.end_date &&
            scheduleData.days_of_week
        ) {
            const {
                start_date,
                end_date,
                days_of_week,
                course_name,
                room_name,
            } = scheduleData;

            const startDateObj = new Date(start_date);
            const endDateObj = new Date(end_date);

            days_of_week.forEach((day) => {
                const dayOfWeek = Object.values(day)[0] - 1;

                let eventDate = new Date(startDateObj);

                while (eventDate <= endDateObj) {
                    if (eventDate.getDay() === dayOfWeek) {
                        events.push({
                            title: `${course_name} - ${room_name}`,
                            start: new Date(eventDate),
                            end: new Date(eventDate),
                        });
                    }
                    eventDate = addDays(eventDate, 1);
                }
            });

            setEvents(events);
        } else {
            console.error("Dữ liệu lịch học không hợp lệ:", scheduleData);
        }
    };

    useEffect(() => {
        generateEvents();
    }, [startDate, endDate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await instance.get(`admin/schedules/${id}`);
                console.log(data.data);
                console.log("Dữ liệu trả về từ API:", data);
                if (data && data.data && typeof data.data === "object") {
                    generateEvents(data.data);
                } else {
                    console.error("Dữ liệu không hợp lệ:", data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu lịch:", error);
            }
        };

        fetchData();
    }, [id]);

    const eventStyleGetter = (event) => {
        const currentDate = new Date();
        const eventDate = new Date(event.start);

        const isFutureEvent = eventDate > currentDate;

        return {
            style: {
                backgroundColor: isFutureEvent ? "darkblue" : "lightblue",
                color: "white",
            },
        };
    };

    return (
        <>
            <div>
                {/* <h1 class="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold mb-2">Lịch học - Môn {data.subject_name}</h1> */}
                <Calendar
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    localizer={localizer}
                    eventPropGetter={eventStyleGetter}
                    style={{ height: 500 }}
                />
            </div>
            <Link
                to={`edit`}
                state={{ subjectId: subjectId, majorId: majorId }}
            >
                Chỉnh sửa
            </Link>
        </>
    );
};

export default ScheduleDetail;
