import React, { useEffect, useState } from "react";
import instance from "../../../config/axios";
import Loading from "../../../components/loading";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Table,
  Drawer,
  Space,
  Select,
  message,
  Popconfirm,
} from "antd";
import { isBefore } from "date-fns";
import dayjs from "dayjs";

const SemesterManage = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [update, setUpdate] = useState(false);
  const [currentName, setCurrentName] = useState();
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
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
    setUpdate(false);
    setInitialValues({});
    form.resetFields();
    setOpen(false);
  };
  useEffect(() => {
    (async () => {
      try {
        const [semesters, courses] = await Promise.all([
          instance.get("admin/semesters"),
          instance.get("admin/courses"),
        ]);
        setSemesters(semesters.data.data);
        setCourses(courses.data.data);
        // console.log(courses.data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  //   console.log(semesters);
  //   console.log(courses);
  const dataSource = semesters.map((item, index) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const now = formatDate(`${year}/${month}/${day}`);
    const course = courses.find((course) => course.id === item.course_id);
    // console.log(item.course_id);
    return {
      key: index + 1,
      name: item.name,
      start_date: item.start_date,
      end_date: item.end_date,
      course_name: course ? course.name : "Khóa học không xác định",
      status: isBefore(now, item.end_date) ? (
        <span className="text-blue-500">Đang diễn ra</span>
      ) : (
        <span className="text-red-500">Đã kết thúc</span>
      ),
    };
  });
  const onHandleSubmit = async (values) => {
    // console.log(values);
    const outGoingData = {
      name: values.name,
      start_date: formatDate(values.dateTime[0].$d),
      end_date: formatDate(values.dateTime[1].$d),
      course_id: values.course_id,
    };
    console.log(outGoingData);
    console.log(currentName);
    //   const outGoingDataClone = [...outGoingData, course_name]
    try {
      if (update) {
        await instance.put(`admin/semesters/${currentName}`, outGoingData);
        message.success("Cập nhật kỳ học thành công");
      } else {
        await instance.post("admin/semesters", outGoingData);
        message.success("Thêm khóa học thành công");
      }
      form.resetFields();
      setSemesters(
        update
          ? semesters.map(
              (item) => (item.name = currentName ? item : outGoingData)
            )
          : [...semesters, outGoingData]
      );
    } catch (error) {
      if (error.response && error.response.status == 409) {
        message.error("Tên kỳ học đã tồn tại, vui lòng đặt tên khác");
        return false;
      }
      console.log(error.message);
      !update
        ? message.error("Thêm kỳ học thất bại")
        : message.error("Cập nhật kỳ học thất bại");
    } finally {
      setLoading(false);
    }
  };
  const onHandleDelete = async (name) => {
    try {
      await instance.delete(`admin/semesters/${name}`);
      setSemesters(semesters.filter((item) => item.name != name));
      message.success("Xóa mềm kỳ học thành công");
    } catch (error) {
      console.log(error.message);
      message.error("Xóa thất bại");
    }
  };
  const handleEdit = async (name) => {
    setOpen(true);
    setUpdate(true);
    // console.log(name);
    try {
      const { data } = await instance.get("admin/semesters/" + name);
      //   console.log(formatDate(data.data.dateTime[0].$d));
      // console.log(dayjs(data.data.start_date));
      // console.log(data.data);
      setInitialValues({
        name: data.data.name,
        dateTime: [dayjs(data.data.start_date), dayjs(data.data.end_date)],
        course_id: data.data.course_id,
      });
      form.setFieldsValue({
        name: data.data.name,
        dateTime: [dayjs(data.data.start_date), dayjs(data.data.end_date)],
        course_id: data.data.course_id,
      });
      setCurrentName(name);
      //   console.log(initialValues);
    } catch (error) {
      console.log(error);
    }
    // }
  };
  const onFinishFailed = () => {};
  const columns = [
    {
      title: "Tên kỳ học",
      dataIndex: "name",
    },
    {
      title: "Khóa học",
      dataIndex: "course_name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record.name)}>
            Chỉnh sửa
          </Button>

          <Popconfirm
            className="ml-2"
            title="Delete the task"
            description="Are you sure to delete this task?"
            onCancel={onFinishFailed}
            onConfirm={() => onHandleDelete(record.name)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Button className="mb-2" onClick={showDrawer} icon={<PlusOutlined />}>
        Thêm kỳ học
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 8 }}
      />
      <Drawer
        title={update ? "Cập nhật khóa học" : "Thêm mới khóa học"}
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
        <Form
          layout="vertical"
          onFinish={onHandleSubmit}
          form={form}
          initialValues={initialValues}
        >
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
                name="course_id"
                label="Khóa học"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khóa học",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 250,
                  }}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                >
                  {courses.map((item, index) => (
                    <Option key={index} value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
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
              <Button htmlType="submit">
                {update ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default SemesterManage;
