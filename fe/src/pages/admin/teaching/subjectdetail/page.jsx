import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Popconfirm,
  Form,
  Input,
  InputNumber,
  message,
  Tabs,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";
import instance from "../../../../config/axios";

const { TabPane } = Tabs;

const MajorDetailSubject = () => {
  // Lấy majorId và subjectId từ URL
  const { majorId, subjectId } = useParams();

  // Trạng thái dữ liệu môn học
  const [loading, setLoading] = useState(true);

  // Các biến trạng thái khác
  const [activeTab, setActiveTab] = useState("lecture");
  const [isLectureModalVisible, setIsLectureModalVisible] = useState(false);
  const [isClassroomModalVisible, setIsClassroomModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [lectureCount, setLectureCount] = useState(1);
  const [classroomCount, setClassroomCount] = useState(1);
    const {subjectName} = useLocation().state;

  

  const [lectureData, setLectureData] = useState([]);
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    fetchLessons();
    fetchClassroom();
    setLoading(false);
  }, [majorId, subjectId]);

  const fetchLessons = async () => {
    const response = await instance.get(`admin/subject/${subjectId}/lessons`);
    setLectureData(response.data.data); 
  }

  const fetchClassroom = async () => {
    const response = await instance.get(`admin/subject/${subjectId}/classrooms`);
    setClassData(response.data.data);
  }

  const confirmDeleteClassroom = (id) => {
    setClassData((prev) => prev.filter((classroom) => classroom.id !== id));
    message.success("Đã xóa lớp học thành công!");
  };

  const confirmDeleteLecture = (id) => {
    setLectureData((prev) => prev.filter((lecture) => lecture.id !== id));
    message.success("Đã xóa bài giảng thành công!");
  };

  // Hiển thị modal thêm/sửa bài giảng
  const showLectureModal = (lecture = null) => {
    setIsEditing(lecture !== null);
    setCurrentLecture(lecture);
    setIsLectureModalVisible(true);
    if (lecture) {
      setLectureCount(1);
    }
  };

  // Hiển thị modal thêm/sửa lớp học
  const showClassroomModal = (classroom = null) => {
    setIsEditing(classroom !== null);
    setCurrentClassroom(classroom);
    setIsClassroomModalVisible(true);
    if (classroom) {
      setClassroomCount(1);
    }
  };

  // Đóng modal bài giảng
  const handleLectureModalCancel = () => {
    setIsLectureModalVisible(false);
    setCurrentLecture(null);
    setLectureCount(1);
  };

  // Đóng modal lớp học
  const handleClassroomModalCancel = () => {
    setIsClassroomModalVisible(false);
    setCurrentClassroom(null);
    setClassroomCount(1);
  };

  // Hàm thêm nhiều bài giảng
  const handleAddLectures = (values) => {
    const newLectures = values.lectures.map((lecture, index) => ({
      id: Date.now() + index,
      name: lecture.name,
      description: lecture.description,
    }));
    console.log(values);
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
      id: Date.now() + index,
      name: classroom.name,
      students: classroom.students,
      status: "Đang học",
      createdDate: new Date().toISOString().split("T")[0],
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

  // Nút hành động cho bài giảng
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

  // Nút hành động cho lớp học
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

  // Render các thẻ bài giảng
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
          title={<span className="font-bold text-black">Mô tả bài giảng</span>}
          bordered={false}
          className="mb-4"
        >
          <p className="text-gray-700">{lecture.description}</p>
        </Card>
        {renderLectureActionButtons(lecture)}
      </Card>
    ));

  // Render các thẻ lớp học
  const renderClassroomCards = () =>
    classData.map((classroom) => (
      <Card
        key={classroom.id}
        className="mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div className="teaching__card-top flex justify-between items-center mb-4">
          <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
            Tên lớp:{" "}
            <span className="text-red-300 uppercase ml-2">
              {classroom.code}
            </span>
          </h2>
        </div>
        <div className="teaching__card-body">
          <div className="mt-6 flex flex-col gap-4 pb-6">
            <div className="flex gap-6">
              <p className="text-[#9E9E9E]">Số học sinh:</p>
              <p className="text-[#000]">{classroom.max_students}</p>
            </div>
            <div className="flex gap-6">
              <p className="text-[#9E9E9E]">Trạng thái:</p>
              <p className="text-[#000]">{classroom.status}</p>
            </div>
          </div>
          {renderClassroomActionButtons(classroom)}
        </div>
      </Card>
    ));

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  }


  return (
    <div className="p-6">
      <div className="col-12 justify-between flex mb-4">
        <h1 className="text-[#7017E2] text-[24px] pb-8 font-semibold">
          Chi tiết môn học: {subjectName}
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
            width={800}
          >
            {isEditing ? (
              // Form Sửa Bài Giảng
              <Form
                layout="vertical"
                initialValues={{
                  name: currentLecture?.name || "",
                  description: currentLecture?.description || "",
                }}
                onFinish={handleEditLecture}
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
                  <Input.TextArea rows={4} placeholder="Nhập mô tả bài giảng" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="mr-2">
                    Cập nhật
                  </Button>
                  <Button onClick={handleLectureModalCancel} type="default">
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              // Form Thêm Nhiều Bài Giảng
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
                      message: "Vui lòng nhập số lượng bài học!",
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
                    className="w-full"
                  />
                </Form.Item>

                {lectureCount > 0 && (
                  <Tabs defaultActiveKey="1" type="card">
                    {[...Array(lectureCount)].map((_, index) => (
                      <TabPane tab={`Bài học ${index + 1}`} key={index + 1}>
                        <Card
                          type="inner"
                          title={`Thông tin Bài học ${index + 1}`}
                          className="mb-4"
                        >
                          <Form.Item
                            name={["lectures", index, "name"]}
                            label="Tên Bài Giảng"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tên bài giảng!",
                              },
                            ]}
                          >
                            <Input placeholder="Nhập tên bài giảng" />
                          </Form.Item>
                          <Form.Item
                            name={["lectures", index, "description"]}
                            label="Mô Tả"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập mô tả!",
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
                    ))}
                  </Tabs>
                )}

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="mr-2">
                    Thêm
                  </Button>
                  <Button onClick={handleLectureModalCancel} type="default">
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

          <Modal
            title={isEditing ? "Sửa Lớp Học" : "Thêm Lớp Học"}
            open={isClassroomModalVisible}
            onCancel={handleClassroomModalCancel}
            footer={null}
            width={800}
          >
            {isEditing ? (
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
                      message: "Vui lòng nhập số học sinh!",
                    },
                    {
                      type: "number",
                      min: 1,
                      max: 40,
                      message: "Số học sinh phải từ 1 đến 40",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={40}
                    placeholder="Nhập số học sinh (tối đa 40)"
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="mr-2">
                    Cập nhật
                  </Button>
                  <Button onClick={handleClassroomModalCancel} type="default">
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              // Form Thêm Nhiều Lớp Học
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
                      message: "Vui lòng nhập số lượng lớp học!",
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
                    className="w-full"
                  />
                </Form.Item>

                {classroomCount > 0 && (
                  <Tabs defaultActiveKey="1" type="card">
                    {[...Array(classroomCount)].map((_, index) => (
                      <TabPane tab={`Lớp học ${index + 1}`} key={index + 1}>
                        <Card
                          type="inner"
                          title={`Thông tin Lớp học ${index + 1}`}
                          className="mb-4"
                        >
                          <Form.Item
                            name={["classrooms", index, "name"]}
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
                            name={["classrooms", index, "students"]}
                            label="Số Học Sinh"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số học sinh!",
                              },
                              {
                                type: "number",
                                min: 1,
                                max: 40,
                                message: "Số học sinh phải từ 1 đến 40",
                              },
                            ]}
                          >
                            <InputNumber
                              min={1}
                              max={40}
                              placeholder="Nhập số học sinh (tối đa 40)"
                              className="w-full"
                            />
                          </Form.Item>
                        </Card>
                      </TabPane>
                    ))}
                  </Tabs>
                )}

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="mr-2">
                    Thêm
                  </Button>
                  <Button onClick={handleClassroomModalCancel} type="default">
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

export default MajorDetailSubject;
