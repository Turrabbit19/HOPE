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
  Tabs,
  Card,
  message,
  notification,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import instance from "../../../../config/axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;

const ScheduleAdd = () => {
  const [form] = Form.useForm();
  const [selectedClasses, setSelectedClasses] = useState([]);  // Store classIds
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, semesterId, majorId, subjectId } = location.state || {};
  const [subject, setSubject] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setLoading(true);
    instance
      .get("admin/classrooms")
      .then((response) => {
        setClassrooms(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Lỗi khi tải danh sách phòng học!");
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    instance
      .get("admin/teachers")
      .then((response) => {
        setTeachers(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Lỗi khi tải danh sách giảng viên!");
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    instance
      .get("admin/rooms")
      .then((response) => {
        setRooms(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Lỗi khi tải danh sách phòng học!");
      });
  }, [form.getFieldValue("learningMethod")]);

  useEffect(() => {
    if (subjectId) {
      instance
        .get(`admin/subjects/${subjectId}`)
        .then((response) => {
          setSubject(response.data);
        })
        .catch(() => {
          message.error("Lỗi khi tải thông tin môn học!");
        });
    }
  }, [subjectId]);

  const handleClassChange = (values) => {
    console.log(values);
    setSelectedClasses(values);  // Store selected classIds
  };

  const calculateEndDate = async (startDate, subjectId, daysOfWeek) => {
    console.log(daysOfWeek);
    const payload = {
      start_date: startDate,
      subject_id: subjectId,
      days_of_week: daysOfWeek.map((day) => {
        switch (day) {
          case "Thứ 2":
            return "2";
          case "Thứ 3":
            return "3";
          case "Thứ 4":
            return "4";
          case "Thứ 5":
            return "5";
          case "Thứ 6":
            return "6";
          case "Thứ 7":
            return "7";
          default:
            return "";
        }
      }),
    };
    console.log(payload);
    try {
      const response = await instance.post(`admin/calculate-end-date`, payload);
      console.log(response);
      setEndDate(response.data.end_date);
      form.setFieldsValue({ endDate: response.data.end_date });
    } catch (error) {
      message.error("Không thể tính toán ngày kết thúc.");
    }
  };

  const handleFinish = async (values) => {
    debugger;
    console.log(values);
    try {
      const transformedValues = selectedClasses.map((classId) => {
        const classDetails = values.classDetails[classId];
        console.log(classDetails);
        return {
          id: classId,
          teacher_id: classDetails.teacher,
          shift_id: classDetails.session,
          start_date: moment(classDetails.startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
          days_of_week: classDetails.repeatDays.map((day) => {
            switch (day) {
              case "Thứ 2":
                return "2";
              case "Thứ 3":
                return "3";
              case "Thứ 4":
                return "4";
              case "Thứ 5":
                return "5";
              case "Thứ 6":
                return "6";
              case "Thứ 7":
                return "7";
              default:
                return "";
            }
          }),
          room_id:
            classDetails.learningMethod === "offline"
              ? classDetails.classRoom
              : null,
          link:
            classDetails.learningMethod === "online"
              ? classDetails.classLink
              : null,
        };
      });
      console.log(transformedValues);
      const response = await instance.post(
        `admin/schedules/${courseId}/${semesterId}/${majorId}/${subjectId}/add`,
        {
          classrooms: transformedValues,
        }
      );
      notification.success({
        message: "Thêm lịch học thành công",
      });
      form.resetFields();
      setTimeout(() => {
        navigate("/admin/list-schedule");
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClassIdChange = (values) => {
    const selectedClassDetails = classrooms.filter((classroom) =>
      values.includes(classroom.id)  // Match the selected classIds
    );
    setSelectedClasses(selectedClassDetails.map((classroom) => classroom.id));  // Store only classIds
  };

  const renderClassFields = () => {
    return selectedClasses.map((classId) => (
      <TabPane tab={`Lớp ${classId}`} key={classId}>
        <Card title={`Thông Tin Cho Lớp ${classId}`}>
          {/* Giảng Viên */}
          <Form.Item
            label="Giảng Viên"
            name={["classDetails", classId, "teacher"]}
            rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}>
            <Select
              showSearch
              placeholder="Chọn giảng viên"
              optionFilterProp="children">
              {teachers.map((teacher) => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Ngày Bắt Đầu */}
          <Form.Item
            label="Ngày Bắt Đầu"
            name={["classDetails", classId, "startDate"]}
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}>
            <DatePicker
              format="DD-MM-YYYY"
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                calculateEndDate(
                  dateString,
                  subjectId,
                  form.getFieldValue(["classDetails", classId, "repeatDays"])
                )
              }
            />
          </Form.Item>

          <Form.Item
            label="Thời Gian Lặp"
            name={["classDetails", classId, "repeatDays"]}
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một ngày!" }]}>
            <Checkbox.Group style={{ width: "100%" }}>
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

          <Form.Item
            label="Ngày Kết Thúc"
            name="endDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}>
            <Input
              value={endDate ? moment(endDate).format("DD-MM-YYYY") : ""}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Ca Học"
            name={["classDetails", classId, "session"]}
            rules={[{ required: true, message: "Vui lòng chọn ca học!" }]}>
            <Select showSearch placeholder="Chọn ca học">
              {[...Array(6)].map((_, i) => (
                <Option key={i} value={`${i + 1}`}>{`Ca ${i + 1}: ${
                  7 + i * 2
                }h15 - ${9 + i * 2}h15`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Hình Thức Học"
            name={["classDetails", classId, "learningMethod"]}
            rules={[{ required: true, message: "Vui lòng chọn hình thức học!" }]}>
            <Select
              showSearch
              placeholder="Chọn hình thức học"
              onChange={() =>
                form.resetFields([
                  `classDetails.${classId}.classRoom`,
                  `classDetails.${classId}.classLink`,
                ])
              }>
              <Option value="online">Trực tuyến</Option>
              <Option value="offline">Trực tiếp</Option>
            </Select>
          </Form.Item>

          {/* Conditional Rendering based on Learning Method */}
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.classDetails?.[classId]?.learningMethod !==
              currentValues.classDetails?.[classId]?.learningMethod
            }>
            {({ getFieldValue }) => {
              const learningMethod = getFieldValue([
                "classDetails",
                classId,
                "learningMethod",
              ]);
              if (learningMethod === "online") {
                return (
                  <Form.Item
                    label="Link Học Trực Tuyến"
                    name={["classDetails", classId, "classLink"]}
                    rules={[{ required: true, message: "Vui lòng nhập link học!" }]}>
                    <Input
                      placeholder="Link phòng học"
                      prefix={<LinkOutlined />}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                );
              } else if (learningMethod === "offline") {
                return (
                  <Form.Item
                    label="Phòng Học"
                    name={["classDetails", classId, "classRoom"]}
                    rules={[{ required: true, message: "Vui lòng chọn phòng học!" }]}>
                    <Select placeholder="Chọn phòng học">
                      {rooms.map((room) => (
                        <Option key={room.id} value={room.id}>
                          {room.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              }
            }}
          </Form.Item>
        </Card>
      </TabPane>
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cấu Hình Thông Tin</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="bg-white p-6 rounded-lg shadow-md">
        <Form.Item
          label="Lớp Học"
          name="classes"
          rules={[{ required: true, message: "Vui lòng chọn lớp học!" }]}>
          <Select
            mode="multiple"
            showSearch
            placeholder="Chọn lớp học"
            onChange={handleClassChange}
            loading={loading}>
            {classrooms.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.code} {/* Displaying class code */}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedClasses.length > 0 && <Tabs>{renderClassFields()}</Tabs>}

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
