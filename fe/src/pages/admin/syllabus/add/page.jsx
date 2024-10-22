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
  const [subjects, setSubjects] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const majorsData = await instance.get(`admin/majors`);
        setMajors(majorsData.data.data);
      } catch (error) {
        notification.error({
          message: "Lỗi khi fetch dữ liệu",
          description: "Thử lại sau",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMajorsChange = async (value) => {
    setSelectedMajors(value);
    setSubjectsByMajorAndSemester({});
    setTotalSemesters(1);
    setSubjects({});


    try {
      setLoading(true);
      const subjectsData = await Promise.all(value.map((majorId) =>
        instance.get(`admin/majors/${majorId}/subjects`)
      ));

      const subjectsMap = {};
      subjectsData.forEach((res, index) => {
        subjectsMap[value[index]] = res.data.data;
      });
      setSubjects(subjectsMap);
    } catch (error) {
      notification.error({
        message: "Lỗi khi fetch dữ liệu môn học",
        description: "Thử lại sau",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
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
    const selectedSubjectsInCurrentMajor = Object.entries(subjectsByMajorAndSemester[majorId] || {})
    .flatMap(([index, subjects]) => 
      Number(index) < semesterIndex ? subjects : []
    );

  return (subjects[majorId] || []).filter(subject => 
    !selectedSubjectsInCurrentMajor.includes(subject.id)
  ).map(subject => ({
    label: subject.name,
    value: subject.id,
  }));
  };
  

  const transformData = (values, subjectsByMajorAndSemester) => {
    return {
      name: values.name,
      status: true, 
      majors: Object.entries(subjectsByMajorAndSemester).map(([majorId, semesters]) => ({
        id: parseInt(majorId),
        semesters: Object.entries(semesters).map(([semesterIndex, subjects]) => ({
          order: parseInt(semesterIndex) + 1, 
          subjects: subjects.map(subjectId => ({ id: subjectId }))
        }))
      }))
    };
  };

  const handleFormSubmit = async (values) => {
    console.log(values);
    const finalData = transformData(values, subjectsByMajorAndSemester);
    console.log(finalData);
    try {
      setLoading(true);
      await instance.post(`admin/plans`, finalData);
      message.success("Thêm thành công kế hoạch học tập");
      form.resetFields();
      navigate(`/admin/list-syllabus`);
    } catch (error) {
      notification.error({
        message: "Lỗi khi lưu kế hoạch",
        description: "Thử lại sau",
      });
      console.error(error);
    } finally {
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
