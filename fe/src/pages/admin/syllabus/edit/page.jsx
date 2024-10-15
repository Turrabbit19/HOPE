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
} from "antd";

const majorsWithCourses = [
    {
        id: "1",
        name: "Khoa học Máy tính",
        courses: [
            { id: "1", name: "Lập trình C++", semester: 1 },
            { id: "2", name: "Cấu trúc dữ liệu", semester: 2 },
            { id: "3", name: "Toán rời rạc", semester: 3 },
        ],
    },
    {
        id: "2",
        name: "Kỹ thuật Điện",
        courses: [
            { id: "4", name: "Xử lý tín hiệu số", semester: 1 },
            { id: "5", name: "Điện tử cơ bản", semester: 2 },
            { id: "6", name: "Mạch điện", semester: 3 },
        ],
    },
];

// Giả lập dữ liệu syllabus để chỉnh sửa
const existingSyllabus = {
    name: "Lập trình C++",
    majors: ["1", "2"],
    totalSemesters: 3,
    subjectsByMajorAndSemester: {
        1: {
            0: ["1"],
            1: ["2"],
            2: [],
        },
        2: {
            0: ["4"],
            1: ["5"],
            2: [],
        },
    },
};

const SyllabusEdit = () => {
    const [form] = Form.useForm();
    const [selectedMajors, setSelectedMajors] = useState([]);
    const [subjectsByMajorAndSemester, setSubjectsByMajorAndSemester] =
        useState({});
    const [totalSemesters, setTotalSemesters] = useState(0);

    useEffect(() => {
        // Gán giá trị vào form từ syllabus đã có
        form.setFieldsValue({
            name: existingSyllabus.name,
            majors: existingSyllabus.majors,
            totalSemesters: existingSyllabus.totalSemesters,
        });
        setSelectedMajors(existingSyllabus.majors);
        setTotalSemesters(existingSyllabus.totalSemesters);
        setSubjectsByMajorAndSemester(
            existingSyllabus.subjectsByMajorAndSemester
        );
    }, [form]);

    const handleMajorsChange = (value) => {
        setSelectedMajors(value);
        setSubjectsByMajorAndSemester({});
    };

    const getCoursesBySemesterForMajor = (majorId, semester) => {
        const major = majorsWithCourses.find((m) => m.id === majorId);
        if (!major) return [];
        return major.courses
            .filter((course) => course.semester === semester)
            .map((course) => ({
                label: course.name,
                value: course.id,
            }));
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

    const handleFormSubmit = (values) => {
        const finalData = {
            ...values,
            subjectsByMajorAndSemester,
        };
        console.log("Updated Syllabus Data: ", finalData);
    };

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
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên môn học!",
                                },
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
                                    message:
                                        "Vui lòng chọn ít nhất một ngành học!",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn ngành học"
                                options={majorsWithCourses.map((major) => ({
                                    label: major.name,
                                    value: major.id,
                                }))}
                                onChange={handleMajorsChange}
                            />
                        </Form.Item>

                        {/* Số kỳ học */}
                        <Form.Item
                            label="Số lượng kỳ học"
                            name="totalSemesters"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số kỳ học!",
                                },
                            ]}
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

                {/* Hiển thị môn học theo ngành và kỳ */}
                {selectedMajors.length > 0 && (
                    <Tabs defaultActiveKey="1">
                        {selectedMajors.map((majorId) => (
                            <Tabs.TabPane
                                tab={
                                    majorsWithCourses.find(
                                        (major) => major.id === majorId
                                    )?.name
                                }
                                key={majorId}
                            >
                                <Card className="syllabus-card">
                                    {Array.from(
                                        { length: totalSemesters },
                                        (_, semesterIndex) => (
                                            <div
                                                key={semesterIndex}
                                                className="semester-section"
                                            >
                                                <h4>{`Kỳ ${
                                                    semesterIndex + 1
                                                }`}</h4>
                                                <Col span={24}>
                                                    <Select
                                                        mode="multiple"
                                                        placeholder={`Chọn môn học cho kỳ ${
                                                            semesterIndex + 1
                                                        }`}
                                                        options={getCoursesBySemesterForMajor(
                                                            majorId,
                                                            semesterIndex + 1
                                                        )}
                                                        value={
                                                            subjectsByMajorAndSemester[
                                                                majorId
                                                            ]
                                                                ? subjectsByMajorAndSemester[
                                                                      majorId
                                                                  ][
                                                                      semesterIndex
                                                                  ]
                                                                : []
                                                        }
                                                        onChange={(value) =>
                                                            handleCoursesChange(
                                                                value,
                                                                majorId,
                                                                semesterIndex
                                                            )
                                                        }
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    />
                                                </Col>
                                            </div>
                                        )
                                    )}
                                </Card>
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                )}

                {/* Nút lưu syllabus */}
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