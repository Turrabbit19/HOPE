import { Button, Col, message, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import Loading from "../../../components/loading";
import instance from "../../../config/axios";

const NotificationManage = () => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  //   const []
  const [sections, setSections] = useState([]);
  const [noti, setNoti] = useState([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [sections, noti] = await Promise.all([
          instance.get("admin/sections"),
          instance.get("admin/notifications"),
        ]);
        setSections(sections.data.data);
        setNoti(noti.data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const onHandleSubmit = async (values) => {
    try {
      setLoading(true);
      instance.post("admin/notifications", values);
      message.success("Thêm thông báo thành công");
      setNoti([...noti, values]);
    } catch (error) {
      console.log(object);
      message.error("Thêm thông báo thất bại");
    } finally {
      setLoading(false);
    }
  };
  const onHandleDelete = async (id) => {
    setLoading(true);
    try {
      instance.delete(`admin/notifcations/${id}`);
      message.success("Xóa thành công");
      setNoti(noti.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error.message);
      message.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };
  const onHandleUpdate = async (values) => {
    setLoading(true);
    try {
      await instance.put(`admin/notifications/${values.id}`, values);
      message.success("Cập nhật thông báo thành công");
      setNoti(noti.map((item) => (item.id == values.id ? values : item)));
    } catch (error) {
      message.error("Cập nhật thông báo thất bại");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  const onHandleUndo = async (id) => {
    setLoading(true);
    try {
      await instance.post(`admin/notifications/${id}/restore`);
      message.success("Hoàn tác thông báo đã xóa thành công");
    } catch (error) {
      console.log(error.message);
      message.error("Hoàn tác thông báo thất bại");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="grid grid-cols-4 gap-x-2.5 gap-y-0">
        <div className="flex justify-center">
          <h1>Thông tin học tập</h1>
        </div>
        <div className="flex justify-center">
          <h1>Thông tin hoạt động</h1>
        </div>
        <div className="flex justify-center">
          <h1>Thông tin học phí</h1>
        </div>
        <div className="flex justify-center">
          <h1>Thông tin việc làm</h1>
        </div>
      </div>
      <Modal
        title={
          <>
            <h1 className="text-center">Thông báo</h1>
          </>
        }
        footer={<Button type="primary">Reload</Button>}
        width="90%"
        height="500"
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default NotificationManage;
