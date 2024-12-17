import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Button, Table, Empty } from "antd";
import instance from "../../../config/axios";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;
const { Option } = Select;

const TuitionFee = () => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const courses = await instance.get(`admin/courses`);
      setCourses(courses.data.data);
    })();
  }, []);

  const handleFinish = async (values) => {
    const { dateRange, course } = values;
    console.log(values);
    try {
      const response = await instance.post(
        "admin/paypal/getTransactionsByCourse",
        {
          course: course || null,
          startDate: dateRange ? dateRange[0].format("YYYY-MM-DD") : null,
          endDate: dateRange ? dateRange[1].format("YYYY-MM-DD") : null,
        }
      );

      setData(response.data);
    } catch (error) {
      console.error("Error fetching tuition fee data:", error);
      setData([]); // Reset data on error
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "payment_id",
      key: "payment_id",
    },
    {
      title: "Mã Sinh Viên",
      dataIndex: ["student", "student_code"], // Nested field
      key: "student_code",
    },
    {
      title: "Kỳ đóng học",
      dataIndex: "semester", // Nested field
      key: "semester",
    },
    {
      title: "Tên Sinh viên",
      dataIndex: ["student", "name"], // Nested field
      key: "name",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Loại tiền",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Ngày đóng học",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleDateString("en-GB"),
    },
  ];

  const handleExport = () => {
    const exportData = data.map((item) => ({
      "Mã giao dịch": item.payment_id,
      "Mã Sinh Viên": item.student ? item.student.student_code : "",
      "Kỳ học": item.semester,
      "Tên Sinh viên": item.student ? item.student.name : "",
      "Số tiền": item.amount,
      "Loại tiền": item.currency,
      "Ngày đóng học": new Date(item.created_at).toLocaleDateString("vi-VN"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách giao dịch");
    XLSX.writeFile(wb, "Tuition_Fees.xlsx");
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
        <Form.Item label="Khoảng thời gian" name="dateRange" >
          <RangePicker format="DD/MM/YYYY" />
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
        <div className="flex gap-3 justify-center">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Form.Item>
          <Button
            type="primary"
            onClick={handleExport}
            disabled={data.length === 0}
          >
            Xuất Excel
          </Button>
        </div>
      </Form>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        locale={{
          emptyText: (
            <Empty
              description="Không có dữ liệu"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
    </div>
  );
};

export default TuitionFee;
