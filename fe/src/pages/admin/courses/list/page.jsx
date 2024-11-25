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
  notification,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import Loading from "../../../../components/loading";
import instance from "../../../../config/axios";

const { Option } = Select;

const ListCourse = () => {
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [courses, plans] = await Promise.all([
          instance.get("admin/courses"),
          // instance.get("admin/plans"),
        ]);
        console.log(courses.data.data);
        setCourses(courses.data.data);
        // setPlans(plans.data.data);
      } catch (error) {
        console.log(error.message);
        notification.success({
          message: "Lỗi lấy dữ liệu",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm)
  );

  const showEditModal = (course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      name: course.name,
      start_date: moment(course.startDate),
      end_date: moment(course.endDate),
      plan_id: course.plan_id,
    });
    setId(course.id);
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleModalOk = async (values) => {
    const formattedValues = {
      name: values.name,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      plan_id: values.plan_id,
    };
    try {
      setLoading(true);
      const response = await instance.post("admin/courses", formattedValues);
      notification.success({
        message: `Tạo khóa học ${values.name} thành công`,
      });
      const newCourse = response.data.data;
      setCourses((prevCourses) => [...prevCourses, newCourse]);
      form.resetFields();
      handleModalCancel();
    } catch (error) {
      notification.error({
        message: "Tạo khóa học thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const onHandleUpdate = async (values) => {
    const formattedValues = {
      name: values.name,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      plan_id: values.plan_id,
    };
    try {
      setLoading(true);
      const response = instance.put(`admin/courses/${id}`, formattedValues);
      notification.success({
        message: "Cập nhật khóa học thành công",
      });
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === editingCourse.id
            ? { ...course, ...formattedValues }
            : course
        )
      );
      form.resetFields();
      handleModalCancel();
    } catch (error) {
      console.log(error.message);
      notification.error({
        message: "Cập nhật khóa học thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
  };

  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      await instance.delete("admin/courses/" + id);
      setCourses(courses.filter((course) => course.id !== id));
      notification.success({
        message: (
          <span>
            Xóa thành công khó học,{" "}
            <a className="underline" onClick={() => undoCourse(id)}>
              Khôi phục lại khóa học
            </a>
          </span>
        ),
      });
    } catch (error) {
      console.error("Error deleting semester:", error);
    } finally {
      setLoading(false);
    }
  };

  const undoCourse = async (id) => {
    try {
      setLoading(true);
      const values = await instance.post(`admin/courses/${id}/restore`);
      const restoredCourse = values.data.data;
      console.log(values.data.data);
      notification.success({
        message: "Khôi phục khóa học thành công",
      });
      setCourses((prev) => [...prev, restoredCourse]);
    } catch (error) {
      console.log(error.message);
      message.error("Khôi phục thất bại thất bại");
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
        <div className="col-12">
          <div className="justify-between flex">
            <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
              Quản Lý Khóa Học
              <button>
                <img src="/assets/svg/reload.svg" alt="reload..." />
              </button>
            </h1>

            <div>
              <Input.Search
                placeholder="Tìm kiếm khóa học..."
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
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
              {filteredCourses.length} items
            </span>
          </div>
        </div>
        <div className="row row-cols-2 g-3">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <div className="col" key={index}>
                <div className="teaching__card">
                  <div className="teaching__card-top">
                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                      <img src="/assets/svg/share.svg" alt="" />
                      Chuyên ngành:{" "}
                      <p className="text-red-300 uppercase ml-2 font-bold">
                        {course.name}
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
                            {course.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">Ngày bắt đầu:</p>
                        <p className="font-bold text-[#000]">
                          {moment(course.start_date).format("DD/MM/YYYY")}
                        </p>
                      </div>
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">Ngày kết thúc:</p>
                        <p className="font-bold text-[#000]">
                          {moment(course.end_date).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="teaching__card-bottom">
                    <Link
                      to={`${course.id}/detail`}
                      className="flex items-center gap-3 text-[#1167B4] font-bold"
                    >
                      <img src="/assets/svg/setting.svg" alt="setting" />
                      Quản Lý Khóa Học
                    </Link>
                    <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                      <img src="/assets/svg/eye.svg" alt="detail" />
                      Chi Tiết
                    </button>
                    <Popconfirm
                      title="Xóa khóa học"
                      onConfirm={() => confirmDelete(course.id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                        <img src="/assets/svg/remove.svg" alt="remove" />
                        Xóa khỏi Danh Sách
                      </button>
                    </Popconfirm>

                    <button
                      className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                      onClick={() => showEditModal(course)}
                    >
                      <EditOutlined />
                      Sửa Thông Tin
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-red-500 font-bold text-lg">
                Không tìm thấy khóa học
              </p>
            </div>
          )}
        </div>

        <Pagination
          className="mt-12"
          align="center"
          defaultCurrent={1}
          total={50}
        />
      </div>

      <Modal
        title={editingCourse ? "Sửa Thông Tin Khóa Học" : "Thêm Mới Khóa Học"}
        open={isEditModalVisible || isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingCourse ? onHandleUpdate : handleModalOk}
          style={{ padding: "0 20px" }}
        >
          <Form.Item
            label="Tên Khóa Học"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên khóa học!",
              },
            ]}
          >
            <Input placeholder="Nhập tên khóa học" />
          </Form.Item>

          <Form.Item
            label="Ngày Bắt Đầu"
            name="start_date"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày bắt đầu!",
              },
            ]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Ngày Kết Thúc"
            name="end_date"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày kết thúc!",
              },
            ]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleModalCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingCourse ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListCourse;
