import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  message,
  Pagination,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import Loading from "../../../components/loading";
import instance from "../../../config/axios";
import debounce from "lodash";

const { Option } = Select;

const ClassRoom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentId, setCurrentId] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { subjectId } = useLocation().state || {};

  const searchRef = useRef(searchTerm);

  useEffect(() => {
    if (subjectId) {
      console.log(subjectId);
      setIsAddModalVisible(true);
      form.setFieldsValue({ name: subjectId });
    }
  }, [subjectId]);

  useEffect(() => {
    const fetchClassrooms = async (page, search) => {
      setLoading(true);
      try {
        const response = await instance.get("admin/classrooms", {
          params: {
            page,
            search: search || "",
          },
        });
        const { data, pagination: pag } = response.data;
        setClassrooms(data);
        setPagination((prev) => ({
          ...prev,
          total: pag.total,
          current: pag.current_page,
        }));
      } catch (error) {
        console.error("Lỗi từ server:", error);
        message.error("Lỗi tải dữ liệu, vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms(pagination.current, searchRef.current);
  }, [pagination.current]);

  const handleSearchChange = (e) => {
    searchRef.current = e.target.value;
  };

  const handleSearchSubmit = debounce((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Đặt lại trang về 1 khi tìm kiếm
  }, 500);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const onHandleUpdate = async (values) => {
    setLoading(true);
    console.log(values);
    try {
      await instance.put(`admin/classrooms/${currentId}`, {
        ...values,
        subject_id: values.name,
      });
      setClassrooms((prevClassrooms) =>
        prevClassrooms.map((classroom) =>
          classroom.id === currentId ? { ...classroom, ...values } : classroom
        )
      );
      message.success("Cập nhật lớp học thành công");
      handleModalCancel();
    } catch (error) {
      console.log(error.message);
      message.warning("Cập nhật lớp học thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (classroom) => {
    console.log(classroom);
    setEditingClassroom(classroom);
    form.setFieldsValue({
      name: classroom.subject_id,
      code: classroom.code,
      max_students: classroom.max_students,
      status: classroom.status ? 1 : 0,
    });
    setCurrentId(classroom.id);
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    setEditingClassroom(null);
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const onHandleSubmit = async (values) => {
    setLoading(true);
    console.log(values);
    try {
      const response = await instance.post("admin/classrooms", {
        ...values,
        subject_id: values.name,
      });
      message.success("Thêm lớp học thành công");
      const newClassroom = response.data.data;
      setClassrooms((prevClassrooms) => [...prevClassrooms, newClassroom]);
      handleModalCancel();
      form.resetFields();
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
    } catch (error) {
      console.log(error.message);
      message.warning("Thêm lớp học thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
  };

  const confirmDelete = async (id) => {
    setLoading(true);
    try {
      await instance.delete(`admin/classrooms/${id}`);
      setClassrooms(classrooms.filter((item) => item.id !== id));
      message.success(
        <span>
          Xóa mềm thành công,{" "}
          <button onClick={() => undoClassrooms(id)} className="underline">
            Hoàn tác
          </button>
        </span>,
        5
      );
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error(error.message);
      message.error("Xóa thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const undoClassrooms = async (id) => {
    try {
      setLoading(true);
      const response = await instance.post(`admin/classrooms/${id}/restore`);
      const restoredClassroom = response.data.data;
      message.success("Khôi phục thành công");
      setClassrooms((prevClassroom) => [...prevClassroom, restoredClassroom]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
    } catch (error) {
      console.log(error.message);
      message.error("Khôi phục thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="row row-cols-2 g-3">
      <div className="col-12">
        <div>
          <div className="justify-between flex">
            <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
              Quản Lý Lớp Học
              <button>
                <img src="/assets/svg/reload.svg" alt="reload..." />
              </button>
            </h1>

            <div>
              <Input.Search
                placeholder="Tìm kiếm lớp học..."
                onSearch={handleSearchSubmit} // Gọi khi người dùng nhấn vào nút tìm kiếm
                onChange={handleSearchChange} // Cập nhật giá trị tìm kiếm khi người dùng nhập
                style={{ width: 300 }}
                allowClear
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div></div>

            <span className="font-bold text-[14px] text-[#000]">
              {pagination.total} items
            </span>
          </div>
        </div>
        <div className="row row-cols-2 g-3">
          {classrooms.length > 0 ? (
            classrooms.map((classroom) => (
              <div className="col" key={classroom.id}>
                <div className="teaching__card">
                  <div className="teaching__card-top">
                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                      <img src="/assets/svg/share.svg" alt="" />
                      Tên lớp:{" "}
                      <p className="text-red-300 uppercase ml-2 font-bold">
                        {classroom.subject_name}
                      </p>
                    </h2>
                    <button>
                      <img src="/assets/svg/more_detail.svg" alt="" />
                    </button>
                  </div>

                  <div className="teaching__card-body">
                    <div className="mt-6 flex flex-col gap-8 pb-6">
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">Mã lớp:</p>
                        <p className="font-bold text-[#000]">
                          {classroom.code}
                        </p>
                      </div>
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">
                          Số lượng học sinh tối đa:
                        </p>
                        <p className="font-bold text-[#000]">
                          {classroom.max_students}
                        </p>
                      </div>
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">Trạng thái:</p>
                        <p
                          className={`font-bold ${
                            classroom.status === "Đang có lịch học"
                              ? "text-[#4CAF50]"
                              : "text-[#FF5252]"
                          }`}
                        >
                          {classroom.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="teaching__card-bottom">
                    <Link
                      to="list"
                      className="flex items-center gap-3 text-[#1167B4] font-bold"
                    >
                      <img src="/assets/svg/setting.svg" alt="setting" />
                      Quản Lý Lớp Học
                    </Link>

                    {/* Chỉ hiển thị nút "Chỉnh sửa" nếu không có lịch học */}
                    {classroom.status !== "Đang có lịch học" && (
                      <button
                        className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                        onClick={() => showEditModal(classroom)}
                      >
                        <EditOutlined />
                        Chỉnh sửa
                      </button>
                    )}

                    {/* Chỉ hiển thị nút "Xóa" nếu không có lịch học */}
                    {classroom.status !== "Đang có lịch học" && (
                      <Popconfirm
                        title={`Bạn có chắc muốn xóa lớp học ${classroom.name} này chứ?`}
                        onConfirm={() => confirmDelete(classroom.id)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                          <img src="/assets/svg/remove.svg" alt="remove" />
                          Loại bỏ
                        </button>
                      </Popconfirm>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-red-500 font-bold text-lg">
                Không tìm thấy lớp học nào!
              </p>
            </div>
          )}
        </div>
        {/* Pagination Component */}
        {pagination.total > pagination.pageSize && (
          <Pagination
            className="mt-12"
            align="center"
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        )}
        <Modal
          title={
            editingClassroom ? "Sửa Thông Tin Lớp Học" : "Thêm Mới Lớp Học"
          }
          open={isEditModalVisible || isAddModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          centered
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={isEditModalVisible ? onHandleUpdate : onHandleSubmit}
            style={{ padding: "0 20px" }}
          >
            <Form.Item
              label="Mã lớp"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã lớp!",
                },
              ]}
            >
              <Input placeholder="Nhập mã lớp" />
            </Form.Item>

            <Form.Item
              label="Học sinh (Tối đa: 40)"
              name="max_students"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng học sinh!",
                },
                {
                  type: "number",
                  max: 40,
                  message: "Số lượng học sinh không quá 40!",
                },
              ]}
            >
              <Input type="number" placeholder="Nhập số lượng học sinh" />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái!",
                },
              ]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="1">Còn trống</Option>
                <Option value="0">Đang có lớp</Option>
              </Select>
            </Form.Item>

            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleModalCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingClassroom ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Space>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ClassRoom;
