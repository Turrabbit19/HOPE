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

    const fetchStudentsByDepartment = (departmentId, page = 1) => {
        const total = 5000;
        const data = Array.from({ length: pageSize }, (_, index) => ({
            id: (page - 1) * pageSize + index + 1,
            studentCode: `SV${departmentId}-${
                (page - 1) * pageSize + index + 1
            }`, // Student code
            name: `Sinh Viên ${departmentId}-${
                (page - 1) * pageSize + index + 1
            }`,
            avatar: "https://via.placeholder.com/150",
            birthYear: 2000 + (index % 3),
            gender: index % 2 === 0 ? "Nam" : "Nữ",
            status:
                index % 3 === 0
                    ? "Đang học"
                    : index % 3 === 1
                    ? "Đang bảo lưu"
                    : "Thôi học",
        }));
        setTotalStudents(total);
        setStudents(data);
        setFilteredStudents(data);
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
        { title: "Ngày Bắt Đầu", dataIndex: "start_date", key: "startDate" },
        { title: "Ngày Kết Thúc", dataIndex: "end_date", key: "endDate" },
    ];

    const departmentColumns = [
        {
            title: "Tên Ngành Học",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => handleDepartmentClick(record)}
                >
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
            render: (avatar) => <Avatar src={avatar} />,
        },
        {
            title: "Mã Sinh Viên",
            dataIndex: "studentCode",
            key: "studentCode",
        },
        {
            title: "Tên Sinh Viên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Năm Sinh",
            dataIndex: "birthYear",
            key: "birthYear",
        },
        {
            title: "Giới Tính",
            dataIndex: "gender",
            key: "gender",
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
        <Table
            dataSource={departments}
            columns={departmentColumns}
            rowKey="id"
        />
    );

    return (
        <div className="mx-auto px-4 py-8">
            <Space
                align="center"
                style={{ cursor: "pointer" }}
                onClick={handleBack}
            >
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
                    <ArrowLeftOutlined
                        style={{ fontSize: "16px", color: "#1890ff" }}
                    />
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
                    <h2
                        style={{ fontSize: "24px", fontWeight: "bold" }}
                        className="mb-6"
                    >
                        Danh Sách Sinh Viên Ngành :{" "}
                        <span className="text-[#7017E2]">
                            {selectedDepartment.name}
                        </span>
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