import {
    Button,
    Form,
    Input,
    message,
    Modal,
    notification,
    Pagination,
    Popconfirm,
    Select,
  } from "antd";
  import { EditOutlined, PlusOutlined } from "@ant-design/icons";
  import React, { useState, useEffect } from "react";
  import { Link } from "react-router-dom";
  import Loading from "../../../components/loading";
  import instance from "../../../config/axios";
  
  const Teach = () => {
    // const [courses, setCourses] = useState([]);
    const [filterMajors, setFilterMajors] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [majors, setMajors] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [initialValues, setInitialValues] = useState({});
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
  
    useEffect(() => {
      const fetchMajors = async () => {
        setLoading(true);
        try {
          const { data } = await instance.get("admin/majors");
          setMajors(data.data);
        } catch (error) {
          console.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMajors();
    }, []);
  
    const checkNameUnique = async (name) => {
      const { data } = await instance.get(`admin/majors/check-unique/${name}`);
      if(data.is_unique){
        return true;
      }else {
        return ""
      }
    //   return  data.data.is_unique : "";
    };
  
    const onHandleSubmit = async (values) => {
      setLoading(true);
      try {
        const response = await instance.post("admin/majors", values);
        const newMajor = response.data.data;
        setMajors((prevMajors) => [...prevMajors, newMajor]);
        message.success("Tạo mới ngành học thành công");
        form.resetFields();
        handleCancel();
      } catch (error) {
        console.error(error.message);
        message.error("Không thể tạo mới ngành học");
      } finally {
        setLoading(false);
      }
    };
  
    const onHandleDelete = async (id) => {
      setLoading(true);
      try {
        await instance.delete(`admin/majors/${id}`);
        setMajors(majors.filter((item) => item.id !== id));
        message.success(
            <span>
                Xóa mềm thành công,
                <button
                    onClick={() => undoMajor(id)}
                    className="underline"
                >
                    Hoàn tác
                </button>
            </span>,
            5
        )
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    const undoMajor = async (id) => {
        try {
            const response = await instance.post(`admin/majors/${id}/restore`);
        const restoredMajor = response.data.data;
        message.success("Khôi phục thành công");
        
        setMajors((prevMajors) => [...prevMajors, restoredMajor]);
        } catch (error) {
            console.log(error.message);
            message.error("Khôi phục thất bại thất bại");
        } finally {
            setLoading(false);
        }
    }
  
    const onHandleUpdate = async (values) => {
      setLoading(true);
      try {
        await instance.put(`admin/majors/${initialValues.id}`, values);
        message.success("Cập nhật ngành học thành công");
        setMajors((prevMajors) =>
          prevMajors.map((major) => (major.id === initialValues.id ? { ...major, ...values } : major))
        );
        handleCancel();
      } catch (error) {
        console.error(error.message);
        message.error("Không thể cập nhật ngành học");
      } finally {
        setLoading(false);
      }
    };
  
    const handleSearch = (event) => {
      const value = event.target.value.toLowerCase();
      const filtered = majors.filter(
        (major) =>
          major.name.toLowerCase().includes(value) ||
          major.code.toLowerCase().includes(value)
      );
      setFilterMajors(filtered);
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    };
  
    const handleCancel = () => {
      setUpdate(false);
      form.resetFields();
      setInitialValues({});
      setIsModalVisible(false);
    };
  
    const showEditModal = (item) => {
      setInitialValues(item);
      form.setFieldsValue(item);
      setUpdate(true);
      setIsModalVisible(true);
    };
  
    // Tính toán các chỉ số cho phân trang
    const indexOfLastMajor = currentPage * pageSize;
    const indexOfFirstMajor = indexOfLastMajor - pageSize;
    const currentMajors = (filterMajors.length > 0 ? filterMajors : majors).slice(indexOfFirstMajor, indexOfLastMajor);
  
    if (loading) {
      return <Loading />;
    }
  
    return (
      <>
        {contextHolder}
        <div className="teaching">
          <div className="container">
            <div className="row justify-between">
              <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                Quản Lý Ngành
                <button>
                  <img src="/assets/svg/reload.svg" alt="reload..." />
                </button>
              </h1>
              <div>
                <Input.Search
                  placeholder="Tìm kiếm ngành học..."
                  onChange={handleSearch}
                  style={{ width: 300 }}
                  allowClear
                />
              </div>
            </div>
  
            <div className="flex justify-between items-center mt-6">
              <Button onClick={() => setIsModalVisible(true)} className="btn btn--outline text-[#7017E2]">
                <PlusOutlined />
                Tạo mới
              </Button>
              <span className="font-bold text-[14px] text-[#000]">
                {majors.length} ngành học
              </span>
            </div>
  
            {/* Hiển thị danh sách ngành học */}
            <div className="row row-cols-2 g-3">
              {currentMajors.length > 0 ? (
                currentMajors.map((item) => (
                  <div className="col" key={item.id}>
                    <div className="teaching__card">
                      <div className="teaching__card-top">
                        <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                          <img src="/assets/svg/share.svg" alt="" />
                          Chuyên ngành:{" "}
                          <p className="text-red-300 uppercase ml-2 font-bold">{item.name}</p>
                        </h2>
                        <button>
                          <img src="/assets/svg/more_detail.svg" alt="" />
                        </button>
                      </div>
                      <div className="teaching__card-body">
                        <div className="mt-6 flex flex-col gap-8 pb-6">
                          <div className="flex gap-6">
                            <p className="text-[#9E9E9E]">Trạng thái :</p>
                            <div className="teaching__card-status">
                              <img className="svg-green" src="/assets/svg/status.svg" alt="" />
                              <span className="text-[#44CC15] text-[12px]">{item.status}</span>
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <p className="text-[#9E9E9E]">Code :</p>
                            <p className="font-bold text-[#000]">{item.code}</p>
                          </div>
                          <div className="text-[#9E9E9E] gap-2 mt-3 flex">
                            <span className="flex-shrink-0">Mô tả :</span>
                            <span className="text-black ml-2 line-clamp-2">{item.description}</span>
                          </div>
                        </div>
                      </div>
                      <div className="teaching__card-bottom">
                        <Link to="list" className="flex items-center gap-3 text-[#1167B4] font-bold">
                          <img src="/assets/svg/setting.svg" alt="Quản lý chương trình dạy" />
                          Quản Lý Chương Trình Dạy
                        </Link>
                        <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                          <img src="/assets/svg/eye.svg" alt="" />
                          Chi Tiết
                        </button>
                        <Popconfirm
                          title="Xóa môn học"
                          description={`Bạn có chắc chắn muốn xóa ngành học "${item.name}" không? `}
                          okText="Có"
                          onConfirm={() => onHandleDelete(item.id)}
                          cancelText="Không"
                        >
                          <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                            <img src="/assets/svg/remove.svg" alt="" />
                            Xóa khỏi Danh Sách
                          </button>
                        </Popconfirm>
                        <button
                          className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                          onClick={() => showEditModal(item)}
                        >
                          <EditOutlined />
                          Sửa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có ngành học nào.</p>
              )}
            </div>
  
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={(filterMajors.length > 0 ? filterMajors : majors).length}
              onChange={(page) => setCurrentPage(page)}
              className="mt-6"
            />
  
            <Modal
              title={update ? "Cập nhật ngành học" : "Thêm mới ngành học"}
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
              width={1000}
            >
              <Form
                form={form}
                autoComplete="off"
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={initialValues}
                onFinish={update ? onHandleUpdate : onHandleSubmit}
              >
                <div className="flex row-cols-2 pb-6 justify-between items-end teaching__add">
                  <div className="col-6">
                    <div className="teaching_add-form-left">
                      <h1 className="text-[#1167B4] text-[20px] mt-4 font-semibold">Tổng quan</h1>
  
                      <div className="teaching__add-form-group mt-14">
                        <Form.Item
                          name="name"
                          rules={[
                            { required: true, message: "Vui lòng điền vào trường này" },
                            { min: 6, message: "Tên chuyên ngành phải có ít nhất 6 ký tự" },
                            {
                              validator: async (_, value) => {
                                if (!update) {
                                  const isUnique = await checkNameUnique(value);
                                  if (!isUnique) {
                                    return Promise.reject(new Error("Tên ngành đã trùng, vui lòng đặt tên khác."));
                                  }
                                }
                              },
                            },
                          ]}
                        >
                          <Input placeholder="Tên chuyên ngành" className="input_form" />
                        </Form.Item>
                      </div>
  
                      <div className="teaching__add-form-group mt-14 mb-8">
                        <Form.Item
                          name="status"
                          rules={[{ required: true, message: "Vui lòng điền vào trường này" }]}
                        >
                          <Select
                            placeholder="Chọn trạng thái"
                            options={[
                              { value: "Đang hoạt động", label: "Đang hoạt động" },
                              { value: "Tạm dừng", label: "Tạm dừng" },
                            ]}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
  
                  <div className="col-5">
                    <div className="teaching_add-form-left">
                      <div className="teaching__add-form-group mt-3">
                        <Form.Item
                          name="description"
                        //   className="w-500"
                          rules={[{ required: true, message: "Vui lòng điền vào trường này" }]}
                        >
                          <Input.TextArea placeholder="Mô tả" rows={8}  />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button type="reset" className="btn btn--cancel">Reset</button>
                  <button className="btn btn--primary">{update ? "Cập nhật" : "Thêm mới"}</button>
                </div>
              </Form>
            </Modal>
          </div>
        </div>
      </>
    );
  };
  
  export default Teach;
  