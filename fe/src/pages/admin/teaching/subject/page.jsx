import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, Typography, Spin, Tag } from "antd";
import { BookOutlined } from "@ant-design/icons";
import instance from "../../../../config/axios";

const { Title, Text } = Typography;

const MajorSubject = () => {
  const location = useLocation();
  const { subId } = useParams();
  const [subjects, setsubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { majorName } = location.state || {};
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await instance.get(`admin/major/${subId}/subjects`);
        console.log(data.data);
        setsubjects(data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [subId]);

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
      case "Tạm dừng":
        color = "red";
        break;
      case "Đang hoạt động":
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <Link
              to={`detail/${subject.id}`}
              state={{ subjectName: subject.name, credit: subject.credits }}
              key={subject.id}
              className="no-underline"
            >
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition flex flex-col justify-between min-h-[200px]">
                <div>
                  <h4 className="text-3xl text-red-500 font-semibold mb-2">
                    {subject.name}
                  </h4>

                  <div className="mb-2 text-2xl">
                    <p className="text-gray-600">
                      Mã môn học:{" "}
                      <span className="font-bold">{subject.code}</span>
                    </p>
                  </div>
                  <div className="mb-2 text-2xl">
                    <p className="text-gray-600">
                      Số tín chỉ:{" "}
                      <span className="font-bold">{subject.credit}</span>
                    </p>
                  </div>
                  <div className="mb-2 text-2xl">
                    <p className="text-gray-600">
                      Trạng thái: {renderStatusTag(subject.status)}
                    </p>
                  </div>
                  <p className="text-gray-600 text-2xl">
                    Mô tả: {subject.description}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <Text type="warning">Không có môn học cho chuyên ngành này.</Text>
        )}
      </div>
    </div>
  );
};

export default MajorSubject;
