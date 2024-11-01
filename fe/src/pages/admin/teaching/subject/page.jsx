import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Collapse, Card, Breadcrumb, Typography, Spin, Tag } from "antd";
import {
    HomeOutlined,
    BookOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const MajorSubject = () => {
    const { id } = useParams();
    const [coursesBySemester, setCoursesBySemester] = useState({});
    const [majorName, setMajorName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Dữ liệu chuyên ngành
        const allMajors = [
            { id: 1, name: "Công nghệ thông tin" },
            { id: 2, name: "Quản trị kinh doanh" },
        ];

        const allCourses = [
            {
                id: 1,
                code: "MTH101",
                name: "Reactjs",
                description: "Môn học về Reactjs",
                semester: 1,
                majorId: 1,
                status: "Bắt buộc",
                credits: 3,
            },
            {
                id: 2,
                code: "CS101",
                name: "Nodejs",
                description: "Nhập môn nodejs",
                semester: 1,
                majorId: 1,
                status: "Bắt buộc",
                credits: 4,
            },
            {
                id: 3,
                code: "CS201",
                name: "Cấu Trúc Dữ Liệu",
                description: "Học về cấu trúc dữ liệu",
                semester: 2,
                majorId: 1,
                status: "Tự chọn",
                credits: 3,
            },
            {
                id: 4,
                code: "BUS101",
                name: "Quản Trị Học",
                description: "Môn học về quản trị",
                semester: 1,
                majorId: 2,
                status: "Bắt buộc",
                credits: 3,
            },
            {
                id: 5,
                code: "ECO201",
                name: "Kinh Tế Vi Mô",
                description: "Học về kinh tế vi mô",
                semester: 2,
                majorId: 2,
                status: "Tự chọn",
                credits: 3,
            },
            // Thêm các môn học khác
        ];

        // Lấy tên chuyên ngành
        const major = allMajors.find((major) => major.id === parseInt(id));
        setMajorName(major ? major.name : "Chuyên ngành không tồn tại");

        // Lọc môn học theo chuyên ngành
        const coursesOfMajor = allCourses.filter(
            (course) => course.majorId === parseInt(id)
        );

        // Nhóm môn học theo kỳ
        const groupedCourses = coursesOfMajor.reduce((acc, course) => {
            acc[course.semester] = acc[course.semester] || [];
            acc[course.semester].push(course);
            return acc;
        }, {});

        setCoursesBySemester(groupedCourses);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20%" }}>
                <Spin size="large" />
            </div>
        );
    }

    // Hàm render tiêu đề cho mỗi Panel
    const renderPanelHeader = (semester) => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <CalendarOutlined
                style={{ marginRight: 8, fontSize: "18px", color: "#1890ff" }}
            />
            <Text strong style={{ fontSize: "16px" }}>
                Học kỳ {semester}
            </Text>
        </div>
    );

    // Hàm render Tag trạng thái
    const renderStatusTag = (status) => {
        let color;
        switch (status) {
            case "Bắt buộc":
                color = "red";
                break;
            case "Tự chọn":
                color = "green";
                break;
            default:
                color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
    };

    return (
        <div style={{ padding: "24px" }}>
            {/* Tiêu đề */}

            <Title>
                <BookOutlined style={{ marginRight: "8px" }} />
                {majorName}
            </Title>

            {/* Danh sách môn học */}
            {Object.keys(coursesBySemester).length > 0 ? (
                <Collapse
                    bordered={false}
                    defaultActiveKey={Object.keys(coursesBySemester)}
                    expandIconPosition="end"
                    style={{ background: "#fff" }}
                >
                    {Object.keys(coursesBySemester).map((semester) => (
                        <Panel
                            header={renderPanelHeader(semester)}
                            key={semester}
                            style={{
                                marginBottom: 24,
                                background: "#f7f7f7",
                                borderRadius: 8,
                                border: "1px solid #e8e8e8",
                            }}
                        >
                            {coursesBySemester[semester].map((course) => (
                                <Link
                                    to={`detail/${course.id}`}
                                    key={course.id}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Card
                                        style={{
                                            marginBottom: "16px",
                                            boxShadow:
                                                "0 4px 6px rgba(0,0,0,0.1)",
                                            borderRadius: "8px",
                                        }}
                                        hoverable
                                    >
                                        {/* Tiêu đề môn học */}
                                        <Title level={4}>{course.name}</Title>

                                        {/* Thông tin chi tiết theo chiều dọc */}
                                        <div style={{ marginBottom: "8px" }}>
                                            <Text>
                                                Mã môn học:{" "}
                                                <strong>{course.code}</strong>
                                            </Text>
                                        </div>
                                        <div style={{ marginBottom: "8px" }}>
                                            <Text>
                                                Số tín chỉ:{" "}
                                                <strong>
                                                    {course.credits}
                                                </strong>
                                            </Text>
                                        </div>
                                        <div style={{ marginBottom: "8px" }}>
                                            <Text>
                                                Trạng thái:{" "}
                                                {renderStatusTag(course.status)}
                                            </Text>
                                        </div>

                                        {/* Mô tả */}
                                        <Text>Mô tả: {course.description}</Text>
                                    </Card>
                                </Link>
                            ))}
                        </Panel>
                    ))}
                </Collapse>
            ) : (
                <Text type="warning">
                    Không có môn học cho chuyên ngành này.
                </Text>
            )}
        </div>
    );
};

export default MajorSubject;
