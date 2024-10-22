import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../../../../config/axios";
import Loading from "../../../../components/loading";
import { add } from "date-fns";

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [majors, setMajors] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await instance.get("admin/students");

        // console.log(data.data.data);
        setStudents(data.data.data);

        // setLoading();
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) {
    return <Loading />;
  }
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: 12
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: 200,
      fixed: "left",
    },
    {
      title: "Mã Sinh viên",
      dataIndex: "student_code",
      key: "student_code",
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
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      width: 150,
      key: "3",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "4",
    },
    {
      title: "Dân tộc",
      dataIndex: "ethnicity",
      key: "5",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "6",
    },
    // {
    //   title: "Chứ vụ",
    //   dataIndex: "role_name",
    //   key: "7",
    // },
    {
      title: "Khóa học",
      dataIndex: "course_name",
      key: "8",
    },
    {
      title: "Ngành học",
      dataIndex: "major_name",
      key: "8",
    },
    {
      title: "Môn học",
      dataIndex: "semester_name",
      key: "8",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "8",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 170,
      render: () => (
        <div className="flex gap-1">
          <Button danger>Xóa</Button>
          <Link>
            <Button>Cập nhật</Button>
          </Link>
        </div>
      ),
    },
  ];
  const data = students.map((item, index) => {
    console.log(item);
    return {
      key: item.id,
      id: item.id,
      stt: index + 1,
      fullname: item.user.name,
      student_code: item.student_code,  
      email: item.user.email,
      phone: item.user.phone,
      dob: item.user.dob,
      gender: item.user.gender ? "Nam" : "Nữ",
      ethnicity: item.user.ethnicity,
      address: item.user.address,
      // role: item.user.role.name,
      // semester_name: item.semester.name,
      major_name: item.major.name,
      course_name: item.course.name,
      status: item.status,
    };
  });
  return (
    <>
      <div className="flex justify-between mb-2">
        <h1>Học sinh</h1>
        <Button>Thêm học sinh</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          x: 2000,
        }}
      />
    </>
  );
};

export default StudentManager;
