import React, { useEffect, useState } from "react";
import { Input, Button, List, Popconfirm, Typography, Pagination, message } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Loading from "../../../components/loading";
import instance from "../../../config/axios";

const { Title } = Typography;

// Dữ liệu mẫu syllabus
const syllabuses = [
  {
    id: 1,
    name: "Khoa học Máy tính",
    description: "Tìm hiểu về lập trình và cấu trúc dữ liệu",
    credits: 3,
    semester: 1,
    subjects: ["Giới thiệu về Lập trình", "Cấu trúc Dữ liệu"],
  },
  {
    id: 2,
    name: "Kỹ thuật Điện",
    description: "Nghiên cứu các nguyên lý điện và điện tử",
    credits: 4,
    semester: 2,
    subjects: ["Nguyên lý Điện", "Mạch Điện"],
  },
  // Thêm nhiều syllabus nếu cần
];

const SyllabusList = () => {
  const [filteredSyllabuses, setFilteredSyllabuses] = useState(syllabuses);

  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await instance.get(`admin/plans`);
        setSyllabus(data.data);
        console.log(data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const handleSearch = (value) => {
    const filtered = syllabuses.filter((syllabus) =>
      syllabus.name.toLowerCase().includes(value.toLowerCase())

    );
    setFilteredSyllabuses(filtered);
  };

  const handleEdit = (id) => {
    // Xử lý sự kiện khi nhấn nút Sửa
    console.log(`Sửa syllabus với ID: ${id}`);
  };

  const handleDelete = async (id) => {
    try {
        await instance.delete(`admin/plans/${id}`);
        setSyllabus(syllabus.filter((item) => item.id != id));
        message.success(
            <span>
                Xóa mềm thành công,{" "}
                <button
                    onClick={() => undoPlans(id)}
                    className="underline"
                >
                    Hoàn tác
                </button>
            </span>,
            5
        );
    } catch (error) {
        console.log(error.message);
        message.error("Xóa thất bại");
    } finally {
        setLoading(false);
    }
  };

  const undoPlans = async (id) => {
    try {
        setLoading(true);
        const values = await instance.post(`admin/plans/${id}/restore`);
        const restoredPlan = values.data.data;
        console.log(values.data.data);
        message.success("Khôi phục thành công");
        setSyllabus((prevSyl) => [...prevSyl, restoredPlan]);
    } catch (error) {
        console.log(error.message);
        message.error("Khôi phục thất bại thất bại");
    } finally {
        setLoading(false);
    }
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="row row-cols-2 g-3">
      <div className="col-12">
        <div>
          <div className="justify-between flex">
            <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
              Quản Lý Kế Hoạch Học Tập
              <button>
                <img src="/assets/svg/reload.svg" alt="reload..." />
              </button>
            </h1>

            <div>
              <Input.Search
                placeholder="Tìm kiếm syllabus..."
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link to={`add`} className="btn btn--outline text-[#7017E2]">
              <PlusOutlined />
              Tạo mới
            </Link>

            <span className="font-bold text-[14px] text-[#000]">
              {syllabus.length} items
            </span>
          </div>
        </div>
        <div className="row row-cols-2 g-3 mt-4">
          {syllabus.length > 0 ? (
            syllabus.map((item) => (
              <div className="col" key={item.id}>
                <div className="teaching__card">
                  <div className="teaching__card-top">
                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                      <img src="/assets/svg/share.svg" alt="" />
                      Tên Syllabus:
                      <p className="text-red-300 uppercase ml-2 font-bold">
                        {item.name}
                      </p>
                    </h2>
                    <button>
                      <img src="/assets/svg/more_detail.svg" alt="" />
                    </button>
                  </div>

                  <div className="teaching__card-body">
                    <div className="mt-6 flex flex-col gap-8 pb-6">
                      <div className="flex gap-6">
                        <p className="text-[#9E9E9E]">Trạng thái :</p>
                        <div className="teaching__card-status">
                          <img
                            className="svg-green"
                            src="/assets/svg/status.svg"
                            alt=""
                          />
                          <span className="text-[#44CC15] text-[12px]">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="teaching__card-bottom">
                    <Popconfirm
                      title={`Bạn có muốn chắc xóa ${item.name} này chứ ?`}
                      onConfirm={() => handleDelete(item.id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                        <img src="/assets/svg/remove.svg" alt="remove" />
                        Xóa khỏi Danh Sách
                      </button>
                    </Popconfirm>
                    <Link
                      to={`edit/${item.id}`}
                      className="text-[#1167B4] font-bold flex items-center gap-2 justify-center"
                      onClick={() => handleEdit(item.id)}
                    >
                      <EditOutlined />
                      Sửa Thông Tin
                    </Link>
                    <Button
                      className="text-[#1167B4] font-bold flex items-center gap-2 justify-center border-none"
                    >
                      <EditOutlined />
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-red-500 font-bold text-lg">
                Không tìm thấy syllabus
              </p>
            </div>
          )}
        </div>
        <Pagination
          className="mt-12"
          align="center"
          defaultCurrent={1}
          total={50}
        />
      </div>
    </div>
  );
};

export default SyllabusList;
