
// ScheduleEdit.jsx
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
    Modal,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import qs from "qs";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;
const ScheduleEdit = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    // Trích xuất các ID cần thiết từ state
    const { subjectId, majorId } = state || {};

    // Các state để lưu trữ dữ liệu từ API
    const [shifts, setShifts] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingShifts, setLoadingShifts] = useState(true);

    // State hiện tại của tab
    const [activeTab, setActiveTab] = useState("configure"); // Tab hiện tại
    const [selectedClasses, setSelectedClasses] = useState([]); // Các lớp học đã chọn
    const [classDetails, setClassDetails] = useState({}); // Chi tiết cho mỗi lớp
    const [teacherAssignments, setTeacherAssignments] = useState({}); // Phân công giáo viên

    // State để tính toán ngày kết thúc
    const [isCalculatingEndDate, setIsCalculatingEndDate] = useState(false);

    // Giám sát các trường trong form
    const learningMethod = Form.useWatch("learningMethod", form);
    const startDate = Form.useWatch("startDate", form);
    const repeatDays = Form.useWatch("repeatDays", form);

    const { id } = useParams();
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                const apiHeaders = { Authorization: `Bearer ${token}` };
                const schedule = await axios.get(
                    `http://localhost:8000/api/admin/schedules/${id}`,
                    { headers: apiHeaders }
                );
                const scheduleData = schedule.data.data;
                scheduleData.days_of_week.map((item) => console.log(item));
                const daysMap = {
                    2: "Thứ 2",
                    3: "Thứ 3",
                    4: "Thứ 4",
                    5: "Thứ 5",
                    6: "Thứ 6",
                    7: "Thứ 7",
                };

                const formattedDays = scheduleData.days_of_week.map(
                    (item) => daysMap[item["Thứ"]] || "Không xác định"
                );
                let learningMethod;
                if (scheduleData.link == "NULL") {
                    learningMethod = "offline";
                } else {
                    learningMethod = "online";
                }
                //   handleClassChange()
                console.log(scheduleData);
                handleClassChange([id]);
                form.setFieldsValue({
                    classes: scheduleData.classroom_name,
                    repeatDays: formattedDays,
                    startDate: moment(scheduleData.start_date),
                    endDate: moment(scheduleData.end_date),
                    learningMethod: learningMethod,
                    classDetails: {
                        [id]: {
                            session: scheduleData.shift_id,
                            classRoom: scheduleData.room_id,
                        },
                    },
                    teacherAssignments: {
                        [id]: scheduleData.teacher_id,
                    },
                });
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const apiHeaders = { Authorization: `Bearer ${token}` };

                try {
                    const shiftsRes = await axios.get(
                        "http://localhost:8000/api/admin/shifts",
                        { headers: apiHeaders }
                    );
                    const shiftsData = shiftsRes.data;
                    if (Array.isArray(shiftsData)) {
                        setShifts(shiftsData);
                    } else if (Array.isArray(shiftsData.data)) {
                        setShifts(shiftsData.data);
                    } else {
                        message.error("Dữ liệu shifts không hợp lệ.");
                    }
                } catch (error) {
                    console.error("Error fetching shifts:", error);
                    message.error("Không thể tải dữ liệu shifts.");
                }

                // Fetch Classrooms
                try {
                    const classroomsRes = await axios.get(
                        `http://localhost:8000/api/admin/${subjectId}/classrooms/without-schedule`,
                        { headers: apiHeaders }
                    );
                    const classroomsData = classroomsRes.data;
                    if (Array.isArray(classroomsData)) {
                        setClassrooms(classroomsData);
                    } else if (Array.isArray(classroomsData.classrooms)) {
                        setClassrooms(classroomsData.classrooms);
                    } else {
                        message.error("Dữ liệu classrooms không hợp lệ.");
                    }
                } catch (error) {
                    console.error("Error fetching classrooms:", error);
                    message.error("Không thể tải dữ liệu classrooms.");
                }

                // Fetch Teachers
                try {
                    const teachersRes = await axios.get(
                        `http://localhost:8000/api/admin/major/${majorId}/teachers`,
                        { headers: apiHeaders }
                    );
                    const teachersData = teachersRes.data.listTeachers;
                    if (Array.isArray(teachersData)) {
                        setTeachers(teachersData);
                    } else {
                        message.error("Dữ liệu teachers không hợp lệ.");
                    }
                } catch (error) {
                    console.error("Error fetching teachers:", error);
                    message.error("Không thể tải dữ liệu teachers.");
                }

                // Fetch Rooms
                try {
                    const roomsRes = await axios.get(
                        "http://localhost:8000/api/admin/rooms",
                        { headers: apiHeaders }
                    );
                    const roomsData = roomsRes.data.data;
                    if (Array.isArray(roomsData)) {
                        setRooms(roomsData);
                    } else if (Array.isArray(roomsData.rooms)) {
                        setRooms(roomsData.rooms);
                    } else {
                        throw new Error("Dữ liệu rooms không hợp lệ.");
                    }
                } catch (error) {
                    console.error("Error fetching rooms:", error);
                    message.error("Không thể tải dữ liệu rooms.");
                }

                setLoading(false);
                setLoadingShifts(false);
            } catch (error) {
                console.error("Unexpected error:", error);
                message.error(
                    `Đã xảy ra lỗi không mong muốn: ${error.message}`
                );
                setLoading(false);
                setLoadingShifts(false);
            }
        };

        fetchData();
    }, [subjectId, navigate]);

    // useEffect để tính toán ngày kết thúc khi startDate hoặc repeatDays thay đổi
    useEffect(() => {
        // Hàm để tính toán ngày kết thúc
        const calculateEndDate = async () => {
            if (!startDate || !repeatDays || repeatDays.length === 0) {
                // Không tính toán nếu thiếu trường cần thiết
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
                    "Thứ 2": 1,
                    "Thứ 3": 2,
                    "Thứ 4": 3,
                    "Thứ 5": 4,
                    "Thứ 6": 5,
                    "Thứ 7": 6,
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
                            days_of_week: daysOfWeek, // Gửi dưới dạng mảng
                        },
                        paramsSerializer: (params) =>
                            qs.stringify(params, { arrayFormat: "brackets" }), // Sử dụng arrayFormat 'brackets' để gửi mảng đúng cách
                    }
                );

                if (response.data && response.data.end_date) {
                    const endDate = moment(
                        response.data.end_date,
                        "YYYY-MM-DD"
                    );
                    form.setFieldsValue({ endDate });
                    message.success("Ngày kết thúc đã được tính toán tự động!");
                } else {
                    //   message.error("Không nhận được ngày kết thúc từ API.");
                }
            } catch (error) {
                // console.error("Error calculating end date:", error);
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.errors
                ) {
                    const apiErrors = error.response.data.errors;
                    Object.values(apiErrors).forEach((errArray) => {
                        errArray.forEach((errMsg) => {
                            //   message.error(errMsg);
                        });
                    });
                } else {
                    //   message.error("Không thể tính toán ngày kết thúc.");
                }
            } finally {
                setIsCalculatingEndDate(false);
            }
        };

        calculateEndDate();
    }, [startDate, repeatDays, subjectId, form]);

    // Hàm kiểm tra xem giáo viên có sẵn sàng hay không
    const isTeacherAvailable = (teacherId, shiftId, currentClassId) => {
        return !Object.entries(teacherAssignments).some(
            ([classId, assignedTeacherId]) => {
                if (classId === currentClassId) return false; // Bỏ qua lớp hiện tại
                const assignedShiftId = classDetails[classId]?.session;
                return (
                    assignedTeacherId === teacherId &&
                    assignedShiftId === shiftId
                );
            }
        );
    };

    // Xử lý khi chọn lớp học
    const handleClassChange = (values) => {
        setSelectedClasses(values);
        // Cập nhật classDetails chỉ giữ lại các lớp đã chọn
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
        // Nếu thay đổi lớp sau khi phân công, reset lại
        if (activeTab === "addTeacher") {
            setActiveTab("configure");
            setTeacherAssignments({});
        }
    };

    // Xử lý thay đổi giá trị trong form
    const handleValuesChange = (changedValues, allValues) => {
        if (changedValues.learningMethod) {
            const updatedDetails = {};
            debugger;
            selectedClasses.forEach((classId) => {
                updatedDetails[classId] = {
                    session: classDetails[classId]?.session || null,
                    classLink: "",
                    classRoom: null,
                };
            });
            setClassDetails(updatedDetails);
            form.setFieldsValue({
                classDetails: updatedDetails,
            });
        }
    };

    // Xử lý khi chuyển tab
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    // Xử lý khi chọn giáo viên cho một lớp
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

        // Cập nhật phân công giáo viên
        setTeacherAssignments((prev) => ({
            ...prev,
            [classId]: teacherId,
        }));
        message.success("Phân công giáo viên thành công!");
    };

    // Xử lý khi submit cấu hình lớp học
    const handleFinish = (values) => {
        console.log("Form values: ", values);
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
        // Reset phân công giáo viên
        setTeacherAssignments({});
        // Chuyển sang tab phân công giáo viên
        setActiveTab("addTeacher");
        message.success("Cấu hình đã được lưu thành công!");
    };

    // Hàm render các trường session và classRoom/classLink cho mỗi lớp
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
            console.log(className);

            return (
                <TabPane tab={`Lớp ${className}`} key={classId}>
                    <Card title={`Ca Học Cho Lớp ${className}`}>
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
                                showSearch
                                placeholder="Chọn ca học"
                                optionFilterProp="children"
                            >
                                {shifts.map((shift) => (
                                    <Option key={shift.id} value={shift.id}>
                                        {`${shift.name}: ${shift.start_time} - ${shift.end_time}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Hiển thị classRoom hoặc classLink dựa trên learningMethod */}
                        {learningMethod === "online" ? (
                            <Form.Item
                                label="Link Học Trực Tuyến"
                                name={["classDetails", classId, "classLink"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập link học!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Link học trực tuyến"
                                    prefix={<LinkOutlined />}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        ) : learningMethod === "offline" ? (
                            <Form.Item
                                label="Phòng Học Trực Tiếp"
                                name={["classDetails", classId, "classRoom"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn phòng học!",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn phòng học"
                                    optionFilterProp="children"
                                >
                                    {rooms.map((room) => (
                                        <Option key={room.id} value={room.id}>
                                            {room.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : null}
                    </Card>
                </TabPane>
            );
        });
    };

    // Hàm render form phân công giáo viên
    const renderTeacherAssignment = () => {
        if (selectedClasses.length === 0) {
            return <p>Vui lòng cấu hình lớp học trước khi thêm giáo viên.</p>;
        }

        return (
            <Form
                layout="vertical"
                onFinish={async () => {
                    // Kiểm tra xem tất cả các lớp đã được phân công giáo viên chưa
                    const allAssigned = selectedClasses.every(
                        (classId) => teacherAssignments[classId]
                    );
                    if (!allAssigned) {
                        message.error(
                            "Vui lòng phân công giáo viên cho tất cả các lớp!"
                        );
                        return;
                    }

                    // Chuẩn bị payload
                    const payload = {
                        start_date: form.getFieldValue("startDate")
                            ? form
                                  .getFieldValue("startDate")
                                  .format("YYYY-MM-DD") // Định dạng "YYYY-MM-DD"
                            : null,
                        end_date: form.getFieldValue("endDate")
                            ? form.getFieldValue("endDate").format("YYYY-MM-DD") // Định dạng "YYYY-MM-DD"
                            : null,
                        days_of_week: form
                            .getFieldValue("repeatDays")
                            .map((day) => {
                                const dayMapping = {
                                    "Thứ 2": 1,
                                    "Thứ 3": 2,
                                    "Thứ 4": 3,
                                    "Thứ 5": 4,
                                    "Thứ 6": 5,
                                    "Thứ 7": 6,
                                };
                                return dayMapping[day];
                            }),
                        learning_method: form.getFieldValue("learningMethod"),
                        classrooms: selectedClasses
                            .map((classId) => {
                                const selectedRoom = rooms.find(
                                    (room) =>
                                        room.id ===
                                        classDetails[classId]?.classRoom
                                );
                                if (
                                    form.getFieldValue("learningMethod") ===
                                        "offline" &&
                                    !selectedRoom
                                ) {
                                    console.error(
                                        `Phòng học không hợp lệ cho lớp: ${classId}, room_id: ${classDetails[classId]?.classRoom}`
                                    );
                                    message.error(
                                        `Phòng học không hợp lệ. Vui lòng chọn lại cho lớp ${classId}.`
                                    );
                                    return null;
                                }
                                return {
                                    id: classId,
                                    shift_id: classDetails[classId]?.session,
                                    room_id:
                                        form.getFieldValue("learningMethod") ===
                                        "offline"
                                            ? selectedRoom.id
                                            : null, // Lấy room_id nếu offline
                                    link:
                                        form.getFieldValue("learningMethod") ===
                                        "online"
                                            ? classDetails[classId]?.classLink
                                            : null,
                                };
                            })
                            .filter((item) => item !== null), // Loại bỏ các mục null
                        teachers: selectedClasses.map((classId) => ({
                            class_id: classId,
                            teacher_id: teacherAssignments[classId],
                        })),
                    };

                    // Kiểm tra xem start_date và end_date đã được đặt chưa
                    if (!payload.start_date || !payload.end_date) {
                        message.error(
                            "Vui lòng nhập đầy đủ ngày bắt đầu và kết thúc!"
                        );
                        return;
                    }

                    try {
                        // Lấy token
                        const token = localStorage.getItem("token");
                        // Gọi API để thêm lịch học
                        // const response = await axios.post(
                        //   `http://localhost:8000/api/admin/schedules/${semesterId}/${courseId}/${majorId}/${subjectId}/add`,
                        //   payload,
                        //   {
                        //     headers: {
                        //       Authorization: `Bearer ${token}`,
                        //     },
                        //   }
                        // );

                        if (
                            response.status === 200 ||
                            response.status === 201
                        ) {
                            message.success("Thêm lịch học thành công!");
                            // Điều hướng đến danh sách lịch học
                            navigate("/admin/list-schedule");
                        } else {
                            message.error("Thêm lịch học thất bại!");
                        }
                    } catch (error) {
                        console.error("Error adding schedule:", error);
                        if (
                            error.response &&
                            error.response.data &&
                            error.response.data.error
                        ) {
                            message.error(
                                `Thêm lịch học thất bại: ${error.response.data.error}`
                            );
                        } else {
                            message.error("Thêm lịch học thất bại!");
                        }
                    }
                }}
            >
                {selectedClasses.map((classId) => {
                    const classIdNumber = Number(classId);
                    const classData = classrooms.find(
                        (c) => c.id === classIdNumber
                    );
                    const className = classData
                        ? classData.name || classData.code
                        : `ID ${classId}`;
                    const details = classDetails[classId];
                    const shiftId = details?.session;
                    const shift = shifts.find((s) => s.id === shiftId);
                    const classLink = details?.classLink || "";
                    const classRoom = details?.classRoom
                        ? rooms.find((room) => room.id === details.classRoom)
                              ?.name
                        : "";

                    return (
                        <Card
                            key={classId} // Sử dụng classId làm key duy nhất
                            title={`Phân Công Giáo Viên Cho Lớp ${className}`}
                            style={{ marginBottom: 16 }}
                        >
                            {/* Hiển thị chi tiết lớp học */}
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Ca Học:</Text>{" "}
                                {shift
                                    ? `${shift.name}: ${shift.start_time} - ${shift.end_time}`
                                    : "Chưa chọn"}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Text strong>Hình Thức Học:</Text>{" "}
                                {learningMethod === "online"
                                    ? "Trực tuyến"
                                    : "Trực tiếp"}
                            </div>
                            {learningMethod === "online" ? (
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong>Link Học Trực Tuyến:</Text>{" "}
                                    {classLink || "Chưa nhập"}
                                </div>
                            ) : (
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong>Phòng Học Trực Tiếp:</Text>{" "}
                                    {classRoom || "Chưa chọn"}
                                </div>
                            )}

                            {/* Chọn Giáo Viên */}
                            <Form.Item
                                label="Chọn Giáo Viên"
                                required
                                validateStatus={
                                    teacherAssignments[classId]
                                        ? "success"
                                        : "error"
                                }
                                help={
                                    teacherAssignments[classId]
                                        ? ""
                                        : "Vui lòng chọn giáo viên!"
                                }
                            >
                                <Select
                                    placeholder="Chọn giáo viên"
                                    value={teacherAssignments[classId]}
                                    onChange={(value) =>
                                        handleTeacherSelect(classId, value)
                                    }
                                >
                                    {teachers.map((teacher) => (
                                        <Option
                                            key={teacher.id}
                                            value={teacher.id}
                                            disabled={
                                                !isTeacherAvailable(
                                                    teacher.id,
                                                    shiftId,
                                                    classId
                                                )
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
                        <Button
                            type="default"
                            onClick={() => setActiveTab("configure")}
                        >
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
                                        <Option
                                            key={classItem.id}
                                            value={classItem.id}
                                        >
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
                                                message:
                                                    "Vui lòng chọn ngày bắt đầu!",
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            format="DD-MM-YYYY" // Định dạng hiển thị "DD-MM-YYYY"
                                            style={{ width: "100%" }}
                                            disabled={
                                                activeTab === "addTeacher"
                                            }
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
                                                message:
                                                    "Vui lòng chọn ngày kết thúc!",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        !getFieldValue(
                                                            "startDate"
                                                        )
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    if (
                                                        value.isAfter(
                                                            getFieldValue(
                                                                "startDate"
                                                            )
                                                        )
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            "Ngày kết thúc phải sau ngày bắt đầu!"
                                                        )
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <DatePicker
                                            format="DD-MM-YYYY" // Định dạng hiển thị "DD-MM-YYYY"
                                            style={{ width: "100%" }}
                                            disabled={
                                                activeTab === "addTeacher"
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Hiển thị loading khi đang tính toán ngày kết thúc */}
                            {isCalculatingEndDate && (
                                <Row>
                                    <Col span={24}>
                                        <Spin
                                            size="small"
                                            tip="Đang tính toán ngày kết thúc..."
                                        />
                                    </Col>
                                </Row>
                            )}

                            {/* Chọn thời gian lặp */}
                            <Form.Item
                                label="Thời Gian Lặp"
                                name="repeatDays"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng chọn ít nhất một ngày!",
                                    },
                                ]}
                            >
                                <Checkbox.Group style={{ width: "100%" }}>
                                    <Row>
                                        {[
                                            "Thứ 2",
                                            "Thứ 3",
                                            "Thứ 4",
                                            "Thứ 5",
                                            "Thứ 6",
                                            "Thứ 7",
                                        ].map((day, index) => (
                                            <Col
                                                span={4}
                                                key={`${day}-${index}`}
                                            >
                                                <Checkbox value={day}>
                                                    {day}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>

                            {/* Chọn hình thức học */}
                            <Form.Item
                                label="Hình Thức Học"
                                name="learningMethod"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn hình thức học!",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn hình thức học"
                                    optionFilterProp="children"
                                    disabled={activeTab === "addTeacher"}
                                >
                                    <Option value="online">Trực tuyến</Option>
                                    <Option value="offline">Trực tiếp</Option>
                                </Select>
                            </Form.Item>

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
                                            disabled={
                                                activeTab === "addTeacher"
                                            }
                                        >
                                            Cập nhật
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

export default ScheduleEdit;
