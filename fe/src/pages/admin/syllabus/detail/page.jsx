import React from "react";
import { Card, Descriptions, Button } from "antd";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const syllabuses = [
    {
        id: 1,
        name: "Khoa học Máy tính",
        description: "Tìm hiểu về lập trình và cấu trúc dữ liệu",
        credits: 3,
        semester: 1,
        subjects: ["Giới thiệu về Lập trình", "Cấu trúc Dữ liệu"],
    },
    {
        id: 2,
        name: "Kỹ thuật Điện",
        description: "Nghiên cứu các nguyên lý điện và điện tử",
        credits: 4,
        semester: 2,
        subjects: ["Nguyên lý Điện", "Mạch Điện"],
    },
];

const SyllabusDetail = () => {
    const { id } = useParams();
    const syllabus = syllabuses.find((item) => item.id === parseInt(id));

    if (!syllabus) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500 text-xl">Syllabus không tồn tại!</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <Link to="/admin/list-syllabus" className="mb-6 inline-block">
                <Button icon={<ArrowLeftOutlined />} type="primary">
                    Quay lại Danh Sách
                </Button>
            </Link>
            <Card
                title={
                    <h1 className="text-[#1167B4] text-2xl font-bold">
                        Chi Tiết Kế Hoạch Học Tập: {syllabus.name}
                    </h1>
                }
                bordered={false}
                style={{
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                }}
                bodyStyle={{ padding: "20px" }}
            >
                <Descriptions
                    title="Thông Tin Chi Tiết"
                    bordered
                    layout="vertical"
                    column={1}
                    labelStyle={{ fontWeight: "bold", fontSize: "16px" }}
                    style={{ overflowWrap: "break-word" }}
                >
                    <Descriptions.Item label="Tên Syllabus">
                        {syllabus.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tín chỉ">
                        {syllabus.credits}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kỳ học">
                        Kỳ {syllabus.semester}
                    </Descriptions.Item>
                    <Descriptions.Item label="Môn học">
                        {syllabus.subjects.join(", ")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả">
                        {syllabus.description}
                    </Descriptions.Item>
                </Descriptions>
                <div className="mt-6 flex justify-end gap-4">
                    <Link to={`edit/${syllabus.id}`}>
                        <Button type="primary">Sửa Thông Tin</Button>
                    </Link>
                    <Button danger>Xóa Syllabus</Button>
                </div>
            </Card>
        </div>
    );
};

export default SyllabusDetail;
