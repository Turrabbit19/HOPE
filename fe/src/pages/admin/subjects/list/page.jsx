import React, { useEffect, useState } from "react";
import {
  Pagination,
  Row,
  Form,
  Input,
  Button,
  Modal,
  InputNumber,
  Select,
  Popconfirm,
  Col,
  message,
  Menu,
  Dropdown,
} from "antd";
import { EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Option } = Select;

const semesterData = {
  1: { majors: ["Lập trình Web", "Thiết kế đồ họa", "An ninh mạng"] },
  2: { majors: ["Kinh tế", "Tài chính", "Quản lý dự án"] },
  3: { majors: ["Y học", "Dược học", "Điều dưỡng"] },
};

const schedules = ["18.3", "17.3", "19.1"];
const semesters = Object.keys(semesterData);

const ListSubject = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [form] = Form.useForm();

  const [selectedSemester] = useState(semesters[0]);
  const [majors] = useState(semesterData[selectedSemester].majors);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const allCourses = [
    { id: 1, name: "Math" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" },
    { id: 4, name: "History" },
    { id: 5, name: "Biology" },
    { id: 6, name: "Geography" },
  ];

  const MoreMenu = (
    <Menu>
      <Menu.Item key="1">Lớp học</Menu.Item>
      <Menu.Item key="2">Ca học</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    setFilteredCourses(allCourses);
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredCourses(allCourses);
    } else {
      const filtered = allCourses.filter((course) =>
        course.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    console.log("Form data:", values);
    // Xử lý dữ liệu form ở đây
    message.success("Thêm môn học thành công!");
    togglePopup();
  };

  const confirmDelete = (course) => {
    console.log("Xóa:", course);
    message.success(`Xóa môn học ${course.name} thành công!`);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      code: course.code,
      name: course.name,
      description: course.description,
      credit: course.credit,
    });
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handleEditFormSubmit = (values) => {
    console.log("Edit data:", values);
    // Xử lý cập nhật môn học ở đây
    message.success("Cập nhật môn học thành công!");
    closeEditModal();
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShowModalFilter = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Selected Filters:", values);
        // Xử lý lọc ở đây
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="listCourse">
        <div className="">
          <div className="flex gap-4 row-cols-2 relative">
            <div className="col-12">
              <div>
                <div className="flex justify-between">
                  <h1 className="flex gap-2 pb-5 items-center text-[#7017E2] text-[20px] font-semibold">
                    Danh Sách Môn Học
                    <button>
                      <img src="/assets/svg/reload.svg" alt="reload..." />
                    </button>
                  </h1>

                  <Input.Search
                    placeholder="Tìm kiếm môn học..."
                    onChange={handleSearch}
                    style={{ width: 300 }}
                    allowClear
                  />
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={togglePopup}
                    className="btn btn--outline text-[#7017E2]"
                  >
                    <img src="/assets/svg/plus.svg" alt="" />
                    Thêm Môn Học
                  </button>
                  <div className="flex gap-6 items-center">
                    <span className="font-bold text-[14px] text-[#000]">
                      {filteredCourses.length} items
                    </span>

                    <Button type="primary" onClick={handleShowModalFilter}>
                      Lọc Khóa Học
                    </Button>
                  </div>
                </div>
              </div>

              <div className="row row-cols-2 g-3">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <div className="col" key={course.id}>
                      <div className="listCourse__item ">
                        <div className="listCourse__item-top flex justify-between items-center">
                          <Link
                            to={`detail/${course.id}`}
                            className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]"
                          >
                            <img src="/assets/svg/share.svg" alt="" />
                            Môn Học :<span>{course.name}</span>
                          </Link>
                        </div>

                        <div className="listCourse__item-body">
                          <div className="flex gap-8">
                            <div className="listCourse__item-status_group">
                              <div className="flex gap-2 listCourse__item-status">
                                <span className="ml-3 text-[#9E9E9E]">
                                  Trạng thái :
                                </span>

                                <div className="flex gap-1 bg-[#44cc151a]">
                                  <img
                                    className="fill-current svg-green"
                                    src="/assets/svg/status.svg"
                                    alt=""
                                  />
                                  <span className="text-[#44CC15] text-[12px]">
                                    Kích Hoạt
                                  </span>
                                </div>
                              </div>

                              <p className="text-[#9E9E9E] mt-3 ml-3">
                                Code:
                                <span className="text-black ml-2">
                                  COURSE_
                                  {course.id}
                                </span>
                              </p>

                              <p className="text-[#9E9E9E] mt-3 ml-3">
                                Tín chỉ :
                                <span className="text-black ml-2">3</span>
                              </p>

                              <div className="text-[#9E9E9E] gap-2 mt-3 ml-3 flex">
                                <span className="flex-shrink-0">Mô tả :</span>
                                <span className="text-black ml-2 line-clamp-2">
                                  lorem ipsum dolor sit amet...
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="listCourse__item-bottom teaching__card-bottom ">
                          <Link
                            to={`detail/${course.id}`}
                            className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                          >
                            <img src="/assets/svg/eye.svg" alt="" />
                            Chi Tiết
                          </Link>

                          <Popconfirm
                            title="Xóa môn học"
                            description={`Bạn có chắc chắn muốn xóa môn học ${course.name} không? `}
                            onConfirm={() => confirmDelete(course)}
                            okText="Có"
                            cancelText="Không"
                          >
                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                              <img src="/assets/svg/remove.svg" alt="" />
                              Xóa khỏi Danh Sách
                            </button>
                          </Popconfirm>

                          <button
                            className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                            onClick={() => openEditModal(course)}
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
                      Không tìm thấy môn học
                    </p>
                  </div>
                )}
              </div>

              <Pagination
                className="mt-12"
                align="center"
                defaultCurrent={1}
                total={filteredCourses.length}
              />
            </div>
          </div>

          {/* Popup Modal Form Add */}
          <Modal
            open={isPopupVisible}
            onCancel={togglePopup}
            footer={null}
            centered
            width={1000}
          >
            <div className="createScheduleForm pb-6">
              <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
                Tạo Môn Học Mới
              </h3>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                autoComplete="off"
              >
                <Row gutter={24}>
                  <Col span={16}>
                    <Form.Item
                      label="Mã Môn Học"
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã môn học!",
                        },
                      ]}
                    >
                      <Input placeholder="Mã môn học" />
                    </Form.Item>

                    <Form.Item
                      label="Tên Môn Học"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên môn học!",
                        },
                      ]}
                    >
                      <Input placeholder="Tên" />
                    </Form.Item>

                    <Form.Item
                      label="Mô tả"
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả!",
                        },
                      ]}
                    >
                      <Input.TextArea rows={3} placeholder="Mô tả" />
                    </Form.Item>

                    <Form.Item label="Tín chỉ và Thứ tự kỳ">
                      <Row gutter={16}>
                        {/* Tín chỉ */}
                        <Col span={12}>
                          <Form.Item
                            name="credit"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tín chỉ!",
                              },
                              {
                                pattern: /^(?!0)\d+(\.\d+)?$/,
                                message: "Tín chỉ phải là số dương.",
                              },
                              {
                                validator: (_, value) => {
                                  if (value && (value <= 0 || value >= 8)) {
                                    return Promise.reject(
                                      new Error(
                                        "Tín chỉ phải lớn hơn 0 và nhỏ hơn 8."
                                      )
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Tín chỉ"
                              min={1}
                              max={7}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>

                        {/* Thứ tự kỳ */}
                        <Col span={12}>
                          <Form.Item
                            name="semesterOrder"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập thứ tự kỳ!",
                              },
                              {
                                pattern: /^\d+$/,
                                message: "Thứ tự kỳ phải là số nguyên.",
                              },
                              {
                                validator: (_, value) => {
                                  if (value && (value < 1 || value > 12)) {
                                    return Promise.reject(
                                      new Error(
                                        "Thứ tự kỳ phải nằm trong khoảng 1 đến 12."
                                      )
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Thứ tự kỳ"
                              min={1}
                              max={12}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      label="Ngành Học"
                      name="majors"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngành học!",
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn ngành học"
                        options={majors.map((major) => ({
                          label: major,
                          value: major,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex justify-center items-center mt-4">
                  <Button type="primary" htmlType="submit">
                    Tạo Môn Học
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>

          {/* Popup Modal Form Edit */}
          <Modal
            open={isEditModalVisible}
            onCancel={closeEditModal}
            footer={null}
            centered
            width={1000}
          >
            <div className="createCourseForm pb-6">
              <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
                Sửa Môn Học
              </h3>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleEditFormSubmit}
                autoComplete="off"
              >
                <Row gutter={24}>
                  <Col span={16}>
                    <Form.Item
                      label="Mã Môn Học"
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã môn học!",
                        },
                      ]}
                    >
                      <Input placeholder="Mã môn học" />
                    </Form.Item>

                    <Form.Item
                      label="Tên Môn Học"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên môn học!",
                        },
                      ]}
                    >
                      <Input placeholder="Tên" />
                    </Form.Item>

                    <Form.Item
                      label="Mô tả"
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả!",
                        },
                      ]}
                    >
                      <Input.TextArea rows={3} placeholder="Mô tả" />
                    </Form.Item>

                    <Form.Item label="Tín chỉ và Thứ tự kỳ">
                      <Row gutter={16}>
                        {/* Tín chỉ */}
                        <Col span={12}>
                          <Form.Item
                            name="credit"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tín chỉ!",
                              },
                              {
                                pattern: /^(?!0)\d+(\.\d+)?$/,
                                message: "Tín chỉ phải là số dương.",
                              },
                              {
                                validator: (_, value) => {
                                  if (value && (value <= 0 || value >= 8)) {
                                    return Promise.reject(
                                      new Error(
                                        "Tín chỉ phải lớn hơn 0 và nhỏ hơn 8."
                                      )
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Tín chỉ"
                              min={1}
                              max={7}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>

                        {/* Thứ tự kỳ */}
                        <Col span={12}>
                          <Form.Item
                            name="semesterOrder"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập thứ tự kỳ!",
                              },
                              {
                                pattern: /^\d+$/,
                                message: "Thứ tự kỳ phải là số nguyên.",
                              },
                              {
                                validator: (_, value) => {
                                  if (value && (value < 1 || value > 12)) {
                                    return Promise.reject(
                                      new Error(
                                        "Thứ tự kỳ phải nằm trong khoảng 1 đến 12."
                                      )
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Thứ tự kỳ"
                              min={1}
                              max={12}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      label="Ngành học"
                      name="majors"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ít nhất một ngành học!",
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn ngành học"
                        options={majors.map((major) => ({
                          label: major,
                          value: major,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex justify-center items-center mt-4">
                  <Button type="primary" htmlType="submit">
                    Lưu Thay Đổi
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>

          {/* Modal Filter */}
          <Modal
            title="Lọc Khóa Học"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="Chọn Ngành Học"
                name="major"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngành học!",
                  },
                ]}
              >
                <Select placeholder="Chọn ngành học">
                  {majors.map((major) => (
                    <Option key={major} value={major}>
                      {major}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Chọn Kỳ Học"
                name="semester"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn kỳ học!",
                  },
                ]}
              >
                <Select placeholder="Chọn kỳ học">
                  {semesters.map((semester) => (
                    <Option key={semester} value={semester}>
                      Kỳ {semester}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ListSubject;
