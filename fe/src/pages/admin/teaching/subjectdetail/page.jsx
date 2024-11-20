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
  notification,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import instance from "../../../../config/axios";
import { useForm } from "antd/es/form/Form";

const { TabPane } = Tabs;

const MajorDetailSubject = () => {
  // Lấy majorId và subjectId từ URL
  const { subId, subjectId } = useParams();
  const { credit } = useLocation().state || {};
  console.log(credit);
  // Trạng thái dữ liệu môn học
  const [loading, setLoading] = useState(true);
  const [form] = useForm();
  // Các biến trạng thái khác
  const [activeTab, setActiveTab] = useState("lecture");
  const [isLectureModalVisible, setIsLectureModalVisible] = useState(false);
  const [isClassroomModalVisible, setIsClassroomModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [lectureCount, setLectureCount] = useState(1);
  const [classroomCount, setClassroomCount] = useState(1);
  const { subjectName } = useLocation().state;
  const [lectureId, setlectureId] = useState();
  const [classId, setClassId] = useState();

  const [lectureData, setLectureData] = useState([]);
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    fetchLessons();
    fetchClassroom();
    setLoading(false);
  }, [subId, subjectId]);

  const fetchLessons = async () => {
    const response = await instance.get(`admin/subject/${subjectId}/lessons`);
    setLectureData(response.data.data);
    // console.log(response.data.data);
  };

  const fetchClassroom = async () => {
    const response = await instance.get(
      `admin/subject/${subjectId}/classrooms`
    );
    setClassData(response.data.data);
  };

  const confirmDeleteClassroom = async (id) => {
    try {
      await instance.delete(`admin/classrooms/${id}`);

      notification.success({
        message: "Xóa lớp học thành công",
      });
      setClassData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting classrooms:", error);

      notification.error({
        message: "Xóa lớp học thất bại",
        description:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  const confirmDeleteLecture = async (id) => {
    try {
      await instance.delete(`admin/lessons/${id}`);

      notification.success({
        message: "Xóa bài giảng thành công",
      });
      setLectureData((prev) => prev.filter((lecture) => lecture.id !== id));
    } catch (error) {
      console.error("Error deleting lecture:", error);

      notification.error({
        message: "Xóa bài giảng thất bại",
        description:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  const showLectureModal = (lecture = null) => {
    if (lecture) {
      setlectureId(lecture.id);
    }
    setLectureCount(credit * 6);
    setIsEditing(lecture !== null);
    setCurrentLecture(lecture);
    setIsLectureModalVisible(true);
    if (lecture) {
      setLectureCount(1);
    }
  };

  const showClassroomModal = (classroom = null) => {
    setIsEditing(classroom !== null);
    setCurrentClassroom(classroom);
    setIsClassroomModalVisible(true);
    if (classroom) {
      setClassroomCount(1);
      setClassId(classroom.id);
    }
  };

  const handleLectureModalCancel = () => {
    setIsLectureModalVisible(false);
    setCurrentLecture(null);
    setLectureCount(1);
    form.resetFields();
  };

  const handleClassroomModalCancel = () => {
    setIsClassroomModalVisible(false);
    setCurrentClassroom(null);
    setClassroomCount(1);
  };

  const handleAddLectures = async (values) => {
    debugger;
    console.log(values.lectures.length);
    if (values.lectures.length != lectureCount) {
      message.error("Vui lòng nhập đầy đủ các bài học");
      return;
    }
    const newLectures = values.lectures.map((lecture, index) => ({
      name: lecture.name,
      description: lecture.description,
    }));
    console.log(newLectures);
    try {
      const response = await instance.post(
        `admin/subject/${subjectId}/lessons/add`,
        newLectures
      );
      setLectureData((prev) => [...prev, ...response.data.data]);
      message.success("Thêm bài giảng thành công!");
      handleLectureModalCancel();
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm bài giảng!");
    }
  };

  const handleEditLecture = async (values) => {
    console.log(values);
    try {
      await instance.put(`admin/lessons/${lectureId}`, values);
      notification.success({
        message: "Cập nhật bài giảng thành công",
      });
      setLectureData((prev) =>
        prev.map((lecture) =>
          lecture.id === lectureId ? { ...lecture, ...values } : lecture
        )
      );
      handleLectureModalCancel();
    } catch (error) {
      console.error("Error deleting lecture:", error);

      notification.error({
        message: "Cập nhật giảng thất bại",
        description:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  const handleAddClassrooms = async (values) => {
    const newClassrooms = values.classrooms.map((item, index) => ({
      code: item.name,
      max_students: item.students,
    }));
    try {
      const response = await instance.post(
        `admin/subject/${subjectId}/classrooms/add`,
        newClassrooms
      );
      console.log(response.data.data);
      notification.success({
        message: "Thêm lớp học thành công",
      });
      setClassData((prev) => [...prev, response.data.data]);
      handleLectureModalCancel();
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm lớp học!");
    }
    handleClassroomModalCancel();
  };

  // Hàm sửa một lớp học
  const handleEditClassroom = async (values) => {
    console.log(values);
    try {
      // await instance.put(`admin/classrooms/${classId}`, values);
      notification.success({
        message: "Cập nhật lớp học thành công",
      });
      setClassData((prev) =>
        prev.map((item) =>
          item.id === classId ? { ...item, ...values } : item
        )
      );
      handleClassroomModalCancel();
    } catch (error) {
      console.error("Error deleting classrooms:", error);

      notification.error({
        message: "Cập nhật lớp học thất bại",
        description:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

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
    </div>
  );

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
    lectureData.length > 0 ? (
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
              <span className="font-bold text-black">Mô tả bài giảng</span>
            }
            bordered={false}
            className="mb-4"
          >
            <p className="text-gray-700">{lecture.description}</p>
          </Card>
          {renderLectureActionButtons(lecture)}
        </Card>
      ))
    ) : (
      <div className="col-12 text-center">
        <p className="text-red-500 font-bold text-lg">
          Không tìm thấy bài giảng
        </p>
      </div>
    );

  // Render các thẻ lớp học
  const renderClassroomCards = () =>
    classData.length > 0 ? (
      classData.map((item) => (
        <Card
          key={item.id}
          className="mb-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="teaching__card-top flex justify-between items-center mb-4">
            <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
              Tên lớp:{" "}
              <span className="text-red-300 uppercase ml-2">
                {item.code}
              </span>
            </h2>
          </div>
          <div className="teaching__card-body">
            <div className="mt-6 flex flex-col gap-4 pb-6">
              <div className="flex gap-6">
                <p className="text-[#9E9E9E]">Số học sinh:</p>
                <p className="text-[#000]">{item.max_students}</p>
              </div>
              <div className="flex gap-6">
                <p className="text-[#9E9E9E]">Trạng thái:</p>
                <p className="text-[#000]">{item.status}</p>
              </div>
            </div>
            {renderClassroomActionButtons(item)}
          </div>
        </Card>
      ))
    ) : (
      <div className="col-12 text-center">
        <p className="text-red-500 font-bold text-lg">
          Không tìm thấy lớp học
        </p>
      </div>
    );

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
            {lectureData.length !== credit * 6 ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showLectureModal()}
                className="text-lg"
              >
                Thêm bài giảng
              </Button>
            ) : (
              ""
            )}
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
                form={form}
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
                // initialValues={{
                //   lectureCount: lectureCount,
                //   lectures: [],
                // }}
                initialValues={{
                  lectureCount: lectureCount,
                  lectures: Array(lectureCount).fill({
                    name: "",
                    description: "",
                  }),
                }}
              >
                {/* Trường nhập số lượng bài học */}
                <Form.Item
                  name="lectureCount"
                  label="Tổng số bài học của môn tính theo tín ( số tín x 6 )"
                  initialValue={lectureCount}
                >
                  <InputNumber
                    min={1}
                    disabled
                    onChange={(value) => {
                      setLectureCount(value || 1);
                    }}
                    className="w-full"
                  />
                </Form.Item>

                {lectureCount > 0 && (
                  <Tabs defaultActiveKey="1" type="card">
                    {[...Array(lectureCount)].map((_, index) => (
                      <TabPane tab={`Bài học ${index + 1}`} key={`lecture-${index}`}>
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
