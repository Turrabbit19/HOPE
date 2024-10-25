import React, { useState } from "react";
import {
    Table,
    Avatar,
    Button,
    Modal,
    Descriptions,
    Divider,
    Input,
} from "antd";
import {
    DeleteOutlined,
    UserOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";

// Sample data
const accounts = {
    classManager: [
        {
            id: 1,
            name: "Nguyễn Văn A",
            phone: "0912789789",
            email: "quanly@example.com",
            avatar: "",
            dob: "1985-05-05",
            gender: true,
            ethnicity: "Kinh",
            address: "Hà Nội",
        },
    ],
    teachers: [
        {
            id: 2,
            name: "Nguyễn Văn B",
            phone: "0912789789",
            email: "giangvien1@example.com",
            avatar: "",
            teacher_code: "GV001",
            major: "Công nghệ thông tin",
            status: 0,
            dob: "1990-01-01",
            gender: true,
            ethnicity: "Kinh",
            address: "Hà Nội",
        },
        {
            id: 3,
            name: "Nguyễn Văn C",
            phone: "0912789789",
            email: "giangvien2@example.com",
            avatar: "",
            teacher_code: "GV002",
            major: "Kinh tế",
            status: 1,
            dob: "1988-02-02",
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
            avatar: "",
            student_code: "SV001",
            current_semester: 3,
            status: 0,
            course: "Khóa Học 1",
            major: "Công nghệ thông tin",
            dob: "2000-03-03",
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
            avatar: "",
            student_code: "SV002",
            current_semester: 2,
            status: 1,
            course: "Khóa Học 2",
            major: "Kinh tế",
            dob: "2001-04-04",
            gender: false,
            ethnicity: "Kinh",
            address: "Nha Trang",
        },
    ],
};

// Convert status from number to string for Students
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

// Convert status from number to string for Teachers
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

const Testing = () => {
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [recordType, setRecordType] = useState("");
    const [teacherFilter, setTeacherFilter] = useState("");
    const [studentFilter, setStudentFilter] = useState("");

    // Show account detail
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

    // Columns for displaying table (only includes 4 columns: Avatar, Name, Phone, Email)
    const getColumns = (type = "") => {
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

        // Action column (Details and Delete)
        const actionColumn = {
            title: "Hành Động",
            key: "actions",
            render: (text, record) => (
                <>
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
                    <Button type="link" icon={<DeleteOutlined />} />
                </>
            ),
        };

        return [...commonColumns, actionColumn];
    };

    // Filter teachers and students based on the input fields
    const filteredTeachers = accounts.teachers.filter((teacher) =>
        teacher.teacher_code.toLowerCase().includes(teacherFilter.toLowerCase())
    );

    const filteredStudents = accounts.students.filter((student) =>
        student.course.toLowerCase().includes(studentFilter.toLowerCase())
    );

    return (
        <div>
            <div className="col-12 justify-between flex">
                <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                    Quản Lý Tài Khoản
                    <button>
                        <img src="/assets/svg/reload.svg" alt="reload..." />
                    </button>
                </h1>
            </div>

            {/* Account Management */}
            <Divider orientation="left">#1. Quản trị Viên</Divider>
            <Table
                dataSource={accounts.classManager}
                columns={getColumns("classManager")}
                rowKey="id"
                pagination={false}
            />

            {/* Teachers Filter */}
            <Divider orientation="left">#2. Giảng Viên</Divider>
            <Input
                placeholder="Tìm kiếm theo mã giảng viên..."
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                style={{ width: 300, marginBottom: 16 }}
            />
            <Table
                dataSource={filteredTeachers}
                columns={getColumns("teachers")}
                rowKey="id"
                pagination={false}
            />

            {/* Students Filter */}
            <Divider orientation="left">#3. Sinh Viên</Divider>
            <Input
                placeholder="Tìm kiếm theo khóa học..."
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
                style={{ width: 300, marginBottom: 16 }}
            />
            <Table
                dataSource={filteredStudents}
                columns={getColumns("students")}
                rowKey="id"
                pagination={false}
            />

            {/* Modal for displaying account details */}
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
                    width={800} // Increase modal size
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
                                <Descriptions.Item label="Học Kỳ Hiện Tại">
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

export default Testing;
