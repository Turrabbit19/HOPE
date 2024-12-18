import React, { useEffect, useState } from "react";
import instance from "../../../config/axios";
import { Select, Spin, Alert, Row, Col } from "antd";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { LoadingOutlined } from "@ant-design/icons";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Plugin hiển thị attendance_rate ở giữa
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: function (chart) {
    const { width, height, ctx } = chart;
    const datasets = chart.data.datasets[0];
    const attendanceRate = datasets.attendanceRate || "0%";

    // Chỉnh font và style văn bản
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#000";

    // Xác định chính giữa biểu đồ Doughnut
    const centerX = width / 2;
    const centerY =
      chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

    // Hiển thị văn bản ở chính giữa
    ctx.fillText(`Tỷ lệ tham gia: ${attendanceRate}`, centerX, centerY);
    ctx.restore();
  },
};

const StatisticSemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Không tìm thấy token xác thực");
  }

  // Fetch danh sách kỳ học
  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      try {
        const semesterResponse = await instance.get(`student/semesters`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const fetchedSemesters = semesterResponse.data.data;
        setSemesters(fetchedSemesters);

        // Chọn kỳ học gần nhất
        if (fetchedSemesters.length > 0) {
          const maxIdSemester = fetchedSemesters.reduce((max, semester) =>
            semester.id > max.id ? semester : max
          );
          setSelectedSemester(maxIdSemester.id);
          handleChange(maxIdSemester.id);
        } else {
          setErrorMessage("Không có kỳ học nào để hiển thị.");
        }
      } catch (error) {
        setErrorMessage("Lỗi kết nối với máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  // Fetch dữ liệu môn học khi kỳ học thay đổi
  const handleChange = async (value) => {
    if (!value) {
      setErrorMessage("Vui lòng chọn kỳ học.");
      return;
    }

    setSelectedSemester(value);
    setDataLoading(true);

    try {
      const { data } = await instance.get(`student/statistics/${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSubjects(data.data);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Chưa có dữ liệu cho kỳ học này.");
        setSubjects([]);
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setDataLoading(false);
    }
  };

  // Tạo dữ liệu cho biểu đồ Doughnut
  const createChartData = (subject) => {
    const attendedLessons = subject.attended_lessons;
    const missedLessons = subject.missed_lessons;
    const remainingLessons = subject.remaining_lessons;

    return {
      labels: ["Buổi học đã tham gia", "Buổi học đã vắng", "Buổi học còn lại"],
      datasets: [
        {
          data: [attendedLessons, missedLessons, remainingLessons],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)", // Đã tham gia
            "rgba(255, 99, 132, 0.6)", // Đã vắng
            "rgba(255, 159, 64, 0.6)", // Còn lại
          ],
          borderWidth: 1,
          attendanceRate: subject.attendance_rate, // Thêm attendance_rate ở đây
        },
      ],
    };
  };

  const loadingSpinner = <Spin indicator={<LoadingOutlined />} />;

  return (
    <div>
      {/* Dropdown chọn kỳ học */}
      <Select
        placeholder="Vui lòng chọn kỳ học"
        value={selectedSemester}
        onChange={handleChange}
        style={{ width: "100%" }}
        options={semesters.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        disabled={loading}
      />

      {/* Hiển thị thông báo lỗi */}
      {errorMessage && (
        <Alert message={errorMessage} type="error" style={{ marginTop: 20 }} />
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          {loadingSpinner}
        </div>
      )}

      {/* Không có dữ liệu */}
      {selectedSemester && !dataLoading && subjects.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Alert
            message="Không có dữ liệu cho kỳ học này."
            type="info"
            showIcon
          />
        </div>
      )}

      {/* Hiển thị dữ liệu môn học */}
      {subjects.length > 0 && !dataLoading && (
        <div style={{ marginTop: "20px" }}>
          <Row gutter={[16, 16]}>
            {subjects.map((subject, index) => (
              <Col key={index} span={8}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Thông tin tín chỉ và tổng số buổi học */}
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <strong>Tín chỉ:</strong> {subject.subject_credit}
                    </div>
                    <div>
                      <strong>Học phần:</strong> {subject.total_lessons}
                    </div>
                  </div>

                  {/* Tên môn học */}
                  <h3 className="font-bold text-[22px]">
                    {subject.subject_name}
                  </h3>

                  {/* Biểu đồ Doughnut */}
                  <Doughnut
                    data={createChartData(subject)}
                    options={{
                      responsive: true,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function (tooltipItem) {
                              return `${tooltipItem.label}: ${tooltipItem.raw} buổi`;
                            },
                          },
                        },
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                    plugins={[centerTextPlugin]} // Plugin hiển thị văn bản chính giữa
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Loading dữ liệu môn học */}
      {dataLoading && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Spin indicator={loadingSpinner} />
        </div>
      )}
    </div>
  );
};

export default StatisticSemester;
