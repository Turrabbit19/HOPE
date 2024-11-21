import {
    Avatar,
    Button,
    Descriptions,
    Divider,
    Input,
    message,
    Modal,
    Popconfirm,
    Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../../config/axios";
import Loading from "../../../../components/loading";
import { add } from "date-fns";
import {
    DeleteOutlined,
    UserOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    createStudent,
    deleteStudent,
    deleteUser,
    getStudent,
} from "../../../../services/user-service";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

const { Search } = Input;

const StudentManager = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);

    const fileInputRef = useRef(null); // Tạo ref cho input file

    const [textSearch, setTextSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [panigation, setPanigation] = useState({
        current_page: 1,
        per_page: 40,
        total: 12,
    });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reload, setReload] = useState(false);
    const [userDetail, setUserDetail] = useState({});
    const [recordType, setRecordType] = useState(""); // "teacher" hoặc "student" hoặc "classManager"

    const [dataImport, setDataImport] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await instance.get("admin/students");
                let pa = data.pagination;
                // console.log(data.data.data);
                setStudents(data.data);
                setPanigation((pre) => ({
                    ...pre,
                    total: pa.total,
                }));

                // setLoading();
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [reload]);

    useEffect(() => {
        if (dataImport.length > 0) {
            handleAddUser();
        }
    }, [dataImport]);

    async function handleAddUser() {}

    if (loading) {
        return <Loading />;
    }
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: 12,
            width: 70,
        },
        {
            title: "Avatar",
            dataIndex: "avatar",
            key: "avatar",
            width: 80,
            render: (avatar) => (
                <Avatar
                    src={
                        `https://qrrhjldgdidplxjzixkd.supabase.co/storage/v1/object/public/${avatar}` || (
                            <UserOutlined />
                        )
                    }
                    icon={!avatar && <UserOutlined />}
                />
            ),
        },
        {
            title: "Mã Sinh viên",
            dataIndex: "student_code",
            key: "student_code",
            fixed: "left",
            width: 100,
            render: (_, res) => {
                return (
                    <div>
                        {/* <img src="https://media.istockphoto.com/vectors/student-avatar-flat-icon-flat-vector-illustration-symbol-design-vector-id1212812078?k=20&m=1212812078&s=170667a&w=0&h=Pl6TaYY87D2nWwRSWmdtJJ0DKeD5vPowomY9fyeqNOs=" style={{width: 50, height: 50, borderRadius: 100}}/> */}
                        <span>{res.student_code}</span>
                    </div>
                );
            },
        },
        {
            title: "Họ và tên",
            dataIndex: "fullname",
            key: "fullname",
            width: 200,
            fixed: "left",
        },

        {
            title: "Email",
            dataIndex: "email",
            width: 200,
            key: "1",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            width: 150,
            key: "2",
        },
        // {
        //   title: "Ngày sinh",
        //   dataIndex: "dob",
        //   width: 150,
        //   key: "3",
        // },
        // {
        //   title: "Giới tính",
        //   dataIndex: "gender",
        //   key: "4",
        // },
        // {
        //   title: "Dân tộc",
        //   dataIndex: "ethnicity",
        //   key: "5",
        // },
        // {
        //   title: "Địa chỉ",
        //   dataIndex: "address",
        //   key: "6",
        // },
        // {
        //   title: "Chứ vụ",
        //   dataIndex: "role_name",
        //   key: "7",
        // },
        // {
        //   title: "Khóa học",
        //   dataIndex: "course_name",
        //   key: "8",
        //   width: 100
        // },
        {
            title: "Ngành học",
            dataIndex: "major_name",
            key: "8",
            width: 1000,
        },
        // {
        //   title: "Môn học",
        //   dataIndex: "semester_name",
        //   key: "8",
        // },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "8",
            width: 400,
        },
        {
            title: "Action",
            key: "operation",
            fixed: "right",
            width: 170,
            render: (text, record) => (
                <div className="flex flex-row items-center justify-between">
                    <Button
                        type="link"
                        icon={<InfoCircleOutlined />}
                        onClick={() => handleDetailClick(record)}
                    >
                        Chi tiết
                    </Button>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            navigate(
                                `${`/admin/list-users/edit/${record.id}`}`,
                                {
                                    state: {
                                        type: "students",
                                    },
                                }
                            );
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa tài khoản này?"
                        onConfirm={() => handleDelete(record)} // Xóa tài khoản
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="link" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const data = students.map((item, index) => {
        return {
            key: item.id,
            id: item.id,
            stt: index + 1,
            fullname: item.name,
            student_code: item.student_code,
            email: item.email,
            phone: item.phone,
            // dob: item.dob,
            // gender: item.gender ? "Nam" : "Nữ",
            // ethnicity: item.user.ethnicity,
            // address: item.user.address,
            // role: item.user.role.name,
            // semester_name: item.semester.name,
            major_name: item.major_name,
            course_name: item.course_name,
            status: item.status,
            avatar: item.avatar,
        };
    });

    const handleDetailClick = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
        getStudent(record.id).then((res) => {
            setUserDetail(res.data.data);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        // console.log(file);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Make POST request to the server
            const response = await axios.post(
                "http://localhost:8000/api/admin/import-student",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                setReload(true);
                message.success("Import thành công");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file");
        }
    };

    const handleDelete = async (record) => {
        await deleteStudent(record.id);
        setReload(!reload);
        message.success(`Đã xóa tài khoản: ${record.name}`);
    };

    const handleAdd = () => {
        navigate(`/admin/list-users/add`, {
            state: {
                type: "students",
            },
        });
    };

    let dataSearch = data.filter((e) => {
        let fullname = e?.fullname || "";
        let student_code = e.student_code || "";
        if (textSearch === "") {
            return true;
        }

        return (
            fullname.search(textSearch) > -1 ||
            student_code.search(textSearch) > -1
        );
    });

    function handlePickExcel() {
        fileInputRef.current.click();
    }

    const handleExport = () => {
        let dataExport = data.map(({ key, id, ...rest }) => rest);
        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataExport);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "FlowData");

        // Generate a binary string and create a Blob
        const workbookBlob = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([workbookBlob], {
            type: "application/octet-stream",
        });

        // Use FileSaver to save the file
        saveAs(blob, "student.xlsx");
    };

    const downloadExcel = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/admin/export-student",
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Get the file as a blob
            const blob = await response.blob();

            // Save the file
            saveAs(blob, "downloaded_student.xlsx");
        } catch (error) {
            console.error("Failed to download file:", error);
        }
    };

    return (
        <>
            <div>
                <div className="flex justify-between mb-2">
                    <h1>Sinh viên</h1>
                    <div className="flex flex-row items-center">
                        <Button onClick={handleAdd}>Thêm sinh viên</Button>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        <Button
                            onClick={handlePickExcel}
                            className="ml-5"
                            type="primary"
                        >
                            Import
                        </Button>
                        <Button
                            onClick={downloadExcel}
                            className="ml-5"
                            type="default"
                        >
                            Export
                        </Button>
                    </div>
                </div>
                <div className="relative">
                    <Input
                        value={textSearch}
                        allowClear={true}
                        onChange={(e) => {
                            setTextSearch(e.target.value);
                            if (panigation.page !== 1) {
                                setPanigation((pre) => ({
                                    ...pre,
                                    current_page: 1,
                                }));
                            }
                        }}
                        onClear={() => setTextSearch("")}
                        placeholder="Tìm kiếm theo mã hoặc tên sinh viên ...."
                        className="xl:w-[300px] md:w-[180px] max-[767px]:w-[120px]"
                    />
                </div>
            </div>

            <Divider />

            <Table
                columns={columns}
                dataSource={dataSearch.slice(
                    panigation.current_page > 1
                        ? (panigation.current_page - 1) * 40
                        : panigation.current_page - 1,
                    panigation.current_page * 40
                )}
                onChange={(e) => {
                    setPanigation((pre) => ({
                        ...pre,
                        current_page: e.current,
                    }));
                }}
                // scroll={{
                //   x: 0.1,
                // }}
                pagination={{
                    current: panigation.current_page,
                    pageSize: 40,
                    total: panigation.total,
                }}
            />

            {/* Modal hiển thị chi tiết tài khoản */}
            {selectedRecord && (
                <Modal
                    title={`Chi tiết ${
                        recordType === "teacher"
                            ? "Giảng Viên"
                            : recordType === "classManager"
                            ? "Quản Trị Viên"
                            : "Học Viên"
                    }`}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button
                            key="close"
                            onClick={() => setIsModalVisible(false)}
                        >
                            Đóng
                        </Button>,
                    ]}
                    width={800} // Tăng kích thước modal
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        <Avatar
                            size={100}
                            src={
                                `https://qrrhjldgdidplxjzixkd.supabase.co/storage/v1/object/public/${userDetail?.avatar}` || (
                                    <UserOutlined />
                                )
                            }
                            style={{ marginRight: 20 }}
                        />
                        <div>
                            <h3>{userDetail.name}</h3>
                            <p>Email: {userDetail.email}</p>
                            <p>Điện Thoại: {userDetail.phone}</p>
                        </div>
                    </div>
                    <Divider />

                    <Descriptions bordered column={1}>
                        {/* Thông tin cho Quản Trị Viên */}

                        {/* Thông tin cho Học Viên */}

                        <>
                            <Descriptions.Item label="Mã Sinh Viên">
                                {userDetail?.student_code}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngành Học">
                                {userDetail?.major_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Khóa Học">
                                {userDetail?.course_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Học Kỳ Hiện Tại">
                                {userDetail?.current_semester}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng Thái">
                                {userDetail?.status}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phụ Huynh">
                                {userDetail.parent}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày Sinh">
                                {userDetail.dob}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới Tính">
                                {userDetail.gender ? "Nam" : "Nữ"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Dân Tộc">
                                {userDetail.ethnicity}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa Chỉ">
                                {userDetail.address}
                            </Descriptions.Item>
                        </>
                    </Descriptions>
                </Modal>
            )}
        </>
    );
};

export default StudentManager;
