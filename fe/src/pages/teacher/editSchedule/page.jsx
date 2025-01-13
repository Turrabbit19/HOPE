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
          <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow-lg">
            <h3 className="text-xl text-center font-bold text-blue-800 mb-4">
              Vui lòng chọn giảng viên cần thay đổi
            </h3>
            <Select
              showSearch
              className="w-full mt-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              placeholder="Chọn giảng viên"
              optionFilterProp="children"
              onChange={(value) => setSelectedTeacher(value)}
              filterOption={(input, option) => {
                const childrenText = String(option?.children || "");
                return childrenText.toLowerCase().includes(input.toLowerCase());
              }}
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
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 shadow-md transition-all"
            >
              Gửi yêu cầu
            </Button>
          </div>
        );
      case "change-schedule":
        return (
          <div className="mt-6 p-6 bg-green-50 rounded-lg shadow-lg">
            <h3 className="text-xl text-center font-bold text-green-800 mb-4">
              Đổi ngày dạy
            </h3>
            <DatePicker
              placeholder="Lựa chọn ngày mong muốn"
              className="w-full mt-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
              onChange={onChangeDatePicker}
              disabledDate={disabledDate}
            />
            <Button
              type="primary"
              onClick={handleSubmitRequestChangeDate}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 shadow-md transition-all"
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
    <div className="p-6 bg-gradient-to-br from-green-200 via-blue-200 to-gray-300 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-wide">
        Đổi lịch dạy
      </h2>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Info className="h-6 w-6 mr-2 text-blue-500" />
          Chi tiết lịch dạy
        </h2>
        <div className="space-y-4">
          {[
            { icon: Book, label: "Môn học", value: schedule.subject_name },
            { icon: Clock, label: "Ca học", value: schedule.shift_name },
            { icon: MapPin, label: "Phòng học", value: schedule.room_name },
            { icon: Book, label: "Tiết học", value: schedule.lesson?.name },
            {
              icon: Info,
              label: "Nội dung",
              value: schedule.lesson?.description,
            },
            { icon: Calendar, label: "Ngày", value: schedule.lesson?.date },
            { icon: Info, label: "Trạng thái", value: schedule.lesson?.status },
          ].map(({ icon: Icon, label, value }, index) => (
            <p key={index} className="flex items-center text-gray-700">
              <Icon className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-medium">{label}:</span> {value || "N/A"}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">
          Lựa chọn hình thức
        </h2>
        <div className="flex gap-4">
          <Button
            type="primary"
            onClick={() => setView("change-teacher")}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-6 py-2 shadow-md transition-transform transform hover:scale-105"
          >
            Thay đổi giảng viên
          </Button>
          <Button
            type="success"
            onClick={() => setView("change-schedule")}
            className="bg-green-300 text-gray-800 rounded-lg px-6 py-2 shadow-md transition-transform transform hover:scale-105"
          >
            Thay đổi lịch dạy
          </Button>
        </div>
      </div>
      <div className="mt-6 w-full max-w-3xl">{renderContent()}</div>
    </div>
  );
};

export default EditScheduleComponent;
