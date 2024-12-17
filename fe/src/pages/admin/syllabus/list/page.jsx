import React, { useEffect, useState } from "react";
import instance from "../../../../config/axios";
import { Select } from "antd";

const Curriculum = () => {
  const [activePopup, setActivePopup] = useState(null); // To track active popup
  const [curriculums, setCurriculums] = useState([]);

  const [activeChildId, setActiveChildId] = useState(null);

  // Toggle popup visibility
  const togglePopup = (index) => {
    setActivePopup(activePopup === index ? null : index);
  };

  const handleChildSelect = (childId) => {
    setActiveChildId(childId);
  };

  // Close the popup when clicking outside the modal or pressing escape
  const closePopup = () => setActivePopup(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`admin/getMajorAndSubMajor`);

        setCurriculums(data.data);

        // Set default activeChildId if children exist
        if (data.data.length > 0 && data.data[0].children.length > 0) {
          setActiveChildId(data.data[0].children[0].id);
        }
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        HOPE Syllabus
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 lg:grid-cols-3 gap-10">
        {curriculums.map((curriculum, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col"
            style={{ minHeight: "300px" }}
          >
            {/* Image Section */}
            <div className="h-64 bg-gray-300 flex items-center justify-center relative">
              {curriculum.image ? (
                <img
                  src={curriculum.image}
                  alt={curriculum.description || "Curriculum Image"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-500 font-bold text-lg">
                  No Image
                </span>
              )}
            </div>

            <div className="p-6 flex-grow">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">
                {curriculum.name}
              </h2>

              {curriculum.children?.length > 0 ? (
                <Select
                  className="w-full border-2 border-gray-300 text-lg text-orange-600 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onChange={handleChildSelect}
                  value={activeChildId}
                >
                  {curriculum.children.map((child) => (
                    <Select.Option key={child.id} value={child.id}>
                      {child.name} - {child.code}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <span className="text-gray-500 text-xl">
                  Hiện chưa có chuyên ngành hẹp.
                </span>
              )}
            </div>

            {/* Footer Section */}
            <div className="mt-auto p-6 flex justify-between items-center text-sm text-gray-600">
              <button
                onClick={() => togglePopup(index)}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium focus:outline-none"
              >
                Thống kê
              </button>
              <div className="flex items-center text-lg font-medium text-gray-500">
                {curriculum.courses && curriculum.courses.length > 0 ? (
                  curriculum.courses.map((course, courseIndex, courses) => (
                    <React.Fragment key={course.id}>
                      <a
                        href={`list-syllabus/detail/${curriculum.id}`}
                        className="hover:underline"
                      >
                        <div>{course.name}</div>
                      </a>
                      {/* Show separator between courses except the last one */}
                      {courseIndex < courses.length - 1 && (
                        <span className="mx-2">|</span>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <span>Hiện chưa có khóa sinh viên.</span>
                )}
              </div>
            </div>

            {/* Popup Modal */}
            {activePopup === index && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={closePopup}
              >
                <div
                  className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-1/2 md:w-2/5 lg:w-1/3 transform transition-all duration-300 ease-out scale-100 opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-semibold text-gray-800">
                      Thông tin chi tiết
                    </p>
                    <button
                      onClick={closePopup}
                      className="text-gray-500 hover:text-gray-700 font-bold"
                    >
                      X
                    </button>
                  </div>
                  <ul className="mt-4 text-2xl text-gray-700">
                    <li>- Chuyên ngành: {curriculum.name}</li>
                    <li>- Chuyên ngành hẹp: {curriculum.children.length}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Curriculum;
