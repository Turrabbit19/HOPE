import React, { useState, useEffect } from "react";
import {
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Pagination,
  Row,
  Col,
  message,
  notification,
} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import instance from "../../../../config/axios"; // Ensure this is set up correctly
import Loading from "../../../../components/loading";

const ListSemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [additionalVariants, setAdditionalVariants] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, semestersResponse] = await Promise.all([
          instance.get("admin/courses"),
          instance.get("admin/semesters"),
        ]);
        setCourses(coursesResponse.data.data);
        setSemesters(semestersResponse.data.data);
        console.log(semestersResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const showEditModal = (semester) => {
    debugger;
    setEditingSemester(semester);
    form.setFieldsValue({
      name: semester.name,
      start_date: moment(semester.start_date),
      end_date: moment(semester.end_date),
      status: semester.status,
    });
    const variants = semester.courses.map((course, index) => ({
      course: course.id,
      order: course.order,
    }));
    setId(semester.id);
    setAdditionalVariants(variants);

    variants.forEach((variant, index) => {
      form.setFieldsValue({
        [`course_${index}`]: variant.course,
        [`order_${index}`]: variant.order,
      });
    });
    setIsEditModalVisible(true);
  };
  console.log(additionalVariants);
  const showAddModal = () => {
    debugger;
    setEditingSemester(null);
    form.resetFields();
    setAdditionalVariants([
      {
        course: courses[0]?.id,
        order: 1,
      },
    ]);
    setIsAddModalVisible(true);
  };

  const handleModalOk = async (values) => {
    console.log(values);
    console.log(values);
    const formattedValues = {
      name: values.name,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      status: 1,
      courses: [],
    };

    additionalVariants.forEach((variant) => {
      formattedValues.courses.push({
        id: variant.course,
        order: variant.order,
      });
    });
    console.log(formattedValues);
    try {
      setLoading(true);
      const response = await instance.post("admin/semesters", formattedValues);
      notification.success({ message: "Thêm kỳ học thành công" });
      setSemesters([
        ...semesters,
        { ...formattedValues, status: 1 ? "Đang diễn ra" : "Kết thúc" },
      ]);
      form.resetFields();
    } catch (error) {
      notification.error("Thêm thất bại");
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
    handleModalCancel();
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
  };

  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      await instance.delete(`admin/semesters/${id}`);
      setSemesters(semesters.filter((semester) => semester.id !== id));
      notification.success({
        message: (
          <span>
            Xóa kỳ học thành công!{" "}
            <a className="underline" onClick={() => undoSemester(id)}>
              Hoàn tác
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

  const undoSemester = async (id) => {
    try {
      setLoading(true);
      const values = await instance.post(`admin/semesters/${id}/restore`);
      const restoredSemester = values.data.data;
      console.log(values.data.data);
      notification.success({
        message: "Khôi phục kỳ học thành công",
      });
      setSemesters((prev) => [...prev, restoredSemester]);
    } catch (error) {
      console.log(error.message);
      message.error("Khôi phục thất bại thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onHandleUpdate = async (values) => {
    console.log(values);
    const formattedValues = {
      name: values.name,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      status: 1,
      courses: [],
    };

    additionalVariants.forEach((variant) => {
      formattedValues.courses.push({
        id: variant.course,
        order: variant.order,
      });
    });
    try {
      setLoading(true);
      const response = await instance.put(
        `admin/semesters/${id}`,
        formattedValues
      );
      const updatedSemester = response.data.data;
      setSemesters((prev) =>
        prev.map((semester) =>
          semester.id === updatedSemester.id ? updatedSemester : semester
        )
      );
      notification.success({ message: "Cập nhật kỳ học thành công" });
      form.resetFields();
      handleModalCancel();
    } catch (error) {
      console.log(error.message);
      notification.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (value, index) => {
    debugger;
    const updatedVariants = [...additionalVariants];
    updatedVariants[index].course = value;
    setAdditionalVariants(updatedVariants);
  };

  const getAvailableCourses = (index) => {
    const selectedCourses = additionalVariants
      .map((variant, i) => (i !== index ? variant.course : null))
      .filter(Boolean);
    return courses.filter((course) => !selectedCourses.includes(course.id));
  };

  const handleDeleteVariant = (index) => {
    const updatedVariants = additionalVariants.filter((_, i) => i !== index);
    setAdditionalVariants(updatedVariants);
  };

  const handleOrderChange = (value, index) => {
    const updatedVariants = [...additionalVariants];
    updatedVariants[index].order = value;
    setAdditionalVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    setAdditionalVariants([
      ...additionalVariants,
      {
        course: courses[0]?.id,
        order: additionalVariants.length + 1,
      },
    ]);
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
                Quản Lý Kỳ Học
                <button>
                  <img src="/assets/svg/reload.svg" alt="reload..." />
                </button>
              </h1>

              <div>
                <Input.Search
                  placeholder="Tìm kiếm kỳ học..."
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
                {semesters.length} items
              </span>
            </div>
          </div>

          <div className="row row-cols-2 g-3">
            {semesters.length > 0 ? (
              semesters.map((semester, index) => (
                <div className="col" key={index}>
                  <div className="teaching__card">
                    <div className="teaching__card-top">
                      <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                        <img src="/assets/svg/share.svg" alt="" />
                        Chuyên ngành:{" "}
                        <p className="text-red-300 uppercase ml-2 font-bold">
                          {semester.name}
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
                              {semester.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <p className="text-[#9E9E9E]">Ngày bắt đầu:</p>
                          <p className="font-bold text-[#000]">
                            {moment(semester.start_date).format("DD/MM/YYYY")}
                          </p>
                        </div>
                        <div className="flex gap-6">
                          <p className="text-[#9E9E9E]">Ngày kết thúc:</p>
                          <p className="font-bold text-[#000]">
                            {moment(semester.end_date).format("DD/MM/YYYY")}
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
                        Quản Lý Kỳ Học
                      </Link>
                      <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                        <img src="/assets/svg/eye.svg" alt="detail" />
                        Chi Tiết
                      </button>

                      {semester.status == "Đang diễn ra" ||
                      semester.status == "Kết thúc" ? (
                        ""
                      ) : (
                        <>
                          <Popconfirm
                            title="Xóa kỳ học"
                            onConfirm={() => confirmDelete(semester.id)}
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
                            onClick={() => showEditModal(semester)}
                          >
                            <EditOutlined />
                            Sửa Thông Tin
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-red-500 font-bold text-lg">
                  Không tìm thấy kỳ học
                </p>
              </div>
            )}
          </div>

          <Pagination
            className="mt-12"
            align="center"
            defaultCurrent={1}
            total={semesters.length}
          />
        </div>

        <Modal
          title={editingSemester ? "Sửa Thông Tin Kỳ Học" : "Thêm Mới Kỳ Học"}
          open={isEditModalVisible || isAddModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          centered
          width={1000}
        >
          <div className="createScheduleForm pb-6">
            <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
              Tạo Kỳ Học Mới
            </h3>

            <Form
              form={form}
              layout="vertical"
              onFinish={isEditModalVisible ? onHandleUpdate : handleModalOk}
              autoComplete="off"
            >
              <Row gutter={30}>
                <Col span={8}>
                  <Form.Item
                    label="Tên Kỳ Học"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên kỳ học!",
                      },
                    ]}
                  >
                    <Input placeholder="Tên kỳ học" />
                  </Form.Item>

                  <Form.Item
                    label="Ngày Khởi Tạo"
                    name="start_date"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày khởi tạo!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      placeholder="Ngày bắt đầu"
                    />
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
                    <DatePicker
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      placeholder="Ngày kết thúc"
                    />
                  </Form.Item>
                </Col>

                {/* <Col span={16}>
                  {additionalVariants.map((variant, index) => (
                    <Row key={index} gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label={`Khóa học ${index + 1}`}
                          name={`course_${index}`}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn khóa học!",
                            },
                          ]}
                        >
                          <Select
                            value={variant.course}
                            placeholder="Tên khóa học"
                            onChange={(value) =>
                              handleCourseChange(value, index)
                            }
                            options={getAvailableCourses(index).map(
                              (course) => ({
                                label: course.name,
                                value: course.id,
                              })
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={`Thứ tự học ${index + 1}`}
                          name={`order_${index}`}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn thứ tự học!",
                            },
                          ]}
                        >
                          <Select
                            value={variant.order}
                            placeholder="Kỳ học của khóa học"
                            onChange={(value) =>
                              handleOrderChange(value, index)
                            }
                            options={[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                              (order) => ({
                                label: `kỳ ${order}`,
                                value: order,
                              })
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ marginTop: 30 }}>
                        <Button
                          type="danger"
                          onClick={() => handleDeleteVariant(index)}
                          icon={<DeleteOutlined />}
                        >
                          Xóa Biến Thể
                        </Button>
                      </Col>
                    </Row>
                  ))}

                  <Button onClick={handleAddVariant}>Thêm Biến Thể</Button>
                </Col> */}
              </Row>

              <div className="flex justify-center items-center mt-4">
                <Button type="primary" htmlType="submit">
                  {isEditModalVisible ? "Cập nhật kỳ học" : "Tạo kỳ học"}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ListSemester;
