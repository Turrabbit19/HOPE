import React, { useEffect, useState } from "react";
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
  Table,
  message,
  notification,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import instance from "../../../../config/axios";
import Loading from "../../../../components/loading";

const { Option } = Select;

const ScheduleAdd = () => {
  const [form] = Form.useForm();
  const [learningMethod, setLearningMethod] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [majors, setMajors] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCoures] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedMajorId, setSelectedMajorId] = useState(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const [majors, courses, classrooms, rooms, teachers] = await Promise.all([
        instance.get("admin/majors"),
        instance.get("admin/courses"),
        instance.get("admin/classrooms"),
        instance.get("admin/rooms"),
        instance.get("admin/teachers"),
      ]);
      setCoures(courses.data.data);
      setMajors(majors.data.data);
      setClassrooms(classrooms.data.data);
      setRooms(rooms.data.data);
      setTeachers(teachers.data.data);
    })();
  }, []);

  const handleCourseChange = async (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedMajorId(null);
    setSelectedSemesterId(null);
    const response = await instance.get(`admin/course/${courseId}/semesters`);
    setSemesters(response.data.semesters);
    console.log(response.data.semesters);
  };

  const fetchSubjects = async () => {
  console.log(selectedCourseId, selectedMajorId, selectedSemesterId);
    if (selectedCourseId && selectedMajorId && selectedSemesterId) {
      try {
        // course/{courseId}/semester/{semesterId}/major/{majorId}/subjects
        const response = await instance.get(`admin/course/${selectedCourseId}/semester/${selectedSemesterId}/major/${selectedMajorId}/subjects`);
        console.log(response);
        setSubjects(response.data.subjects);
      } catch (error) {
        message.error("Error fetching subjects. Please try again.");
        console.error("Error fetching subjects:", error);
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [selectedCourseId, selectedMajorId, selectedSemesterId]);

  

  const convertToScheduleJson = (values) => {
    const repeatDays = values.repeatDays || [];
    
    if (repeatDays.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một ngày lặp!");
    }

    const startDate = values.startDate.format("YYYY-MM-DD");
    const endDate = values.endDate.format("YYYY-MM-DD");

    if (endDate < startDate) {
        throw new Error("Ngày kết thúc phải sau ngày bắt đầu!");
    }

    return {
        course_id: values.course,
        semester_id: values.semester,
        major_id: values.major,
        subject_id: values.subject,
        classroom_id: values.class,
        teacher_id: values.teacher,
        shift_id: values.session,
        room_id: values.classRoom || null,
        link: values.learningMethod === "online" ? values.classLink : null,
        start_date: startDate,
        end_date: endDate,
        days_of_week: repeatDays.map(day => {
            switch(day) {
                case "Thứ 2": return 1;
                case "Thứ 3": return 2;
                case "Thứ 4": return 3;
                case "Thứ 5": return 4;
                case "Thứ 6": return 5;
                case "Thứ 7": return 6;
                default: return null;
            }
        }).filter(day => day !== null)
    };
};


  const handleFinish = async (values) => {
    console.log("Form values: ", values);
    console.log(convertToScheduleJson(values));
    try {
        setLoading(true);
        await instance.post(`/admin/schedules`, convertToScheduleJson(values));
        notification.success({
            message: "Tạo mới lịch học thành công"
        })
        form.resetFields();
    } catch (error) {
        notification.error({
            message: `Tạo mới lịch học thất bại: ${error.message}`
        })
    }finally{
        setLoading(false);
    }
  };

  const handleLearningMethodChange = (value) => {
    debugger
    setLearningMethod(value);
  };

  const handleCreateSchedule = () => {
    debugger
    form.validateFields().then((values) => {
      const repeatDays = values.repeatDays || [];
      if (repeatDays.length === 0) {
        message.error("Vui lòng chọn ít nhất một ngày lặp!");
        return;
      }

      const startDate = values.startDate;
      const endDate = values.endDate;
      if (endDate.isBefore(startDate)) {
        message.error("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }

      const schedule = repeatDays.map((day, index) => ({
        key: index + 1,
        session: `Buổi ${index + 1}`,
        date: startDate.format("DD-MM-YYYY"),
        startTime: `${7 + index * 2}h15`,
        endTime: `${9 + index * 2}h15`,
        learningMethod:
          values.learningMethod === "online" ? "Trực tuyến" : "Trực tiếp",
        link:
          values.learningMethod === "online"
            ? values.classLink
            : values.classRoom,
      }));
      setScheduleData(schedule);
    });
  };

  const columns = [
    {
      title: "Buổi Học",
      dataIndex: "session",
      key: "session",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Thời Gian Bắt Đầu",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Thời Gian Kết Thúc",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Hình Thức Học",
      dataIndex: "learningMethod",
      key: "learningMethod",
    },
    {
      title: "Link Học Trực Tuyến/Phòng Học",
      dataIndex: "link",
      key: "link",
      render: (text, record) =>
        record.learningMethod === "Trực tuyến" && text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          text
        ),
    },
  ];
  if(loading) {
    return <Loading/>
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cấu Hình Thông Tin</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {/* Ngày Bắt Đầu, Ngày Kết Thúc */}
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
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
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
              ]}
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 1: Khóa Học, Kỳ Học, Ngành Học */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Khóa Học"
              name="course"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn khóa học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn khóa học"
                optionFilterProp="children"
                onChange={handleCourseChange}
              >
                {courses.map((course) => (
                  <Option key={course.id} value={course.id}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Kỳ Học"
              name="semester"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn kỳ học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn kỳ học"
                optionFilterProp="children"
                onChange={setSelectedSemesterId}
              >
                {semesters.map((semester) => (
                  <Option key={semester.id} value={semester.id}>
                    {semester.semester.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Ngành Học"
              name="major"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngành học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn ngành học"
                optionFilterProp="children"
                onChange={setSelectedMajorId}
              >
                {majors.map((major) => (
                  <Option key={major.id} value={major.id}>
                    {major.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 2: Môn Học, Lớp Học */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Môn Học"
              name="subject"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn môn học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn môn học"
                optionFilterProp="children"
              >
                {subjects.map((subject, item) => (
                  <Option key={item} value={subject.id}>
                    {subject.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Lớp Học"
              name="class"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn lớp học!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn lớp học"
                optionFilterProp="children"
              >
                {classrooms.map((classItem) => (
                  <Option key={classItem.id} value={classItem.id}>
                    {classItem.code}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 3: Thứ Trong Tuần */}
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
          <Checkbox.Group style={{ width: "50%" }}>
            <Row>
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map(
                (day, index) => (
                  <Col span={4} key={index}>
                    <Checkbox value={day}>{day}</Checkbox>
                  </Col>
                )
              )}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        {/* Hàng 4: Ca Học */}
        <Form.Item
          label="Ca Học"
          name="session"
          rules={[{ required: true, message: "Vui lòng chọn ca học!" }]}
        >
          <Select
            showSearch
            placeholder="Chọn ca học"
            optionFilterProp="children"
          >
            {[...Array(6)].map((_, i) => (
              <Option key={i} value={`${i + 1}`}>{`Ca ${i + 1}: ${
                7 + i * 2
              }h15 - ${9 + i * 2}h15`}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Hàng 5: Giảng Viên, Hình Thức Học */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giảng Viên"
              name="teacher"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giảng viên!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn giảng viên"
                optionFilterProp="children"
              >
                {teachers.map((teacher) => (
                  <Option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
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
                onChange={handleLearningMethodChange}
              >
                <Option value="online">Trực tuyến</Option>
                <Option value="offline">Trực tiếp</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {learningMethod === "online" && (
          <Form.Item
            label="Link Học Trực Tuyến"
            name="classLink"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập link học!",
              },
            ]}
          >
            <Input
              placeholder="Link phòng học"
              prefix={<LinkOutlined />}
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
        {learningMethod === "offline" && (
          <Form.Item
            label="Phòng Học Trực Tiếp"
            name="classRoom"
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
        )}

        <Button
          type="dashed"
          className="w-full mb-6"
          onClick={handleCreateSchedule}
        >
          Tạo Danh Sách Lịch Học
        </Button>

        {/* Kết Quả Lịch Học */}
        {scheduleData.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-4">Kết Quả Lịch Học</h3>
            <Table
              columns={columns}
              dataSource={scheduleData}
              pagination={false}
            />
          </>
        )}

        {/* Nút Hành Động */}
        <Form.Item>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="default">Hủy Bỏ</Button>
            <Button type="primary" htmlType="submit">
              Lưu Lại
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ScheduleAdd;
