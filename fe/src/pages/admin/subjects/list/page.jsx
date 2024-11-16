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
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Loading from "../../../../components/loading";
import instance from "../../../../config/axios";

const ListSubject = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // State cho popup tạo khóa học mới
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [form] = Form.useForm();

  // State cho lựa chọn kỳ học và ngành học
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(majors[0]);
  const [subjects, setSubjects] = useState([]);
  const [initialValues, setInitialValues] = useState();
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState(false);
  // State cho các biến thể được thêm vào
  const [additionalVariants, setAdditionalVariants] = useState([
    {
      major: selectedMajor,
    },
  ]);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [{ data }, majors] = await Promise.all([
          instance.get("admin/subjects"),
          instance.get("admin/majors"),
        ]);
        setMajors(majors.data.data);
        setSubjects(data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onHandleDelete = async (id) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const undoSubject = async (id) => {
    try {
      const response = await instance.post(`admin/subjects/${id}/restore`);
      const restoredSubject = response.data.data;
      message.success("Khôi phục thành công");
      setSubjects((prevSubject) => [...prevSubject, restoredSubject]);
    } catch (error) {
      console.log(error.message);
      message.error("Khôi phục thất bại thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value; // Lấy giá trị từ input
    setSearchValue(value);

    if (value.trim() === "") {
      // Nếu input trống, hiển thị tất cả các khóa học
      setFilteredCourses(allCourses);
    } else {
      // Lọc khóa học theo tên
      const filtered = allCourses.filter((course) =>
        course.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible); // Đảo ngược trạng thái hiển thị
    setAdditionalVariants([
      {
        major: majors[0],
      },
    ]);
  };

  // Hàm xử lý khi form được gửi
  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        credit: values.credit,
        status: values.status,
        majors: values.majors.map((id) => ({ id })),
      };
      console.log(payload);
      const response = await instance.post("/admin/subjects", payload);
      const newSubject = response.data.data; 
      message.success("Thêm môn học mới thành công !!!");
      setIsPopupVisible(!isPopupVisible);
      form.resetFields();
      setSubjects((prevSubjects) => [...prevSubjects, newSubject])
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Có lỗi xảy ra, vui lòng thử lại!");
      } else {
        message.error("Lỗi kết nối, vui lòng kiểm tra lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý thay đổi ngành học
  const handleMajorChange = (value, index) => {
    const updatedVariants = [...additionalVariants]; // Sao chép danh sách biến thể hiện tại
    updatedVariants[index].major = value; // Cập nhật ngành học
    setAdditionalVariants(updatedVariants); // Cập nhật state với danh sách biến thể mới
  };

  // Hàm xử lý thay đổi lịch học
  const handleScheduleChange = (value, index) => {
    const updatedVariants = [...additionalVariants];
    updatedVariants[index].schedule = value; // Cập nhật lịch học
    setAdditionalVariants(updatedVariants);
  };

  // Hàm xử lý thay đổi kỳ học
  const handleSemesterChange = (value, index) => {
    const updatedVariants = [...additionalVariants];
    setAdditionalVariants(updatedVariants);
  };

  // Hàm thêm biến thể mới
  const handleAddVariant = () => {
    setAdditionalVariants([
      // Thêm một biến thể mới vào danh sách
      ...additionalVariants,
      {
        major: majors[0],
      },
    ]);
  };

  // Hàm xác nhận xóa khóa học
  const confirm = (e) => {
    console.log(e);
    message.success("Xóa thành công !"); // Hiển thị thông báo thành công
  };

  // Hàm hủy xác nhận xóa
  const cancel = (e) => {
    console.log(e);
    // message.error("Click on No");
  };

  const getMajorIdBySubjectId = async (subjectId) => {
    const response = await instance.get(`/admin/subjects/${subjectId}/getMajorIdBySubjectId`);
    return response.data;
  }

  // Hàm mở modal chỉnh sửa khóa học
  const openEditModal = async (values) => {
    setIsPopupVisible(!isPopupVisible);
    setUpdate(true);
    const majors = await getMajorIdBySubjectId(values.id);
    console.log(majors);
    form.setFieldsValue({
      code: values.code,
      name: values.name,
      description: values.description,
      credit: values.credit,
      status: values.status,
      majors: majors
    });
    setInitialValues(values.id)
  };

  const onHandleUpdate = async (values) => {
    try {
      setLoading(true);
      const response = await instance.put(`/admin/subjects/${initialValues}`, {...values, majors: values.majors.map((id) => ({ id }))});
      const updatedSubject = response.data.data;
      setSubjects(prevSubjects => 
        prevSubjects.map(subject => 
          subject.id === updatedSubject.id ? updatedSubject : subject
        )
      );
      message.success("Cập nhật môn học thành công");
      setIsPopupVisible(!isPopupVisible);
      closeEditModal()
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Có lỗi xảy ra, vui lòng thử lại!");
      } else {
        message.error("Lỗi kết nối, vui lòng kiểm tra lại!");
      }
    }finally {
      setLoading(false)
    }
  }

  // Hàm đóng modal chỉnh sửa khóa học
  const closeEditModal = () => {
    setIsEditModalVisible(false); 
    form.resetFields();
  };

  // State cho modal lọc khóa học
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm hiển thị modal lọc khóa học
  const handleShowModalFilter = () => {
    setIsModalVisible(true);
  };

  // Hàm xử lý khi nhấn OK trong modal lọc
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Selected Filters:", values); // In ra các bộ lọc đã chọn
        // Xử lý lọc ở đây
        setIsModalVisible(false); // Đóng modal sau khi xử lý xong
      })
      .catch((info) => {
        console.log("Validate Failed:", info); // Xử lý lỗi xác thực
      });
  };

  // Hàm hủy bỏ việc hiển thị modal
  const handleCancel = () => {
    setIsModalVisible(false); // Ẩn modal lọc
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="listCourse">
        <div className="">
          <div className="flex gap-4 row-cols-2 relative">
            {/* Item */}
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
                    onChange={handleSearch} // Sử dụng onChange để gọi hàm tìm kiếm
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
                      {subjects.length} items
                    </span>

                    <Button type="primary" onClick={handleShowModalFilter}>
                      Lọc Khóa Học
                    </Button>
                  </div>
                </div>
              </div>

              <div className="row row-cols-2 g-3">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <div className="col" key={subject.id}>
                      <div className="listCourse__item ">
                        <div className="listCourse__item-top flex justify-between items-center">
                          <h2 className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                            <img src="/assets/svg/share.svg" alt="" />
                            Môn Học :<span>{subject.name}</span>
                          </h2>
                          <button>
                            <img src="/assets/svg/more_detail.svg" alt="" />
                          </button>
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
                                  
                                  {subject.code}
                                </span>
                              </p>

                              <p className="text-[#9E9E9E] mt-3 ml-3">
                                Tín chỉ :
                                <span className="text-black ml-2">{subject.credit}</span>
                              </p>

                              <div className="text-[#9E9E9E] gap-2 mt-3 ml-3 flex">
                                <span className="flex-shrink-0">Mô tả :</span>
                                <span className="text-black ml-2 line-clamp-2">
                                  {subject.description}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="listCourse__item-bottom teaching__card-bottom ">
                          <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                            <img src="/assets/svg/eye.svg" alt="" />
                            Chi Tiết
                          </button>

                          <Popconfirm
                            title="Xóa môn học"
                            description={`Bạn có chắc chắn muốn xóa môn học ${subject.name} không? `}
                            onConfirm={() => onHandleDelete(subject.id)}
                            onCancel={cancel}
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
                            onClick={() => openEditModal(subject)}
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
                total={50}
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
                onFinish={update ? onHandleUpdate : handleFormSubmit}
                autoComplete="off"
              >
                <Row gutter={24}>
                  <Col span={16}>
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

                    {/* Mô tả môn học */}
                    <Form.Item
                      label="Mô tả"
                      name="description"
                      rules={[
                    
                      ]}
                    >
                      <Input.TextArea rows={3} placeholder="Mô tả" />
                    </Form.Item>

                    {/* Tín chỉ */}
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="Tín chỉ"
                          name="credit"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tín chỉ!",
                            },
                            {
                              type: "number",
                              min: 1,
                              max: 7,
                              message: "Tín chỉ phải từ 1 đến 7.",
                            },
                          ]}
                        >
                          <InputNumber placeholder="Tín chỉ" min={1} max={7} />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="Trạng thái"
                          name="status"
                          rules={[
                            
                          ]}
                        >
                          <Select
                          defaultValue="Đang hoạt động"
                            placeholder="Chọn trạng thái"
                            options={[
                              {
                                value: "Đang hoạt động",
                                label: "Đang hoạt động",
                              },
                              { value: "Tạm dừng", label: "Tạm dừng" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
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
                          label: major.name,
                          value: major.id,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Nút tạo môn học */}
                <div className="flex justify-center items-center mt-4">
                  <Button type="primary" htmlType="submit">
                    {!update ? "Tạo môn học": "Cập nhật môn học"}
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
                  <Option value="computer-science">Khoa học máy tính</Option>
                  <Option value="data-science">Khoa học dữ liệu</Option>
                  <Option value="web-development">Phát triển web</Option>
                  <Option value="graphic-design">Thiết kế đồ họa</Option>
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
                  <Option value="semester1">Kỳ 1</Option>
                  <Option value="semester2">Kỳ 2</Option>
                  <Option value="semester3">Kỳ 3</Option>
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
