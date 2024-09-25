import { Button, Col, Form, Input, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import instance from "../../../config/axios";
import Loading from "../../../components/loading";

const SectionManage = () => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("admin/sections");
        setSections(data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const onHandleSubmit = async (values) => {
    setLoading(true);
    try {
      await instance.post("admin/sections", values);
      setSections([...sections, values]);
      message.success("Thêm sections thành công");
    } catch (error) {
      message.error("Thêm sections thất bại");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  const onHandleDelete = async (id) => {
    setLoading(true);
    try {
      instance.delete("admin/sections" + id);
      setSections(sections.filter((item) => item.id != id));
      message.success("Xóa mềm sections thành công");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  const onHandleUpdate = async (values) => {
    setLoading(true);
    try {
      instance.update(`admin/sections/${values.id}` + values);
      message.success("Cập nhật section thành công");
      setSections(
        sections.map((item) => (item.id == values.id ? values : item))
      );
    } catch (error) {
      console.log(error.message);
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };
  const undoSections = async (id) => {
    setLoading(true);
    try {
      instance.post(`admin/sections/${id}/store`);
    } catch (error) {
      console.log(error.message);
      message.error("Hoàn tác thất bại");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Form
        layout="vertical"
        onFinish={onHandleSubmit}
        form={form}
        // initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên sections"
              rules={[
                {
                  required: true,
                  message: "Vui lòng sections",
                },
              ]}
            >
              <Input placeholder="Tên kỳ học" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={20}>
            <Button htmlType="submit" loading={loading}>
              Thêm mới
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default SectionManage;
