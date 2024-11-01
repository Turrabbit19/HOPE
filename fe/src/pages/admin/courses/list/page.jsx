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
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const ListCourse = () => {
    const [courses, setCourses] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCourses = async () => {
            const data = [
                {
                    id: 1,
                    name: "Khóa 18.1",
                    startDate: "2024-01-01",
                    endDate: "2024-04-30",
                    status: "Đang diễn ra",
                },
                {
                    id: 2,
                    name: "Khóa 18.2",
                    startDate: "2024-05-01",
                    endDate: "2024-08-31",
                    status: "Chờ diễn ra",
                },
                {
                    id: 3,
                    name: "Khóa 18.3",
                    startDate: "2024-09-01",
                    endDate: "2024-12-31",
                    status: "Chờ diễn ra",
                },
            ];
            setCourses(data);
        };

        fetchCourses();
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
            startDate: moment(course.startDate),
            endDate: moment(course.endDate),
            status: course.status,
        });
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setEditingCourse(null);
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleModalOk = async () => {
        const values = await form.validateFields();
        if (editingCourse) {
            setCourses(
                courses.map((course) =>
                    course.id === editingCourse.id
                        ? { ...course, ...values }
                        : course
                )
            );
        } else {
            setCourses([...courses, { id: courses.length + 1, ...values }]);
        }
        handleModalCancel();
    };

    const handleModalCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
    };

    const confirmDelete = (id) => {
        setCourses(courses.filter((course) => course.id !== id));
    };

    return (
        <div className="row row-cols-2 g-3">
            <div className="col-12">
                <div className="col-12">
                    <div className="justify-between flex">
                        <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                            Quản Lý Khóa Học
                            <button>
                                <img
                                    src="/assets/svg/reload.svg"
                                    alt="reload..."
                                />
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
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div className="col" key={course.id}>
                                <div className="teaching__card">
                                    <div className="teaching__card-top">
                                        <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                            <img
                                                src="/assets/svg/share.svg"
                                                alt=""
                                            />
                                            Chuyên ngành:{" "}
                                            <p className="text-red-300 uppercase ml-2 font-bold">
                                                {course.name}
                                            </p>
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
                                                <p className="text-[#9E9E9E]">
                                                    Ngày bắt đầu:
                                                </p>
                                                <p className="font-bold text-[#000]">
                                                    {course.startDate}
                                                </p>
                                            </div>
                                            <div className="flex gap-6">
                                                <p className="text-[#9E9E9E]">
                                                    Ngày kết thúc:
                                                </p>
                                                <p className="font-bold text-[#000]">
                                                    {course.endDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="teaching__card-bottom">
                                        <Link
                                            to={`${course.id}/detail`}
                                            className="flex items-center gap-3 text-[#1167B4] font-bold"
                                        >
                                            <img
                                                src="/assets/svg/setting.svg"
                                                alt="setting"
                                            />
                                            Quản Lý Khóa Học
                                        </Link>
                                        <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                            <img
                                                src="/assets/svg/eye.svg"
                                                alt="detail"
                                            />
                                            Chi Tiết
                                        </button>
                                        <Popconfirm
                                            title="Xóa khóa học"
                                            onConfirm={() =>
                                                confirmDelete(course.id)
                                            }
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/remove.svg"
                                                    alt="remove"
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </Popconfirm>

                                        <button
                                            className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                                            onClick={() =>
                                                showEditModal(course)
                                            }
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
                title={
                    editingCourse
                        ? "Sửa Thông Tin Khóa Học"
                        : "Thêm Mới Khóa Học"
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
                    onFinish={handleModalOk}
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
                        name="startDate"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày bắt đầu!",
                            },
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày Kết Thúc"
                        name="endDate"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày kết thúc!",
                            },
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    {/* <Form.Item
                        label="Trạng Thái"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="Đang diễn ra">Đang diễn ra</Option>
                            <Option value="Chờ diễn ra">Chờ diễn ra</Option>
                        </Select>
                    </Form.Item> */}
                    <Form.Item
                        label="Quản lý học tập"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng không để trống",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn quản lý học tập">
                            <Option value="abcyxz">abcyxz</Option>
                            <Option value="123456">123456</Option>
                        </Select>
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
