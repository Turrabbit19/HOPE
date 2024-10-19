import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Modal,
  Descriptions,
  Divider,
  Popconfirm,
  message,
} from "antd";
import {
  DeleteOutlined,
  UserOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useRoutes } from "react-router-dom";
import {
  deleteStudent,
  deleteTeacher,
  deleteUser,
  getUser,
  getTeacher,
  getStudent,
  getListUser,
  getListMajor,
  getListCourse,
} from "../../../../services/user-service";
// Dữ liệu mẫu

// Hàm chuyển đổi trạng thái từ số sang chuỗi cho Học viên
const getStudentStatus = (status) => {
  switch (status) {
    case 0:
      return "Đang học";
    case 1:
      return "Bảo lưu";
    case 2:
      return "Hoàn thành";
    default:
      return "Không xác định";
  }
};

// Hàm chuyển đổi trạng thái từ số sang chuỗi cho Giảng viên
const getTeacherStatus = (status) => {
  switch (status) {
    case 0:
      return "Đang công tác";
    case 1:
      return "Tạm dừng";
    case 2:
      return "Kết thúc";
    default:
      return "Không xác định";
  }
};

const ListUser = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reload, setReload] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [recordType, setRecordType] = useState(""); // "teacher" hoặc "student" hoặc "classManager"
  const [accounts, setAccounts] = useState({
    classManager: [],
    teachers: [],
    students: [],
  });

  console.log(accounts);
  
 
  
  const [studentPagination, setStudentPagination] = useState({
    current_page: 1,
    page_size: 5,
    total: 10
  })

  const navigate = useNavigate();

  useEffect(() => {
    getListUser().then((res) => {
      console.log(res);
      
      setAccounts({
        classManager: [
          ...res.data["Quản trị viên"].data,
          ...res.data["Cán bộ"].data,
        ],
        teachers: res.data["Giảng viên"].data,
        students: res.data["Sinh viên"].data,
      });
      setStudentPagination(res.data["Sinh viên"].pagination)
    });
  }, []);

  // Hàm hiển thị thông tin chi tiết của tài khoản
  const handleDetailClick = (record, type) => {
    setSelectedRecord(record);
    setRecordType(type);
    setIsModalVisible(true);
    getUser(record.id).then((res) => {
      setUserDetail(res.data.data);
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
    setRecordType("");
  };

  const handleDelete = async (record) => {
    await deleteUser(record.id);
    setReload(!reload);
    message.success(`Đã xóa tài khoản: ${record.name}`);
  };

  // Các cột cho bảng hiển thị (chỉ bao gồm 4 cột: Avatar, Họ Tên, Điện Thoại, Email)
  const getColumns = (type = "") => {
    // Cột chung
    const commonColumns = [
      {
        title: "Avatar",
        dataIndex: "avatar",
        key: "avatar",
        render: (avatar) => (
          <Avatar 
          src={`https://qrrhjldgdidplxjzixkd.supabase.co/storage/v1/object/public/${avatar}` || <UserOutlined />}
          icon={!avatar && <UserOutlined />} />
        ),
      },
      {
        title: "Họ Tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Điện Thoại",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
    ];

    // Cột hành động
    const actionColumn = {
      title: "Hành Động",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() =>
              handleDetailClick(
                record,
                type === "teachers"
                  ? "teacher"
                  : type === "classManager"
                  ? "classManager"
                  : "student"
              )
            }
          >
            Chi tiết
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              navigate("edit/" + record.id);
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
        </>
      ),
    };

    return [...commonColumns, actionColumn];
  };



  return (
    <div>
      <div className="col-12 pb-8">
        <div className="col-12 justify-between flex">
          <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
            Quản Lý Tài Khoản
            <button>
              <img src="/assets/svg/reload.svg" alt="reload..." />
            </button>
          </h1>
        </div>

        <div className="col-12 flex justify-between items-center mt-6">
          <Link to={`add`} className="btn btn--outline text-[#7017E2]">
            <PlusOutlined />
            Tạo mới
          </Link>
        </div>
      </div>

      {/* Tài Khoản Quản Lý Lớp */}
      <Divider orientation="left">#1. Quản trị Viên</Divider>
      <Table
        dataSource={accounts.classManager}
        columns={getColumns("classManager")}
        rowKey="id"
        pagination={false}
      />

      {/* Tài Khoản Giảng Viên */}
      <Divider orientation="left">#2. Giảng Viên</Divider>
      <Table
        dataSource={accounts.teachers}
        columns={getColumns("teachers")}
        rowKey="id"
        pagination={true}
      />

      {/* Tài Khoản Học Viên */}
      <Divider orientation="left">#3. Sinh Viên</Divider>
      <Table
        dataSource={accounts.students.slice(studentPagination.current_page - 1, 5 * studentPagination.current_page)}
        columns={getColumns("students")}
        rowKey="id"
        onChange={(e) => {
          setStudentPagination((pre) => ({
            ...pre,
            current_page: e.current
          }))
          
        }}
        pagination={{
          current: studentPagination.current_page,
          pageSize: 5,
          total: studentPagination.total
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
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
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
              src={`https://qrrhjldgdidplxjzixkd.supabase.co/storage/v1/object/public/${userDetail?.avatar}` || <UserOutlined />}
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
            {recordType === "classManager" && (
              <>
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
            )}

            {/* Thông tin cho Giảng Viên */}
            {recordType === "teacher" && (
              <>
                <Descriptions.Item label="Mã Giảng Viên">
                  {userDetail?.teacher?.teacher_code ?? ''}
                </Descriptions.Item>
                <Descriptions.Item label="Ngành Học">
                  {userDetail.teacher?.major_name}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">
                  {(userDetail.teacher?.status)}
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
            )}

            {/* Thông tin cho Học Viên */}
            {recordType === "student" && (
              <>
                <Descriptions.Item label="Mã Sinh Viên">
                  {userDetail?.student?.student_code}
                </Descriptions.Item>
                <Descriptions.Item label="Ngành Học">
                  {userDetail.student?.major_name}
                </Descriptions.Item>
                <Descriptions.Item label="Khóa Học">
                  {userDetail.student?.course_name}
                </Descriptions.Item>
                <Descriptions.Item label="Học Kỳ Hiện Tại">
                  {userDetail.student?.current_semester}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái">
                  {(userDetail.student?.status)}
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
            )}
          </Descriptions>
        </Modal>
      )}
    </div>
  );
};

export default ListUser;
