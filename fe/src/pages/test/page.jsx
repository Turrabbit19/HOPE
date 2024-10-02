import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";

const Testing = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        // Xử lý logic khi người dùng nhấn "OK"
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        // Đóng popup khi người dùng nhấn "Cancel"
        setIsModalVisible(false);
    };

    const onFinish = (values) => {
        console.log("New Item Data:", values);
        // Thêm logic xử lý thêm mới ở đây
        setIsModalVisible(false); // Đóng popup sau khi hoàn thành form
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Tạo mới
            </Button>
            <Modal
                title="Thêm Mới Ngành Học"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Tên ngành học"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên ngành học",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên ngành học" />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập trạng thái",
                            },
                        ]}
                    >
                        <Input placeholder="Kích hoạt/Không kích hoạt" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập mô tả ngành học"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Mã ngành"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mã ngành",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập mã ngành" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm mới
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Testing;
