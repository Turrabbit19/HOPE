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
  message,
  Checkbox,
  notification,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useLocation, useParams } from "react-router-dom";
import instance from "../../../../config/axios";

const SubMajors = () => {
  const [majors, setMajors] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const [isMajorSelected, setIsMajorSelected] = useState(false);
  const itemsPerPage = 6;
  const [idMajor, setId] = useState();
  const { id } = useParams();
  const { majorName } = useLocation().state || {};
  console.log(majorName);
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await instance.get(`/admin/sub/${id}/majors`);
        setMajors(response.data.data);
      } catch (error) {
        message.error("Không thể tải dữ liệu chuyên ngành");
      }
    };

    fetchMajors();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredMajors = majors
    .filter((major) => major.name.toLowerCase().includes(searchTerm))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showEditModal = (major) => {
    setEditingMajor(major);
    form.setFieldsValue({
      name: major.name,
      code: major.code,
      status: major.status,
      description: major.description,
      isMajor: major.isMajor || false,
      selectedMajor: major.selectedMajor || null,
    });
    setId(major.id);
    setIsMajorSelected(major.isMajor || false);
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    setEditingMajor(null);
    form.resetFields();
    setIsMajorSelected(false);
    setIsAddModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      if (editingMajor) {
        const response = await instance.put(`/admin/majors/${idMajor}`, {
          ...values,
          major_id: id,
        });
        setMajors(
          majors.map((major) =>
            major.id === editingMajor.id ? { ...major, ...values } : major
          )
        );
        notification.success({
          message: "Cập nhật chuyên ngành thành công",
        });
      } else {
        const response = await instance.post("/admin/majors", {
          ...values,
          major_id: id,
        });
        setMajors([
          ...majors,
          { id: majors.length + 1, ...response.data.data },
        ]);
        notification.success({
          message: "Thêm mới chuyên ngành thành công",
        });
      }
      handleModalCancel();
    } catch (errorInfo) {
      console.log("Validate Failed:", errorInfo);
    }
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
    form.resetFields();
    setIsMajorSelected(false);
  };

  const confirmDelete = async (id) => {
    try {
      await instance.delete(`/admin/majors/${id}`);
      setMajors(majors.filter((major) => major.id !== id));
      notification.success({
        message: "Xóa ngành học thành công",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="row row-cols-2 g-3">
      <div className="col-12">
        <div className="col-12">
          <div className="justify-between flex">
            <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
              Quản lý Chuyên ngành: {majorName}
            </h1>

            <div>
              <Input.Search
                placeholder="Tìm kiếm chuyên ngành..."
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
              {majors.length} items
            </span>
          </div>
        </div>
        <div className="row row-cols-2 g-3">
          {filteredMajors.length > 0 ? (
            filteredMajors.map((major) => (
              <div className="col" key={major.id}>
                <div className="teaching__card">
                  <div className="teaching__card-top">
                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                      <img src="/assets/svg/share.svg" alt="" />
                      Chuyên ngành hẹp:{" "}
                      <p className="text-red-300 uppercase ml-2 font-bold">
                        {major.name}
                      </p>
                    </h2>
                    <button>
                      <img src="/assets/svg/more_detail.svg" alt="" />
                    </button>
                  </div>

                  <div className="teaching__card-body">
                    <div className="mt-6 flex flex-col gap-8 pb-6">
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">Mã chuyên ngành:</p>
                        <p className="font-bold text-[#000]">{major.code}</p>
                      </div>
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">Trạng thái :</p>
                        <div className="teaching__card-status">
                          <img
                            className="svg-green"
                            src="/assets/svg/status.svg"
                            alt=""
                          />
                          <span className="text-[#44CC15] text-[12px]">
                            {major.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">Mô tả:</p>
                        <p className="text-black ml-2 line-clamp-2">
                          {major.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="teaching__card-bottom">
                    <Link
                      to={`${major.id}/subjects`}
                      state={{ majorName: major.name }}
                      className="flex items-center gap-1 text-[#1167B4] font-bold"
                    >
                      <img src="/assets/svg/setting.svg" alt="setting" />
                      Quản lý môn học
                    </Link>

                    <Popconfirm
                      title="Xóa chuyên ngành"
                      onConfirm={() => confirmDelete(major.id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <button className="text-[#FF5252] font-bold flex items-center gap-1 justify-center">
                        <img src="/assets/svg/remove.svg" alt="remove" />
                        Xóa
                      </button>
                    </Popconfirm>

                    <button
                      className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                      onClick={() => showEditModal(major)}
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
                Không tìm thấy chuyên ngành
              </p>
            </div>
          )}
        </div>
        <Pagination
          align="center"
          current={currentPage}
          pageSize={itemsPerPage}
          total={majors.length}
          onChange={handlePageChange}
          className="mt-6"
        />
      </div>

      <Modal
        title={
          editingMajor ? "Sửa Thông Tin Chuyên Ngành" : "Thêm Mới Chuyên Ngành"
        }
        open={isEditModalVisible || isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalOk}
          autoComplete="off"
          name="basic"
          initialValues={{ remember: true }}
        >
          {/* Form Content */}
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Column 1 */}
            <div style={{ flex: 1 }}>
              <Form.Item
                name="code"
                label="Mã chuyên ngành"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền vào trường này",
                  },
                  {
                    min: 4,
                    message: "Mã chuyên ngành phải có ít nhất 4 ký tự",
                  },
                ]}
              >
                <Input placeholder="Code" />
              </Form.Item>

              <Form.Item
                name="name"
                label="Tên chuyên ngành"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền vào trường này",
                  },
                  {
                    min: 6,
                    message: "Tên chuyên ngành phải có ít nhất 6 ký tự",
                  },
                ]}
              >
                <Input placeholder="Tên chuyên ngành" />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền vào trường này",
                  },
                ]}
              >
                <Input.TextArea placeholder="Mô tả" rows={5} />
              </Form.Item>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "30px",
            }}
          >
            <Button
              onClick={() => form.resetFields()}
              className="btn btn--cancel"
            >
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="btn btn--primary"
            >
              {editingMajor ? "Lưu" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SubMajors;
