import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  TreeSelect,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import instance from "../../../../../config/axios";
import Loading from "../../../../../components/loading";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [ethnicity, setEthnicity] = useState([]);
  const [courses, setCourses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [counts, setCounts] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  //   const [ethnicity, setEthnicity] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [courses, majors, semesters, counts] = await Promise.all([
          instance.get("admin/courses"),
          instance.get("admin/majors"),
          instance.get("admin/semesters"),
          instance.get("admin/user-count"),
        ]);
        // console.log(majors.data.majors);
        setCourses(courses.data.data);
        setMajors(majors.data.majors);
        setSemesters(semesters.data.data);
        setCounts(counts.data.user_count);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const generateStudentEmail = (fullName) => {
    const nameParts = fullName.split(" ");
    const lastName = nameParts[nameParts.length - 1];
    const code = generateStudentCode();
    const normalizedLastName = lastName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const initials = nameParts
      .slice(0, -1)
      .map((part) => part[0].toLowerCase())
      .join("");
    const currentYear = new Date().getFullYear();
    currentYear.toString().slice(-2);
    const parts = year.split("/");
    const studentCode = `${initials}${normalizedLastName}${currentYear}${parts[1]}${parts[2]}${code}@hope.edu.vn`;
    return studentCode;
  };

  const generateStudentCode = () => {
    return `SV${counts}`;
  };
  const onHandleSubmit = async (values) => {
    setLoading(true);
    const date = new Date(values.dob);
    const formattedDate = format(date, "yyyy/MM/dd");

    const users = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      dob: formattedDate,
      gender: values.gender,
      ethnicity: values.ethnicity,
      address: values.address,
      password: generateStudentEmail(values.name),
      role_id: 2,
      avatar: values.avatar,
    };

    try {
      const response = await instance.post("admin/users", users);
      console.log(response.data.data.id);
      const students = {
        user_id: response.data.data.id,
        course_id: values.course_id,
        major_id: values.major_id,
        semester_id: values.semester_id,
        student_code: generateStudentCode(),
        status: 1,
      };
      await instance.post("admin/students", students);
      message.success("Thêm sinh viên thành công", 2);
      setTimeout(() => {
        navigate("");
      }, 2000);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={onHandleSubmit}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập đầy đủ họ và tên ",
            },
          ]}
          label="Họ và tên"
        >
          <Input placeholder="Họ và tên" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email ",
            },
          ]}
          label="Email"
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Số điện thoại ",
            },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>
        <Form.Item
          name="ethnicity"
          label="Dân tộc"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Dân tộc ",
            },
          ]}
        >
          <Input placeholder="Dân tộc" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập địa chỉ ",
            },
          ]}
        >
          <Input placeholder="Địa chỉ" />
        </Form.Item>
        <Form.Item label="Giới tính" name="gender">
          <Select placeholder="giới tính">
            <Option value="1">Nam</Option>
            <Option value="0">Nữ</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Ngày sinh" name="dob">
          <DatePicker needConfirm />
        </Form.Item>

        <Form.Item
          name="course_id"
          label="Khóa học"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khóa học",
            },
          ]}
        >
          <Select
            showSearch
            style={{
              width: 250,
            }}
            placeholder="Search to Select"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          >
            {courses.map((item, index) => (
              <Option key={index} value={item.id} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* semester */}
        <Form.Item
          name="semester_id"
          label="Kỳ học"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khóa học",
            },
          ]}
        >
          <Select
            showSearch
            style={{
              width: 250,
            }}
            placeholder="Search to Select"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          >
            {semesters.map((item, index) => (
              <Option key={index} value={item.id} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* major */}
        <Form.Item
          name="major_id"
          label="Ngành học"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khóa học",
            },
          ]}
        >
          <Select
            showSearch
            style={{
              width: 250,
            }}
            placeholder="Search to Select"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          >
            {majors.map((item, index) => (
              <Option key={index} value={item.id} label={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Avatar"
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action="" listType="picture-card">
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Button htmlType="submit" loading={loading}>
          Thêm sinh viên
        </Button>
      </Form>
    </>
  );
};

export default AddStudent;
