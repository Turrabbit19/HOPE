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
  Radio,
  notification,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Loading from "../../../../components/loading";
import instance from "../../../../config/axios";
import { Link } from "react-router-dom";

const ListSubject = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const { Option } = Select;

  const [loading, setLoading] = useState(false);
  const [majors, setMajors] = useState([]);
  const [subMajors, setSubMajors] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState([]);
  const [majorId, setMajorId] = useState(null);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [form] = Form.useForm();

  const [selectedMajor, setSelectedMajor] = useState(majors[0]);
  const [subjects, setSubjects] = useState([]);
  const [initialValues, setInitialValues] = useState();
  const [update, setUpdate] = useState(false);
  const [additionalVariants, setAdditionalVariants] = useState([
      {
          major: selectedMajor,
      },
  ]);
  const [total, setTotal] = useState(0);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedMajor1, setSelectedMajor1] = useState(null);

  useEffect(() => {
      const fetchSubjects = async () => {
          try {
              setLoading(true);

              const endpoint = selectedMajor1
                  ? `admin/filter-by-major/${selectedMajor1}/subjects`
                  : "admin/subjects";

              const response = await instance.get(endpoint, {
                  params: {
                      page: currentPage,
                      per_page: 10,
                  },
              });

              setSubjects(response.data.data);
              setTotal(response.data.pagination.total);
          } catch (error) {
              message.error("Error fetching subjects");
          } finally {
              setLoading(false);
          }
      };

      fetchSubjects();
  }, [currentPage, selectedMajor1]);

  useEffect(() => {
      const fetchMajors = async () => {
          try {
              setLoading(true);
              const response = await instance.get("admin/main/majors");
              console.log("Majors Response:", response);
              setMajors(response.data.data);
          } catch (error) {
              console.error("Error fetching majors:", error.message);
          } finally {
              setLoading(false);
          }
      };

      fetchMajors();
  }, []);

  const handlePageChange = (page) => {
      console.log(page);
      setCurrentPage(page);
  };

  useEffect(() => {
      console.log("Selected Specialization:", selectedSpecialization);
      if (selectedSpecialization.length > 0 && selectedType === "sub_major") {
          (async () => {
              try {
                  setLoading(true);

                  const promises = selectedSpecialization.map((majorId) =>
                      instance.get(`admin/sub/${majorId}/majors`)
                  );
                  const responses = await Promise.all(promises);

                  const combinedSubMajors = responses
                      .map((response) => response.data.data)
                      .flat();

                  console.log("Sub Majors:", combinedSubMajors);

                  setSubMajors(combinedSubMajors);
              } catch (error) {
                  console.error("Lỗi tải chuyên ngành hẹp:", error.message);
              } finally {
                  setLoading(false);
              }
          })();
      }
  }, [selectedSpecialization, selectedType]);

  useEffect(() => {
      if (selectedSpecialization.length > 0) {
          setSelectedType("sub_major");
      }
  }, [selectedSpecialization]);

  const onHandleDelete = async (id) => {
      try {
          setLoading(true);
          await instance.delete(`admin/subjects/${id}`);
          setSubjects(subjects.filter((item) => item.id !== id));
          message.success(
              <span>
                  Xóa mềm thành công,{" "}
                  <button
                      onClick={() => undoSubject(id)}
                      className="underline"
                  >
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
          const response = await instance.post(
              `admin/subjects/${id}/restore`
          );
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

  const handleSearch = (value) => {
      const searchVal =
          typeof value === "string"
              ? value.trim()
              : value.target.value.trim();
      setSearchValue(searchVal);

      if (searchVal === "") {
          setFilteredCourses([]);
      } else {
          const filtered = subjects.filter((course) =>
              course.name.toLowerCase().includes(searchVal.toLowerCase())
          );
          setFilteredCourses(filtered);
      }
      setCurrentPage(1);
  };

  const togglePopup = () => {
      setIsPopupVisible(!isPopupVisible);
      form.resetFields();
      setUpdate(false);
      setAdditionalVariants([
          {
              major: majors[0],
          },
      ]);
  };

  const handleFormSubmit = async (values) => {
      setLoading(true);
      try {
          const majors = values.majors ? values.majors.filter((m) => m) : [];

          const payload = {
              name: values.name,
              description: values.description,
              credit: values.credit,
              majors,
              order: values.order,
              code: values.code,
              max_students: values.max_students,
              form: values.form,
              status: 0,
              sub_major:
                  selectedType === "sub_major" ? values.sub_major : null,
          };

          const response = await instance.post("/admin/subjects", payload);

          setSubjects((prevSubjects) => [
              ...prevSubjects,
              response.data.data,
          ]);

          notification.success({
              message: "Thành công",
              description: "Thêm môn học mới thành công!",
          });

          form.resetFields();
          setIsPopupVisible(false);
      } catch (error) {
          handleError(error);
      } finally {
          setLoading(false);
      }
  };

  const cancel = (e) => {
      console.log(e);
  };

  const getMajorIdBySubjectId = async (subjectId) => {
      const response = await instance.get(
          `/admin/subject/${subjectId}/majors`
      );
      console.log(response);
      return response.data.data;
  };

  const openEditModal = async (values) => {
      try {
          setInitialValues(values.id);
          setIsPopupVisible(true);
          setUpdate(true);

          const majors = await getMajorIdBySubjectId(values.id);

          const mainMajors = majors.filter((m) => m.status === "Ngành chính");
          const subMajorsResponse = majors.filter(
              (m) => m.status === "Chuyên ngành hẹp"
          );
          const basicMajors = majors.filter((m) => m.status === "Cơ bản");

          if (basicMajors.length > 0) {
              setSelectedType("basic");
          } else if (subMajorsResponse.length > 0) {
              setSelectedType("sub_major");
              setSelectedSpecialization(mainMajors.map((m) => m.id));

              const responses = await Promise.all(
                  mainMajors.map((major) =>
                      instance.get(`sub/${major.id}/majors`)
                  )
              );
              const combinedSubMajors = responses
                  .map((response) => response.data.data)
                  .flat();

              setSubMajors(combinedSubMajors);
          } else {
              setSelectedType("majors");
          }

          form.setFieldsValue({
              ...values,
              majors: mainMajors.map((m) => m.id),
              sub_major:
                  subMajorsResponse.length > 0
                      ? subMajorsResponse.map((m) => ({
                            value: m.id,
                            label: m.name,
                        }))
                      : null,
          });
      } catch (error) {
          console.error("Lỗi khi mở modal chỉnh sửa:", error);
          message.error("Không thể mở cửa sổ chỉnh sửa, vui lòng thử lại!");
      }
  };

  const onHandleUpdate = async (values) => {
      try {
          setLoading(true);

          if (!initialValues) {
              notification.error({
                  message: "Lỗi",
                  description: "Dữ liệu môn học không hợp lệ.",
              });
              return;
          }

          const updatedValues = {
              ...values,
              form: formatForm(values.form, true),
              majors:
                  selectedType === "sub_major"
                      ? selectedSpecialization
                      : selectedType === "basic"
                      ? [1]
                      : values.majors,
              sub_major:
                  selectedType === "sub_major" ? values.sub_major : null,
          };

          const response = await instance.put(
              `/admin/subjects/${initialValues}`,
              updatedValues
          );

          const updatedSubject = response.data.data;

          setSubjects((prevSubjects) =>
              prevSubjects.map((subject) =>
                  subject.id === updatedSubject.id ? updatedSubject : subject
              )
          );

          notification.success({
              message: "Thành công",
              description: "Cập nhật môn học thành công!",
          });

          setIsPopupVisible(false);
      } catch (error) {
          handleError(error);
      } finally {
          setLoading(false);
      }
  };

  const handleError = (error) => {
      console.error("Lỗi xử lý:", error);

      if (error.response) {
          const { data } = error.response;

          if (data.errors) {
              Object.keys(data.errors).forEach((field) => {
                  notification.error({
                      message: `Lỗi ở trường ${field}`,
                      description: data.errors[field].join(", "),
                  });
              });
          } else {
              notification.error({
                  message: "Lỗi",
                  description:
                      data.message || "Có lỗi xảy ra, vui lòng thử lại!",
              });
          }
      } else {
          notification.error({
              message: "Lỗi",
              description:
                  "Không thể kết nối đến server, vui lòng thử lại sau!",
          });
      }
  };

  const formatForm = (formValue, toServer = false) => {
      if (toServer) {
          return formValue === "0" ? "0" : "1";
      }
      return formValue === "0" ? "Trực tiếp" : "Trực tuyến";
  };

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
      form.validateFields()
          .then((values) => {
              console.log("Selected Filters:", values);
              // Xử lý lọc ở đây
              setIsModalVisible(false);
          })
          .catch((info) => {
              console.log("Validate Failed:", info);
          });
  };

  if (loading) {
      return <Loading />;
  }

  const displaySubjects =
      searchValue.trim() === "" ? subjects : filteredCourses;

  const paginatedSubjects = displaySubjects.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
  );

  const handleMajorChange = (majorId) => {
      console.log(majorId);
      setSelectedMajor1(majorId);
      setCurrentPage(1);
  };

  return (
    <>
      <div className="listCourse">
        <div className="">
          <div className="flex gap-4 row-cols-2 relative">
            {/* Item */}
            <div className="col-12">
              <div className="p-6 bg-white shadow-md rounded-lg">
                {/* Tiêu đề quản lý môn học */}
                <h1 className="text-4xl font-bold text-center text-[#7017E2] mb-6">
                  Quản Lý Môn Học
                </h1>

                <div className="flex justify-between items-center mb-6 gap-4">
                  {/* Input tìm kiếm */}
                  <div className="flex-1 max-w-sm">
                    <Input.Search
                      placeholder="Tìm kiếm môn học..."
                      onSearch={handleSearch}
                      onChange={handleSearch}
                      allowClear
                      className="rounded-lg"
                      style={{ width: "100%" }}
                    />
                  </div>

                  {/* Bộ lọc theo ngành */}
                  <div className="flex-1 max-w-xl">
                    <Form.Item
                      label="Lọc theo ngành"
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        placeholder="Chọn ngành"
                        value={selectedMajor1}
                        onChange={handleMajorChange}
                        allowClear
                        className="rounded-lg"
                        style={{ width: "100%" }}
                      >
                        {majors.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {/* Button thêm môn học */}
                  <button
                    onClick={togglePopup}
                    className="btn btn--outline text-[#7017E2]"
                  >
                    <img
                      src="/assets/svg/plus.svg"
                      alt="Thêm"
                      className="w-4 h-4"
                    />
                    Thêm Môn Học
                  </button>

                  {/* Hiển thị số lượng môn học */}
                  <span className="font-bold text-xl text-gray-700">
                    {displaySubjects.length} môn học
                  </span>
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
                                  Hình thức:
                                </span>

                                <div className="flex gap-1 bg-[#44cc151a]">
                                  <img
                                    className="fill-current svg-green"
                                    src="/assets/svg/status.svg"
                                    alt=""
                                  />
                                  <span className="text-[#44CC15] text-[12px]">
                                    {subject.form}
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
                                <span className="text-black ml-2">
                                  {subject.credit}
                                </span>
                              </p>

                              <p className="text-[#9E9E9E] mt-3 ml-3">
                                Kỳ học :
                                <span className="text-black ml-2">
                                  {subject.order}
                                </span>
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

                        <div className="listCourse__item-bottom teaching__card-bottom pb-3 border !mx-[-1px]">
                          <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                            <img src="/assets/svg/eye.svg" alt="" />
                            <Link
                              to={`detail/${subject.id}`}
                              state={{
                                subjectName: subject.name,
                                max_students: subject.max_students,
                                code: subject.code,
                                credit: subject.credit,
                              }}
                            >
                              Chi Tiết
                            </Link>
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
                align="center"
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={(page) => handlePageChange(page)}
                style={{
                  marginTop: 16,
                  textAlign: "center",
                }}
              />
            </div>
          </div>

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
                initialValues={{
                  majors: [],
                  specialization: null,
                  narrow_specialization: null,
                }}
              >
                <Row gutter={24}>
                  <Col span={16}>
                    <Row gutter={24}>
                      <Col span={12}>
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
                          <Input placeholder="Tên môn học" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
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
                      </Col>
                    </Row>

                    {/* Mô tả môn học */}
                    <Form.Item label="Mô tả" name="description" rules={[]}>
                      <Input.TextArea rows={3} placeholder="Mô tả" />
                    </Form.Item>

                    {/* Tín chỉ */}
                    <Row gutter={24}>
                      {/* Cột cho các trường tín chỉ và kỳ học */}
                      <Col span={12}>
                        <Row gutter={16}>
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
                                  max: 5,
                                  message: "Tín chỉ phải từ 1 đến 5.",
                                },
                              ]}
                            >
                              <InputNumber
                                placeholder="Tín chỉ"
                                min={1}
                                max={5}
                                style={{ width: "100%" }} // Đảm bảo input vừa vặn với cột
                              />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label="Kỳ học"
                              name="order"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập kỳ học!",
                                },
                                {
                                  type: "number",
                                  min: 1,
                                  max: 9,
                                  message: "Kỳ học phải từ 1 đến 9.",
                                },
                              ]}
                            >
                              <InputNumber
                                placeholder="Kỳ học"
                                min={1}
                                max={9}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>

                      {/* Cột cho trường Số lượng sinh viên */}
                      <Col span={12}>
                        <Form.Item
                          label="Số lượng sinh viên"
                          name="max_students"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số lượng sinh viên!",
                            },
                            {
                              type: "number",
                              min: 30,
                              message:
                                "Số lượng tối thiểu phải từ 30 sinh viên",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="Số lượng sinh viên tối đa"
                            min={30}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="Hình thức"
                          name="form"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn hình thức",
                            },
                            {
                              type: "string",
                              enum: ["0", "1"],
                              message: "Hình thức không hợp lệ",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn hình thức"
                            options={[
                              { value: "0", label: "Trực tiếp" },
                              { value: "1", label: "Trực tuyến" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="Môn này thuộc về:">
                      <Radio.Group
                        value={selectedType}
                        onChange={(e) => {
                          setSelectedType(e.target.value);
                          if (e.target.value !== "sub_major") {
                            setSelectedSpecialization([]);
                            setSubMajors([]);
                          }
                        }}
                      >
                        <Radio value="basic">Cơ bản</Radio>
                        <Radio value="majors">Chuyên ngành</Radio>
                        <Radio value="sub_major">Chuyên ngành hẹp</Radio>
                      </Radio.Group>
                    </Form.Item>

                    {selectedType === "majors" && (
                      <Form.Item
                        label="Chuyên ngành"
                        name="majors"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn chuyên ngành!",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          placeholder="Chọn chuyên ngành"
                          disabled={selectedType !== "majors"}
                        >
                          {Array.isArray(majors) &&
                            majors.map((major) => (
                              <Option key={major.id} value={major.id}>
                                {major.name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    )}

                    {selectedType === "sub_major" && (
                      <Form.Item
                        label="Chọn chuyên ngành chính"
                        name="majors"
                        rules={[
                          {
                            required: true,
                            message:
                              "Vui lòng chọn ít nhất một chuyên ngành chính!",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          placeholder="Chọn chuyên ngành chính"
                          onChange={(values) =>
                            setSelectedSpecialization(values)
                          }
                        >
                          {majors.map((major) => (
                            <Option key={major.id} value={major.id}>
                              {major.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}

                    {/* Dropdown chọn Chuyên ngành hẹp */}
                    {selectedType === "sub_major" && (
                      <Form.Item
                        label="Chọn chuyên ngành hẹp"
                        name="sub_major"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn một chuyên ngành hẹp!",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn chuyên ngành hẹp">
                          {subMajors.map((subMajor) => (
                            <Option key={subMajor.id} value={subMajor.id}>
                              {subMajor.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  </Col>
                </Row>

                <div className="flex justify-center items-center mt-4">
                  <Button type="primary" htmlType="submit">
                    {!update ? "Tạo môn học" : "Cập nhật môn học"}
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ListSubject;
