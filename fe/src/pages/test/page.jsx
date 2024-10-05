import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Button,
    Select,
    DatePicker,
    Row,
    Col,
} from "antd";

const Testing = () => {
    const courseData = {
        18.3: ["Kỳ 1", "Kỳ 2", "Kỳ 3"],
        17.3: ["Kỳ 4", "Kỳ 5", "Kỳ 6"],
        19.1: ["Kỳ 7", "Kỳ 8", "Kỳ 9"],
    };
    const courseKeys = ["18.3", "17.3", "19.1"];

    const [form] = Form.useForm();
    const [additionalVariants, setAdditionalVariants] = useState([
        {
            course: courseKeys[0],
            order: courseData[courseKeys[0]][0],
        },
    ]);
    const [orderOptions, setOrderOptions] = useState(courseData[courseKeys[0]]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Hàm mở modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Hàm đóng modal
    const handleClose = () => {
        setIsModalVisible(false);
    };

    // Hàm xử lý thay đổi khóa học
    const handleCourseChange = (value, index) => {
        const updatedVariants = [...additionalVariants];
        updatedVariants[index].course = value;
        updatedVariants[index].order = courseData[value][0];
        setAdditionalVariants(updatedVariants);
        setOrderOptions(courseData[value]);
    };

    // Hàm xử lý thay đổi thứ tự học
    const handleOrderChange = (value, index) => {
        const updatedVariants = [...additionalVariants];
        updatedVariants[index].order = value;
        setAdditionalVariants(updatedVariants);
    };

    // Hàm thêm biến thể mới
    const handleAddVariant = () => {
        setAdditionalVariants([
            ...additionalVariants,
            {
                course: courseKeys[0],
                order: courseData[courseKeys[0]][0],
            },
        ]);
    };

    // Hàm xử lý submit form
    const handleFormSubmit = (values) => {
        console.log("Submitted Values: ", { ...values, additionalVariants });
        // Gửi dữ liệu tới API hoặc thực hiện các thao tác cần thiết
        handleClose(); // Đóng modal sau khi gửi dữ liệu
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Thêm Khóa Học
            </Button>

            <Modal
                open={isModalVisible}
                onCancel={handleClose}
                footer={null}
                centered
                width={1000}
            >
                <div className="createScheduleForm pb-6">
                    <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
                        Tạo Kỳ Học Mới
                    </h3>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFormSubmit}
                        autoComplete="off"
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    label="Tên Kỳ Học"
                                    name="semesterName"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập tên kỳ học!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Tên kỳ học" />
                                </Form.Item>

                                <Form.Item
                                    label="Ngày Khởi Tạo"
                                    name="startDate"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn ngày khởi tạo!",
                                        },
                                    ]}
                                >
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                    label="Ngày Kết Thúc"
                                    name="endDate"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn ngày kết thúc!",
                                        },
                                    ]}
                                >
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item>

                                <Form.Item
                                    label="Trạng Thái"
                                    name="status"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng chọn trạng thái!",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Chọn trạng thái">
                                        <Select.Option value="active">
                                            Đang hoạt động
                                        </Select.Option>
                                        <Select.Option value="inactive">
                                            Ngừng hoạt động
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Khóa học và Thứ tự học">
                                    {additionalVariants.map(
                                        (variant, index) => (
                                            <Row
                                                key={index}
                                                gutter={16}
                                                style={{ marginBottom: 16 }}
                                            >
                                                <Col span={12}>
                                                    <Select
                                                        value={variant.course}
                                                        onChange={(value) =>
                                                            handleCourseChange(
                                                                value,
                                                                index
                                                            )
                                                        }
                                                        options={courseKeys.map(
                                                            (course) => ({
                                                                label: course,
                                                                value: course,
                                                            })
                                                        )}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Select
                                                        value={variant.order}
                                                        onChange={(value) =>
                                                            handleOrderChange(
                                                                value,
                                                                index
                                                            )
                                                        }
                                                        options={orderOptions.map(
                                                            (order) => ({
                                                                label: order,
                                                                value: order,
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
                        </Row>

                        <div className="flex justify-center items-center mt-4">
                            <Button type="primary" htmlType="submit">
                                Tạo Kỳ Học
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default Testing;
