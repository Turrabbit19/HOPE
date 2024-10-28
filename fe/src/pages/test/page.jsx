import React, { useState, useEffect } from "react";
import { Button, Popconfirm, Input, Table, Typography, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

const Testing = () => {
    const [schedules, setSchedules] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchSchedules = async () => {
            const data = [
                {
                    id: 1,
                    courseName: "Reactjs",
                    className: "Web209",
                    classroom: "A101",
                    session: "Ca 1",
                    startDate: "2024-01-01",
                    endDate: "2024-04-30",
                    status: "Đang diễn ra",
                },
                {
                    id: 2,
                    courseName: "PHP",
                    className: "Web302",
                    classroom: "B202",
                    session: "Ca 3",
                    startDate: "2024-05-01",
                    endDate: "2024-08-31",
                    status: "Chờ diễn ra",
                },
                {
                    id: 3,
                    courseName: "JAVA",
                    className: "WEB401",
                    classroom: "C303",
                    session: "Ca 6",
                    startDate: "2024-09-01",
                    endDate: "2024-12-31",
                    status: "Chờ diễn ra",
                },
            ];
            setSchedules(data);
        };

        fetchSchedules();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    const filteredSchedules = schedules.filter(
        (schedule) =>
            schedule.courseName.toLowerCase().includes(searchTerm) ||
            schedule.className.toLowerCase().includes(searchTerm) ||
            schedule.classroom.toLowerCase().includes(searchTerm) ||
            schedule.session.toLowerCase().includes(searchTerm)
    );

    const confirmDelete = (id) => {
        setSchedules(schedules.filter((schedule) => schedule.id !== id));
    };

    const columns = [
        {
            title: "Môn Học",
            dataIndex: "courseName",
            key: "courseName",
            render: (text) => (
                <span style={{ color: "#7017E2", fontWeight: "bold" }}>
                    {text}
                </span>
            ),
        },
        {
            title: "Lớp Học",
            dataIndex: "className",
            key: "className",
        },
        {
            title: "Phòng Học",
            dataIndex: "classroom",
            key: "classroom",
        },
        {
            title: "Ca học",
            dataIndex: "session",
            key: "session",
        },
        {
            title: "Ngày Bắt Đầu",
            dataIndex: "startDate",
            key: "startDate",
        },
        {
            title: "Ngày Kết Thúc",
            dataIndex: "endDate",
            key: "endDate",
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span
                    style={{
                        color:
                            status === "Đang diễn ra" ? "#44CC15" : "#FF5252",
                        fontWeight: "bold",
                    }}
                >
                    {status}
                </span>
            ),
        },
        {
            title: "Hành Động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Link to="list" style={{ color: "#1167B4" }}>
                        Quản Lý
                    </Link>
                    <Link
                        to={`/detail/${record.id}`}
                        style={{ color: "#1167B4" }}
                    >
                        Chi Tiết
                    </Link>
                    <Popconfirm
                        title="Xóa lịch học"
                        onConfirm={() => confirmDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <a style={{ color: "#FF5252" }}>Xóa</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px", backgroundColor: "#F9F9F9" }}>
            <Title level={2} style={{ color: "#7017E2", textAlign: "center" }}>
                Quản Lý Lịch Học
            </Title>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: "#7017E2" }}
                >
                    <Link to="add" style={{ color: "white" }}>
                        Tạo mới
                    </Link>
                </Button>

                <Input.Search
                    placeholder="Tìm kiếm lịch học..."
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>

            <Table
                dataSource={filteredSchedules}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                style={{ backgroundColor: "#FFF" }}
                bordered
            />
        </div>
    );
};

export default Testing;
