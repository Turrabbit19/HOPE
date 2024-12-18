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
  notification,
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    setInitialValues(room.id);
  };

  const showAddModal = () => {
    setEditingRoom(null);
    form.resetFields();
    setIsAddModalVisible(true);
    setUpdate(false);
  };

  const onHandleDelete = async (id) => {
    try {
      setLoading(true);
      await instance.delete(`admin/rooms/${id}`);
      setRooms(rooms.filter((item) => item.id !== id));

      // Hiển thị thông báo xóa thành công
      message.success(
        <span>
          Xóa mềm thành công,{" "}
          <button onClick={() => undoRooms(id)} className="underline">
            Hoàn tác
          </button>
        </span>,
        5 // Hiển thị trong 5 giây
      );
    } catch (error) {
      console.log(error.message);
      // Hiển thị thông báo xóa thất bại
      message.error("Xóa thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const onHandleSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await instance.post(`admin/rooms`, values);
      const newRoom = response.data.data;

      notification.success({
        message: "Thành công",
        description: "Phòng học đã được tạo mới thành công!",
        duration: 3,
      });

      setRooms([...rooms, newRoom]);
      handleModalCancel();
      form.resetFields();
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        const errors = error.response.data.errors;
        for (let field in errors) {
          notification.error({
            message: `Lỗi ${field}`,
            description: errors[field].join(", "),
            duration: 3,
          });
        }
      } else if (error.response && error.response.status === 500) {
        notification.error({
          message: "Tạo mới thất bại",
          description:
            "Có lỗi xảy ra khi tạo mới phòng học, vui lòng thử lại sau.",
          duration: 3,
        });
      } else {
        notification.error({
          message: "Lỗi kết nối",
          description: "Vui lòng kiểm tra lại kết nối và thử lại.",
          duration: 3,
        });
      }
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

      // Hiển thị thông báo cập nhật thành công
      message.success("Cập nhật phòng học thành công");
      handleModalCancel();
    } catch (error) {
      console.log(error.message);
      // Hiển thị thông báo cập nhật thất bại
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
  };

  if (loading) {
    return <Loading />;
  }

  // Determine which rooms to display based on pagination
  const paginatedRooms = rooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="test__list">
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
                // You can add onSearch or onChange handlers here if needed
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
          {paginatedRooms.length > 0 ? (
            paginatedRooms.map((room) => (
              <div className="col" key={room.id}>
                <div className="teaching__card">
                  <div className="teaching__card-top">
                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                      <img src="/assets/svg/share.svg" alt="" />
                      Tên phòng học:{" "}
                      <p className="text-red-300 uppercase ml-2 font-bold">
                        {room.name}
                      </p>
                    </h2>
                  </div>

                  <div className="teaching__card-body">
                    <div className="mt-6 flex flex-col gap-8 pb-6">
                      {/* Bỏ phần trạng thái */}
                    </div>
                  </div>

                  <div className="teaching__card-bottom">
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

      {/* Pagination Component */}
      {rooms.length > pageSize && (
        <Pagination
          className="mt-12"
          align="center"
          current={currentPage}
          pageSize={pageSize}
          total={rooms.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      )}
      <Modal
        title={editingRoom ? "Sửa Thông Tin Phòng Học" : "Thêm Mới Phòng Học"}
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
