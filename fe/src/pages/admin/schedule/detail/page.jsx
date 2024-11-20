import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isBetween from "dayjs/plugin/isBetween"; // Import the isBetween plugin
import { Button, Calendar, Modal, Typography, Card, Divider } from "antd";
import { Link, useParams } from "react-router-dom";
import {
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import instance from "../../../../config/axios";
import moment from "moment";

dayjs.extend(isBetween);
dayjs.locale("vi");

const { Title, Paragraph, Text } = Typography;

const ScheduleDetail = () => {
  const [classData, setClassData] = useState(null);
  const { id } = useParams();
  const [days_of_week, setDays_of_week] = useState([]);
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const { data } = await instance.get(`admin/schedules/${id}`);
        setClassData(data.data);
        setDays_of_week(data.data.days_of_week.map((item) => item["Thứ"]));
      } catch (error) {
        console.error("Error fetching class data", error);
      }
    };
    fetchClassData();
  }, [id]);

  if (!classData) {
    return <div>Loading...</div>;
  }

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  const onDateCellRender = (value) => {
    console.log(days_of_week);
    console.log(value.day());
    if (days_of_week.includes(value.day())) {
      return (
        <div
          style={{
            backgroundColor: "black",
            width: "100%",
            height: "100%",
            opacity: 0.2,
          }}
        ></div>
      );
    }
    
    // return null
  };

  return (
    <div>
      <div>Môn học: {classData.subject_name}</div>
      <Calendar onChange={onPanelChange} dateCellRender={onDateCellRender} />

      <div className="flex justify-end mt-6">
        <Button type="primary">
          <Link to={`edit`}>Sửa lịch học</Link>
        </Button>
      </div>
    </div>
  );
};

export default ScheduleDetail;
