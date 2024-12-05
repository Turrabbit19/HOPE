import React, { useEffect, useState } from "react";
import instance from "../../../../config/axios";
import { Select } from "antd";

const Curriculum = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [curriculums, setCurriculums] = useState([]);

  const [activeChildId, setActiveChildId] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };


  const handleChildSelect = (childId) => {
    setActiveChildId(childId);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`admin/getMajorAndSubMajor`);
        console.log(data);
        setCurriculums(data);

        if (data.length > 0 && data[0].children.length > 0) {
          setActiveChildId(data[0].children[0].id);
        }
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

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

            <div className="p-6 flex-grow">
              <h2 className="text-2xl font-bold text-red-600">
                {curriculum.name}
              </h2>
              <select
                className="border-0 text-lg text-orange-600 font-semibold p-0 focus:outline-none"
                onChange={(e) => handleChildSelect(e.target.value)}
                value={activeChildId}
              >
                {curriculum?.children?.map((child) => (
                  <option
                    key={child.id}
                    value={child.id}
                    className="text-lg text-orange-600 font-semibold"
                  >
                    {child.name} - {child.code}
                  </option>
                ))}
              </select>
            </div>
            {/* Footer Section */}
            <div className="mt-auto p-6 flex justify-between items-center text-sm text-gray-600">
              <button
                onClick={() => toggleDropdown(index)}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium focus:outline-none"
              >
                Thống kê
              </button>
              <div className="flex items-center text-lg font-medium text-gray-500">
                {curriculum.children.map((className) => {
                  if (className.id === parseInt(activeChildId)) {
                    return (
                      className.courses.length > 0 && (
                        <React.Fragment key={className.id}>

                          {className.courses.map((item, courseIndex) => (
                            <React.Fragment key={item.id}>
                              <a
                                href={`list-syllabus/detail/${curriculum.id}`} // Use curriculum.id as Major ID
                                className="hover:underline"
                              >
                                <div>{item.name}</div>
                              </a>
                              {courseIndex < className.courses.length - 1 && (
                                <span className="mx-2">|</span>
                              )}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      )
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            {/* Dropdown */}
            {activeDropdown === index && (
              <div className="mt-4 bg-gray-100 p-4 rounded shadow">
                <p className="text-lg font-semibold">Thông tin chi tiết:</p>
                <ul className="mt-2 text-base text-gray-700">

                  <li>- Chuyên ngành: {curriculum.name}</li>

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
