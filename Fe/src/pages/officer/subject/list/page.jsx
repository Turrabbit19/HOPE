// src/pages/officer/ListSubject.jsx

import {
    Pagination,
    Row,
    Form,
    Input,
    Button,
    Modal,
    InputNumber,
    Select,
    Popconfirm,
    Col,
    message,
    notification,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import React, {
    useEffect,
    useState,
    useContext,
    useCallback,
    useMemo,
} from "react";
import { AuthContext } from "../../../../context/authContext";
import instance from "../../../../config/axios";
import Loading from "../../../../components/loading/page";

const { Option } = Select;

const ListSubject = () => {
    const { logout } = useContext(AuthContext);
    const [searchValue, setSearchValue] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);

    const [deletedSubjects, setDeletedSubjects] = useState([]);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [formAddEdit] = Form.useForm();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formFilter] = Form.useForm();

    const [majors, setMajors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [initialValues, setInitialValues] = useState();
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 9,
        total: 0,
    });

    // Hàm chuyển đổi status thành boolean
    const convertStatusToBoolean = (status) => {
        console.log("Converting status:", status);
        if (typeof status === "string") {
            const normalizedStatus = status.trim().toLowerCase();
            const result =
                normalizedStatus === "đang hoạt động" ||
                normalizedStatus === "active" ||
                normalizedStatus === "1" ||
                normalizedStatus === "true"; // Thêm các giá trị khác nếu cần
            console.log("Converted to boolean:", result);
            return result;
        } else if (typeof status === "boolean") {
            console.log("Status is already boolean:", status);
            return status;
        } else if (typeof status === "number") {
            const result = status === 1;
            console.log("Converted number status to boolean:", result);
            return result;
        }
        console.log("Default status:", false);
        return false; // Mặc định là false nếu không rõ
    };

    // Logic hiển thị các môn học: nếu có filteredCourses, sử dụng filteredCourses
    const displayCourses = useMemo(() => {
        let courses = subjects;

        if (filteredCourses.length > 0) {
            courses = filteredCourses;
        }

        if (searchValue) {
            courses = courses.filter((subject) =>
                subject.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        console.log("Display Courses:", courses);
        return courses;
    }, [subjects, filteredCourses, searchValue]);

    // Hàm fetchData để lấy dữ liệu môn học và ngành học
    const fetchData = useCallback(
        async (page = 1, perPage = 9) => {
            try {
                setLoading(true);
                // Fetch subjects và majors
                const [subjectsResponse, majorsResponse] = await Promise.all([
                    instance.get("officer/subjects", {
                        params: { per_page: perPage, page: page },
                    }),
                    instance.get("officer/majors"),
                ]);

                // Log dữ liệu nhận được từ API
                console.log("Subjects Response:", subjectsResponse.data.data);
                console.log("Majors Response:", majorsResponse.data.data);

                // Chuyển đổi majors
                const fetchedMajors = majorsResponse.data.data.map((major) => ({
                    ...major,
                    id: String(major.id), // Đảm bảo ID là string
                }));
                setMajors(fetchedMajors);

                // Lấy tất cả các major IDs
                const allMajorIds = fetchedMajors.map((major) => major.id);

                // Fetch subjects with majors using 'filterSubjectsByMajor'
                const filterResponse = await instance.get(
                    "officer/filter/subjects",
                    {
                        params: { majors: allMajorIds }, // Gửi majors dưới dạng mảng
                    }
                );

                const subjectsByMajor = filterResponse.data; // Dữ liệu trả về từ API

                // Log dữ liệu đã lọc từ API
                console.log(
                    "Filter Subjects By Major Response:",
                    subjectsByMajor
                );

                // Tạo bản đồ từ subjectId đến danh sách majors
                const subjectToMajorsMap = {};

                for (const [majorName, majorData] of Object.entries(
                    subjectsByMajor
                )) {
                    const majorId = String(majorData.id);
                    const subjectsList = majorData.subjects;

                    subjectsList.forEach((subject) => {
                        const subjectId = String(subject.id);
                        if (!subjectToMajorsMap[subjectId]) {
                            subjectToMajorsMap[subjectId] = [];
                        }
                        subjectToMajorsMap[subjectId].push({
                            id: majorId,
                            name: majorName,
                        });
                    });
                }

                // Xử lý subjects để bao gồm majors và status
                const subjectsWithMajors = subjectsResponse.data.data.map(
                    (subject) => ({
                        ...subject,
                        status: convertStatusToBoolean(subject.status), // Chuyển đổi status
                        majors: subjectToMajorsMap[String(subject.id)] || [],
                    })
                );

                // Log dữ liệu đã xử lý
                console.log(
                    "Processed Subjects with Majors:",
                    subjectsWithMajors
                );

                setSubjects(subjectsWithMajors);
                setPagination({
                    current: subjectsResponse.data.pagination.current_page,
                    pageSize: subjectsResponse.data.pagination.per_page,
                    total: subjectsResponse.data.pagination.total,
                });
            } catch (error) {
                console.log(error.message);
                if (error.response && error.response.status === 401) {
                    message.error(
                        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
                    );
                    logout();
                } else if (error.response && error.response.status === 403) {
                    message.error(
                        "Bạn không có quyền truy cập vào tài nguyên này."
                    );
                } else {
                    message.error("Có lỗi xảy ra khi lấy dữ liệu.");
                }
            } finally {
                setLoading(false);
            }
        },
        [logout]
    );

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [fetchData, update, pagination.current, pagination.pageSize]);

    const handlePageChange = (page) => {
        fetchData(page, pagination.pageSize);
    };

    const onHandleDelete = async (id) => {
        try {
            await instance.delete(`officer/subjects/${id}`);

            // Tìm môn học đã xóa trong subjects
            const deletedSubject = subjects.find((item) => item.id === id);

            if (deletedSubject) {
                // Thêm môn học đã xóa vào deletedSubjects
                setDeletedSubjects([...deletedSubjects, deletedSubject]);

                // Loại bỏ môn học đã xóa khỏi subjects
                setSubjects(subjects.filter((item) => item.id !== id));

                message.success("Xóa môn học thành công!");

                // Hiển thị notification với tùy chọn hoàn tác
                notification.open({
                    message: "Môn học đã bị xóa",
                    description: `${deletedSubject.name} đã được xóa.`,
                    btn: (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => undoSubject(id)}
                        >
                            Hoàn tác
                        </Button>
                    ),
                    duration: 5, // Thời gian trước khi notification tự động đóng
                });
            } else {
                message.error("Không tìm thấy môn học để xóa.");
            }
        } catch (error) {
            console.error("Lỗi khi xóa môn học:", error);
            if (error.response && error.response.status === 403) {
                message.error("Bạn không có quyền xóa môn học này.");
            } else if (error.response && error.response.data) {
                message.error(
                    error.response.data.message ||
                        "Có lỗi xảy ra, vui lòng thử lại!"
                );
            } else {
                message.error("Lỗi kết nối, vui lòng kiểm tra lại!");
            }
        }
    };

    const undoSubject = async (id) => {
        try {
            // Gọi API để khôi phục môn học
            await instance.post(`officer/subject/${id}/restore`);

            // Gọi lại fetchData để cập nhật danh sách môn học
            await fetchData(pagination.current, pagination.pageSize);

            // Loại bỏ môn học khỏi deletedSubjects
            setDeletedSubjects(
                deletedSubjects.filter((item) => item.id !== id)
            );

            message.success("Khôi phục môn học thành công");
        } catch (error) {
            console.error("Lỗi khi khôi phục môn học:", error);
            message.error("Không thể khôi phục môn học. Vui lòng thử lại.");
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);
    };

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        setUpdate(false);
        formAddEdit.resetFields();
    };

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            const payload = {
                code: values.code,
                name: values.name,
                description: values.description,
                credit: values.credit,
                status: values.status,
                order: values.semester,
                majors: values.majors.map((id) => ({ id: String(id) })), // Chuyển ID thành string
            };
            console.log("Payload gửi lên:", payload);
            const response = await instance.post("officer/subjects", payload);
            const newSubject = response.data.data;

            // Log dữ liệu nhận được sau khi thêm mới
            console.log("New Subject:", newSubject);

            message.success("Thêm môn học mới thành công!");
            setIsPopupVisible(false);
            formAddEdit.resetFields();

            // Gọi lại fetchData để cập nhật danh sách môn học
            await fetchData(pagination.current, pagination.pageSize);

            // Xóa bộ lọc để displayCourses lấy từ subjects
            setFilteredCourses([]);
        } catch (error) {
            console.error("Lỗi khi thêm môn học:", error.response);
            if (error.response && error.response.status === 403) {
                message.error("Bạn không có quyền thêm môn học này.");
            } else if (error.response && error.response.data) {
                message.error(
                    error.response.data.message ||
                        "Có lỗi xảy ra, vui lòng thử lại!"
                );
            } else {
                message.error("Lỗi kết nối, vui lòng kiểm tra lại!");
            }
        } finally {
            setLoading(false);
        }
    };

    const getSubjectById = async (subjectId) => {
        const response = await instance.get(`officer/subjects/${subjectId}`);
        return response.data.data;
    };

    const openEditModal = async (subject) => {
        setIsPopupVisible(true);
        setUpdate(true);
        try {
            const subjectData = await getSubjectById(subject.id);
            console.log("Subject Data for Editing:", subjectData);
            formAddEdit.setFieldsValue({
                code: subjectData.code,
                name: subjectData.name,
                description: subjectData.description,
                credit: subjectData.credit,
                status: convertStatusToBoolean(subjectData.status), // Chuyển đổi status
                semester: subjectData.order,
                majors: subjectData.majors.map((m) => String(m.id)),
            });
            setInitialValues(subject.id);
        } catch (error) {
            console.log(error.message);
            if (error.response && error.response.status === 403) {
                message.error("Bạn không có quyền chỉnh sửa môn học này.");
            } else {
                message.error("Không thể lấy thông tin môn học để chỉnh sửa.");
            }
        }
    };

    const onHandleUpdate = async (values) => {
        try {
            setLoading(true);
            const payload = {
                code: values.code,
                name: values.name,
                description: values.description,
                credit: values.credit,
                status: values.status,
                order: values.semester,
                majors: values.majors.map((id) => ({ id: String(id) })), // Chuyển ID thành string
            };
            console.log("Payload cập nhật:", payload);
            const response = await instance.put(
                `officer/subjects/${initialValues}`,
                payload
            );
            const updatedSubject = response.data.data;

            // Log dữ liệu nhận được sau khi cập nhật
            console.log("Updated Subject:", updatedSubject);

            message.success("Cập nhật môn học thành công");
            setIsPopupVisible(false);
            formAddEdit.resetFields();

            // Gọi lại fetchData để cập nhật danh sách môn học
            await fetchData(pagination.current, pagination.pageSize);

            // Xóa bộ lọc để displayCourses lấy từ subjects
            setFilteredCourses([]);
        } catch (error) {
            console.error("Lỗi khi cập nhật môn học:", error.response);
            if (error.response && error.response.status === 403) {
                message.error("Bạn không có quyền cập nhật môn học này.");
            } else if (error.response && error.response.data) {
                message.error(
                    error.response.data.message ||
                        "Có lỗi xảy ra, vui lòng thử lại!"
                );
            } else {
                message.error("Lỗi kết nối, vui lòng kiểm tra lại!");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleShowModalFilter = () => {
        setIsModalVisible(true);
    };

    const handleOkFilter = async () => {
        try {
            // Lấy giá trị từ form lọc
            const values = await formFilter.validateFields();
            const selectedMajorIds = values.majors.map((id) => String(id)); // Đảm bảo là string

            const response = await instance.get("officer/filter/subjects", {
                params: { majors: selectedMajorIds }, // Gửi majors dưới dạng mảng
            });

            const data = response.data;

            // Log dữ liệu nhận được từ API
            console.log("Filter Subjects By Major Response:", data);

            // Tạo bản đồ từ subjectId đến danh sách majors
            const subjectMap = {};

            for (const [majorName, majorData] of Object.entries(data)) {
                const majorId = String(majorData.id);
                const subjectsList = majorData.subjects;

                subjectsList.forEach((subject) => {
                    const subjectId = String(subject.id);
                    if (subjectMap[subjectId]) {
                        // thêm id ngành học vào mảng majors
                        subjectMap[subjectId].majors.push({
                            id: majorId,
                            name: majorName,
                        });
                    } else {
                        // tạo mới entry với mảng majors chứa id ngành học hiện tại và xử lý status
                        subjectMap[subjectId] = {
                            ...subject,
                            majors: [{ id: majorId, name: majorName }],
                            status: convertStatusToBoolean(subject.status), // Xử lý status là boolean
                        };
                    }
                });
            }

            // Chuyển đổi bản đồ thành mảng
            let filteredSubjects = Object.values(subjectMap);
            console.log("Filtered Subjects:", filteredSubjects); // Log dữ liệu đã lọc

            // Kiểm tra các giá trị status sau khi chuyển đổi
            filteredSubjects.forEach((subject) => {
                console.log(
                    `Subject ID: ${subject.id}, Status: ${subject.status}`
                );
            });

            // Cập nhật state với danh sách môn học đã lọc có thông tin ngành học
            setFilteredCourses(filteredSubjects);
            setIsModalVisible(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách môn học đã lọc:", error);
            message.error("Có lỗi xảy ra khi lọc môn học.");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        formFilter.resetFields();
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div className="listCourse p-6 bg-gray-100 min-h-screen">
                <div className="container mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h1 className="flex items-center text-purple-600 text-xl font-semibold">
                                Danh Sách Môn Học
                                <button
                                    className="ml-2"
                                    onClick={() =>
                                        fetchData(
                                            pagination.current,
                                            pagination.pageSize
                                        )
                                    }
                                >
                                    <img
                                        src="/assets/svg/reload.svg"
                                        alt="reload..."
                                        className="w-6 h-6"
                                    />
                                </button>
                            </h1>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                            <Input.Search
                                placeholder="Tìm kiếm môn học..."
                                onChange={handleSearch}
                                style={{ width: 300 }}
                                allowClear
                                className="rounded-md"
                            />
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={togglePopup}
                                    className="flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition"
                                >
                                    <PlusOutlined className="mr-2" />
                                    Thêm Môn Học
                                </button>
                                <Button
                                    type="primary"
                                    onClick={handleShowModalFilter}
                                    className="rounded-md"
                                >
                                    Lọc Môn Học
                                </Button>
                                <Button
                                    onClick={() => {
                                        formFilter.resetFields();
                                        setFilteredCourses([]);
                                        message.info("Đã xóa bộ lọc");
                                    }}
                                    className="rounded-md"
                                >
                                    Xóa Bộ Lọc
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Số Lượng Môn Học Đang Hiển Thị */}
                    <div className="mb-4">
                        <span className="text-gray-700 font-semibold">
                            Số lượng môn học: {displayCourses.length}
                        </span>
                    </div>

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {displayCourses.length > 0 ? (
                            displayCourses.map((subject) => (
                                <div
                                    key={subject.id}
                                    className="bg-white shadow-md rounded-lg p-6"
                                >
                                    {/* Subject Header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="flex items-center text-blue-600 font-bold text-lg">
                                            <img
                                                src="/assets/svg/share.svg"
                                                alt=""
                                                className="w-5 h-5 mr-2"
                                            />
                                            Môn Học:{" "}
                                            <span className="ml-2">
                                                {subject.name}
                                            </span>
                                        </h2>
                                        <button>
                                            <img
                                                src="/assets/svg/more_detail.svg"
                                                alt=""
                                                className="w-5 h-5"
                                            />
                                        </button>
                                    </div>

                                    {/* Subject Body */}
                                    <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <span className="text-gray-500">
                                                Trạng thái:
                                            </span>
                                            <div
                                                className={`flex items-center ml-2 px-2 py-1 rounded-full text-xs ${
                                                    subject.status
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-yellow-100 text-yellow-600"
                                                }`}
                                            >
                                                <img
                                                    src="/assets/svg/status.svg"
                                                    alt=""
                                                    className="w-3 h-3 mr-1"
                                                />
                                                {subject.status
                                                    ? "Đang hoạt động"
                                                    : "Tạm dừng"}
                                            </div>
                                        </div>

                                        <p className="text-gray-500">
                                            <span className="font-semibold">
                                                Code:
                                            </span>{" "}
                                            <span className="text-black ml-2">
                                                {subject.code || "Không có"}
                                            </span>
                                        </p>
                                        <p className="text-gray-500">
                                            <span className="font-semibold">
                                                Tín chỉ:
                                            </span>{" "}
                                            <span className="text-black ml-2">
                                                {subject.credit || "Không có"}
                                            </span>
                                        </p>
                                        <p className="text-gray-500">
                                            <span className="font-semibold">
                                                Kỳ Học:
                                            </span>{" "}
                                            <span className="text-black ml-2">
                                                {subject.order || "Không có"}
                                            </span>
                                        </p>
                                        <p className="flex text-gray-500 mt-2">
                                            <span className="flex-shrink-0 font-semibold">
                                                Mô tả:
                                            </span>{" "}
                                            <span className="text-black ml-2 line-clamp-2">
                                                {subject.description ||
                                                    "Không có"}
                                            </span>
                                        </p>

                                        {/* Hiển Thị Ngành Học */}
                                        <p className="flex text-gray-500 mt-2">
                                            <span className="flex-shrink-0 font-semibold">
                                                Ngành Học:
                                            </span>{" "}
                                            <span className="text-black ml-2">
                                                {subject.majors &&
                                                subject.majors.length > 0
                                                    ? subject.majors
                                                          .map(
                                                              (major) =>
                                                                  major.name
                                                          )
                                                          .join(", ")
                                                    : "Không xác định"}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Divider Line */}
                                    <hr className="my-4 border-gray-300" />

                                    {/* Action Buttons */}
                                    <div className="flex justify-around text-center">
                                        <button className="flex items-center text-blue-600 font-semibold hover:text-blue-800">
                                            <img
                                                src="/assets/svg/eye.svg"
                                                alt=""
                                                className="w-4 h-4 mr-1"
                                            />
                                            Chi Tiết
                                        </button>

                                        <Popconfirm
                                            title="Xóa môn học"
                                            description={`Bạn có chắc chắn muốn xóa môn học ${
                                                subject.name || "một môn học"
                                            } không?`}
                                            onConfirm={() =>
                                                onHandleDelete(subject.id)
                                            }
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <button className="flex items-center text-red-600 font-semibold hover:text-red-800">
                                                <img
                                                    src="/assets/svg/remove.svg"
                                                    alt=""
                                                    className="w-4 h-4 mr-1"
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </Popconfirm>

                                        <button
                                            className="flex items-center text-blue-600 font-semibold hover:text-blue-800"
                                            onClick={() =>
                                                openEditModal(subject)
                                            }
                                        >
                                            <EditOutlined className="mr-1" />
                                            Sửa Thông Tin
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center">
                                <p className="text-red-500 font-bold text-lg">
                                    Không tìm thấy môn học
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        <Pagination
                            current={pagination.current}
                            total={pagination.total}
                            pageSize={pagination.pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>

                    {/* Add/Edit Popup Modal Form */}
                    <Modal
                        open={isPopupVisible}
                        onCancel={togglePopup}
                        footer={null}
                        centered
                        width={800}
                        className="rounded-lg"
                    >
                        <div className="createScheduleForm pb-6">
                            <h3 className="text-purple-600 text-2xl font-semibold mb-4">
                                {update
                                    ? "Cập Nhật Môn Học"
                                    : "Tạo Môn Học Mới"}
                            </h3>

                            <Form
                                form={formAddEdit}
                                layout="vertical"
                                onFinish={
                                    update ? onHandleUpdate : handleFormSubmit
                                }
                                autoComplete="off"
                            >
                                <Row gutter={24}>
                                    <Col span={16}>
                                        {/* Mã Môn Học */}
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
                                            <Input
                                                placeholder="Mã môn học"
                                                className="rounded-md"
                                            />
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
                                            <Input
                                                placeholder="Tên"
                                                className="rounded-md"
                                            />
                                        </Form.Item>

                                        {/* Mô tả môn học */}
                                        <Form.Item
                                            label="Mô tả"
                                            name="description"
                                            rules={[]}
                                        >
                                            <Input.TextArea
                                                rows={3}
                                                placeholder="Mô tả"
                                                className="rounded-md"
                                            />
                                        </Form.Item>

                                        {/* Tín chỉ và Trạng thái */}
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Tín chỉ"
                                                    name="credit"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập tín chỉ!",
                                                        },
                                                        {
                                                            type: "number",
                                                            min: 1,
                                                            max: 19,
                                                            message:
                                                                "Tín chỉ phải từ 1 đến 19.",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Tín chỉ"
                                                        min={1}
                                                        max={19}
                                                        className="w-full rounded-md"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item
                                                    label="Trạng thái"
                                                    name="status"
                                                    initialValue={true}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng chọn trạng thái!",
                                                        },
                                                    ]}
                                                >
                                                    <Select className="rounded-md">
                                                        <Option value={true}>
                                                            Đang hoạt động
                                                        </Option>
                                                        <Option value={false}>
                                                            Tạm dừng
                                                        </Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        {/* Kỳ Học */}
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Kỳ Học"
                                                    name="semester"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập kỳ học!",
                                                        },
                                                        {
                                                            type: "number",
                                                            min: 1,
                                                            max: 9,
                                                            message:
                                                                "Kỳ học phải từ 1 đến 9.",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Kỳ học"
                                                        min={1}
                                                        max={9}
                                                        className="w-full rounded-md"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            label="Ngành Học"
                                            name="majors"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Vui lòng chọn ngành học!",
                                                },
                                            ]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Chọn ngành học"
                                                options={majors.map(
                                                    (major) => ({
                                                        label: major.name,
                                                        value: major.id,
                                                    })
                                                )}
                                                className="rounded-md"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Submit Button */}
                                <div className="flex justify-center items-center mt-4">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="px-6 py-2 rounded-md"
                                    >
                                        {!update
                                            ? "Tạo môn học"
                                            : "Cập nhật môn học"}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Modal>

                    {/* Filter Modal */}
                    <Modal
                        title="Lọc Môn Học"
                        visible={isModalVisible}
                        onOk={handleOkFilter}
                        onCancel={handleCancel}
                        centered
                        width={600}
                        className="rounded-lg"
                    >
                        <Form form={formFilter} layout="vertical">
                            <Form.Item
                                label="Chọn Ngành Học"
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
                                    className="rounded-md"
                                >
                                    {majors.map((major) => (
                                        <Option key={major.id} value={major.id}>
                                            {major.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default ListSubject;
