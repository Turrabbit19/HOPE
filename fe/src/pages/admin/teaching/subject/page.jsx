import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, Typography, Spin, Tag } from "antd";
import { BookOutlined } from "@ant-design/icons";
import instance from "../../../../config/axios";

const { Title, Text } = Typography;

const MajorSubject = () => {
  const location = useLocation();
  const { id } = useParams();
  const [subjects, setsubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { majorName } = location.state || {};
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await instance.get(`admin/major/${id}/subjects`);
        setsubjects(data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  }

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
      <Title>
        <BookOutlined style={{ marginRight: "8px" }} />
        {majorName}
      </Title>

      {subjects.length > 0 ? (
        subjects.map((subject) => (
          <Link
            to={`detail/${subject.id}`}
            state={{ subjectName: subject.name}}
            key={subject.id}
            style={{ textDecoration: "none" }}
          >
            <Card
              style={{
                marginBottom: "16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}
              hoverable
            >
              <Title level={4}>{subject.name}</Title>

              <div style={{ marginBottom: "8px" }}>
                <Text>
                  Mã môn học: <strong>{subject.code}</strong>
                </Text>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <Text>
                  Số tín chỉ: <strong>{subject.credit}</strong>
                </Text>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <Text>Trạng thái: {renderStatusTag(subject.status)}</Text>
              </div>

              <Text>Mô tả: {subject.description}</Text>
            </Card>
          </Link>
        ))
      ) : (
        <Text type="warning">Không có môn học cho chuyên ngành này.</Text>
      )}
    </div>
  );
};

export default MajorSubject;
