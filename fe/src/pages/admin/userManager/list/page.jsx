import React, { useState } from "react";
import {
    Table,
    Avatar,
    Button,
    Modal,
    Descriptions,
    Divider,
    Popconfirm,
    message,
} from "antd";
import {
    DeleteOutlined,
    UserOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

// Dữ liệu mẫu
const accounts = {
    classManager: [
        {
            id: 1,
            name: "Nguyễn Văn A",
            phone: "0912789789",
            email: "quanly@example.com",
            avatar: "",
            dob: "01-10-2003",
            gender: true, // true: Nam, false: Nữ
            ethnicity: "Kinh", // Dân tộc
            address: "Hà Nội", // Địa chỉ
        },
    ],
    teachers: [
        {
            id: 2,
            name: "Nguyễn Văn B",
            phone: "0912789789",
            email: "giangvien1@example.com",
            avatar: "", // Ví dụ URL cho avatar
            teacher_code: "GV001",
            major: "Công nghệ thông tin",
            status: 0, // 'Đang công tác'
            dob: "01-10-2003",
            gender: true, // true: Nam, false: Nữ
            ethnicity: "Kinh", // Dân tộc
            address: "Hà Nội", // Địa chỉ
        },
        {
            id: 3,
            name: "Nguyễn Văn C",
            phone: "0912789789",
            email: "giangvien2@example.com",
            avatar: "", // Ví dụ URL cho avatar
            teacher_code: "GV002",
            major: "Kinh tế",
            status: 1, // 'Tạm dừng'
            dob: "01-10-2003",
            gender: false,
            ethnicity: "Kinh",
            address: "TP HCM",
        },
    ],
    students: [
        {
            id: 4,
            name: "Nguyễn Văn D",
            phone: "0912789789",
            email: "hocvien1@example.com",
            parent: "Lê Thị A",
            avatar: "", // Ví dụ URL cho avatar
            student_code: "SV001",
            current_semester: 3,
            status: 0, // 'Đang học'
            course: "Khóa Học 1",
            major: "Công nghệ thông tin",
            dob: "01-10-2003",
            gender: true,
            ethnicity: "Kinh",
            address: "Đà Nẵng",
        },
        {
            id: 5,
            name: "Nguyễn Văn E",
            phone: "0912789789",
            email: "hocvien2@example.com",
            parent: "Lê Thị A",
            avatar: "", // Ví dụ URL cho avatar
            student_code: "SV002",
            current_semester: 2,
            status: 1, // 'Bảo lưu'
            course: "Khóa Học 2",
            major: "Kinh tế",
            dob: "01-10-2003",
            gender: false,
            ethnicity: "Kinh",
            address: "Nha Trang",
        },
    ],
};

// Hàm chuyển đổi trạng thái từ số sang chuỗi cho Học viên
const getStudentStatus = (status) => {
    switch (status) {
        case 0:
            return "Đang học";
        case 1:
            return "Bảo lưu";
        case 2:
            return "Hoàn thành";
        default:
            return "Không xác định";
    }
};

// Hàm chuyển đổi trạng thái từ số sang chuỗi cho Giảng viên
const getTeacherStatus = (status) => {
    switch (status) {
        case 0:
            return "Đang công tác";
        case 1:
            return "Tạm dừng";
        case 2:
            return "Kết thúc";
        default:
            return "Không xác định";
    }
};

const ListUser = () => {
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [recordType, setRecordType] = useState(""); // "teacher" hoặc "student" hoặc "classManager"

    // Hàm hiển thị thông tin chi tiết của tài khoản
    const handleDetailClick = (record, type) => {
        setSelectedRecord(record);
        setRecordType(type);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
        setRecordType("");
    };

    const handleDelete = (record) => {
        message.success(`Đã xóa tài khoản: ${record.name}`);
    };

    // Các cột cho bảng hiển thị (chỉ bao gồm 4 cột: Avatar, Họ Tên, Điện Thoại, Email)
    const getColumns = (type = "") => {
        // Cột chung
        const commonColumns = [
            {
                title: "Avatar",
                dataIndex: "avatar",
                key: "avatar",
                render: (avatar) => (
                    <Avatar src={avatar} icon={!avatar && <UserOutlined />} />
                ),
            },
            {
                title: "Họ Tên",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Điện Thoại",
                dataIndex: "phone",
                key: "phone",
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
            },
        ];

        // Cột hành động
        const actionColumn = {
            title: "Hành Động",
            key: "actions",
            render: (text, record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        type="link"
                        icon={<InfoCircleOutlined />}
                        onClick={() =>
                            handleDetailClick(
                                record,
                                type === "teachers"
                                    ? "teacher"
                                    : type === "classManager"
                                    ? "classManager"
                                    : "student"
                            )
                        }
                    >
                        Chi tiết
                    </Button>

                    <Button type="link" icon={<EditOutlined />}>
                        <Link to={`update/${record.id}`}>Sửa</Link>
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa tài khoản này?"
                        onConfirm={() => handleDelete(record)} // Xóa tài khoản
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="link" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        };

        return [...commonColumns, actionColumn];
    };

    return (
        <div style={{ padding: "0 20px" }}>
            <div className="col-12 pb-8">
                <div className="col-12 justify-between flex">
                    <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                        Quản Lý Tài Khoản
                        <button>
                            <img src="/assets/svg/reload.svg" alt="reload..." />
                        </button>
                    </h1>
                </div>

                <div className="col-12 flex justify-between items-center mt-6">
                    <Link
                        to={`add`}
                        className="btn btn--outline text-[#7017E2]"
                    >
                        <PlusOutlined />
                        Tạo mới
                    </Link>
                </div>
            </div>

            {/* Tài Khoản Quản Lý Lớp */}
            <Divider orientation="left">#1. Quản trị Viên</Divider>
            <Table
                dataSource={accounts.classManager}
                columns={getColumns("classManager")}
                rowKey="id"
                pagination={false}
                style={{ marginBottom: "20px" }}
            />

            {/* Tài Khoản Giảng Viên */}
            <Divider orientation="left">#2. Giảng Viên</Divider>
            <Table
                dataSource={accounts.teachers}
                columns={getColumns("teachers")}
                rowKey="id"
                pagination={false}
                style={{ marginBottom: "20px" }}
            />

            {/* Tài Khoản Học Viên */}
            <Divider orientation="left">#3. Sinh Viên</Divider>
            <Table
                dataSource={accounts.students}
                columns={getColumns("students")}
                rowKey="id"
                pagination={false}
                style={{ marginBottom: "20px" }}
            />

            {/* Modal hiển thị chi tiết tài khoản */}
            {selectedRecord && (
                <Modal
                    title={`Chi tiết ${
                        recordType === "teacher"
                            ? "Giảng Viên"
                            : recordType === "classManager"
                            ? "Quản Trị Viên"
                            : "Học Viên"
                    }`}
                    visible={isModalVisible}
                    onCancel={handleModalClose}
                    footer={[
                        <Button key="close" onClick={handleModalClose}>
                            Đóng
                        </Button>,
                    ]}
                    width={800} // Tăng kích thước modal
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        <Avatar
                            size={100}
                            src={selectedRecord.avatar || <UserOutlined />}
                            style={{ marginRight: 20 }}
                        />
                        <div>
                            <h3>{selectedRecord.name}</h3>
                            <p>Email: {selectedRecord.email}</p>
                            <p>Điện Thoại: {selectedRecord.phone}</p>
                        </div>
                    </div>
                    <Divider />

                    <Descriptions bordered column={1}>
                        {/* Thông tin cho Quản Trị Viên */}
                        {recordType === "classManager" && (
                            <>
                                <Descriptions.Item label="Ngày Sinh">
                                    {selectedRecord.dob}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giới Tính">
                                    {selectedRecord.gender ? "Nam" : "Nữ"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Dân Tộc">
                                    {selectedRecord.ethnicity}
                                </Descriptions.Item>
                                <Descriptions.Item label="Địa Chỉ">
                                    {selectedRecord.address}
                                </Descriptions.Item>
                            </>
                        )}

                        {/* Thông tin cho Giảng Viên */}
                        {recordType === "teacher" && (
                            <>
                                <Descriptions.Item label="Mã Giảng Viên">
                                    {selectedRecord.teacher_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngành Học">
                                    {selectedRecord.major}
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng Thái">
                                    {getTeacherStatus(selectedRecord.status)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày Sinh">
                                    {selectedRecord.dob}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giới Tính">
                                    {selectedRecord.gender ? "Nam" : "Nữ"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Dân Tộc">
                                    {selectedRecord.ethnicity}
                                </Descriptions.Item>
                                <Descriptions.Item label="Địa Chỉ">
                                    {selectedRecord.address}
                                </Descriptions.Item>
                            </>
                        )}

                        {/* Thông tin cho Học Viên */}
                        {recordType === "student" && (
                            <>
                                <Descriptions.Item label="Mã Sinh Viên">
                                    {selectedRecord.student_code}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngành Học">
                                    {selectedRecord.major}
                                </Descriptions.Item>
                                <Descriptions.Item label="Khóa Học">
                                    {selectedRecord.course}
                                </Descriptions.Item>
                                <Descriptions.Item label="Học Ký Hiện Tại">
                                    {selectedRecord.current_semester}
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng Thái">
                                    {getStudentStatus(selectedRecord.status)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phụ Huynh">
                                    {selectedRecord.parent}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày Sinh">
                                    {selectedRecord.dob}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giới Tính">
                                    {selectedRecord.gender ? "Nam" : "Nữ"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Dân Tộc">
                                    {selectedRecord.ethnicity}
                                </Descriptions.Item>
                                <Descriptions.Item label="Địa Chỉ">
                                    {selectedRecord.address}
                                </Descriptions.Item>
                            </>
                        )}
                    </Descriptions>
                </Modal>
            )}
        </div>
    );
};

export default ListUser;
