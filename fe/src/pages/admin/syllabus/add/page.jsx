import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  InputNumber,
  Tabs,
  Card,
} from "antd";
import Loading from "../../../../components/loading";
import instance from "../../../../config/axios";

const SyllabusAdd = () => {
  const [form] = Form.useForm();
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [subjectsByMajorAndSemester, setSubjectsByMajorAndSemester] = useState({});
  const [totalSemesters, setTotalSemesters] = useState(1); // Default to 1 semester
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [subjectsData, majorsData] = await Promise.all([
          instance.get(`admin/subjects`),
          instance.get(`admin/majors`)
        ]);
        setSubjects(subjectsData.data.data);
        setMajors(majorsData.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handle major selection
  const handleMajorsChange = (value) => {
    setSelectedMajors(value);
    setSubjectsByMajorAndSemester({});
  };

  // Handle semester number change
  const handleSemesterNumberChange = (value) => {
    setTotalSemesters(value);
  };

  // Handle subject selection
  const handleCoursesChange = (value, majorId, semesterIndex) => {
    setSubjectsByMajorAndSemester((prevState) => ({
      ...prevState,
      [majorId]: {
        ...(prevState[majorId] || {}),
        [semesterIndex]: value,
      },
    }));
  };

  // Get available subjects for the current semester excluding already selected subjects
  const getAvailableSubjectsForSemester = (majorId, semesterIndex) => {
    const selectedSubjects = Object.values(subjectsByMajorAndSemester)
      .flatMap(semesters => Object.values(semesters).flat());

    return subjects
      .filter(subject => !selectedSubjects.includes(subject.id))
      .map(subject => ({
        label: subject.name,
        value: subject.id,
      }));
  };

  // Handle form submission
  const handleFormSubmit = (values) => {
    const finalData = {
      ...values,
      subjectsByMajorAndSemester,
    };
    console.log("Syllabus Data: ", finalData);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="syllabus-container">
      <h2 className="syllabus-title">Thêm Mới Quản Lý Học Tập</h2>
      <Form form={form} layout="vertical" onFinish={handleFormSubmit} autoComplete="off">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Tên kế hoạch"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên kế hoạch!" }]}
            >
              <Input placeholder="Tên kế hoạch" />
            </Form.Item>

            <Form.Item
              label="Ngành Học"
              name="majors"
              rules={[{ required: true, message: "Vui lòng chọn ít nhất một ngành học!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn ngành học"
                options={majors.map(major => ({ label: major.name, value: major.id }))}
                onChange={handleMajorsChange}
              />
            </Form.Item>

            <Form.Item
              label="Số lượng kỳ học"
              name="totalSemesters"
              rules={[{ required: true, message: "Vui lòng nhập số kỳ học!" }]}
            >
              <InputNumber
                min={1}
                defaultValue={totalSemesters}
                onChange={handleSemesterNumberChange}
                placeholder="Số kỳ học"
              />
            </Form.Item>
          </Col>
        </Row>

        {selectedMajors.length > 0 && (
          <Tabs defaultActiveKey="1">
            {selectedMajors.map((majorId) => (
              <Tabs.TabPane tab={majors.find(major => major.id === majorId)?.name} key={majorId}>
                <Card className="syllabus-card">
                  {Array.from({ length: totalSemesters }, (_, semesterIndex) => (
                    <div key={semesterIndex} className="semester-section">
                      <h4>{`Kỳ ${semesterIndex + 1}`}</h4>
                      <Col span={24}>
                        <Select
                          mode="multiple"
                          placeholder={`Chọn môn học cho kỳ ${semesterIndex + 1}`}
                          options={getAvailableSubjectsForSemester(majorId, semesterIndex)}
                          value={subjectsByMajorAndSemester[majorId]?.[semesterIndex] || []}
                          onChange={(value) => handleCoursesChange(value, majorId, semesterIndex)}
                          style={{ width: "100%" }}
                        />
                      </Col>
                    </div>
                  ))}
                </Card>
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">Lưu Syllabus</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SyllabusAdd;
