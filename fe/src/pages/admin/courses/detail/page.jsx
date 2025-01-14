import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Tabs, Table, Space, Button, Avatar, Input, Spin } from "antd";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import instance from "../../../../config/axios";

const { TabPane } = Tabs;

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();

  const courseData = location.state?.course;
  const [courseName, setCourseName] = useState(""); // Khai báo state cho tên khóa học

  useEffect(() => {
    // Kiểm tra thông tin `courseData` trước khi sử dụng.
    if (courseId && courseData) {
      const newCourseData = {
        id: courseId,
        name: `Khóa ${courseData.name}`, // Sử dụng `courseData.name` thay vì `course.name`
      };

      setCourseName(courseData.name); // Cập nhật tên khóa học vào state
      setCourse(newCourseData); // Cập nhật thông tin khóa học
      fetchSemesters();
      fetchDepartments();
    } else {
      setCourse({ name: "Khóa không xác định" });
    }
  }, [courseId, courseData]); // Đảm bảo biến `courseData` đã được truyền vào đúng.

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const semesters = await instance.get(
        `admin/course/${courseId}/semesters`
      );
      setSemesters(semesters.data.semesters);
    } catch (error) {
      console.error("Lỗi khi lấy kỳ học:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const majors = await instance.get(`admin/course/${courseId}/majors`);
      setDepartments(majors.data.majors);
    } catch (error) {
      console.error("Lỗi khi lấy ngành học:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByDepartment = async (departmentId, page = 1) => {
    setLoading(true);
    try {
      const response = await instance.get(
        `admin/${courseId}/${departmentId}/students`,
        {
          params: {
            page,
            limit: pageSize,
          },
        }
      );
      const { data, total } = response.data;
      setTotalStudents(total);
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
      alert("Có lỗi khi tải dữ liệu sinh viên.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/list-course");
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    fetchStudentsByDepartment(department.id, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchStudentsByDepartment(selectedDepartment.id, page);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Lọc sinh viên từ danh sách gốc
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(value) ||
        student.studentCode.toLowerCase().includes(value)
    );
    setFilteredStudents(filtered);

    // Điều chỉnh phân trang lại nếu cần
    setCurrentPage(1); // Reset trang lại nếu tìm kiếm lại từ đầu
  };

  const semesterColumns = [
    { title: "Tên Kỳ Học", dataIndex: "name", key: "courseName" },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "start_date",
      key: "startDate",
      render: (text) => {
        const date = new Date(text);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "end_date",
      key: "endDate",
      render: (text) => {
        const date = new Date(text);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
  ];

  const departmentColumns = [
    {
      title: "Tên Ngành Học",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Button type="link" onClick={() => handleDepartmentClick(record)}>
          {text}
        </Button>
      ),
    },
  ];

  const studentColumns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Avatar src={avatar || "https://via.placeholder.com/150"} />
      ),
    },
    {
      title: "Mã Sinh Viên",
      dataIndex: "student_code",
      key: "student_code",
    },
    {
      title: "Tên Sinh Viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tên Khóa",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Kỳ Hiện Tại",
      dataIndex: "current_semester",
      key: "current_semester",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  const renderSemesters = () => (
    <Table dataSource={semesters} columns={semesterColumns} rowKey="id" />
  );

  const renderDepartments = () => (
    <Table dataSource={departments} columns={departmentColumns} rowKey="id" />
  );

  return (
    <div className="mx-auto px-4 py-8 max-w-screen">
      {/* Phần quay lại */}
      <Space align="center" style={{ cursor: "pointer" }} onClick={handleBack}>
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
          <ArrowLeftOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
        </div>
      </Space>

      {/* Tên khóa học */}
      {course && (
        <>
          <h1
            className="text-[#7017E2] text-center"
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {courseName || "Khóa không xác định"}
          </h1>

          {/* Các tab */}
          <Tabs
            defaultActiveKey="1"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            <TabPane tab="Kỳ Học" key="1">
              {loading ? <Spin size="large" /> : renderSemesters()}
            </TabPane>
            <TabPane tab="Ngành Học" key="2">
              {loading ? <Spin size="large" /> : renderDepartments()}
            </TabPane>
          </Tabs>
        </>
      )}

      {/* Danh sách sinh viên */}
      {selectedDepartment && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }} className="mb-6">
            Danh Sách Sinh Viên Ngành:{" "}
            <span className="text-[#7017E2]">{selectedDepartment.name}</span>
          </h2>

          {/* Tìm kiếm sinh viên */}
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã sinh viên"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearch}
            style={{
              marginBottom: "20px",
              width: "100%",
              borderRadius: "8px",
              paddingLeft: "20px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Table danh sách sinh viên */}
          <Table
            loading={loading}
            dataSource={filteredStudents}
            columns={studentColumns}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize,
              total: totalStudents,
              onChange: handlePageChange,
              showSizeChanger: false,
            }}
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
