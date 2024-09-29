import {
    Button,
    Form,
    Input,
    message,
    Card,
    Col,
    Pagination,
    Row,
    Drawer,
    Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../../config/axios";

const MajorManagement = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const majorsPerPage = 9;

    useEffect(() => {
        (async () => {
            const { data } = await instance.get("admin/majors");
            console.log(data.majors);
            setData(data.majors || []);
        })();
    }, []);

    const onHandleSubmit = async (values) => {
        console.log(values);
        if (data.includes(values.name)) {
            message.error("Ngành học này đã có, vui lòng đặt tên khác");
            return;
        }

        try {
            setLoading(true);
            await instance.post("admin/majors", values);
            message.success("Thêm ngành học thành công");
            form.resetFields();
            setData([...data, values]);
        } catch (error) {
            message.error("Thêm ngành học thất bại");
        } finally {
            setLoading(false);
        }
    };

    const onHandleDelete = async (name, status) => {
        // console.log(name);
        try {
            setLoading(true);
            await instance.update(`admin/majors/${name}`, status);
            message.success("Xóa ngành học thành công");
            setOpen(false);
            await fetchMajors();
        } catch (error) {
            message.error("Xóa ngành học thất bại");
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastMajor = currentPage * majorsPerPage;
    const indexOfFirstMajor = indexOfLastMajor - majorsPerPage;
    const currentMajors = data.slice(indexOfFirstMajor, indexOfLastMajor);
    const [selectedMajor, setSelectedMajor] = useState("");

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const [open, setOpen] = useState(false);
    const showDrawer = (item) => {
        setOpen(true);
        setSelectedMajor(item);
    };

    const onClose = () => {
        setOpen(false);
        setSelectedMajor("");
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-black-600 mb-5">
                Quản lý ngành học
            </h1>

            <Form
                form={form}
                onFinish={onHandleSubmit}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                layout="horizontal"
                style={{ maxWidth: 600, marginBottom: "20px" }}
                className=""
                initialValues={{ status: 1 }}
            >
                <Form.Item
                    label="Tên ngành học"
                    name="name"
                    className=""
                    rules={[
                        {
                            required: true,
                            message: "Ngành học bắt buộc phải nhập",
                        },
                        {
                            min: 6,
                            message: "Ngành học phải có 6 ký tự trở lên",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item className="hidden" name="status">
                    <Input value={1} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm
                    </Button>
                </Form.Item>
            </Form>

            <Row gutter={16}>
                {currentMajors.map((item, index) =>
                    item.status ? (
                        <Col
                            span={8}
                            key={index}
                            style={{ marginTop: index >= 3 ? 16 : 0 }}
                        >
                            <Card
                                className="border-black border-[1px] flex flex-col"
                                title={item.name}
                                bordered={true}
                            >
                                <Button
                                    type="primary"
                                    onClick={() => showDrawer(item.name)}
                                >
                                    Quản lý ngành học
                                </Button>
                            </Card>
                        </Col>
                    ) : (
                        ""
                    )
                )}
            </Row>
            <Pagination
                className="mt-4"
                align="center"
                defaultCurrent={1}
                total={data.length}
                pageSize={majorsPerPage}
                onChange={handlePageChange}
            />
            <Drawer
                title={selectedMajor ? `Quản lý ngành: ${selectedMajor}` : ""}
                width={500}
                onClose={onClose}
                open={open}
                extra={<Space></Space>}
            >
                <Button
                    type="dashed"
                    onClick={() => onHandleDelete(selectedMajor, 0)}
                    loading={loading}
                >
                    Xóa
                </Button>
                <Button type="primary">Cập nhật</Button>
            </Drawer>
        </>
    );
};

export default MajorManagement;
