import React, { useEffect, useState } from "react";
import Loading from "../../../components/loading";
import instance from "../../../config/axios";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";

const SubjectManager = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [currentId, setCurrentId] = useState();
  const [form] = useForm();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setUpdate(false);
    setOpen(false);
    setInitialValues({});
    form.setFieldsValue({});
  };
  useEffect(() => {
    (async () => {
      try {
        const [semesters, majors, subjects] = await Promise.all([
          instance.get("admin/semesters"),
          instance.get("admin/majors"),
          instance.get("admin/subjects"),
        ]);
        setSemesters(semesters.data.data);
        setMajors(majors.data.majors);
        setSubjects(subjects.data.data);
        // console.log(semesters.data.data);
        // console.log(majors.data.majors);
        // console.log(subjects.data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  //   console.log(majors);
  //   console.log(semesters);
  const onHandleSubmit = async (values) => {
    console.log(values);
    // return;
    //   const outGoingDataClone = [...outGoingData, course_name]
    try {
      if (update) {
        await instance.put(`admin/subjects/${currentId}`, values);
        message.success("Cập nhật kỳ học thành công");
        setSubjects(
          semesters.map((item) =>
            item.id == currentId ? values : item
          )
        );
        form.resetFields();
      } else {
        await instance.post("admin/subjects", values);
        message.success("Thêm khóa học thành công");
        setSubjects([...subjects, values]);
        form.resetFields();
      }
    } catch (error) {
      if (error.response && error.response.status == 409) {
        message.warning("Tên kỳ học đã tồn tại, vui lòng đặt tên khác");
        return false;
      }
      //   console.log(error.message);
      //   !update
      message.error("Thêm kỳ học thất bại");
      // : message.error("Cập nhật kỳ học thất bại");
    } finally {
      setLoading(false);
    }
  };
  const onHandleDelete = async (id) => {
    try {
      await instance.delete(`admin/subjects/${id}`);
      setSubjects(subjects.filter((item) => item.id != id));
      message.success(
        <span>
          Xóa mềm thành công,{" "}
          <button onClick={() => undoSubject(id)} className="underline">
            Hoàn tác
          </button>
        </span>,
        5
      );
    } catch (error) {
      console.log(error.message);
      message.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };
  const undoSubject = async (id) => {
    try {
      const values = await instance.post(`admin/subjects/${id}/restore`);
      console.log(values.data.data);
      message.success("Khôi phục thành công");
      setSubjects((prevSubjects) => [...prevSubjects, restoredSubject]);
    } catch (error) {
      console.log(error.message);
      message.error("Khôi phục thất bại thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (id) => {
    setOpen(true);
    setUpdate(true);
    try {
      const { data } = await instance.get("admin/subjects/" + id);
      console.log(data.data);
      setInitialValues({
        name: data.data.name,
        major_id: data.data.major_id,
        semester_id: data.data.semester_id,
        description: data.data.description,
        credit: data.data.credit,
        subject_code: data.data.subject_code,
      });
      form.setFieldsValue({
        name: data.data.name,
        major_id: data.data.major_id,
        semester_id: data.data.semester_id,
        description: data.data.description,
        credit: data.data.credit,
        subject_code: data.data.subject_code,
      });
      setCurrentId(id);
    } catch (error) {
      console.log(error);
    }
    // }
  };
  const onFinishFailed = () => {};
  const dataSource = subjects.map((item, index) => {
    return {
      key: item.id,
      id: item.id,
      stt: index + 1,
      name: item.name,
      subject_code: item.subject_code,
      major_name: item.major_name,
      semester_name: item.semester_name,
      description: item.description,
      credit: item.credit,
    };
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
    },
    {
      title: "Mã môn",
      dataIndex: "subject_code",
      render: (text) => <span style={{ color: "red" }}>{text}</span>,
    },
    {
      title: "Tên môn học",
      dataIndex: "name",
    },
    {
      title: "Kỳ học",
      dataIndex: "semester_name",
    },
    {
      title: "Ngành học",
      dataIndex: "major_name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Credit",
      dataIndex: "credit",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Chỉnh sửa
          </Button>

          <Popconfirm
            className="ml-2"
            title="Delete the task"
            description="Are you sure to delete this task?"
            onCancel={onFinishFailed}
            onConfirm={() => onHandleDelete(record.id)}
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
        Thêm môn học
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 8 }}
      />
      <Drawer
        title={update ? "Cập nhật môn học" : "Thêm mới môn học"}
        width={700}
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
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên môn học"
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
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="major_id"
                label="Tên ngành học"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngành học",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 300,
                  }}
                  placeholder="Vui lòng chọn ngành học"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                >
                  {majors.map((item, index) => (
                    <Option key={index} value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="semester_id"
                label="Kỳ học"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn kỳ học",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 300,
                  }}
                  placeholder="Vui lòng chọn kỳ học"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                >
                  {semesters.map((item, index) => (
                    <Option key={index} value={item.id} label={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="credit"
                label="Credit"
                style={{
                  width: 300,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập credit",
                  },
                  {
                    min: 1,
                    message: "Vui lòng nhập credit lớn hơn 1",
                  },
                  {
                    max: 19,
                    message: "Credit nhỏ hơn 19",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập credit" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item name="description" label="Mô tả">
                <TextArea rows={5}></TextArea>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={20}>
              <Button htmlType="submit" loading={loading}>
                {update ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default SubjectManager;
