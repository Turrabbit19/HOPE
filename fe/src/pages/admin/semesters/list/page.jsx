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
  notification,
} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import instance from "../../../../config/axios";
import Loading from "../../../../components/loading";

const ListSemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [allYears, setAllYears] = useState([]);

  useEffect(() => {
    

    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      const semestersResponse = await instance.get("admin/semesters");
      const abc = semestersResponse.data.data;
      setSemesters(abc);
      let b = Array.from(
        new Set(abc.map((semester) => moment(semester.start_date).year()))
      );

      setAllYears(b);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Lỗi tải dữ liệu",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1);
  };

  const handleYearFilter = async (year) => {
    if(year == 9999) {
      fetchData();
      return;
    }
    try {
      setLoading(true);
      const response = await instance.get(
        `http://127.0.0.1:8000/api/admin/filter-by-year/semesters?year=${year}`
      );
      setSemesters(response.data.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error filtering semesters by year:", error);
      notification.error({
        message: "Lỗi khi lọc kỳ học theo năm",
      });
    } finally {
      setLoading(false);
    }
  };

  const displaySemesters =
    searchTerm.trim() === ""
      ? semesters
      : semesters.filter((semester) =>
          semester.name.toLowerCase().includes(searchTerm)
        );

  const paginatedSemesters = displaySemesters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const showEditModal = (semester) => {
    setEditingSemester(semester);
    form.setFieldsValue({
      name: semester.name,
      start_date: moment(semester.start_date),
      end_date: moment(semester.end_date),
      status: semester.status,
    });
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    setEditingSemester(null);
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleModalOk = async (values) => {
    const formattedValues = {
      name: values.name,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      status: 1,
    };

    try {
      setLoading(true);
      const response = await instance.post("admin/semesters", formattedValues);
      notification.success({ message: "Thêm kỳ học thành công" });
      setSemesters([...semesters, response.data.data]);
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
        message: "Xóa kỳ học thành công",
      });
    } catch (error) {
      console.error("Error deleting semester:", error);
      notification.error({
        message: "Xóa thất bại",
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
      status: 1,
    };

    try {
      setLoading(true);
      const response = await instance.put(
        `admin/semesters/${editingSemester.id}`,
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
      notification.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
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
                <Form.Item label="Lọc theo năm" style={{ marginBottom: 16 }}>
                  <Select
                    placeholder="Chọn năm"
                    onChange={handleYearFilter}
                    allowClear
                    style={{ width: 200 }}
                    // value={null} 
                  >
                    <Select.Option key={null} value={9999}>
                      Tất cả
                    </Select.Option>
                    {allYears.map((year) => (
                      <Select.Option key={year} value={year}>
                        {year}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
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
                {displaySemesters.length} items
              </span>
            </div>
          </div>

          <div className="row row-cols-2 g-3">
            {paginatedSemesters.length > 0 ? (
              paginatedSemesters.map((semester) => (
                <div className="col" key={semester.id}>
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
                      <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                        <img src="/assets/svg/eye.svg" alt="detail" />
                        Chi tiết
                      </button>
                      {semester.status === "Đang diễn ra" ||
                      semester.status === "Kết thúc" ? (
                        ""
                      ) : (
                        <>
                          <button
                            className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                            onClick={() => confirmDelete(semester.id)}
                          >
                            <DeleteOutlined />
                            Xóa
                          </button>
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

          {/* Pagination Component */}
          {displaySemesters.length > pageSize && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={displaySemesters.length}
              onChange={(page) => setCurrentPage(page)}
              style={{ marginTop: 16, textAlign: "center" }}
            />
          )}
        </div>

        <Modal
          title={editingSemester ? "Sửa Thông Tin Kỳ Học" : "Thêm Mới Kỳ Học"}
          open={isEditModalVisible || isAddModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          centered
          width={600}
        >
          <div className="createScheduleForm pb-6">
            <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
              {editingSemester ? "Sửa Kỳ Học" : "Tạo Kỳ Học Mới"}
            </h3>

            <Form
              form={form}
              layout="vertical"
              onFinish={isEditModalVisible ? onHandleUpdate : handleModalOk}
              autoComplete="off"
            >
              <Form.Item
                label="Tên Kỳ Học"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên kỳ học!" },
                ]}
              >
                <Input placeholder="Tên kỳ học" />
              </Form.Item>

              <Form.Item
                label="Ngày Khởi Tạo"
                name="start_date"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày khởi tạo!" },
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
                  { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Ngày kết thúc"
                />
              </Form.Item>

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
