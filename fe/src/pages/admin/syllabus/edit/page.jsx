import React, { useState, useEffect } from "react";
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
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../../config/axios";
import Loading from "../../../../components/loading";

const SyllabusEdit = () => {
  const [form] = Form.useForm();
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [subjectsByMajorAndSemester, setSubjectsByMajorAndSemester] = useState(
    {}
  );
  const [totalSemesters, setTotalSemesters] = useState(0);
  const [loading, setLoading] = useState(false);
  const [majors, setMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [{ data }, majorsResponse, subjectsResponse] = await Promise.all([
          instance.get("admin/plans/" + id),
          instance.get("admin/majors"),
          instance.get("admin/subjects"),
        ]);
        const transformedBackData = transformBackData(data.data);
        setMajors(majorsResponse.data.data);
        setSubjects(subjectsResponse.data.data);
        form.setFieldsValue(transformedBackData);
        setSelectedMajors(transformedBackData.majors);
        setSubjectsByMajorAndSemester(
          transformedBackData.subjectsByMajorAndSemester
        );
        setTotalSemesters(transformedBackData.totalSemesters);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, form]);

  const transformBackData = (inputData) => {
    const subjectsByMajorAndSemester = {};

    inputData.majors.forEach((major) => {
      const majorId = major.id.toString();
      subjectsByMajorAndSemester[majorId] = {};

      major.semesters.forEach((semester, index) => {
        subjectsByMajorAndSemester[majorId][index] = semester.subjects.map(
          (subject) => subject.id
        );
      });
    });

    return {
      name: inputData.name,
      majors: inputData.majors.map((major) => major.id.toString()),
      totalSemesters: inputData.majors[0].semesters.length,
      subjectsByMajorAndSemester,
    };
  };


  
  const handleMajorsChange = (value) => {
    setSelectedMajors(value);
    const updatedSubjects = {};
    value.forEach((majorId) => {
      updatedSubjects[majorId] = subjectsByMajorAndSemester[majorId] || {};
    });
    setSubjectsByMajorAndSemester(updatedSubjects);
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

  const handleSemesterNumberChange = (value) => {
    setTotalSemesters(value);
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
        await instance.put(`admin/plans/${id}`, finalData);
        message.success("Cập nhật kế hoạch thành công");
        form.resetFields();
        setTimeout(()=> {
            navigate(`/admin/list-syllabus`);
        }, 2000)
    } catch (error) {
        console.log(error.message);
    }finally{
        setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="syllabus-container">
      <h2 className="syllabus-title">Chỉnh Sửa Quản Lý Học Tập</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={12}>
            {/* Tên môn học */}
            <Form.Item
              label="Tên Môn Học"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên môn học!" },
              ]}
            >
              <Input placeholder="Tên môn học" />
            </Form.Item>

            {/* Ngành học */}
            <Form.Item
              label="Ngành Học"
              name="majors"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ít nhất một ngành học!",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn ngành học"
                options={majors.map((major) => ({
                  label: major.name,
                  value: major.id.toString(),
                }))}
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
                className="semester-input"
              />
            </Form.Item>
          </Col>
        </Row>

        {selectedMajors.length > 0 && (
    <Tabs defaultActiveKey="1">
        {selectedMajors.map((majorId) => (
            <Tabs.TabPane
                tab={majors.find(major => major.id.toString() === majorId)?.name}
                key={majorId}
            >
                <Card className="syllabus-card">
                    {Array.from({ length: totalSemesters }, (_, semesterIndex) => {
                        const selectedSubjects = subjectsByMajorAndSemester[majorId]?.[semesterIndex] || [];
                        return (
                            <div key={semesterIndex} className="semester-section">
                                <h4>{`Kỳ ${semesterIndex + 1}`}</h4>
                                <Col span={24}>
                                    <Select
                                        mode="multiple"
                                        placeholder={`Chọn môn học cho kỳ ${semesterIndex + 1}`}
                                        options={subjects.map(subject => ({
                                            label: subject.name,
                                            value: subject.id.toString(),
                                        }))}
                                        value={selectedSubjects} 
                                        onChange={(value) => handleCoursesChange(value, majorId, semesterIndex)}
                                        style={{ width: "100%" }}
                                    />
                                </Col>
                            </div>
                        );
                    })}
                </Card>
            </Tabs.TabPane>
        ))}
    </Tabs>
)}


        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập Nhật Syllabus
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SyllabusEdit;
