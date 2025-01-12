import React, { useEffect, useState } from "react";
import { Select, Button, message, DatePicker } from "antd";
import { useLocation } from "react-router-dom";
import instance from "../../../config/axios";
import {
  Book,
  Calendar,
  Clock,
  Info,
  MapPin,
  MessageSquare,
} from "lucide-react";
import moment from "moment";
import dayjs from "dayjs";

const { Option } = Select;

const EditScheduleComponent = () => {
  const location = useLocation();
  const { schedule } = location.state;
  console.log(schedule);
  const [view, setView] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}/${month}/${day}`;
  };

  const fetchTeacherData = async () => {
    try {
      console.log(formatDate(schedule.lesson.date));
      const response = await instance.post(
        "http://127.0.0.1:8000/api/teacher/getAbc",
        {
          shift_id: schedule.shift_id,
          date: formatDate(schedule.lesson.date),
          //   room_id: schedule.room_id
        }
      );
      console.log("Dữ liệu giảng viên từ API:", response.data);
      setTeacherData(response.data || []);
    } catch (error) {
      console.error("Có lỗi khi gọi API:", error);
      setTeacherData([]);
    }
  };

  const fetchDatePicker = async () => {
    try {
      const response = await instance.get(`teacher/max-date-schedule`);
      setMaxDate(new Date(response.data));
    } catch (error) {
      console.error("Có lỗi khi gọi API:", error);
    }
  };

  const handleSubmitRequest = async (id) => {
    if (!selectedTeacher) {
      message.error("Vui lòng chọn giảng viên trước khi gửi yêu cầu.");
      return;
    }
    console.log(selectedTeacher);

    try {
      const response = await instance.post(
        "http://127.0.0.1:8000/api/teacher/changeTeacher",
        {
          schedule_id: schedule.id,
          shift_name: schedule.shift_name,
          room_name: schedule.room_name,
          new_teacher: selectedTeacher,
          subject_name: schedule.subject_name,
          date: formatDate(schedule.lesson.date),
        }
      );
      console.log(response.data);
      if (response.data.success) {
        message.success("Yêu cầu thay đổi giảng viên đã được gửi.");
      } else {
        message.error("Có lỗi xảy ra khi gửi yêu cầu.");
      }
    } catch (error) {
      console.error("Có lỗi khi gửi yêu cầu:", error);
      message.error("Có lỗi xảy ra khi gửi yêu cầu.");
    }
  };

  const handleSubmitRequestChangeDate = async () => {
    if (!selectedDate) {
      message.error("Vui lòng chọn ngày trước khi gửi yêu cầu.");
      return;
    }
    console.log(selectedDate);
    try {
      const response = await instance.post("teacher/handle-change-date", {
        schedule_id: schedule.id,
        old_date: schedule.lesson?.date,
        new_date: moment(selectedDate),
        subject_name: schedule.subject_name,
      });
      console.log(moment(selectedDate));
      message.success("Yêu cầu thay đổi lịch dạy đã được gửi.");
    } catch (error) {
      console.error("Có lỗi khi gửi yêu cầu:", error);
      message.error("Có lỗi xảy ra khi gửi yêu cầu.");
    }
  };

  const onChangeDatePicker = (date, dateString) => {
    console.log(date, dateString);
    setSelectedDate(date);
  };

  const disabledDate = (current) => {
    return current && current < new Date(maxDate);
  };

  useEffect(() => {
    if (view === "change-teacher") {
      fetchTeacherData();
    }
  }, [view]);

  useEffect(() => {
    if (view === "change-schedule") {
      fetchDatePicker();
    }
  }, [view]);

  useEffect(() => {
    console.log("Teacher Data:", teacherData);
  }, [teacherData]);

  const renderContent = () => {
    switch (view) {
      case "change-teacher":
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800">
              Vui lòng chọn giảng viên khác cần thay đổi
            </h3>
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn giảng viên"
              onChange={(value) => setSelectedTeacher(value)}
            >
              {Array.isArray(teacherData) && teacherData.length > 0 ? (
                teacherData.map((teacher) => (
                  <Option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.teacher_code})
                  </Option>
                ))
              ) : (
                <Option disabled>Không có giảng viên nào</Option>
              )}
            </Select>
            <Button
              type="primary"
              onClick={handleSubmitRequest}
              className="mt-4"
            >
              Gửi yêu cầu
            </Button>
          </div>
        );
      case "change-schedule":
        return (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h2 className="text-xxl font-bold text-gray-800 text-[34px]">
              Đổi ngày dạy
            </h2>
            <h3 className="text-m font-medium text-gray-800">
              lựa chọn ngày mong muốn
            </h3>
            <DatePicker
              placeholder="Lựa chọn ngày mong muốn"
              onChange={onChangeDatePicker}
              disabledDate={disabledDate}
            />
            <Button
              type="primary"
              onClick={handleSubmitRequestChangeDate}
              className="mt-4"
            >
              Gửi yêu cầu
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h2>Đổi lịch dạy</h2>
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl transform transition-all animate-scale-in">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <Info className="h-6 w-6 mr-2 text-blue-500" />
            Chi tiết lịch dạy
          </h2>
          <div className="space-y-3">
            <p className="flex items-center text-gray-700">
              <Book className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-semibold mr-2">Môn học:</span>
              {schedule.subject_name}
            </p>
            <p className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-semibold mr-2">Ca học:</span>
              {schedule.shift_name}
            </p>
            <p className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-semibold mr-2">Phòng học:</span>
              {schedule.room_name}
            </p>
            <p className="flex items-center text-gray-700">
              <Book className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-semibold mr-2">Tiết học:</span>
              {schedule.lesson?.name}
            </p>
            <p className="flex items-center text-gray-700">
              <Info className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-semibold mr-2">Nội dung:</span>
              {schedule.lesson?.description}
            </p>
            <p className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-semibold mr-2">Ngày:</span>
              {schedule.lesson?.date}
            </p>
            <p className="flex items-center text-gray-700">
              <Info className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-semibold mr-2">Trạng thái:</span>
              {schedule.lesson?.status}
            </p>
          </div>
        </div>
      </div>
      <h2 className="mt-6">Lựa chọn hình thức</h2>
      <div className="flex gap-4 mt-4">
        <Button type="primary" onClick={() => setView("change-teacher")}>
          Thay đổi giảng viên
        </Button>
        <Button type="default" onClick={() => setView("change-schedule")}>
          Thay đổi lịch dạy
        </Button>
      </div>
      {renderContent()}
    </>
  );
};

export default EditScheduleComponent;
