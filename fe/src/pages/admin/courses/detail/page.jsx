import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Table, Space, Button, Avatar, Input } from "antd";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (courseId) {
      const courseData = {
        id: courseId,
        name: `Khóa ${courseId}`,
      };
      setCourse(courseData);
      fetchSemesters();
      fetchDepartments();
    } else {
      setCourse({ name: "Khóa không xác định" });
    }
  }, [courseId]);

  const fetchSemesters = async () => {
    const semesters = await instance.get(`admin/course/${courseId}/semesters`);
    setSemesters(semesters.data.semesters);
  };

  const fetchDepartments = async () => {
    const majors = await instance.get(`admin/course/${courseId}/majors`);
    setDepartments(majors.data.majors);
  };

  const fetchStudentsByDepartment = async (departmentId, page = 1) => {
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
      console.log(response.data);
      const { data, total } = response.data;
      console.log(data);
      setTotalStudents(total);
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
    }
  };

  const handleBack = () => {
    navigate("/admin/list-course");
  };

  const handleDepartmentClick = (department) => {
    console.log(department);
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

    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(value) ||
        student.studentCode.toLowerCase().includes(value)
    );
    setFilteredStudents(filtered);
  };

  const semesterColumns = [
    { title: "Tên Kỳ Học", dataIndex: "name", key: "name" },
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
    <div className="mx-auto px-4 py-8">
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
      {course && (
        <>
          <h1
            className="text-[#7017E2] text-center"
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            Quản Lý Khóa Học: {course.name}
          </h1>
          <Tabs defaultActiveKey="1" style={{ marginTop: "20px" }}>
            <TabPane tab="Kỳ Học" key="1">
              {renderSemesters()}
            </TabPane>
            <TabPane tab="Ngành Học" key="2">
              {renderDepartments()}
            </TabPane>
          </Tabs>
        </>
      )}

      {selectedDepartment && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }} className="mb-6">
            Danh Sách Sinh Viên Ngành :{" "}
            <span className="text-[#7017E2]">{selectedDepartment.name}</span>
          </h2>
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã sinh viên"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: "20px", width: "100%" }}
          />
          <Table
            dataSource={filteredStudents}
            columns={studentColumns}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize,
              total: totalStudents,
              onChange: handlePageChange,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
