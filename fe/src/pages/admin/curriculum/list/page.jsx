import React, { useState } from "react";

const curriculums = [
    {
        title: "CNTT - Công nghệ thông tin",
        image: "",
        description: "Lập trình Game",
        stats: "Thống kê",
        classes: ["K19.3"],
    },
    {
        title: "CTCK - Công nghệ kỹ thuật cơ khí",
        image: "https://via.placeholder.com/300",
        description: "Công nghệ kỹ thuật cơ khí",
        stats: "Thống kê",
        classes: ["K16.3", "K17.3", "K18.1", "K18.3", "K19.2", "K19.3"],
    },
    {
        title: "HDDL - Hướng dẫn du lịch",
        image: "",
        description: "Dược",
        stats: "Thống kê",
        classes: ["K20.3"],
    },
    {
        title: "QTKD - Quản trị kinh doanh",
        image: "https://via.placeholder.com/300",
        description: "Digital Marketing",
        stats: "Thống kê",
        classes: ["K18.1", "K18.3", "K19.2", "K19.3"],
    },
    {
        title: "TDHO - CNKTĐK & Tự động hóa",
        image: "https://via.placeholder.com/300",
        description: "Điện công nghiệp",
        stats: "Thống kê",
        classes: ["K16.3", "K18.3", "K19.2", "K19.3"],
    },
    {
        title: "TKDH - Thiết kế đồ họa",
        image: "https://via.placeholder.com/300",
        description: "Thiết kế đồ họa",
        stats: "Thống kê",
        classes: ["K18.1", "K18.3", "K19.2", "K19.3"],
    },
];

const Curriculum = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
                FPL Curriculums
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 lg:grid-cols-3 gap-10">
                {curriculums.map((curriculum, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col"
                        style={{ minHeight: "300px" }}
                    >
                        {/* Image Section */}
                        <div className="h-64 bg-gray-300 flex items-center justify-center">
                            {curriculum.image ? (
                                <img
                                    src={curriculum.image}
                                    alt={curriculum.description}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500 font-bold text-lg">
                                    No Image
                                </span>
                            )}
                        </div>
                        {/* Content Section */}
                        <div className="p-6 flex-grow">
                            <h2 className="text-2xl font-bold text-red-600">
                                {curriculum.title}
                            </h2>
                            <p className="text-lg text-orange-600 font-semibold mt-2">
                                {curriculum.description}
                            </p>
                        </div>
                        {/* Footer Section */}
                        <div className="mt-auto p-6 flex justify-between items-center text-sm text-gray-600">
                            <button
                                onClick={() => toggleDropdown(index)}
                                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium focus:outline-none"
                            >
                                {curriculum.stats}
                            </button>
                            <div className="flex items-center text-lg font-medium text-gray-500">
                                {curriculum.classes.map(
                                    (className, classIndex) => (
                                        <React.Fragment key={classIndex}>
                                            <a
                                                href={`list-curriculum/detail/${className}`}
                                                className="hover:underline"
                                            >
                                                {className}
                                            </a>
                                            {classIndex <
                                                curriculum.classes.length -
                                                    1 && (
                                                <span className="mx-2">|</span>
                                            )}
                                        </React.Fragment>
                                    )
                                )}
                            </div>
                        </div>
                        {/* Dropdown */}
                        {activeDropdown === index && (
                            <div className="mt-4 bg-gray-100 p-4 rounded shadow">
                                <p className="text-lg font-semibold">
                                    Thông tin chi tiết:
                                </p>
                                <ul className="mt-2 text-base text-gray-700">
                                    <li>- Chuyên ngành hẹp: 1</li>
                                    <li>- Môn chính thức/lựa chọn: 34/0</li>
                                    <li>- Tín chỉ chính thức/lựa chọn: 99/0</li>
                                    <li>- Thời lượng: 1057H/72H/2400H</li>
                                    <li>- Phương pháp: 21/8/5/1</li>
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Curriculum;
