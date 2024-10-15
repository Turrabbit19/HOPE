import React, { useState } from "react";
import { Button, Card, Input, Modal, Popconfirm, Form } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const Testing = () => {
    const [activeTab, setActiveTab] = useState("lecture"); // Theo dõi tab hiện tại
    const [isLectureModalVisible, setIsLectureModalVisible] = useState(false); // Hiện modal bài giảng
    const [isClassroomModalVisible, setIsClassroomModalVisible] =
        useState(false); // Hiện modal lớp học
    const [isEditing, setIsEditing] = useState(false); // Trạng thái sửa
    const [currentLecture, setCurrentLecture] = useState({}); // Dữ liệu bài giảng hiện tại
    const [currentClassroom, setCurrentClassroom] = useState({}); // Dữ liệu lớp học hiện tại

    // Dữ liệu giả định cho danh sách lớp học
    const classData = [
        {
            id: "1",
            name: "WEB502.1",
            nameSubject: "Reactjs",
            students: 25,
            status: "Đang học",
            createdDate: "2023-08-01",
        },
        {
            id: "2",
            name: "WEB502.3",
            nameSubject: "Reactjs",
            students: 30,
            status: "Đã hoàn thành",
            createdDate: "2023-05-10",
        },
    ];

    // Xác nhận xóa lớp học
    const confirmDelete = (id) => {
        console.log("Xóa lớp học có id:", id);
        // Thực hiện logic xóa lớp học ở đây
    };

    // Hiển thị modal thêm mới/sửa bài giảng
    const showLectureModal = (lecture = {}) => {
        setIsEditing(!!lecture.id); // Nếu có id, đang ở chế độ sửa
        setCurrentLecture(lecture); // Cập nhật bài giảng hiện tại
        setIsLectureModalVisible(true); // Mở modal
    };

    // Hiển thị modal thêm mới/sửa lớp học
    const showClassroomModal = (classroom = {}) => {
        setIsEditing(!!classroom.id); // Nếu có id, đang ở chế độ sửa
        setCurrentClassroom(classroom); // Cập nhật lớp học hiện tại
        setIsClassroomModalVisible(true); // Mở modal
    };

    // Đóng modal
    const handleLectureModalCancel = () => {
        setIsLectureModalVisible(false);
        setCurrentLecture({}); // Reset dữ liệu
    };

    const handleClassroomModalCancel = () => {
        setIsClassroomModalVisible(false);
        setCurrentClassroom({}); // Reset dữ liệu
    };

    // Các nút hành động sửa/xóa bài giảng
    const renderActionButtons = (lecture) => (
        <div className="flex justify-end space-x-4">
            <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => showLectureModal(lecture)}
                className="hover:bg-[#1167B4] hover:text-white transition"
            >
                Sửa
            </Button>
            <Popconfirm
                title="Bạn có chắc chắn muốn xóa bài giảng này?"
                onConfirm={() => confirmDelete(lecture.id)}
                okText="Có"
                cancelText="Không"
            >
                <Button type="danger" icon={<DeleteOutlined />}>
                    Xóa
                </Button>
            </Popconfirm>
        </div>
    );

    // Các thẻ bài giảng
    const renderLectureCards = () =>
        [1, 2, 3, 4].map((i) => (
            <Card
                key={i}
                title={
                    <span className="text-[#1167B4] font-bold text-3xl">
                        Buổi {i}: Giới thiệu về Reactjs
                    </span>
                }
                className="mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
                headStyle={{ backgroundColor: "#f0f8ff", padding: "16px" }}
                bodyStyle={{ padding: "16px", fontSize: "16px" }}
            >
                <Card
                    title={
                        <span className="font-bold text-black">
                            Mô tả buổi học
                        </span>
                    }
                    bordered={false}
                    className="mb-4"
                >
                    <p className="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </Card>
                {renderActionButtons({ id: i })}
            </Card>
        ));

    return (
        <div className="p-6">
            <div className="col-12 justify-between flex mb-4">
                <h1 className="text-[#7017E2] text-[24px] font-semibold">
                    Chi tiết môn học: Reactjs
                </h1>
            </div>

            <div className="col-12 mb-4">
                <Button
                    type={activeTab === "lecture" ? "primary" : "default"}
                    onClick={() => setActiveTab("lecture")}
                    className="text-lg"
                >
                    Bài giảng và tài nguyên
                </Button>
                <Button
                    type={activeTab === "classroom" ? "primary" : "default"}
                    onClick={() => setActiveTab("classroom")}
                    className="ml-4 text-lg"
                >
                    Lớp học
                </Button>
            </div>

            {activeTab === "lecture" ? (
                <>
                    <div className="flex justify-end mb-4">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showLectureModal({})}
                            className="text-lg"
                        >
                            Thêm bài giảng
                        </Button>
                    </div>
                    {renderLectureCards()}

                    <Modal
                        title={isEditing ? "Sửa Bài Giảng" : "Thêm Bài Giảng"}
                        open={isLectureModalVisible}
                        onCancel={handleLectureModalCancel}
                        footer={null}
                    >
                        <Form
                            initialValues={currentLecture}
                            onFinish={() => {
                                console.log("Form submitted");
                                handleLectureModalCancel();
                            }}
                        >
                            <Form.Item
                                name="name"
                                label="Tên Bài Giảng"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên bài giảng!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Mô Tả"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mô tả!",
                                    },
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    {isEditing ? "Cập nhật" : "Thêm"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            ) : (
                <div>
                    <div className="flex justify-end mb-4">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showClassroomModal({})} // Mở modal thêm mới
                            className="text-lg"
                        >
                            Thêm lớp học
                        </Button>
                    </div>
                    <div className="row row-cols-2 gx-3">
                        {classData.length > 0 ? (
                            classData.map((classroom) => (
                                <div className="col" key={classroom.id}>
                                    <div className="teaching__card border p-4 shadow-md rounded-lg">
                                        <div className="teaching__card-top flex justify-between items-center mb-4">
                                            <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt="share icon"
                                                />
                                                Tên lớp:{" "}
                                                <span className="text-red-300 uppercase ml-2">
                                                    {classroom.name}
                                                </span>
                                            </h2>
                                        </div>
                                        <div className="teaching__card-body">
                                            <div className="mt-6 flex flex-col gap-4 pb-6">
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Tên môn:
                                                    </p>
                                                    <p className="text-[#000]">
                                                        {classroom.nameSubject}
                                                    </p>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Học sinh:
                                                    </p>
                                                    <p className="text-[#000]">
                                                        {classroom.students}
                                                    </p>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Trạng thái:
                                                    </p>
                                                    <p className="text-[#000]">
                                                        {classroom.status}
                                                    </p>
                                                </div>
                                                <div className="flex gap-6">
                                                    <p className="text-[#9E9E9E]">
                                                        Ngày tạo:
                                                    </p>
                                                    <p className="text-[#000]">
                                                        {classroom.createdDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    className="text-[#1167B4] font-bold border border-[#1167B4] px-4 py-2 rounded hover:bg-[#1167B4] hover:text-white transition"
                                                    onClick={() =>
                                                        showClassroomModal(
                                                            classroom
                                                        )
                                                    } // Mở modal sửa lớp học
                                                >
                                                    Sửa
                                                </button>
                                                <Popconfirm
                                                    title="Bạn có chắc chắn muốn xóa lớp học này?"
                                                    onConfirm={() =>
                                                        confirmDelete(
                                                            classroom.id
                                                        )
                                                    }
                                                    okText="Có"
                                                    cancelText="Không"
                                                >
                                                    <button className="text-[#FF5252] font-bold border border-[#FF5252] px-4 py-2 rounded hover:bg-[#FF5252] hover:text-white transition">
                                                        Xóa
                                                    </button>
                                                </Popconfirm>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có lớp học nào</p>
                        )}
                    </div>
                    {/* Modal thêm/sửa lớp học */}
                    <Modal
                        title={isEditing ? "Sửa Lớp Học" : "Thêm Lớp Học"}
                        open={isClassroomModalVisible}
                        onCancel={handleClassroomModalCancel}
                        footer={null}
                    >
                        <Form
                            initialValues={currentClassroom}
                            onFinish={() => {
                                console.log("Form submitted"); // Thay thế bằng logic xử lý
                                handleClassroomModalCancel();
                            }}
                        >
                            <Form.Item
                                name="name"
                                label="Tên Lớp"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên lớp!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="students"
                                label="Số Học Sinh"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng không để trống",
                                    },
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    {isEditing ? "Cập nhật" : "Thêm"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default Testing;
