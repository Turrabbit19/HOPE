import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Typography, Spin, Tag, Row, Col, Space } from "antd";
import { ArrowLeftOutlined, BookOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const MajorSubject = () => {
    const { id } = useParams();
    const [courses, setCourses] = useState([]);
    const [majorName, setMajorName] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

        setCourses(coursesOfMajor);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20%" }}>
                <Spin size="large" />
            </div>
        );
    }

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

    const handleBack = () => {
        navigate("/admin/major");
    };

    return (
        <div style={{ padding: "24px" }}>
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
            {/* Tiêu đề */}
            <div className="flex justify-center pb-3 text-[#7017E2]">
                <h1
                    className="mb-8"
                    style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        marginTop: "20px",
                    }}
                >
                    <BookOutlined style={{ marginRight: "8px" }} />
                    {majorName}
                </h1>
            </div>

            {/* Danh sách môn học */}
            {courses.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {courses.map((course) => (
                        <Col
                            xs={24}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            key={course.id}
                        >
                            <Link
                                to={`detail/${course.id}`}
                                style={{ textDecoration: "none" }}
                            >
                                <Card
                                    style={{
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
                                            <strong>{course.credits}</strong>
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
                        </Col>
                    ))}
                </Row>
            ) : (
                <Text type="warning">
                    Không có môn học cho chuyên ngành này.
                </Text>
            )}
        </div>
    );
};

export default MajorSubject;
