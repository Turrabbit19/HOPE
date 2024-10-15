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
  notification,
  message,
} from "antd";
import Loading from "../../../../components/loading";
import instance from "../../../../config/axios";
import { useNavigate } from "react-router-dom";

const SyllabusAdd = () => {
  const [form] = Form.useForm();
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [subjectsByMajorAndSemester, setSubjectsByMajorAndSemester] = useState({});
  const [totalSemesters, setTotalSemesters] = useState(1); 
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [subjectsData, majorsData] = await Promise.all([
          instance.get(`admin/subjects`),
          instance.get(`admin/majors`),
        ]);
        setSubjects(subjectsData.data.data);
        setMajors(majorsData.data.data);
      } catch (error) {
        notification.error({
          message: "Lối khi fetch data",
          description: "thử lại sau",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMajorsChange = (value) => {
    setSelectedMajors(value);
    setSubjectsByMajorAndSemester({});

  };

  const handleSemesterNumberChange = (value) => {
    setTotalSemesters(value);
  };

  const handleCoursesChange = (value, majorId, semesterIndex) => {
    setSubjectsByMajorAndSemester((prevState) => ({
      ...prevState,
      [majorId]: {
        ...(prevState[majorId] || {}),
        [semesterIndex]: value,
      },
    }));
  };

  const getAvailableSubjectsForSemester = (majorId, semesterIndex) => {
    
    const selectedSubjects = Object.keys(subjectsByMajorAndSemester).flatMap((key) =>
      Object.values(subjectsByMajorAndSemester[key] || {}).flat()
    );

    return subjects
      .filter(subject => !selectedSubjects.includes(subject.id)) 
      .map(subject => ({
        label: subject.name,
        value: subject.id,
      }));
  };

  const transformData = (values, subjectsByMajorAndSemester) => {
    return {
      name: values.name,
      status: true, 
      majors: Object.entries(subjectsByMajorAndSemester).map(([majorId, semesters], index) => ({
        id: parseInt(majorId),
        semesters: Object.entries(semesters).map(([semesterIndex, subjects]) => ({
          order: parseInt(semesterIndex) + 1, 
          subjects: subjects.map(subjectId => ({ id: subjectId }))
        }))
      }))
    };
  };

  const handleFormSubmit = async (values) => {
    const finalData = transformData(values, subjectsByMajorAndSemester);
    console.log(finalData);
    try {
      setLoading(true);
      await instance.post(`admin/plans`, finalData);
      message.success("Thêm thành công kế hoạch học tập");
      form.setFieldsValue();
      navigate(`/admin/list-syllabus`);
    } catch (error) {
      notification.error({
        message: "Lối khi fetch data",
        description: "thử lại sau",
      });
      console.error(error);
    }finally{
      setLoading(false);
    }
  
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
                value={totalSemesters} 
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
                          onChange={(value) => handleCoursesChange(value, majorId, semesterIndex)}
                          style={{ width: "100%" }}
                          // value={subjectsByMajorAndSemester[majorId]?.[semesterIndex] || []}
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
