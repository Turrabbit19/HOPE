import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Button, Table } from "antd";
import instance from "../../../config/axios";

const { RangePicker } = DatePicker;
const { Option } = Select;

const TuitionFee = () => {
  const [form] = Form.useForm();
  const [majors, setMajors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [data, setData] = useState([]); // State to store the table data

  useEffect(() => {
    (async () => {
      const [majors, courses] = await Promise.all([
        instance.get(`admin/main/majors`),
        instance.get(`admin/courses`),
      ]);
      setMajors(majors.data.data);
      setCourses(courses.data.data);
    })();
  }, []);

  const handleFinish = async (values) => {
    const { dateRange, major, course } = values;
    console.log(values);
    try {
      const response = await instance.post("admin/paypal/getTransactionsByCourse", {
        major: major || null,
        course: course || null,
        startDate: dateRange ? dateRange[0].format("YYYY-MM-DD") : null,
        endDate: dateRange ? dateRange[1].format("YYYY-MM-DD") : null,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching tuition fee data:", error);
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "payment_id",
      key: "payment_id",
    },
    {
      title: "Student Code",
      dataIndex: ["student", "student_code"], // Nested field
      key: "student_code",
    },
    {
      title: "Student Name",
      dataIndex: ["student", "name"], // Nested field
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleDateString('en-GB'), 
    },
  ];

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

      {/* Table for displaying tuition fee data */}
      <Table dataSource={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default TuitionFee;
