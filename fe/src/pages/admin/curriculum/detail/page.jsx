import React, { useState } from "react";

const tabs = [
    { id: "curriculum", label: "Curriculum", icon: "📅" },
    { id: "overview", label: "Overview", icon: "ℹ️" },
    { id: "plos", label: "PLOs", icon: "🎓" },
    { id: "ploMappings", label: "PLO Mappings", icon: "🔗" },
    { id: "subjects", label: "Subjects", icon: "📋" },
    { id: "statistics", label: "Statistics", icon: "📊" },
];

const semesters = [
    {
        title: "Học Kỳ 1",
        totalCredits: 16,
        totalHours: 405,
        subjects: [
            {
                no: 1,
                name: "Kỹ năng học tập",
                credits: 2,
                hours: 45,
                type: "BLE",
            },
            { no: 2, name: "Tin học", credits: 3, hours: 75, type: "ONL" },
            {
                no: 3,
                name: "Nhập môn lập trình",
                credits: 3,
                hours: 75,
                type: "BLE",
            },
            {
                no: 4,
                name: "Nhập môn CNTT",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 5,
                name: "Tiếng Anh 1.1",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 6,
                name: "Giáo dục thể chất - Vovinam",
                credits: 2,
                hours: 45,
                type: "TRA",
            },
        ],
    },
    {
        title: "Học Kỳ 2",
        totalCredits: 19,
        totalHours: 450,
        subjects: [
            { no: 1, name: "Lập trình C#", credits: 3, hours: 75, type: "TRA" },
            {
                no: 2,
                name: "Nhập môn lập trình Game",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 3,
                name: "Thiết kế hình ảnh với Photoshop",
                credits: 3,
                hours: 75,
                type: "BLE",
            },
            {
                no: 4,
                name: "Lập trình Game 2D",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 5,
                name: "Tiếng Anh 1.2",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            { no: 6, name: "Chính trị", credits: 4, hours: 75, type: "ONL" },
        ],
    },
    {
        title: "Học Kỳ 3",
        totalCredits: 17,
        totalHours: 420,
        subjects: [
            {
                no: 1,
                name: "Lập trình C# 2 cho Unity",
                credits: 3,
                hours: 75,
                type: "BLE",
            },
            { no: 2, name: "Dự án mẫu", credits: 3, hours: 75, type: "ONL" },
            {
                no: 3,
                name: "Cơ sở dữ liệu cho Game",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 4,
                name: "Dự án 1 (Lập trình Game)",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 5,
                name: "Tiếng Anh 2.1",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 6,
                name: "Kỹ năng phát triển bản thân",
                credits: 2,
                hours: 45,
                type: "BLE",
            },
        ],
    },
    {
        title: "Học Kỳ 4",
        totalCredits: 18,
        totalHours: 450,
        subjects: [
            {
                no: 1,
                name: "Xây dựng trang Web",
                credits: 3,
                hours: 75,
                type: "BLE",
            },
            {
                no: 2,
                name: "Xây dựng kịch bản Game",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            { no: 3, name: "Đồ họa Game", credits: 3, hours: 75, type: "TRA" },
            {
                no: 4,
                name: "Lập trình Game Back-End",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 5,
                name: "Lập trình Game 3D cơ bản",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 6,
                name: "Tiếng Anh 2.2",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
        ],
    },
    {
        title: "Học Kỳ 5",
        totalCredits: 17,
        totalHours: 420,
        subjects: [
            {
                no: 1,
                name: "Kiểm thử cơ bản",
                credits: 3,
                hours: 75,
                type: "BLE",
            },
            {
                no: 2,
                name: "Lập trình Game 3D nâng cao",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 3,
                name: "Kỹ năng làm việc",
                credits: 2,
                hours: 45,
                type: "BLE",
            },
            {
                no: 4,
                name: "Kiểm thử Game",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 5,
                name: "Chuyên đề (Game Online)",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 6,
                name: "Khởi sự doanh nghiệp",
                credits: 3,
                hours: 75,
                type: "ONL",
            },
        ],
    },
    {
        title: "Học Song Song",
        totalCredits: 12,
        totalHours: 255,
        subjects: [
            {
                no: 1,
                name: "Thực tập tốt nghiệp",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            {
                no: 2,
                name: "Dự án tốt nghiệp",
                credits: 3,
                hours: 75,
                type: "TRA",
            },
            { no: 3, name: "Pháp luật", credits: 2, hours: 30, type: "ONL" },
            {
                no: 4,
                name: "Giáo dục quốc phòng",
                credits: 4,
                hours: 75,
                type: "TRA",
            },
        ],
    },
];

const CurriculumDetail = () => {
    const [activeTab, setActiveTab] = useState("curriculum");

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
                        {/* Curriculum Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {semesters.map((semester, index) => (
                                <div
                                    key={index}
                                    className="bg-white shadow border border-gray-300 rounded-lg"
                                >
                                    {/* Header */}
                                    <div className="bg-blue-100 px-4 py-2 flex justify-between items-center">
                                        <span className="font-bold text-blue-700">
                                            {semester.title}
                                        </span>
                                        <div className="flex space-x-2">
                                            <span className="text-gray-600 text-sm">
                                                {semester.totalCredits} Credits
                                            </span>
                                            <span className="text-gray-600 text-sm">
                                                {semester.totalHours} Hours
                                            </span>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-700 text-sm font-semibold">
                                                <th className="border px-2 py-1">
                                                    No.
                                                </th>
                                                <th className="border px-2 py-1">
                                                    Subject
                                                </th>
                                                <th className="border px-2 py-1">
                                                    Credits
                                                </th>
                                                <th className="border px-2 py-1">
                                                    Hours
                                                </th>
                                                <th className="border px-2 py-1">
                                                    Type
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {semester.subjects.map(
                                                (subject, subIndex) => (
                                                    <tr
                                                        key={subIndex}
                                                        className={
                                                            subIndex % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-gray-50"
                                                        }
                                                    >
                                                        <td className="border px-2 py-1 text-center">
                                                            {subject.no}
                                                        </td>
                                                        <td className="border px-2 py-1 text-left text-blue-600">
                                                            {subject.name}
                                                        </td>
                                                        <td className="border px-2 py-1 text-center">
                                                            {subject.credits}
                                                        </td>
                                                        <td className="border px-2 py-1 text-center">
                                                            {subject.hours}
                                                        </td>
                                                        <td
                                                            className={`border px-2 py-1 text-center ${
                                                                subject.type ===
                                                                "BLE"
                                                                    ? "text-green-500"
                                                                    : subject.type ===
                                                                      "ONL"
                                                                    ? "text-yellow-500"
                                                                    : "text-red-500"
                                                            }`}
                                                        >
                                                            {subject.type}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
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
                            {tabs.find((tab) => tab.id === activeTab)?.label}{" "}
                            Content
                        </h2>
                        <p>Nội dung của : {activeTab} tab.</p>
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
