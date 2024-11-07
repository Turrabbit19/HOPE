import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { UserOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";

const DashboardPage = () => {
    return (
        <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
            <h2>Dashboard</h2>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số sinh viên"
                            value={1102003}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số giáo viên"
                            value={88}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số khóa học"
                            value={1103}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;
