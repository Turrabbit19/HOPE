import React, { useState, useEffect } from "react";
import { Button, Popconfirm, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Testing = () => {
    const [semesters, setSemesters] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingSemester, setEditingSemester] = useState(null);

    useEffect(() => {
        // Giả lập dữ liệu kỳ học
        const fetchSemesters = async () => {
            const data = [
                {
                    id: 1,
                    name: "Kỳ 1",
                    startDate: "01-01-2024",
                    endDate: "30-04-2024",
                    status: "Đang diễn ra",
                    code: "K1",
                    description: "Kỳ học đầu tiên",
                },
                {
                    id: 2,
                    name: "Kỳ 2",
                    startDate: "01-05-2024",
                    endDate: "31-08-2024",
                    status: "Chờ diễn ra",
                    code: "K2",
                    description: "Kỳ học thứ hai",
                },
                {
                    id: 3,
                    name: "Kỳ 3",
                    startDate: "01-09-2024",
                    endDate: "31-12-2024",
                    status: "Chờ diễn ra",
                    code: "K3",
                    description: "Kỳ học thứ ba",
                },
            ];
            setSemesters(data);
        };

        fetchSemesters();
    }, []);

    const showEditModal = (semester) => {
        setEditingSemester(semester);
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setEditingSemester(null);
        setIsAddModalVisible(true);
    };

    const handleModalOk = () => {
        // Xử lý thêm mới hoặc sửa thông tin kỳ học
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
    };

    const confirmDelete = (id) => {
        setSemesters(semesters.filter((semester) => semester.id !== id));
    };

    return (
        <div className="row row-cols-2 g-3">
            <div className="col-12  mb-3">
                <Button type="primary" onClick={showAddModal}>
                    Thêm Mới
                </Button>
            </div>
            {semesters.length > 0 ? (
                semesters.map((semester) => (
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
                                                alt=""
                                            />
                                            <span className="text-[#44CC15] text-[12px]">
                                                {semester.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <p className="text-[#9E9E9E]">Mã:</p>
                                        <p className="font-bold text-[#000]">
                                            {semester.code}
                                        </p>
                                    </div>
                                    <div className="flex gap-6">
                                        <p className="text-[#9E9E9E]">
                                            Ngày bắt đầu:
                                        </p>
                                        <p className="font-bold text-[#000]">
                                            {semester.startDate}
                                        </p>
                                    </div>
                                    <div className="flex gap-6">
                                        <p className="text-[#9E9E9E]">
                                            Ngày kết thúc:
                                        </p>
                                        <p className="font-bold text-[#000]">
                                            {semester.endDate}
                                        </p>
                                    </div>
                                    <div className="text-[#9E9E9E] gap-2 mt-3 flex">
                                        <span className="flex-shrink-0">
                                            Mô tả:
                                        </span>
                                        <span className="text-black ml-2 line-clamp-2">
                                            {semester.description}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="teaching__card-bottom">
                                <Link
                                    to="list"
                                    className="flex items-center gap-3 text-[#1167B4] font-bold"
                                >
                                    <img
                                        src="/assets/svg/setting.svg"
                                        alt="Quản lý chương trình dạy"
                                    />
                                    Quản Lý Kỳ Học
                                </Link>

                                <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                    <img src="/assets/svg/eye.svg" alt="" />
                                    Chi Tiết
                                </button>

                                <Popconfirm
                                    title="Xóa kỳ học"
                                    description={`Bạn có chắc chắn muốn xóa kỳ học ${semester.name} không? `}
                                    onConfirm={() => confirmDelete(semester.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                        <img
                                            src="/assets/svg/remove.svg"
                                            alt=""
                                        />
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

            <Modal
                title={
                    editingSemester ? "Sửa Thông Tin Kỳ Học" : "Thêm Mới Kỳ Học"
                }
                visible={isEditModalVisible || isAddModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                footer={null}
            >
                {/* Nội dung của form thêm mới hoặc sửa kỳ học */}
                <p>
                    Form {editingSemester ? "sửa" : "thêm"} thông tin kỳ học cho{" "}
                    {editingSemester?.name || "mới"}
                </p>
                {/* Bạn có thể thêm form tương ứng ở đây */}
            </Modal>
        </div>
    );
};

export default Testing;
