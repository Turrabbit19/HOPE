// ScheduleAdd.jsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Space,
  Select,
  Tabs,
  Card,
  message,
  Typography,
  Spin,
  Progress,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import qs from "qs";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const ScheduleAdd = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  // Trích xuất các ID cần thiết từ state
  const { courseId, semesterId, majorId, subjectId } = state || {};

  // Các state để lưu trữ dữ liệu từ API
  const [shifts, setShifts] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [classSessions, setClassSessions] = useState({});

  // State hiện tại của tab
  const [activeTab, setActiveTab] = useState("configure"); // Tab hiện tại
  const [selectedClasses, setSelectedClasses] = useState([]); // Các lớp học đã chọn
  const [classDetails, setClassDetails] = useState({}); // Chi tiết cho mỗi lớp
  const [teacherAssignments, setTeacherAssignments] = useState({}); // Phân công giáo viên

  // State để lưu mapping classroom_id => schedule_id
  const [createdSchedules, setCreatedSchedules] = useState({});

  // State để tính toán ngày kết thúc
  const [isCalculatingEndDate, setIsCalculatingEndDate] = useState(false);

  // Giám sát các trường trong form
  const learningMethod = Form.useWatch("learningMethod", form);

  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);
  const repeatDays = Form.useWatch("repeatDays", form);
  const shiftID = Form.useWatch("session", form);

  const [semesterInfo, setSemesterInfo] = useState(null);

  const [selectedRoomId, setSelectedRoomId] = useState({});
  const [selectedRooms, setSelectedRooms] = useState({});

  const [classScheduleDays, setClassScheduleDays] = useState({});

  const [teachersByClass, setTeachersByClass] = useState({});
  const [roomsByClass, setRoomsByClass] = useState({});

  const [error, setError] = useState(null);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    if (!courseId || !semesterId || !majorId || !subjectId) {
      message.error("Thiếu thông tin cần thiết để thêm lịch học!");
      navigate("/schedule-list");
      return;
    }

    // Hàm để lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Gọi các API song song
        const [classroomsRes, teachersRes, roomsRes] = await Promise.all([
          axios.get(
            `http://localhost:8000/api/admin/${subjectId}/classrooms/without-schedule`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        // Xử lý dữ liệu classrooms
        let classroomsData = classroomsRes.data;
        if (Array.isArray(classroomsData)) {
          setClassrooms(classroomsData);
        } else if (Array.isArray(classroomsData.classrooms)) {
          setClassrooms(classroomsData.classrooms);
        } else {
          message.error("Không có lớp học nào để thêm. Vui lòng thêm lớp học.");
          navigate(`/list-subject/detail/${subjectId}`);
          return;
        }

        setLoading(false);
        setLoadingShifts(false);
      } catch (error) {
        message.error(`Không thể tải dữ liệu cần thiết: ${error.message}`);
        setLoading(false);
        setLoadingShifts(false);
      }
    };

    fetchData();
  }, [courseId, semesterId, majorId, subjectId, navigate]);

  useEffect(() => {
    if (semesterId) {
      setLoading(true);

      axios
        .get(`http://localhost:8000/api/admin/semesters/${semesterId}`)
        .then((response) => {
          setSemesterInfo(response.data.data || {});
          setLoading(false);
        })
        .catch((error) => {
          setError("Có lỗi xảy ra khi tải thông tin kỳ học");
          setLoading(false);
        });
    }
  }, [semesterId]);

  useEffect(() => {
    if (semesterInfo && semesterInfo.start_date && semesterInfo.end_date) {
      form.setFieldsValue({
        startDate: moment.utc(semesterInfo.start_date).local(),
      });
    }
  }, [semesterInfo, form]);

  useEffect(() => {
    const calculateEndDate = async () => {
      if (!startDate || !repeatDays || repeatDays.length === 0) {
        return;
      }

      if (!subjectId) {
        message.error("Thiếu subject_id để tính toán ngày kết thúc!");
        return;
      }

      setIsCalculatingEndDate(true);

      try {
        const token = localStorage.getItem("token");
        const dayMapping = {
          "Thứ 2": 2,
          "Thứ 3": 3,
          "Thứ 4": 4,
          "Thứ 5": 5,
          "Thứ 6": 6,
          "Thứ 7": 7,
        };

        const daysOfWeek = repeatDays.map((day) => dayMapping[day]);

        const response = await axios.get(
          "http://localhost:8000/api/admin/calculate-end-date",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              start_date: startDate.format("YYYY-MM-DD"), // Định dạng "YYYY-MM-DD"
              subject_id: subjectId,
              days_of_week: daysOfWeek,
            },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "brackets" }), // Sử dụng arrayFormat 'brackets' để gửi mảng đúng cách
          }
        );

        if (response.data && response.data.end_date) {
          const endDate = moment(response.data.end_date, "YYYY-MM-DD");
          form.setFieldsValue({ endDate });
        } else {
          message.error("Không nhận được ngày kết thúc từ API.");
        }
      } catch (error) {
        console.error("Error calculating end date:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const apiErrors = error.response.data.errors;
          Object.values(apiErrors).forEach((errArray) => {
            errArray.forEach((errMsg) => {
              message.error(errMsg);
            });
          });
        } else {
          message.error("Không thể tính toán ngày kết thúc.");
        }
      } finally {
        setIsCalculatingEndDate(false);
      }
    };

    calculateEndDate();
  }, [startDate, repeatDays, subjectId, form]);

  useEffect(() => {
    const getFilteredShifts = async () => {
      if (!startDate || !endDate || !repeatDays || repeatDays.length === 0) {
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const dayMapping = {
          "Thứ 2": 2,
          "Thứ 3": 3,
          "Thứ 4": 4,
          "Thứ 5": 5,
          "Thứ 6": 6,
          "Thứ 7": 7,
        };

        const daysOfWeek = repeatDays.map((day) => dayMapping[day]);

        const response = await axios.get(
          "http://localhost:8000/api/admin/filtered-shifts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              start_date: startDate.format("YYYY-MM-DD"),
              end_date: endDate.format("YYYY-MM-DD"),
              days_of_week: daysOfWeek,
            },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "brackets" }),
          }
        );

        if (response.data && response.data.data) {
          const shiftsArray = Object.values(response.data.data);

          setShifts(shiftsArray);
        } else {
          message.error("Không nhận được dữ liệu ca học từ API.");
        }
      } catch (error) {
        console.error("Lỗi khi tải ca học:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const apiErrors = error.response.data.errors;
          Object.values(apiErrors).forEach((errArray) => {
            errArray.forEach((errMsg) => {
              message.error(errMsg);
            });
          });
        } else {
          message.error("Không thể tải dữ liệu ca học.");
        }
      }
    };

    getFilteredShifts();
  }, [startDate, endDate, repeatDays]);

  const getAvailableTeachers = async (classId) => {
    if (
      !semesterId ||
      !repeatDays ||
      repeatDays.length === 0 ||
      !classSessions[classId]
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const dayMapping = {
        "Thứ 2": 2,
        "Thứ 3": 3,
        "Thứ 4": 4,
        "Thứ 5": 5,
        "Thứ 6": 6,
        "Thứ 7": 7,
      };

      const selectedDays = repeatDays.map((day) => dayMapping[day]);

      const response = await axios.get(
        `http://localhost:8000/api/admin/major/${majorId}/teachers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            semesterId,
            days: selectedDays,
            shiftId: classSessions[classId],
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "brackets" }),
        }
      );

      if (response.data && response.data.data) {
        setTeachersByClass((prev) => ({
          ...prev,
          [classId]: response.data.data, // Cập nhật danh sách giáo viên riêng cho lớp
        }));
      } else {
        message.error("Không nhận được danh sách giáo viên từ API.");
      }
    } catch (error) {
      console.error(`Lỗi khi tải giáo viên cho lớp ${classId}:`, error);
      message.error(`Không thể tải danh sách giáo viên cho lớp ${classId}.`);
    }
  };

  const getAvailableRooms = async (classId) => {
    if (
      !startDate ||
      !endDate ||
      !repeatDays ||
      repeatDays.length === 0 ||
      !classSessions[classId]
    ) {
      message.warn(`Lớp ${classId}: Vui lòng điền đủ thông tin để lọc phòng.`);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const dayMapping = Object.freeze({
        "Thứ 2": 2,
        "Thứ 3": 3,
        "Thứ 4": 4,
        "Thứ 5": 5,
        "Thứ 6": 6,
        "Thứ 7": 7,
      });

      const daysOfWeek = repeatDays
        .map((day) => dayMapping[day] || null)
        .filter(Boolean);

      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");

      const response = await axios.get(
        "http://localhost:8000/api/admin/available-rooms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            days_of_week: daysOfWeek,
            shift_id: classSessions[classId],
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "brackets" }),
        }
      );

      if (Array.isArray(response.data?.data)) {
        setRooms(response.data.data);
      } else {
        message.error(
          `Lớp ${classId}: Không có dữ liệu phòng học hợp lệ từ API.`
        );
      }
    } catch (error) {
      console.error(`Lớp ${classId}: Lỗi khi tải phòng học:`, error);
      message.error(`Không thể tải dữ liệu phòng học cho lớp ${classId}.`);
    }
  };

  useEffect(() => {
    if (
      !selectedClasses.length ||
      !majorId ||
      !semesterId ||
      !repeatDays ||
      !startDate ||
      !endDate
    ) {
      return;
    }

    selectedClasses.forEach((classId) => {
      if (classSessions[classId]) {
        getAvailableTeachers(classId);

        if (
          startDate &&
          endDate &&
          repeatDays.length > 0 &&
          classSessions[classId]
        ) {
          getAvailableRooms(classId);
        }
      }
    });
  }, [
    majorId,
    semesterId,
    repeatDays,
    selectedClasses,
    classSessions,
    startDate,
    endDate,
  ]);

  const handleRoomSelect = (classId, shiftId, roomId) => {
    const room = roomId; // Đảm bảo rằng `roomId` là giá trị phòng học mới được chọn

    if (!room) {
      console.error("Phòng học không hợp lệ.");
      return;
    }

    setSelectedRooms((prevSelected) => {
      // Lấy phòng cũ trước khi cập nhật
      const previousRoomId = prevSelected[shiftId]?.[classId]?.id;

      // Cập nhật selectedRooms với phòng mới
      const updatedShiftRooms = { ...(prevSelected[shiftId] || {}) };
      updatedShiftRooms[classId] = { id: room };

      const updatedSelectedRooms = {
        ...prevSelected,
        [shiftId]: updatedShiftRooms,
      };

      // Cập nhật số lượng phòng trống và trả lại phòng cũ
      setShifts((prevShifts) => {
        return prevShifts.map((shift) => {
          if (shift.id === shiftId) {
            if (previousRoomId) {
              shift.available_rooms_count += 1; // Trả lại phòng cũ
            }
            shift.available_rooms_count -= 1; // Giảm đi phòng mới đã được chọn
          }
          return shift;
        });
      });

      return updatedSelectedRooms;
    });
  };

  const getAvailableRoomsForShift = (shiftId, classId) => {
    // Lấy tất cả các phòng đã được chọn
    const occupiedRooms = Object.values(selectedRooms)
      .map((shiftRooms) => shiftRooms[classId]?.id) // Chỉ lấy phòng đã chọn cho lớp hiện tại
      .filter(Boolean); // Loại bỏ null, undefined

    // Trả lại các phòng chưa được chọn
    return rooms.filter((room) => !occupiedRooms.includes(room.id));
  };

  const isTeacherAvailable = (teacherId, shiftId, currentClassId) => {
    return !Object.entries(teacherAssignments).some(
      ([classId, assignedTeacherId]) => {
        if (classId === currentClassId) return false;
        const assignedShiftId = classDetails[classId]?.session;
        return assignedTeacherId === teacherId && assignedShiftId === shiftId;
      }
    );
  };

  const handleClassChange = (values) => {
    setSelectedClasses(values);
    setClassDetails((prevDetails) => {
      const updatedDetails = {};
      values.forEach((classId) => {
        if (prevDetails[classId]) {
          updatedDetails[classId] = prevDetails[classId];
        } else {
          updatedDetails[classId] = {
            session: null,
            classLink: "",
            classRoom: null,
          };
        }
      });
      return updatedDetails;
    });

    if (activeTab === "addTeacher") {
      setActiveTab("configure");
      setTeacherAssignments({});
      setCreatedSchedules({});
    }
  };

  const fetchSubjectById = async (subjectId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/subjects/${subjectId}`
      );
      const data = response.data;

      return data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu môn học:", error);
      return null;
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchSubjectById(subjectId).then((subject) => {
        if (subject && subject.data && subject.data.form !== undefined) {
          const method =
            subject.data.form === "Trực tuyến" ? "Online" : "Offline";
          form.setFieldsValue({ learningMethod: method });

          const updatedDetails = {};
          selectedClasses.forEach((classId) => {
            updatedDetails[classId] = {
              session: classDetails[classId]?.session || null,
              classLink: method === "Online" ? "" : null,
              classRoom: method === "Offline" ? "" : null,
            };
          });

          if (JSON.stringify(updatedDetails) !== JSON.stringify(classDetails)) {
            setClassDetails(updatedDetails);
          }
        }
      });
    }
  }, [subjectId, selectedClasses]);

  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.learningMethod) {
      const method = changedValues.learningMethod;
      const updatedDetails = {};

      selectedClasses.forEach((classId) => {
        updatedDetails[classId] = {
          session: classDetails[classId]?.session || null,
          classLink: method === "Online" ? "" : null,
          classRoom: method === "Offline" ? "" : null,
        };
      });

      // Chỉ set lại nếu có sự thay đổi thực sự
      if (JSON.stringify(updatedDetails) !== JSON.stringify(classDetails)) {
        setClassDetails(updatedDetails);
        form.setFieldsValue({ classDetails: updatedDetails });
      }
    }
  };

  // Xử lý khi chuyển tab
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleTeacherSelect = (classId, teacherId) => {
    const shiftId = classDetails[classId]?.session;
    if (!shiftId) {
      message.error("Vui lòng chọn ca học trước!");
      return;
    }

    // Kiểm tra xem giáo viên có sẵn sàng hay không
    const available = isTeacherAvailable(teacherId, shiftId, classId);
    if (!available) {
      message.error("Giáo viên này đã bị trùng lịch dạy với lớp khác!");
      return;
    }

    setTeacherAssignments((prev) => ({
      ...prev,
      [classId]: teacherId,
    }));
    message.success("Phân công giáo viên thành công!");
  };

  const addSchedules = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/admin/schedules/${semesterId}/${courseId}/${majorId}/${subjectId}/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        message.success("Thêm lịch học thành công!");
        const schedules = response.data.schedules;
        const scheduleMap = {};
        schedules.forEach((schedule) => {
          scheduleMap[String(schedule.data.classroom_id)] =
            schedule.data.schedule_id;
        });
        console.log("Bản đồ Schedule:", scheduleMap);
        setCreatedSchedules(scheduleMap);
        return scheduleMap;
      } else {
        message.error("Thêm lịch học thất bại!");
        return null;
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(`Thêm lịch học thất bại: ${error.response.data.error}`);
      } else {
        message.error("Thêm lịch học thất bại!");
      }
      return null;
    }
  };

  // Hàm gọi API để phân công giáo viên
  const assignTeachers = async (payload) => {
    console.log("Assign Teachers Payload:", payload); // Log payload
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/admin/schedules/assign`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Phân công giáo viên thành công!");
        // Điều hướng đến danh sách lịch học
        navigate("/admin/list-schedule");
      } else {
        message.error("Phân công giáo viên thất bại!");
      }
    } catch (error) {
      console.error("Error assigning teachers:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(
          `Phân công giáo viên thất bại: ${error.response.data.error}`
        );
      } else {
        message.error("Phân công giáo viên thất bại!");
      }
    }
  };

  // Xử lý khi submit cấu hình lớp học
  const handleFinish = async (values) => {
    // Lưu các lớp đã chọn
    setSelectedClasses(values.classes);
    // Lưu chi tiết lớp học (chỉ session và classRoom/classLink)
    const details = {};
    values.classes.forEach((classId) => {
      details[classId] = {
        session: values.classDetails?.[classId]?.session || null,
        classLink: values.classDetails?.[classId]?.classLink || "",
        classRoom: values.classDetails?.[classId]?.classRoom || null,
      };
    });
    setClassDetails(details);

    const payload = {
      classrooms: values.classes.map((classId) => ({
        id: classId,
        shift_id: details[classId].session,
        room_id: details[classId].classRoom,
        link:
          learningMethod === "Trực tuyến" ? details[classId].classLink : null,
        start_date: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null,
        end_date: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        days_of_week: values.repeatDays.map((day) => {
          const dayMapping = {
            "Thứ 2": 2,
            "Thứ 3": 3,
            "Thứ 4": 4,
            "Thứ 5": 5,
            "Thứ 6": 6,
            "Thứ 7": 7,
          };
          return dayMapping[day];
        }),
      })),
    };

    // Gọi API để thêm lịch học
    const scheduleMap = await addSchedules(payload);

    if (scheduleMap) {
      // Reset phân công giáo viên
      setTeacherAssignments({});
      // Chuyển sang tab phân công giáo viên
      setActiveTab("addTeacher");
      message.success("Cấu hình đã được lưu thành công!");
    }
  };

  const renderClassSessionFields = () => {
    if (loadingShifts) {
      return (
        <div className="flex justify-center items-center">
          <Spin tip="Đang tải ca học..." />
        </div>
      );
    }

    return selectedClasses.map((classId) => {
      const classData = classrooms.find((c) => c.id === classId);
      const className = classData ? classData.code : `ID ${classId}`;

      return (
        <TabPane tab={`Lớp ${className}`} key={classId}>
          <Card
            title={`Ca Học Cho Lớp ${className}`}
            className="mb-5 border shadow-sm rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chọn ca học */}
              <div>
                <Form.Item
                  label="Ca Học"
                  name={["classDetails", classId, "session"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ca học!",
                    },
                  ]}
                >
                  <Select
                    value={classSessions[classId] || null}
                    onChange={(value) => {
                      setClassSessions((prev) => ({
                        ...prev,
                        [classId]: value,
                      }));
                    }}
                    placeholder="Chọn ca học"
                    optionFilterProp="children"
                    className="w-full rounded border"
                  >
                    {shifts.map((shift) => {
                      const availableRoomsPercentage =
                        (shift.available_rooms_count /
                          shift.total_rooms_count) *
                        100;

                      const getRoomColor = (percentage) => {
                        if (percentage > 80) return "bg-green-500";
                        if (percentage > 40) return "bg-yellow-500";
                        return "bg-red-500";
                      };

                      return (
                        <Option key={shift.id} value={shift.id}>
                          <div className="flex items-center">
                            <span className="mr-2">
                              {`${shift.name}: ${shift.start_time} - ${shift.end_time}`}
                            </span>
                            {/* Vòng tròn hiển thị số lượng phòng trống */}
                            <div className="w-full flex items-center">
                              <div className="flex-1">
                                <div className="w-full h-2 bg-gray-200 rounded-full">
                                  <div
                                    className={`h-2 rounded-full ${getRoomColor(
                                      availableRoomsPercentage
                                    )}`}
                                    style={{
                                      width: `${availableRoomsPercentage}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <span className="ml-2 text-xl">
                                {shift.available_rooms_count}
                              </span>
                            </div>
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>

              {/* Hiển thị nội dung dựa trên learningMethod */}
              {form.getFieldValue("learningMethod") === "Online" ? (
                <div>
                  <Form.Item
                    label="Link Học Trực Tuyến"
                    name={["classDetails", classId, "classLink"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập link học trực tuyến!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Link học trực tuyến"
                      prefix={<LinkOutlined />}
                      className="w-full rounded border"
                    />
                  </Form.Item>
                </div>
              ) : (
                <div>
                  <Form.Item
                    label="Phòng Học Trực Tiếp"
                    name={["classDetails", classId, "classRoom"]}
                    rules={[
                      { required: true, message: "Vui lòng chọn phòng học!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn phòng học"
                      value={
                        selectedRooms[classSessions[classId]]?.[classId]?.id ||
                        undefined
                      }
                      onChange={(value) =>
                        handleRoomSelect(classId, classSessions[classId], value)
                      }
                      className="w-full rounded border"
                    >
                      {getAvailableRoomsForShift(
                        classSessions[classId],
                        classId
                      ).map((room) => (
                        <Option key={room.id} value={room.id}>
                          {room.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              )}
            </div>
          </Card>
        </TabPane>
      );
    });
  };

  const handleDaysSelect = (days) => {
    const dayMapping = {
      "Thứ 2": 2,
      "Thứ 3": 3,
      "Thứ 4": 4,
      "Thứ 5": 5,
      "Thứ 6": 6,
      "Thứ 7": 7,
    };

    const dayNumbers = days
      .map((day) => dayMapping[day] || null)
      .filter(Boolean);

    setClassScheduleDays((prev) => {
      const updated = {};
      selectedClasses.forEach((classId) => {
        updated[classId] = dayNumbers;
      });
      return { ...prev, ...updated };
    });

    console.log("Selected Days for all classes:", dayNumbers);
  };

  const renderTeacherAssignment = () => {
    if (selectedClasses.length === 0) {
      return <p>Vui lòng cấu hình lớp học trước khi thêm giáo viên.</p>;
    }

    return (
      <Form
        layout="vertical"
        onFinish={async () => {
          const allAssigned = selectedClasses.every(
            (classId) => teacherAssignments[classId]
          );
          if (!allAssigned) {
            message.error("Vui lòng phân công giáo viên cho tất cả các lớp!");
            return;
          }

          const payload = {
            schedules: selectedClasses.map((classId) => ({
              teacher_id: teacherAssignments[classId],
              schedule_id: createdSchedules[String(classId)],
            })),
          };

          await assignTeachers(payload);
        }}
      >
        {selectedClasses.map((classId) => {
          const classData = classrooms.find((c) => c.id === Number(classId));
          const className = classData
            ? classData.name || classData.code
            : `ID ${classId}`;

          // Get days selected for the class
          const selectedDays = classScheduleDays[classId];

          // Get the shiftId from classSessions
          const shiftId = classSessions[classId];
          const shift = shifts.find((s) => s.id === shiftId);

          // Get class details (including room)
          const details = classDetails[classId];
          const classRoom = details?.classRoom
            ? rooms.find((room) => room.id === details.classRoom)?.name
            : ""; // Room name

          return (
            <Card
              key={classId}
              title={`Phân Công Giáo Viên Cho Lớp ${className}`}
              style={{ marginBottom: 16 }}
            >
              {/* Hiển thị ca học */}
              <div style={{ marginBottom: 8 }}>
                <Text strong>Ca Học:</Text>{" "}
                {shift
                  ? `${shift.name} (${shift.start_time} - ${shift.end_time})`
                  : "Chưa chọn"}
              </div>

              {/* Hiển thị các ngày học */}
              <div style={{ marginBottom: 8 }}>
                <Text strong>Các Ngày Học:</Text>{" "}
                {selectedDays && selectedDays.length > 0
                  ? selectedDays.map((day) => `Thứ ${day}`).join(", ")
                  : "Chưa chọn"}
              </div>

              {/* Hiển thị hình thức học */}
              <div style={{ marginBottom: 8 }}>
                <Text strong>Hình Thức Học:</Text>{" "}
                {learningMethod === "Online" ? "Online" : "Offline"}
              </div>

              {learningMethod === "Online" ? (
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Link Học Trực Tuyến:</Text>{" "}
                  {details?.classLink || "Chưa nhập"}
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Phòng Học Trực Tiếp:</Text>{" "}
                  {selectedRooms[classSessions[classId]]?.[classId]?.id
                    ? selectedRooms[classSessions[classId]]?.[classId]?.id
                    : "Chưa chọn"}
                </div>
              )}

              {/* Chọn Giáo Viên */}
              <Form.Item
                label="Chọn Giáo Viên"
                required
                validateStatus={
                  teacherAssignments[classId] ? "success" : "error"
                }
                help={
                  teacherAssignments[classId] ? "" : "Vui lòng chọn giáo viên!"
                }
              >
                <Select
                  placeholder="Chọn giáo viên"
                  value={teacherAssignments[classId]}
                  onChange={(value) => handleTeacherSelect(classId, value)}
                >
                  {teachers.map((teacher) => (
                    <Option
                      key={teacher.id}
                      value={teacher.id}
                      disabled={
                        !isTeacherAvailable(teacher.id, shiftId, classId)
                      }
                    >
                      {teacher.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          );
        })}

        <Form.Item>
          <Space>
            <Button type="default" onClick={() => setActiveTab("configure")}>
              Quay Lại
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu Phân Công
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cấu Hình Thông Tin</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {/* Tab Cấu Hình Lớp Học */}
          <TabPane tab="Cấu Hình Lớp Học" key="configure">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              onValuesChange={handleValuesChange}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              {/* Lựa chọn lớp học (chọn nhiều) */}
              <Form.Item
                label="Lớp Học"
                name="classes"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn lớp học!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  placeholder="Chọn lớp học"
                  optionFilterProp="children"
                  onChange={handleClassChange}
                  disabled={activeTab === "addTeacher"}
                >
                  {classrooms.map((classItem) => (
                    <Option key={classItem.id} value={classItem.id}>
                      {classItem.code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Chọn ngày bắt đầu và kết thúc */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ngày Bắt Đầu"
                    name="startDate"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày bắt đầu!",
                      },
                    ]}
                    initialValue={
                      semesterInfo?.start_date
                        ? moment.utc(semesterInfo.start_date).local()
                        : null
                    }
                  >
                    <DatePicker
                      format="DD-MM-YYYY"
                      style={{ width: "100%" }}
                      disabled={activeTab === "addTeacher"}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Ngày Kết Thúc"
                    name="endDate"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày kết thúc!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || !getFieldValue("startDate")) {
                            return Promise.resolve();
                          }
                          if (
                            value.isAfter(getFieldValue("startDate")) ||
                            value.isSame(getFieldValue("startDate"))
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY" // Định dạng hiển thị "DD-MM-YYYY"
                      style={{ width: "100%" }}
                      disabled={activeTab === "addTeacher"}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Hiển thị loading khi đang tính toán ngày kết thúc */}
              {isCalculatingEndDate && (
                <Row>
                  <Col span={24}>
                    <Spin size="small" tip="Đang tính toán ngày kết thúc..." />
                  </Col>
                </Row>
              )}

              {/* Chọn thời gian lặp */}
              {selectedClasses.length > 0 && (
                <Form.Item
                  label="Thời Gian Lặp"
                  name="repeatDays"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ít nhất một ngày!",
                    },
                  ]}
                >
                  <Checkbox.Group
                    style={{ width: "100%" }}
                    value={classScheduleDays || []} // Áp dụng chung một bộ ngày cho tất cả các lớp
                    onChange={handleDaysSelect} // Hàm xử lý cho các ngày học
                  >
                    {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map(
                      (day, index) => (
                        <Checkbox value={day} key={`${day}-${index}`}>
                          {day}
                        </Checkbox>
                      )
                    )}
                  </Checkbox.Group>
                </Form.Item>
              )}

              {/* Hình thức học */}
              <div style={{ marginBottom: 16 }}>
                <Text strong>Hình Thức Học: </Text>
                {form.getFieldValue("learningMethod") === "Online"
                  ? "Online"
                  : "Offline"}
              </div>

              {/* Các trường cụ thể cho từng lớp */}
              {selectedClasses.length > 0 && (
                <Tabs style={{ marginTop: 24 }}>
                  {renderClassSessionFields()}
                </Tabs>
              )}

              {/* Các nút hành động */}
              <Form.Item style={{ marginTop: 24 }}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    type="default"
                    onClick={() => form.resetFields()}
                    disabled={activeTab === "addTeacher"}
                  >
                    Hủy Bỏ
                  </Button>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={activeTab === "addTeacher"}
                    >
                      Tạo mới
                    </Button>
                  </Space>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Tab Thêm Giáo Viên */}
          <TabPane
            tab="Thêm Giáo Viên"
            key="addTeacher"
            disabled={selectedClasses.length === 0}
          >
            {renderTeacherAssignment()}
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default ScheduleAdd;
