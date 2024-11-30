import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Button } from "antd";
import instance from "../../../config/axios";

const { RangePicker } = DatePicker;
const { Option } = Select;
const TuitionFee = () => {
  const [form] = Form.useForm();
  const [majors, setMajors] = useState([]);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    (async () => {
      const [majors, courses] = await Promise.all([
        instance.get(`admin/main/majors`),
        instance.get(`admin/courses`),
      ]);
      console.log(majors);
      setMajors(majors.data.data);
      setCourses(courses.data.data);
    })();
  }, []);
  const handleFinish = (values) => {
    console.log("Form values:", values);
  };
  return (
    <div className="border-black-2">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          major: undefined,
          course: undefined,
        }}
      >
        <Form.Item label="Khoảng thời gian" name="dateRange">
          <RangePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item label="Ngành học" name="major">
          <Select placeholder="Chọn ngành học">
            {majors.map((item) => (
              <Option key={item.id} value={item.id} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Khóa học" name="course">
          <Select placeholder="Chọn khóa học">
            {courses.map((item) => (
              <Option key={item.id} value={item.id} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TuitionFee;
