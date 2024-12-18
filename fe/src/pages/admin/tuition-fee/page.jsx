import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Button, Table, Empty, message } from "antd";
import instance from "../../../config/axios";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;
const { Option } = Select;

const TuitionFee = () => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await instance.get(`admin/courses`);
        setCourses(res.data.data);
      } catch (error) {
        message.error("Không thể lấy dữ liệu khóa học");
      }
    };
    fetchCourses();
  }, []);

  const handleFinish = async (values) => {
    const { dateRange, course } = values;
    setLoading(true);

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
      message.error("Không thể lấy dữ liệu học phí");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data.length === 0) {
      message.warning("Không có dữ liệu để xuất Excel");
      return;
    }

    const exportData = data.map((item) => ({
      "Mã giao dịch": item.payment_id,
      "Mã Sinh Viên": item.student?.student_code || "N/A",
      "Kỳ học": item.semester,
      "Tên Sinh viên": item.student?.name || "N/A",
      "Số tiền": item.amount,
      "Loại tiền": item.currency,
      "Ngày đóng học": new Date(item.created_at).toLocaleDateString("vi-VN"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách giao dịch");
    XLSX.writeFile(wb, `Tuition_Fees_${Date.now()}.xlsx`);
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "payment_id",
      key: "payment_id",
    },
    {
      title: "Mã Sinh Viên",
      dataIndex: ["student", "student_code"],
      key: "student_code",
      render: (text) => text || "N/A",
    },
    {
      title: "Kỳ đóng học",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "Tên Sinh viên",
      dataIndex: ["student", "name"],
      key: "name",
      render: (text) => text || "N/A",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => new Intl.NumberFormat("vi-VN").format(amount),
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
      render: (text) =>
        new Date(text).toLocaleDateString("vi-VN") || "Không xác định",
    },
  ];

  return (
    <div className="border p-4 bg-white shadow-lg">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          course: undefined,
        }}
      >
        <Form.Item label="Khoảng thời gian" name="dateRange">
          <RangePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item label="Khóa học" name="course">
          <Select placeholder="Chọn khóa học" allowClear>
            {courses.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex gap-3 justify-center">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
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
        loading={loading}
        bordered
      />
    </div>
  );
};

export default TuitionFee;
