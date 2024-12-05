import React, { useState, useEffect, useRef } from "react";
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
  Image,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  getListCourse,
  getListMajor,
  getMainMajor,
  createStudent,
  createUser,
  createTeacher,
} from "../../../../services/user-service";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadMultipleFiles } from "../../../../utils/upload";

const { Option } = Select;

const UserAdd = () => {

  const { state } = useLocation();

  const [role, setRole] = useState(""); // Không có vai trò nào chọn ban đầu
  const [roleNumber, setRoleNumber] = useState(0); // Không có vai trò nào chọn ban đầu
  const [listMajor, setListMajor] = useState([]);
  const [mainMajor, setMainMajor] = useState([]);
  const [listCourse, setListCourse] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef();

  const navigate = useNavigate();
  useEffect(() => {
    if (state?.type === "students") {
      handleRoleChange("student");
    } else if (state?.type === "teachers") {
      handleRoleChange("teacher");
    }
    getListCourse().then((res) => {
      setListCourse(res.data.data);
    });
    getListMajor().then((res) => {
      setListMajor(res.data.data);
    });
    getMainMajor().then((res) => {
      setMainMajor(res.data.data);
    });
  }, []);

  // Xử lý khi thay đổi vai trò
  const handleRoleChange = (e) => {
    setRole(e);
    switch (e) {
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

  const handleRoleChangeByValue = (e) => {
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

  console.log(roleNumber);
  const onSubmit = async (values) => {
    try {
      try {
        values.dob = values.dob.format("YYYY-MM-DD HH:mm:ss");
        const uploadResults = await uploadMultipleFiles(
          "images",
          URL.createObjectURL(avatar),
          "/public"
        );
        console.log(uploadResults[0]?.data?.fullPath);

        const data = {
          ...values,
          password: "123123123",
          role_id: roleNumber,
          avatar: uploadResults[0]?.data?.fullPath ?? null,
        };

        if (roleNumber === 3) {
          createStudent({
            ...data,
            student_major_id: values.major,
            student_course_id: values.course,
            student_code: values.student_code,
            student_current_semester: 1,
            student_status: 1,
          })
            .then((res) => {
              navigate("/admin/all-student");
            })
            .catch((error) => {
              message.error("Đã xãy ra lỗi vui lòng kiểm tra lại dữ liệu");
              return;
              // message.error
            });
        } else if (roleNumber === 4) {
          createTeacher({
            ...data,
            teacher_major_id: values.major,
            teacher_code: values.teacher_code,
            teacher_status: 1,
          })
            .then((res) => {
              navigate("/admin/teacher-manager");
            })
            .catch((error) => {
              message.error("Đã xãy ra lỗi vui lòng kiểm tra lại dữ liệu");
              return;
              // message.error
            });
        } else if (roleNumber === 2 || roleNumber === 1) {
          createUser(data)
            .then((res) => {
              navigate("/admin/admin-manager");
            })
            .catch((error) => {
              message.error("Đã xãy ra lỗi vui lòng kiểm tra lại dữ liệu");
              return;
              // message.error
            });
        }

        message.success("Thêm thành công!");
      } catch (error) {
        for (const key of Object.keys(error?.response?.data?.errors)) {
          message.error(error.response.data.errors[key][0]);
        }
      }
      // switch (role) {
      //   case "teacher":
      //     await createTeacher({
      //       ...values,
      //       user_id: user.id,
      //       major_id: values.major,
      //       teacher_code: values.teacher_code,
      //     });
      //     break;
      //   case "student":
      //     await createStudent({
      //       ...values,
      //       user_id: user.id,
      //       major_id: values.major,
      //       course_id: values.course,
      //       student_code: values.student_code,
      //     });
      //     break;

      //   default:
      //     break;
      // }
    } catch (error) {}
  };

  return (
    <Card hoverable>
      <Form
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ gender: true }}
        style={{ margin: "0 100px" }}
      >
        <h2 className="syllabus-title">Thêm Mới User</h2>

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
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
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
              <div className="flex flex-col items-start">
                <Button
                  onClick={() => fileInputRef?.current?.click()}
                  icon={<UploadOutlined />}
                >
                  Tải lên Avatar
                </Button>
                <input
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={(e) => setAvatar(e.target.files[0] ?? null)}
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                />
                {avatar && (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <Image
                      alt={"avatar"}
                      src={URL.createObjectURL(avatar)}
                      preview={false}
                      style={{
                        width: "140px",
                        height: "140px",
                        aspectRatio: "1/1",
                        objectFit: "fill",
                        borderRadius: 10,
                        margin: "6px 0px 10px",
                      }}
                    />
                    {isHovered && (
                      <div
                        style={{
                          position: "absolute",
                          top: "6px",
                          left: 0,
                          width: "140px",
                          height: "140px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "6px",
                        }}
                      >
                        <DeleteOutlined
                          style={{
                            fontSize: "16px",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setAvatar(null);
                            setIsHovered(false);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Form.Item>
            {/* Vai trò */}
            {state?.type === "admin" && (
              <Form.Item
                label="Vai Trò"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn vai trò!",
                  },
                ]}
              >
                <Radio.Group onChange={handleRoleChangeByValue}>
                  <Radio value="admin">Cán Bộ</Radio>
                  <Radio value="admin1">Quản Trị Viên</Radio>
                </Radio.Group>
              </Form.Item>
            )}
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
                      {mainMajor.map((v) => (
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
              Thêm Mới
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default UserAdd;
