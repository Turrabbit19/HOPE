import React, { useState, useEffect } from "react";
import {
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Pagination,
  Row,
  Col,
  message,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import Loading from "../../../components/loading";
import instance from "../../../config/axios";

const { Option } = Select;

const ListRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await instance.get(`/admin/rooms`);
        setRooms(data.data);
        console.log(data.data);
      } catch (error) {
        if (error.response && error.response.data) {
          message.error(
            error.response.data.message || "Có lỗi xảy ra, vui lòng thử lại!"
          );
        } else {
          message.error("Lỗi kết nối, vui lòng kiểm tra lại!");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showEditModal = (room) => {
    setIsAddModalVisible(true);
    setUpdate(true);
    form.setFieldsValue({
      name: room.name,
      status: room.status,
    });
    setInitialValues(room.id)
  };

  const showAddModal = () => {
    setEditingRoom(null);
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const onHandleDelete = async (id) => {
    try {
      setLoading(true);
      await instance.delete(`admin/rooms/${id}`);
      setRooms(rooms.filter((item) => item.id != id));
      message.success(
        <span>
          Xóa mềm thành công,{" "}
          <button onClick={() => undoRooms(id)} className="underline">
            Hoàn tác
          </button>
        </span>,
        5
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const undoRooms = async (id) => {
    try {
      const response = await instance.post(`admin/rooms/${id}/restore`);
      const restoredRoom = response.data.data;
      message.success("Khôi phục thành công");
      setRooms((prevRoom) => [...prevRoom, restoredRoom]);
      handleModalCancel();
    } catch (error) {
      console.log(error.message);
      message.error("Khôi phục thất bại thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onHandleSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      await instance.post(`admin/rooms`, values);
      message.success("Thêm phòng học thành công");
      setRooms([...rooms, values]);
      form.resetFields();
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(
          error.response.data.message || "Có lỗi xảy ra, vui lòng thử lại!"
        );
      } else {
        message.error("Lỗi kết nối, vui lòng kiểm tra lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const onHandleUpdate = async (values) => {
    console.log(initialValues);
    console.log(values);
    try {
        setLoading(true);
        await instance.put(`/admin/rooms/${initialValues}`, values);
        setRooms((prevRooms) =>
            prevRooms.map((item) =>
              item.id === initialValues ? { ...item, ...values } : item
            )
          );
        message.success("Cập nhật lớp học thành công");
        handleModalCancel();
      } catch (error) {
        console.log(error.message);
      }finally {
        setLoading(false)
      }
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
  };

  
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="test__list">
      <div className="row row-cols-2 g-3">
        <div className="col-12">
          <div>
            <div className="justify-between flex">
              <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                Quản Lý Phòng Học
                <button>
                  <img src="/assets/svg/reload.svg" alt="reload..." />
                </button>
              </h1>

              <div>
                <Input.Search
                  placeholder="Tìm kiếm phòng học..."
                  style={{ width: 300 }}
                  allowClear
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={showAddModal}
                className="btn btn--outline text-[#7017E2]"
              >
                <PlusOutlined />
                Tạo mới
              </Button>

              <span className="font-bold text-[14px] text-[#000]">
                {rooms.length} items
              </span>
            </div>
          </div>
          <div className="row row-cols-2 g-3">
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <div className="col" key={index}>
                  <div className="teaching__card">
                    <div className="teaching__card-top">
                      <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                        <img src="/assets/svg/share.svg" alt="" />
                        Tên phòng học:{" "}
                        <p className="text-red-300 uppercase ml-2 font-bold">
                          {room.name}
                        </p>
                      </h2>
                      <button>
                        <img src="/assets/svg/more_detail.svg" alt="" />
                      </button>
                    </div>

                    <div className="teaching__card-body">
                      <div className="mt-6 flex flex-col gap-8 pb-6">
                        <div className="flex gap-6">
                          <p className="text-[#9E9E9E]">Trạng thái:</p>
                          <div className="teaching__card-status">
                            <img
                              className="svg-green"
                              src="/assets/svg/status.svg"
                              alt="status"
                            />
                            <span className="text-[#44CC15] text-[12px]">
                              {room.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="teaching__card-bottom">
                      <Link
                        to="list"
                        className="flex items-center gap-3 text-[#1167B4] font-bold"
                      >
                        <img src="/assets/svg/setting.svg" alt="setting" />
                        Quản Lý Phòng Học
                      </Link>
                      <button
                        className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                        onClick={() => showEditModal(room)}
                      >
                        <EditOutlined />
                        Chỉnh sửa
                      </button>
                      <Popconfirm
                        title={`Bạn có chắc muốn xóa phòng ${room.name} này chứ ??`}
                        onConfirm={() => onHandleDelete(room.id)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                          <img src="/assets/svg/remove.svg" alt="remove" />
                          Xóa khỏi Danh Sách
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-center">Không tìm thấy phòng học nào!</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Pagination
        className="mt-12"
        align="center"
        total={rooms.length}
        defaultPageSize={6}
        defaultCurrent={1}
      />
      <Modal
        title={editingRoom ? "Sửa Thông Tin phòng Học" : "Thêm Mới phòng Học"}
        open={isEditModalVisible || isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={update ? onHandleUpdate : onHandleSubmit}
          style={{ padding: "0 20px" }}
        >
          <Form.Item
            label="Tên Phòng Học"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên phòng học!",
              },
            ]}
          >
            <Input placeholder="Nhập tên phòng học" />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" rules={[]}>
            <Select
              defaultValue="Đang sử dụng"
              placeholder="Chọn trạng thái"
              options={[
                {
                  value: "Đang sử dụng",
                  label: "Đang sử dụng",
                },
                {
                  value: "Đang trống",
                  label: "Đang trống",
                },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={handleModalCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {update ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListRooms;
