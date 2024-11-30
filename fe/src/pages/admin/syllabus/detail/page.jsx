import React, { useEffect, useState } from "react";
import instance from "../../../../config/axios";
import { Link, useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Table } from "antd";

const tabs = [
  { id: "curriculum", label: "Curriculum", icon: "📅" },
  { id: "overview", label: "Overview", icon: "ℹ️" },
  { id: "plos", label: "PLOs", icon: "🎓" },
  { id: "ploMappings", label: "PLO Mappings", icon: "🔗" },
  { id: "subjects", label: "Subjects", icon: "📋" },
  { id: "statistics", label: "Statistics", icon: "📊" },
];

const CurriculumDetail = () => {
  const [activeTab, setActiveTab] = useState("curriculum");
  const [semesters, setSemesters] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`admin/syllabus/${id}/all`);
        console.log(data);
        setSemesters(data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [id]);
  useEffect(() => {
    if (activeTab === "subjects") {
      (async () => {
        try {
          const { data } = await instance.get(
            `admin/syllabus/${id}/all-subjects`
          );
          setSubjects(data);
          console.log(data);
        } catch (error) {
          console.log("Lỗi khi gọi API thống kê:", error.message);
        }
      })();
    }
  }, [activeTab, id]);  
  useEffect(() => {
    if (activeTab === "statistics") {
      (async () => {
        try {
          const { data } = await instance.get(`admin/getCountType/${id}`);
          setStatistics(data);
          console.log(data);
        } catch (error) {
          console.log("Lỗi khi gọi API thống kê:", error.message);
        }
      })();
    }
  }, [activeTab, id]);
  const pieData = statistics
    ? {
        labels: ["Offline (Học trực tiếp)", "Online (Học trực tuyến)"],
        datasets: [
          {
            data: [statistics["1"], statistics["0"]],
            backgroundColor: ["#4CAF50", "#FF5722"],
            hoverBackgroundColor: ["#45A049", "#FF784E"],
            borderWidth: 1,
          },
        ],
      }
    : null;
  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset.data;
            const currentValue = dataset[tooltipItem.dataIndex];
            const total = dataset.reduce((acc, value) => acc + value, 0);
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${tooltipItem.label} - ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      align: "center",
    },
    {
      title: "Mã môn học",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Tín chỉ",
      dataIndex: "credit",
      key: "credit",
      align: "center",
    },
    {
      title: "Hình thức",
      dataIndex: "form",
      key: "form",
      render: (form) => (
        <span style={{ color: form === 1 ? "red" : "green" }}>
          {form === 1 ? "Online" : "Offline"}
        </span>
      ),
      align: "center",
      filters: [
        { text: "Online", value: 1 },
        { text: "Offline", value: 0 },
      ],
      onFilter: (value, record) => record.form === value,
      filterMultiple: false,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "left",
    },
  ];
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex items-center space-x-4 border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 transition ${
              activeTab === tab.id
                ? "bg-white text-blue-700 font-semibold border border-gray-300 border-b-4 border-r-2 rounded-t-md"
                : "text-gray-500 hover:text-blue-700"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg mt-8">
        {activeTab === "curriculum" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {semesters.map((semester, index) => (
                <div
                  key={index}
                  className="bg-white shadow border border-gray-300 rounded-lg"
                >
                  {/* Header */}
                  <div className="bg-blue-100 px-4 py-2 flex justify-between items-center">
                    <span className="font-bold text-blue-700">
                      Học kỳ {semester.order}
                    </span>
                    <div className="flex space-x-2">
                      <span className="text-gray-600 text-sm">
                        {semester.total_credit} Credits
                      </span>
                    </div>
                  </div>

                  {/* Table */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700 text-sm font-semibold">
                        <th className="border px-2 py-1">STT</th>
                        <th className="border px-2 py-1">Môn học</th>
                        <th className="border px-2 py-1">Tín chỉ</th>
                        <th className="border px-2 py-1">Hình thức</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.subjects.map((subject, subIndex) => (
                        <tr
                          key={subIndex}
                          className={
                            subIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="border px-2 py-1 text-center">
                            {subIndex + 1}
                          </td>
                          <td className="border px-2 py-1 text-left text-blue-600">
                            <Link
                              to={`/admin/list-subject/detail/${subject.id}`}
                              state={{ subjectName: subject.name }}
                            >
                              {subject.name}
                            </Link>
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {subject.credit}
                          </td>
                          <td
                            className={`border px-2 py-1 text-center ${
                              subject.form == "1"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {subject.form == 1 ? "ON" : "OFF"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "statistics" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Thống kê môn học
            </h2>
            {statistics ? (
              <div
                style={{ width: "300px", margin: "0 auto" }}
                className="flex"
              >
                <Pie data={pieData} options={pieOptions} />
              </div>
            ) : (
              <p>Đang tải dữ liệu thống kê...</p>
            )}
          </div>
        )}
        {activeTab === "subjects" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Danh sách môn học
            </h2>
            <Table
              columns={columns}
              dataSource={subjects}
              rowKey="id"
              bordered
              // pagination={{ pageSize: 5 }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 bg-gray-50 border-t border-gray-200 py-4 text-center text-md">
        <div className="mb-2">
          <a href="#" className="text-blue-600 hover:underline">
            Phản hồi ý kiến giảng viên
          </a>
        </div>
        <div className="text-gray-500">
          © 2024 by Hope Edu no1. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetail;
