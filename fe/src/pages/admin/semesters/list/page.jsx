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
    Space,
} from "antd";
import {
    EditOutlined,
    PlusOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import moment from "moment";
import instance from "../../../../config/axios";
import Loading from "../../../../components/loading";
import { useNavigate } from "react-router-dom";

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
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const semestersResponse = await instance.get("admin/semesters");
            const abc = semestersResponse.data.data;
            setSemesters(abc);
            let b = Array.from(
                new Set(
                    abc.map((semester) => moment(semester.start_date).year())
                )
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
        const filteredYear = year === null || year === "all" ? "" : year;
        setSelectedYear(year);

        try {
            setLoading(true);
            const response = await instance.get(
                filteredYear
                    ? `admin/filter-by-year/semesters?year=${filteredYear}`
                    : `admin/filter-by-year/semesters`
            );

            setSemesters(response.data.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error filtering semesters by year:", error);

            notification.error({
                message: "Lỗi khi lọc kỳ học theo năm",
                description:
                    error.response?.data?.message ||
                    "Đã xảy ra lỗi, vui lòng thử lại!",
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
            const response = await instance.post(
                "admin/semesters",
                formattedValues
            );

            notification.success({ message: "Thêm kỳ học thành công" });

            setSemesters([...semesters, response.data.data]);
            form.resetFields();
        } catch (error) {
            if (error.response) {
                if (error.response.data.error) {
                    notification.error({
                        message: "Lỗi",
                        description: error.response.data.error,
                    });
                } else if (error.response.data.errors) {
                    const errorMessages = Object.values(
                        error.response.data.errors
                    ).flat();
                    errorMessages.forEach((message) => {
                        notification.error({
                            message: "Lỗi",
                            description: message,
                        });
                    });
                } else {
                    notification.error({
                        message: "Lỗi không xác định",
                        description:
                            error.response.data.message ||
                            "Có lỗi xảy ra. Vui lòng thử lại sau.",
                    });
                }
            } else {
                notification.error({
                    message: "Lỗi không xác định",
                    description: "Có lỗi xảy ra. Vui lòng thử lại sau.",
                });
            }

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
            status: 1, // Có thể thay đổi tùy vào nhu cầu
        };

        try {
            setLoading(true);
            const response = await instance.put(
                `admin/semesters/${editingSemester.id}`,
                formattedValues
            );
            const updatedSemester = response.data.data;

            // Cập nhật dữ liệu semester
            setSemesters((prev) =>
                prev.map((semester) =>
                    semester.id === updatedSemester.id
                        ? updatedSemester
                        : semester
                )
            );

            notification.success({ message: "Cập nhật kỳ học thành công" });
            form.resetFields();
            handleModalCancel();
        } catch (error) {
            if (error.response) {
                if (error.response.data.error) {
                    notification.error({
                        message: "Lỗi",
                        description: error.response.data.error,
                    });
                } else if (error.response.data.errors) {
                    const errorMessages = Object.values(
                        error.response.data.errors
                    ).flat();
                    errorMessages.forEach((message) => {
                        notification.error({
                            message: "Lỗi",
                            description: message,
                        });
                    });
                } else {
                    notification.error({
                        message: "Lỗi không xác định",
                        description:
                            error.response.data.message ||
                            "Có lỗi xảy ra. Vui lòng thử lại sau.",
                    });
                }
            } else {
                notification.error({
                    message: "Lỗi không xác định",
                    description: "Có lỗi xảy ra. Vui lòng thử lại sau.",
                });
            }
            console.error("Error submitting data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBack = () => {
        navigate("/admin");
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="test__list">
            <div className="row row-cols-2 g-3">
                <div className="col-12">
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <Space
                            align="center"
                            style={{ cursor: "pointer" }}
                            onClick={handleBack}
                        >
                            <div
                                style={{
                                    border: "1.5px solid #1890ff",
                                    borderRadius: "50%",
                                    padding: "6px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ArrowLeftOutlined
                                    style={{
                                        fontSize: "16px",
                                        color: "#1890ff",
                                    }}
                                />
                            </div>
                        </Space>
                        <h1 className="text-4xl font-bold text-center text-[#7017E2]">
                            Quản Lý Kỳ Học
                        </h1>
                        <div className="justify-end flex ">
                            <div>
                                <Form.Item
                                    label="Lọc theo năm"
                                    style={{ marginBottom: 16 }}
                                >
                                    <Select
                                        placeholder="Chọn năm"
                                        onChange={handleYearFilter}
                                        allowClear
                                        style={{ width: 200 }}
                                        value={selectedYear}
                                    >
                                        <Select.Option key="all" value="all">
                                            Tất cả
                                        </Select.Option>
                                        {allYears.map((year) => (
                                            <Select.Option
                                                key={year}
                                                value={year}
                                            >
                                                {year}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <Button
                                onClick={showAddModal}
                                className="btn btn--outline text-[#7017E2]"
                            >
                                <PlusOutlined />
                                Tạo mới
                            </Button>

                            <span className="font-bold text-[14px] text-[#000]">
                                {displaySemesters.length} kỳ học
                            </span>
                        </div>
                    </div>

                    <div className="row row-cols-2 g-3">
                        {paginatedSemesters.length > 0 ? (
                            paginatedSemesters.map((semester) => (
                                <div className="col" key={semester.id}>
                                    <div className="teaching__card">
                                        <div className="teaching__card-top flex justify-between items-center">
                                            <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                Kỳ học:{" "}
                                                <span className="text-red-300 uppercase ml-2 font-bold">
                                                    {semester.name}
                                                </span>
                                            </h2>
                                            <button>
                                                <img
                                                    src="/assets/svg/more_detail.svg"
                                                    alt=""
                                                />
                                            </button>
                                        </div>

                                        <div className="teaching__card-body">
                                            <div className="mt-6 flex flex-col gap-8 pb-6">
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Trạng thái:
                                                    </p>
                                                    <div className="teaching__card-status flex items-center gap-1">
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
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày bắt đầu:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {moment(
                                                            semester.start_date
                                                        ).format("DD/MM/YYYY")}
                                                    </p>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày kết thúc:
                                                    </p>
                                                    <p className="font-bold text-[#000]">
                                                        {moment(
                                                            semester.end_date
                                                        ).format("DD/MM/YYYY")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {semester.status === "Đang diễn ra" ||
                                        semester.status === "Kết thúc" ? (
                                            ""
                                        ) : (
                                            <div className="teaching__card-bottom flex gap-2">
                                                <Popconfirm
                                                    title="Xóa kỳ học"
                                                    onConfirm={() =>
                                                        confirmDelete(
                                                            semester.id
                                                        )
                                                    }
                                                    okText="Có"
                                                    cancelText="Không"
                                                >
                                                    <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                        <DeleteOutlined />
                                                        Xóa
                                                    </button>
                                                </Popconfirm>
                                                <button
                                                    className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                                                    onClick={() =>
                                                        showEditModal(semester)
                                                    }
                                                >
                                                    <EditOutlined />
                                                    Sửa Thông Tin
                                                </button>
                                            </div>
                                        )}
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
                            align="center"
                            pageSize={pageSize}
                            total={displaySemesters.length}
                            onChange={handlePageChange}
                            style={{ marginTop: 16, textAlign: "center" }}
                        />
                    )}
                </div>
            </div>

            <Modal
                title={
                    editingSemester ? "Sửa Thông Tin Kỳ Học" : "Thêm Mới Kỳ Học"
                }
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
                        onFinish={
                            editingSemester ? onHandleUpdate : handleModalOk
                        }
                        autoComplete="off"
                    >
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

                        <div className="flex justify-center items-center mt-4">
                            <Button type="primary" htmlType="submit">
                                {editingSemester
                                    ? "Cập nhật kỳ học"
                                    : "Tạo kỳ học"}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default ListSemester;
