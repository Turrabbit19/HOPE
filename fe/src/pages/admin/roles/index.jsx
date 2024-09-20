import React, { useEffect, useState } from "react";
import instance from "../../../config/axios";
import Loading from "../../../components/loading";
import { Button, Form, Input } from "antd";

const Role = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("admin/roles");
        setData(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const onHandleSubmit = (values) => {
    try {
      const { data } = instance.post("admin/roles", values);
    } catch (error) {
      console.log(error.message);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <h1 className="text-3xl font-bold text-black-600 mb-5">
        Quản lý vai trò
      </h1>
      <Form
        form={form}
        onFinish={onHandleSubmit}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        style={{ maxWidth: 600, marginBottom: "20px" }}
        className=""
      >
        <Form.Item
          label="Tên vai trò"
          name="name"
          className=""
          rules={[
            { required: true, message: "Ngành học bắt buộc phải nhập" },
            { min: 6, message: "Ngành học phải có 6 ký tự trở lên" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Role;
