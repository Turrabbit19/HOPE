import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Row,
    Col,
} from "antd";

const semesterData = {
    1: { majors: ["Lập trình Web", "Thiết kế đồ họa", "An ninh mạng"] },
    2: { majors: ["Kinh tế", "Tài chính", "Quản lý dự án"] },
    3: { majors: ["Y học", "Dược học", "Điều dưỡng"] },
};

const semesters = Object.keys(semesterData); // Lấy danh sách các kỳ học

const CourseAdd = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
    const [majors, setMajors] = useState(semesterData[selectedSemester].majors);
    const [selectedMajor, setSelectedMajor] = useState(majors[0]);
    const [additionalVariants, setAdditionalVariants] = useState([
        { semester: selectedSemester, major: selectedMajor },
    ]);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        form.resetFields();
        setAdditionalVariants([
            {
                semester: semesters[0],
                major: semesterData[semesters[0]].majors[0],
            },
        ]);
    };

    const handleFormSubmit = (values) => {
        console.log("Form data:", values, "Variants:", additionalVariants);

        const formData = {
            ...values,
            variants: additionalVariants,
        };

        console.log("Form data:", formData);
    };

    const handleSemesterChange = (value, index) => {
        const newMajors = semesterData[value].majors;
        const updatedVariants = [...additionalVariants];
        updatedVariants[index].semester = value;
        updatedVariants[index].major = newMajors[0];
        setMajors(newMajors);
        setAdditionalVariants(updatedVariants);
    };

    const handleMajorChange = (value, index) => {
        const updatedVariants = [...additionalVariants];
        updatedVariants[index].major = value;
        setAdditionalVariants(updatedVariants);
    };

    const handleAddVariant = () => {
        setAdditionalVariants([
            ...additionalVariants,
            {
                semester: semesters[0],
                major: semesterData[semesters[0]].majors[0],
            },
        ]);
    };

    return (
        <>
            <Button type="primary" onClick={togglePopup}>
                Tạo Môn Học Mới
            </Button>

            <Modal
                visible={isPopupVisible}
                onCancel={togglePopup}
                footer={null}
                centered
                width={1000}
            >
                <div className="createCourseForm pb-6">
                    <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
                        Tạo Môn Học Mới
                    </h3>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFormSubmit}
                        autoComplete="off"
                    >
                        <Row gutter={24}>
                            <Col span={14}>
                                <Form.Item
                                    label="Mã Môn Học"
                                    name="code"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập mã môn học!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Mã môn học" />
                                </Form.Item>

                                <Form.Item
                                    label="Tên Môn Học"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập tên môn học!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Tên" />
                                </Form.Item>

                                <Form.Item
                                    label="Mô tả"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập mô tả!",
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Mô tả"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Tín chỉ"
                                    name="credit"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập Tín chỉ!",
                                        },
                                        {
                                            pattern: /^(?!0)\d(\.\d+)?$/, // Regex cho số dương
                                            message:
                                                "Tín chỉ phải là số dương.",
                                        },
                                        {
                                            validator: (_, value) => {
                                                if (
                                                    value &&
                                                    (value < 0 || value >= 8)
                                                ) {
                                                    return Promise.reject(
                                                        new Error(
                                                            "Tín chỉ phải nhỏ hơn 8."
                                                        )
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="Tín chỉ"
                                        min={0}
                                        max={8}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={10}>
                                <Form.Item label="Kỳ học và Ngành học">
                                    {additionalVariants.map(
                                        (variant, index) => (
                                            <Row
                                                key={index}
                                                gutter={16}
                                                style={{ marginBottom: 16 }}
                                            >
                                                <Col span={12}>
                                                    <Select
                                                        value={variant.semester}
                                                        onChange={(value) =>
                                                            handleSemesterChange(
                                                                value,
                                                                index
                                                            )
                                                        }
                                                        options={semesters.map(
                                                            (semester) => ({
                                                                label: `Kỳ ${semester}`,
                                                                value: semester,
                                                            })
                                                        )}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Select
                                                        value={variant.major}
                                                        onChange={(value) =>
                                                            handleMajorChange(
                                                                value,
                                                                index
                                                            )
                                                        }
                                                        options={majors.map(
                                                            (major) => ({
                                                                label: major,
                                                                value: major,
                                                            })
                                                        )}
                                                    />
                                                </Col>
                                            </Row>
                                        )
                                    )}

                                    <Button onClick={handleAddVariant}>
                                        Thêm Biến Thể
                                    </Button>
                                </Form.Item>
                            </Col>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Tạo Môn Học
                                </Button>
                            </Form.Item>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default CourseAdd;
