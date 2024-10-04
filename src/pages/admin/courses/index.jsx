import {
  Button,
  Col,
  Drawer,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  message,
  Table,
  Divider,
} from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import instance from "../../../config/axios";
import Loading from "../../../components/loading";
import { isBefore, isAfter, isEqual } from "date-fns";

const columns = [
  {
    title: "Tên kỳ học",
    dataIndex: "name",
  },
  {
    title: "Thời gian bắt đầu",
    dataIndex: "start_date",
  },
  {
    title: "Thời gian kết thúc",
    dataIndex: "end_date",
    sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
];

const CoursesManager = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { RangePicker } = DatePicker;
  const formatDate = (value) => {
    var date = new Date(value),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("/");
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("admin/courses");
        setData(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const dataSource = data.map((item, index) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const now = formatDate(`${year}/${month}/${day}`);
    return {
      key: index + 1,
      name: item.name,
      start_date: item.start_date,
      end_date: item.end_date,
      status: <span>Đang học</span>
    };
  });

  const onHandleSubmit = async (values) => {
    const outGoingData = {
      name: values.name,
      start_date: formatDate(values.dateTime[0].$d),
      end_date: formatDate(values.dateTime[1].$d),
    };
    // console.log(values.dateTime[0].$d);
    console.log(outGoingData.end_date, outGoingData.start_date);
    try {
      await instance.post("admin/courses", outGoingData);
      message.success("Thêm khóa học thành công");
      form.resetFields();
      setData([...data, outGoingData]);
    } catch (error) {
      if (error.response && error.response.status == 409) {
        message.error("Tên khóa học đã tồn tại, vui lòng đặt tên khác");
        return false;
      }
      console.log(error.message);
      message.error("Thêm khóa học thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <h1 className="flex items-center text-[18px] gap-3 text-[#1167B4] font-bold">
        Tạo mới khóa học
      </h1>
      <Button className="" onClick={showDrawer} icon={<PlusOutlined />}>
        Thêm khóa học
      </Button>

      <div>
        <Divider />

        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 8 }}
        />
      </div>

      <Drawer
        title="Tạo mới khóa học"
        width={500}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={onHandleSubmit} form={form}>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                name="name"
                label="Tên kỳ học"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên kỳ học",
                  },
                ]}
              >
                <Input placeholder="Tên kỳ học" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                name="dateTime"
                label="Thời gian bắt đầu, kết thúc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đầy đủ ngày bắt đầu và kết thúc",
                  },
                ]}
              >
                <RangePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={20}>
              <Button htmlType="submit">Thêm mới</Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default CoursesManager;
