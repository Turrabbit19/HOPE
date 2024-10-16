import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  Upload,
  Row,
  Col,
  message,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getListCourse,
  getListMajor,
  createStudent,
  createUser,
  createTeacher,
} from "../../../../services/user-service";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;
import moment from "moment";
import {
  deleteStudent,
  deleteTeacher,
  deleteUser,
  getUser,
  getTeacher,
  getStudent,
  getListUser,
  editUser,
} from "../../../../services/user-service";

const UserEdit = () => {
  const [role, setRole] = useState(""); // Không có vai trò nào chọn ban đầu
  const [roleNumber, setRoleNumber] = useState(0); // Không có vai trò nào chọn ban đầu
  const [listMajor, setListMajor] = useState([]);
  const [listCourse, setListCourse] = useState([]);
  const [user, setUser] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getListCourse().then((res) => {
      setListCourse(res.data.data);
    });
    getListMajor().then((res) => {
      setListMajor(res.data.data);
    });
    getUser(params.id).then((res) => {
      setUser(res.data.data);

      for (const key of Object.keys(res.data.data)) {
        if (key === "gender")
          form.setFieldValue("gender", res.data.data[key] === "Nam");
        if (key === "dob") {
          console.log(res.data.data[key]);
          console.log(moment(res.data.data[key]));
          form.setFieldValue(key, moment(res.data.data[key], "DD/MM/YYYY"));
        } else form.setFieldValue(key, res.data.data[key]);
      }
      form.setFieldValue("gender", res.data.data["gender"] === "Nam");

      switch (res.data.data.role) {
        case "officer":
          setRoleNumber(2);
          form.setFieldValue("role", "admin1");
          setRole("admin1");
          break;
        case "admin":
          setRoleNumber(1);
          form.setFieldValue("role", "admin");

          break;
        case "student":
          setRoleNumber(3);
          form.setFieldValue("role", "student");

          break;
        case "teacher":
          setRoleNumber(4);
          form.setFieldValue("role", "teacher");

          break;

        default:
          break;
      }
    });
  }, []);
  const [form] = Form.useForm();

  // Xử lý khi thay đổi vai trò
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    switch (e.target.value) {
      case "admin1":
        setRoleNumber(1);
        break;
      case "admin":
        setRoleNumber(2);
        break;
      case "student":
        setRoleNumber(3);
        break;
      case "teacher":
        setRoleNumber(4);
        break;

      default:
        break;
    }
  };

  const onFinish = async (values) => {
    try {
      values.dob = values.dob.format("YYYY-MM-DD HH:mm:ss");
      console.log(values);
      const user = await editUser(params.id, {
        ...values,
        role_id: roleNumber,
        gender: values.gender === "Name",
        student_course_id: values?.course,
        student_major_id: values?.major,
        teacher_major_id: values?.major,
        student_current_semester: 1,
        student_status: 1,
        teacher_status: 1,
      });
      message.success(`Đã sửa khoản thành công`);
      navigate("/admin/list-users");
    } catch (error) {
      for (const key of Object.keys(error?.response?.data?.errors)) {
        message.error(error.response.data.errors[key][0]);
      }
    }
  };
  console.log(user);
  return (
    <Card hoverable>
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{ margin: "0 100px" }}
        form={form}
      >
        <h2 className="syllabus-title">Sửa User</h2>

        {/* Dùng Row và Col để chia làm 2 cột */}
        <Row style={{ width: "100%" }} gutter={100}>
          <Col span={12}>
            {/* Họ Tên */}
            <Form.Item
              label="Họ Tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ tên!",
                },
              ]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label="Số Điện Thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            {/* Địa chỉ */}
            <Form.Item
              label="Địa Chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ!",
                },
              ]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            {/* Dân tộc */}
            <Form.Item
              label="Dân Tộc"
              name="ethnicity"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập dân tộc!",
                },
              ]}
            >
              <Input placeholder="Nhập dân tộc" />
            </Form.Item>

            <Form.Item
              label="Ngày Sinh"
              name="dob"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày sinh!",
                },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Giới tính */}
            <Form.Item label="Giới Tính" name="gender">
              <Radio.Group>
                <Radio value={true}>Nam</Radio>
                <Radio value={false}>Nữ</Radio>
              </Radio.Group>
            </Form.Item>
            {/* Avatar Upload */}
            <Form.Item label="Avatar" name="avatar">
              <Upload listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Tải lên Avatar</Button>
              </Upload>
            </Form.Item>{" "}
            {/* Vai trò */}
            <Form.Item
              label="Vai Trò"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Radio.Group value={role} onChange={handleRoleChange}>
                <Radio value="student">Sinh Viên</Radio>
                <Radio value="teacher">Giáo Viên</Radio>
                <Radio value="admin">Cán Bộ</Radio>
                <Radio value="admin1">Quản Trị Viên</Radio>
              </Radio.Group>
            </Form.Item>
            {/* Các trường hiển thị theo vai trò */}
            {role === "student" && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Mã Sinh Viên"
                    name="student_code"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã sinh viên!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập mã sinh viên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Chuyên Ngành"
                    name="major"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn chuyên ngành!",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn chuyên ngành">
                      {listMajor.map((v) => (
                        <Option value={v.id}>{v.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Khóa Học"
                    name="course"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn khóa học!",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn khóa học">
                      {listCourse.map((v) => (
                        <Option value={v.id}>{v.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
            {role === "teacher" && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Mã Giáo Viên"
                    name="teacher_code"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã giáo viên!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập mã giáo viên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Chuyên Ngành Dạy"
                    name="major"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn chuyên ngành!",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn chuyên ngành">
                      {listMajor.map((v) => (
                        <Option value={v.id}>{v.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>
        </Row>

        {/* Mật khẩu */}
        {/* <Form.Item
                label="Mật Khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
                <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item> */}

        <div className="flex items-center justify-center">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Sửa
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default UserEdit;
