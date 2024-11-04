import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../config/axios";
import Loading from "../../../components/loading";

const ScheduleList = () => {
  const [courses, setCourses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedMajor, setExpandedMajor] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await instance.get("admin/courses");
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchMajors = async (courseId) => {
    try {
      const response = await instance.get(`admin/course/${courseId}/majors`);
      console.log(response.data);
      setMajors(response.data.majors);
    } catch (error) {
      console.error("Error fetching majors:", error.message);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    setExpandedMajor(null);
    setSelectedSubject(null);
    // console.log(courseId);
    if (expandedCourse !== courseId) {
      fetchMajors(courseId);
    }
  };
  const toggleMajor = (majorId) => {
    setExpandedMajor(expandedMajor === majorId ? null : majorId);
    setSelectedSubject(null);
  };

  const selectSubject = (subjectId) => {
    setSelectedSubject(selectedSubject === subjectId ? null : subjectId);
  };

  const handleScheduleClick = (scheduleId) => {
    navigate(`details/${scheduleId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto p-10 bg-blue-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-10">
        Quản lý lịch học
      </h2>

      <div className="space-y-8">
        {courses.map((course) => (
          <div key={course.id} className="p-8 bg-white rounded-lg shadow-xl space-y-6">
            <div onClick={() => toggleCourse(course.id)} className="cursor-pointer space-y-2">
              <h3 className="text-3xl font-semibold">Khóa học: {course.name}</h3>
              <p className="text-xl text-gray-600">Ngày bắt đầu: {course.startDate}</p>
              <p className="text-xl text-gray-600">Ngày kết thúc: {course.endDate}</p>
              <p className={`text-xl font-semibold ${course.status === "Đang diễn ra" ? "text-green-600" : "text-yellow-600"}`}>
                {course.status}
              </p>
            </div>

            {expandedCourse === course.id && (
              <div className="mt-6 pl-6 space-y-6 border-l-4 border-blue-200">
                {majors.map((major) => (
                  <div key={major.id}>
                    <button
                      onClick={() => toggleMajor(major.id)}
                      className={`block w-full text-left px-6 py-4 rounded-lg text-2xl ${expandedMajor === major.id ? "bg-blue-100 text-blue-800" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      {major.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;
