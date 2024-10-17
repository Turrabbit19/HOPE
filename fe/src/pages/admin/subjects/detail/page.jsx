import React, { useState } from "react";
import {
    Button,
    Card,
    Input,
    Modal,
    Popconfirm,
    Form,
    InputNumber,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const DetailSubject = () => {
    // Các biến trạng thái hiện tại
    const [activeTab, setActiveTab] = useState("lecture"); // Theo dõi tab hiện tại
    const [isLectureModalVisible, setIsLectureModalVisible] = useState(false); // Hiện modal bài giảng
    const [isClassroomModalVisible, setIsClassroomModalVisible] =
        useState(false); // Hiện modal lớp học
    const [isEditing, setIsEditing] = useState(false); // Trạng thái sửa
    const [currentLecture, setCurrentLecture] = useState({}); // Dữ liệu bài giảng hiện tại
    const [currentClassroom, setCurrentClassroom] = useState({}); // Dữ liệu lớp học hiện tại

    // Thêm biến trạng thái cho số lượng bài giảng và lớp học
    const [lectureCount, setLectureCount] = useState(1);
    const [classroomCount, setClassroomCount] = useState(1);

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

    // Đóng modal bài giảng
    const handleLectureModalCancel = () => {
        setIsLectureModalVisible(false);
        setCurrentLecture({}); // Reset dữ liệu
        setLectureCount(1); // Reset số lượng bài giảng
    };

    // Đóng modal lớp học
    const handleClassroomModalCancel = () => {
        setIsClassroomModalVisible(false);
        setCurrentClassroom({}); // Reset dữ liệu
        setClassroomCount(1); // Reset số lượng lớp học
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

    // Các nút hành động sửa/xóa lớp học
    const renderClassroomActionButtons = (classroom) => (
        <div className="flex justify-end space-x-4">
            <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => showClassroomModal(classroom)}
                className="hover:bg-[#1167B4] hover:text-white transition"
            >
                Sửa
            </Button>
            <Popconfirm
                title="Bạn có chắc chắn muốn xóa lớp học này?"
                onConfirm={() => confirmDelete(classroom.id)}
                okText="Có"
                cancelText="Không"
            >
                <Button type="danger" icon={<DeleteOutlined />}>
                    Xóa
                </Button>
            </Popconfirm>
        </div>
    );

    return (
        <div className="p-6">
            <div className="col-12 justify-between flex mb-4">
                <h1 className="text-[#7017E2] text-[24px] pb-8 font-semibold">
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
                        width={800} // Tăng kích thước modal để chứa nhiều trường hơn
                    >
                        <Form
                            layout="vertical"
                            initialValues={currentLecture}
                            onFinish={(values) => {
                                console.log("Form submitted:", values);
                                // Thực hiện logic gửi dữ liệu ở đây
                                handleLectureModalCancel();
                            }}
                        >
                            {/* Trường nhập số lượng bài học */}
                            <Form.Item
                                name="lectureCount"
                                label="Số lượng bài học"
                                initialValue={lectureCount}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập số lượng bài học!",
                                    },
                                    {
                                        type: "number",
                                        min: 1,
                                        message: "Số lượng phải ít nhất là 1",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    onChange={(value) => {
                                        setLectureCount(value || 1);
                                    }}
                                />
                            </Form.Item>

                            {/* Tạo các trường nhập tên và mô tả cho từng bài giảng */}
                            {[...Array(lectureCount)].map((_, index) => (
                                <div
                                    className="border border-gray-500 p-6 mb-6 rounded-lg shadow-lg bg-white"
                                    key={index}
                                >
                                    <h3 className="mb-2 text-2xl font-bold">
                                        Bài học {index + 1}
                                    </h3>
                                    <Form.Item
                                        name={["lectures", index, "name"]}
                                        label="Tên Bài Giảng"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập tên bài giảng!",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Nhập tên bài giảng" />
                                    </Form.Item>
                                    <Form.Item
                                        name={[
                                            "lectures",
                                            index,
                                            "description",
                                        ]}
                                        label="Mô Tả"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập mô tả!",
                                            },
                                        ]}
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="Nhập mô tả bài giảng"
                                        />
                                    </Form.Item>
                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="mr-2"
                                >
                                    {isEditing ? "Cập nhật" : "Thêm"}
                                </Button>
                                <Button
                                    onClick={handleLectureModalCancel}
                                    type="default"
                                >
                                    Hủy
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
                            onClick={() => showClassroomModal({})}
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
                                                    <p className="text-[#000] font-bold">
                                                        {classroom.createdDate}
                                                    </p>
                                                </div>
                                            </div>

                                            {renderClassroomActionButtons(
                                                classroom
                                            )}
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
                        width={800} // Tăng kích thước modal để chứa nhiều trường hơn
                    >
                        <Form
                            layout="vertical"
                            initialValues={currentClassroom}
                            onFinish={(values) => {
                                console.log("Form submitted:", values);
                                // Thực hiện logic gửi dữ liệu ở đây
                                handleClassroomModalCancel();
                            }}
                        >
                            {/* Trường nhập số lượng lớp học */}
                            <Form.Item
                                name="classroomCount"
                                label="Số lượng lớp học"
                                initialValue={classroomCount}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập số lượng lớp học!",
                                    },
                                    {
                                        type: "number",
                                        min: 1,
                                        message: "Số lượng phải ít nhất là 1",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    onChange={(value) => {
                                        setClassroomCount(value || 1);
                                    }}
                                />
                            </Form.Item>

                            {/* Tạo các trường nhập tên và số học sinh cho từng lớp học */}
                            {[...Array(classroomCount)].map((_, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-500 p-6 mb-6 rounded-lg shadow-lg bg-white"
                                >
                                    <h3 className="mb-4 text-2xl font-bold text-gray-800">
                                        Lớp học {index + 1}
                                    </h3>
                                    <Form.Item
                                        name={["classrooms", index, "name"]}
                                        label="Tên Lớp"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập tên lớp!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Nhập tên lớp"
                                            className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name={["classrooms", index, "students"]}
                                        label="Số Học Sinh"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng nhập số học sinh!",
                                            },
                                            {
                                                type: "number",
                                                min: 1,
                                                max: 40,
                                                message:
                                                    "Số học sinh phải từ 1 đến 40",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            min={1}
                                            max={40}
                                            placeholder="Nhập số học sinh (tối đa 40)"
                                            className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </Form.Item>
                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="mr-2"
                                >
                                    {isEditing ? "Cập nhật" : "Thêm"}
                                </Button>
                                <Button
                                    onClick={handleClassroomModalCancel}
                                    type="default"
                                >
                                    Hủy
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default DetailSubject;
