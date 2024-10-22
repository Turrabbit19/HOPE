import React, { useState } from "react";
import {
    Button,
    Card,
    Input,
    Modal,
    Popconfirm,
    Form,
    InputNumber,
    message,
    Tabs,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const DetailSubject = () => {
    // Các biến trạng thái hiện tại
    const [activeTab, setActiveTab] = useState("lecture"); // Theo dõi tab hiện tại
    const [isLectureModalVisible, setIsLectureModalVisible] = useState(false); // Hiện modal bài giảng
    const [isClassroomModalVisible, setIsClassroomModalVisible] =
        useState(false); // Hiện modal lớp học
    const [isEditing, setIsEditing] = useState(false); // Trạng thái sửa
    const [currentLecture, setCurrentLecture] = useState(null); // Dữ liệu bài giảng hiện tại (null nếu thêm mới)
    const [currentClassroom, setCurrentClassroom] = useState(null); // Dữ liệu lớp học hiện tại (null nếu thêm mới)

    // Thêm biến trạng thái cho số lượng bài giảng và lớp học khi thêm mới
    const [lectureCount, setLectureCount] = useState(1);
    const [classroomCount, setClassroomCount] = useState(1);

    // Dữ liệu giả định cho danh sách lớp học
    const [classData, setClassData] = useState([
        {
            id: "1",
            name: "WEB502.1",
            students: 25,
            status: "Đang học",
            createdDate: "2023-08-01",
        },
        {
            id: "2",
            name: "WEB502.3",
            students: 30,
            status: "Đã hoàn thành",
            createdDate: "2023-05-10",
        },
    ]);

    // Dữ liệu giả định cho danh sách bài giảng
    const [lectureData, setLectureData] = useState([
        {
            id: "1",
            name: "Buổi 1: Giới thiệu về Reactjs",
            description: "Mô tả buổi học 1",
        },
        {
            id: "2",
            name: "Buổi 2: Thành phần trong React",
            description: "Mô tả buổi học 2",
        },
    ]);

    // Xác nhận xóa lớp học
    const confirmDeleteClassroom = (id) => {
        console.log("Xóa lớp học có id:", id);
        // Thực hiện logic xóa lớp học ở đây
        setClassData((prev) => prev.filter((classroom) => classroom.id !== id));
        message.success("Đã xóa lớp học thành công!");
    };

    // Xác nhận xóa bài giảng
    const confirmDeleteLecture = (id) => {
        console.log("Xóa bài giảng có id:", id);
        // Thực hiện logic xóa bài giảng ở đây
        setLectureData((prev) => prev.filter((lecture) => lecture.id !== id));
        message.success("Đã xóa bài giảng thành công!");
    };

    // Hiển thị modal thêm mới/sửa bài giảng
    const showLectureModal = (lecture = null) => {
        setIsEditing(lecture !== null); // Nếu có dữ liệu, đang ở chế độ sửa
        setCurrentLecture(lecture); // Cập nhật bài giảng hiện tại (null nếu thêm mới)
        setIsLectureModalVisible(true); // Mở modal
        if (lecture) {
            setLectureCount(1);
        }
    };

    // Hiển thị modal thêm mới/sửa lớp học
    const showClassroomModal = (classroom = null) => {
        setIsEditing(classroom !== null); // Nếu có dữ liệu, đang ở chế độ sửa
        setCurrentClassroom(classroom); // Cập nhật lớp học hiện tại (null nếu thêm mới)
        setIsClassroomModalVisible(true); // Mở modal
        if (classroom) {
            setClassroomCount(1);
        }
    };

    // Đóng modal bài giảng
    const handleLectureModalCancel = () => {
        setIsLectureModalVisible(false);
        setCurrentLecture(null); // Reset dữ liệu
        setLectureCount(1); // Reset số lượng bài giảng khi thêm mới
    };

    // Đóng modal lớp học
    const handleClassroomModalCancel = () => {
        setIsClassroomModalVisible(false);
        setCurrentClassroom(null); // Reset dữ liệu
        setClassroomCount(1); // Reset số lượng lớp học khi thêm mới
    };

    // Hàm thêm nhiều bài giảng
    const handleAddLectures = (values) => {
        const newLectures = values.lectures.map((lecture, index) => ({
            id: Date.now() + index, // Tạo ID tạm thời
            name: lecture.name,
            description: lecture.description,
        }));
        setLectureData((prev) => [...prev, ...newLectures]);
        message.success("Thêm bài giảng thành công!");
        handleLectureModalCancel();
    };

    // Hàm sửa một bài giảng
    const handleEditLecture = (values) => {
        setLectureData((prev) =>
            prev.map((lecture) =>
                lecture.id === currentLecture.id
                    ? {
                          ...lecture,
                          name: values.name,
                          description: values.description,
                      }
                    : lecture
            )
        );
        message.success("Cập nhật bài giảng thành công!");
        handleLectureModalCancel();
    };

    // Hàm thêm nhiều lớp học
    const handleAddClassrooms = (values) => {
        const newClassrooms = values.classrooms.map((classroom, index) => ({
            id: Date.now() + index, // Tạo ID tạm thời
            name: classroom.name,
            students: classroom.students,
            status: "Đang học", // Hoặc bạn có thể yêu cầu người dùng nhập trạng thái
            createdDate: new Date().toISOString().split("T")[0], // Ngày hiện tại
        }));
        setClassData((prev) => [...prev, ...newClassrooms]);
        message.success("Thêm lớp học thành công!");
        handleClassroomModalCancel();
    };

    // Hàm sửa một lớp học
    const handleEditClassroom = (values) => {
        setClassData((prev) =>
            prev.map((classroom) =>
                classroom.id === currentClassroom.id
                    ? {
                          ...classroom,
                          name: values.name,
                          students: values.students,
                      }
                    : classroom
            )
        );
        message.success("Cập nhật lớp học thành công!");
        handleClassroomModalCancel();
    };

    // Các nút hành động sửa/xóa bài giảng
    const renderLectureActionButtons = (lecture) => (
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
                onConfirm={() => confirmDeleteLecture(lecture.id)}
                okText="Có"
                cancelText="Không"
            >
                <Button type="danger" icon={<DeleteOutlined />}>
                    Xóa
                </Button>
            </Popconfirm>
        </div>
    );

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
                onConfirm={() => confirmDeleteClassroom(classroom.id)}
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
        lectureData.map((lecture) => (
            <Card
                key={lecture.id}
                title={
                    <span className="text-[#1167B4] font-bold text-3xl">
                        {lecture.name}
                    </span>
                }
                className="mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
                headStyle={{ backgroundColor: "#f0f8ff", padding: "16px" }}
                bodyStyle={{ padding: "16px", fontSize: "16px" }}
            >
                <Card
                    title={
                        <span className="font-bold text-black">
                            Mô tả bài giảng
                        </span>
                    }
                    bordered={false}
                    className="mb-4"
                >
                    <p className="text-gray-700">{lecture.description}</p>
                </Card>
                {renderLectureActionButtons(lecture)}
            </Card>
        ));

    // Các thẻ lớp học
    const renderClassroomCards = () =>
        classData.map((classroom) => (
            <Card
                key={classroom.id}
                className="mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
                <div className="teaching__card-top flex justify-between items-center mb-4">
                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                        <img src="/assets/svg/share.svg" alt="share icon" />
                        Tên lớp:{" "}
                        <span className="text-red-300 uppercase ml-2">
                            {classroom.name}
                        </span>
                    </h2>
                </div>
                <div className="teaching__card-body">
                    <div className="mt-6 flex flex-col gap-4 pb-6">
                        <div className="flex gap-6">
                            <p className="text-[#9E9E9E]">Số học sinh:</p>
                            <p className="text-[#000]">{classroom.students}</p>
                        </div>
                        <div className="flex gap-6">
                            <p className="text-[#9E9E9E]">Trạng thái:</p>
                            <p className="text-[#000]">{classroom.status}</p>
                        </div>
                        <div className="flex gap-6">
                            <p className="text-[#9E9E9E]">Ngày tạo:</p>
                            <p className="text-[#000] font-bold">
                                {classroom.createdDate}
                            </p>
                        </div>
                    </div>
                    {renderClassroomActionButtons(classroom)}
                </div>
            </Card>
        ));

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
                            onClick={() => showLectureModal()}
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
                        {isEditing ? (
                            // Form Sửa Bài Giảng
                            <Form
                                layout="vertical"
                                initialValues={{
                                    name: currentLecture?.name || "",
                                    description:
                                        currentLecture?.description || "",
                                }}
                                onFinish={handleEditLecture}
                            >
                                <Form.Item
                                    name="name"
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
                                    name="description"
                                    label="Mô Tả"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mô tả!",
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Nhập mô tả bài giảng"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="mr-2"
                                    >
                                        Cập nhật
                                    </Button>
                                    <Button
                                        onClick={handleLectureModalCancel}
                                        type="default"
                                    >
                                        Hủy
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            // Form Thêm Nhiều Bài Giảng với Tabs và Card
                            <Form
                                layout="vertical"
                                onFinish={handleAddLectures}
                                initialValues={{
                                    lectureCount: lectureCount,
                                    lectures: [],
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
                                            message:
                                                "Số lượng phải ít nhất là 1",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        onChange={(value) => {
                                            setLectureCount(value || 1);
                                        }}
                                        className="w-full"
                                    />
                                </Form.Item>

                                {lectureCount > 0 && (
                                    <Tabs defaultActiveKey="1" type="card">
                                        {[...Array(lectureCount)].map(
                                            (_, index) => (
                                                <TabPane
                                                    tab={`Bài học ${index + 1}`}
                                                    key={index + 1}
                                                >
                                                    <Card
                                                        type="inner"
                                                        title={`Thông tin Bài học ${
                                                            index + 1
                                                        }`}
                                                        className="mb-4"
                                                    >
                                                        <Form.Item
                                                            name={[
                                                                "lectures",
                                                                index,
                                                                "name",
                                                            ]}
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
                                                                    message:
                                                                        "Vui lòng nhập mô tả!",
                                                                },
                                                            ]}
                                                        >
                                                            <Input.TextArea
                                                                rows={3}
                                                                placeholder="Nhập mô tả bài giảng"
                                                            />
                                                        </Form.Item>
                                                    </Card>
                                                </TabPane>
                                            )
                                        )}
                                    </Tabs>
                                )}

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="mr-2"
                                    >
                                        Thêm
                                    </Button>
                                    <Button
                                        onClick={handleLectureModalCancel}
                                        type="default"
                                    >
                                        Hủy
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Modal>
                </>
            ) : (
                <div>
                    <div className="flex justify-end mb-4">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showClassroomModal()}
                            className="text-lg"
                        >
                            Thêm lớp học
                        </Button>
                    </div>
                    {renderClassroomCards()}
                    {/* Modal thêm/sửa lớp học */}
                    <Modal
                        title={isEditing ? "Sửa Lớp Học" : "Thêm Lớp Học"}
                        open={isClassroomModalVisible}
                        onCancel={handleClassroomModalCancel}
                        footer={null}
                        width={800} // Tăng kích thước modal để chứa nhiều trường hơn
                    >
                        {isEditing ? (
                            // Form Sửa Lớp Học
                            <Form
                                layout="vertical"
                                initialValues={{
                                    name: currentClassroom?.name || "",
                                    students: currentClassroom?.students || 1,
                                }}
                                onFinish={handleEditClassroom}
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
                                    <Input placeholder="Nhập tên lớp" />
                                </Form.Item>

                                <Form.Item
                                    name="students"
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
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="mr-2"
                                    >
                                        Cập nhật
                                    </Button>
                                    <Button
                                        onClick={handleClassroomModalCancel}
                                        type="default"
                                    >
                                        Hủy
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            // Form Thêm Nhiều Lớp Học với Tabs và Card
                            <Form
                                layout="vertical"
                                onFinish={handleAddClassrooms}
                                initialValues={{
                                    classroomCount: classroomCount,
                                    classrooms: [],
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
                                            message:
                                                "Số lượng phải ít nhất là 1",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        onChange={(value) => {
                                            setClassroomCount(value || 1);
                                        }}
                                        className="w-full"
                                    />
                                </Form.Item>

                                {classroomCount > 0 && (
                                    <Tabs defaultActiveKey="1" type="card">
                                        {[...Array(classroomCount)].map(
                                            (_, index) => (
                                                <TabPane
                                                    tab={`Lớp học ${index + 1}`}
                                                    key={index + 1}
                                                >
                                                    <Card
                                                        type="inner"
                                                        title={`Thông tin Lớp học ${
                                                            index + 1
                                                        }`}
                                                        className="mb-4"
                                                    >
                                                        <Form.Item
                                                            name={[
                                                                "classrooms",
                                                                index,
                                                                "name",
                                                            ]}
                                                            label="Tên Lớp"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        "Vui lòng nhập tên lớp!",
                                                                },
                                                            ]}
                                                        >
                                                            <Input placeholder="Nhập tên lớp" />
                                                        </Form.Item>

                                                        <Form.Item
                                                            name={[
                                                                "classrooms",
                                                                index,
                                                                "students",
                                                            ]}
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
                                                    </Card>
                                                </TabPane>
                                            )
                                        )}
                                    </Tabs>
                                )}

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="mr-2"
                                    >
                                        Thêm
                                    </Button>
                                    <Button
                                        onClick={handleClassroomModalCancel}
                                        type="default"
                                    >
                                        Hủy
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default DetailSubject;
