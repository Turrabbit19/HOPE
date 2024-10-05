import React, { useState, useEffect } from "react";
import {
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Radio,
  message,
} from "antd";
import moment from "moment";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Loading from "../../../../components/loading";
import instance from "../../../../config/axios";
import {
  addMonths,
  addYears,
  format,
  getMonth,
  isAfter,
  isEqual,
  isWithinInterval,
  parseISO,
  subMonths,
  subYears,
} from "date-fns";

const { Option } = Select;

const ListCourse = () => {
  const [courses, setCourses] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [isStartDateSelected, setIsStartDateSelected] = useState(false);
    const [initialValues, setInitialValues] = useState()
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [{ data }, count] = await Promise.all([
          instance.get("admin/courses"),
          instance.get("admin/count/courses"),
        ]);
        setCourses(data.data);
        console.log(data.data);
        setCount(count.data.total_courses);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onHandleDelete = async (item) => {
    // setLoading(true);
    const currentDate = new Date();
    const dateString = format(currentDate, "dd/MM/yyyy");
    console.log(item.start_date);
    console.log(item.end_date);
    console.log(
      isWithinInterval(dateString, {
        start: parseISO(item.start_date),
        end: parseISO(item.end_date),
      })
    );
    if (
      isWithinInterval(parseISO(dateString), {
        start: parseISO(item.start_date),
        end: parseISO(item.end_date),
      })
    ) {
      message.info("Khóa học đang diễn ra, không thể xóa");
      return;
    } else {
      //   try {
      //     await instance.delete("admin/courses/" + item.id);
      //     setCourses(courses.filter((item) => item.id !== id));
      //     message.success(
      //       <span>
      //         Xóa mềm thành công,
      //         <button onClick={() => undoCourse(item.id)} className="underline">
      //           Hoàn tác
      //         </button>
      //       </span>,
      //       5
      //     );
      //   } catch (error) {
      //     console.log(error.message);
      //   } finally {
      //     setLoading(false);
      //   }
    }
  };
  const onHandleSubmit = async (values) => {
    console.log(values);
    const data = {
      name: values.name,
      start_date: format(values.startDate.$d, "yyyy-MM-dd"),
      end_date:
        values.duration == 1
          ? format(addYears(values.startDate.$d, 4), "yyyy-MM-dd")
          : format(
              addMonths(addYears(values.startDate.$d, 4), 6),
              "yyyy-MM-dd"
            ),
      status: 1,
    };

    setLoading(true);
    try {
      const response = await instance.post("admin/courses", data);
      console.log(response);
      message.success("Thêm khóa học thành công");
      setCourses((prevCourses) => [...prevCourses, response.data.data]);
      form.resetFields();
      handleModalCancel();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (date) => {
    if (date) setIsStartDateSelected(true);
    else setIsStartDateSelected(false);
  };

  const undoCourse = async (id) => {
    try {
      const response = await instance.post(`admin/courses/${id}/restore`);
      const restoredCourse = response.data.data;
      message.success("Khôi phục khóa học thành công");

      setMajors((prevCourse) => [...prevCourse, restoredCourse]);
    } catch (error) {
      console.log(error.message);
      message.error("Khôi phục khóa học thất bại");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (number) => {
    return number.toString().padStart(2, "0");
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm)
  );
  const onHandleUpdate = async (values)=> {
    console.log(values.startDate);
    setLoading(true);
    const data = {
        name: values.name,
        start_date: format(values.startDate, "yyyy-MM-dd"),
        end_date:
          values.duration == 1
            ? format(addYears(values.startDate, 4), "yyyy-MM-dd")
            : format(
                addMonths(addYears(values.startDate, 4), 6),
                "yyyy-MM-dd"
              ),
        status: 1,
      };
      try {
        instance.put(`admin/courses/${initialValues.id}`, data);
      } catch (error) {
        console.log(error.message);
      }finally {
        setLoading(false);
      }
  }

  const showEditModal = (course) => {
    setUpdate(true)
    console.log(course);
    form.setFieldsValue({
        id: course.id,
      name: course.name,
      startDate: moment(course.start_date),
      duration: getMonth(course.start_date) == getMonth(course.end_date) ? 1 : 2
    });
    setInitialValues(course.id)

    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setUpdate(false);
    setIsAddModalVisible(false);
  };

  const confirmDelete = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="row row-cols-2 g-3">
      <div className="col-12 justify-between flex">
        <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
          Quản Lý Khóa Học
          <button>
            <img src="/assets/svg/reload.svg" alt="reload..." />
          </button>
        </h1>

        <div>
          <Input.Search
            placeholder="Tìm kiếm khóa học..."
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
      </div>

      <div className="col-12 flex justify-between items-center mt-6">
        <Button
          onClick={showAddModal}
          className="btn btn--outline text-[#7017E2]"
        >
          <PlusOutlined />
          Tạo mới
        </Button>

        <span className="font-bold text-[14px] text-[#000]">
          {filteredCourses.length} items
        </span>
      </div>
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course) => (
          <div className="col" key={course.id}>
            <div className="teaching__card">
              <div className="teaching__card-top">
                <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                  <img src="/assets/svg/share.svg" alt="" />
                  Chuyên ngành:{" "}
                  <p className="text-red-300 uppercase ml-2 font-bold">
                    {course.name}
                  </p>
                </h2>
                <button>
                  <img src="/assets/svg/more_detail.svg" alt="" />
                </button>
              </div>

              <div className="teaching__card-body">
                <div className="mt-6 flex flex-col gap-8 pb-6">
                  <div className="flex gap-6">
                    <p className="text-[#9E9E9E]">Trạng thái:</p>
                    <div className="teaching__card-status">
                      <img
                        className="svg-green"
                        src="/assets/svg/status.svg"
                        alt="status"
                      />
                      <span className="text-[#44CC15] text-[12px]">
                        {course.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <p className="text-[#9E9E9E]">Ngày bắt đầu:</p>
                    <p className="font-bold text-[#000]">{format(course.start_date, "dd-MM-yyyy")}</p>
                  </div>
                  <div className="flex gap-6">
                    <p className="text-[#9E9E9E]">Ngày kết thúc:</p>
                    <p className="font-bold text-[#000]">{format(course.end_date, "dd-MM-yyyy")}</p>
                  </div>
                </div>
              </div>

              <div className="teaching__card-bottom">
                <Link
                  to="list"
                  className="flex items-center gap-3 text-[#1167B4] font-bold"
                >
                  <img src="/assets/svg/setting.svg" alt="setting" />
                  Quản Lý Khóa Học
                </Link>
                <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                  <img src="/assets/svg/eye.svg" alt="detail" />
                  Chi Tiết
                </button>
                <Popconfirm
                  title="Xóa khóa học"
                  onConfirm={() => onHandleDelete(course)}
                  okText="Có"
                  cancelText="Không"
                >
                  <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                    <img src="/assets/svg/remove.svg" alt="remove" />
                    Xóa khỏi Danh Sách
                  </button>
                </Popconfirm>

                <button
                  className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                  onClick={() => showEditModal(course)}
                >
                  <EditOutlined />
                  Sửa Thông Tin
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center">
          <p className="text-red-500 font-bold text-lg">
            Không tìm thấy khóa học
          </p>
        </div>
      )}

      <Modal
        title={update ? "Sửa Thông Tin Khóa Học" : "Thêm Mới Khóa Học"}
        open={isEditModalVisible || isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={update ? onHandleUpdate : onHandleSubmit }
          initialValues={{
            name: `Khóa học K${formatNumber(count + 1)} `,
          }}
          style={{ padding: "0 20px" }}
        >
          <Form.Item
            label="Tên Khóa Học"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên khóa học!",
              },
            ]}
          >
            <Input placeholder="Nhập tên khóa học" />
          </Form.Item>

          <Form.Item
            label="Ngày Bắt Đầu Dự Kiến"
            name="startDate"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày bắt đầu!",
              },
              {
                validator: (_, value) => {
                  if (!value || isAfter(value.toDate(), new Date())) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Ngày dự kiến bắt đầu phải lớn hơn ngày hiện tại!"
                    )
                  );
                },
              },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
            />
          </Form.Item>
          <Form.Item
            label="Chọn Thời Gian Kết Thúc"
            name="duration"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn thời gian kết thúc!",
              },
            ]}
          >
            <Radio.Group className="">
              <Radio value={1}>4 năm</Radio>
              <Radio value={2}>4 năm 6 tháng</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={handleModalCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {update ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListCourse;
