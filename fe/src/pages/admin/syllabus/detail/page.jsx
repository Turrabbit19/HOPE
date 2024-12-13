import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const tabs = [
  { id: "curriculum", label: "Kế hoạch", icon: "📅" },
  { id: "overview", label: "Tổng quan", icon: "ℹ️" },
  { id: "plos", label: "PLOs", icon: "🎓" },
  { id: "ploMappings", label: "PLO Mappings", icon: "🔗" },
  { id: "subjects", label: "Subjects", icon: "📋" },
  { id: "statistics", label: "Statistics", icon: "📊" },
];

const CurriculumDetail = () => {
  const [activeTab, setActiveTab] = useState("curriculum");
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { majorId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/admin/syllabus/${majorId}/all`
        );
        const apiData = response.data;

        const formattedData = apiData.data.map((semester) => ({
          title: `Học kỳ ${semester.order}`,
          totalSubjects: semester.subjects.length,

          subjects: semester.subjects.map((subject, index) => ({
            no: index + 1,
            name: subject.name,
            credits: subject.credit,
            description: subject.description,
            form: subject.form,
          })),
        }));

        setSemesters(formattedData);
      } catch (err) {
        setError("Không thể tải dữ liệu từ API.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [majorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Tabs Header */}
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

      {/* Content */}
      <div className="bg-white shadow-md p-6 rounded-lg mt-8">
        {activeTab === "curriculum" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {semesters.map((semester, index) => (
                <div
                  key={index}
                  className="bg-white shadow border border-gray-300 rounded-lg"
                >
                  <div className="bg-blue-100 px-4 py-2 flex justify-between items-center">
                    <span className="font-bold text-blue-700">
                      {semester.title}
                    </span>
                    <div className="flex space-x-2">
                      <span className="text-gray-600 text-sm">
                        {semester.totalSubjects} môn
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
                      {semester.subjects.map((subject) => (
                        <tr key={subject.no} className="hover:bg-gray-100">
                          <td className="border px-2 py-1 text-center">
                            {subject.no}
                          </td>
                          <td className="border px-2 py-1 text-left text-blue-600">
                            {subject.name}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {subject.credits}
                          </td>
                          <td
                            className={`border px-2 py-1 text-center ${
                              subject.form === "ONL"
                                ? "text-green-500"
                                : subject.form === "OFF"
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {subject.form}
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
        {activeTab !== "curriculum" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {tabs.find((tab) => tab.id === activeTab)?.label} Content
            </h2>
            <p>Nội dung của: {activeTab} tab.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumDetail;
