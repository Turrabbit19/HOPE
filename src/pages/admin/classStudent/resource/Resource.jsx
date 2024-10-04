import { Avatar, Button, Card, Space } from "antd";
import React, { useState } from "react";
import { AddResourceModal } from "../../../../components/modals/AddResourceModal";

export const Resource = () => {
  const [openAddResourceModal, setOpenAddResourceModal] = useState(false);
  useState;
  let [managers, setManagers] = useState([
    {
      name: "Môn học 1",
    },
  ]);
  const [teachers, setTeachers] = useState([
    {
      name: "Tài liệu 1",
    },
    {
      name: "Tài liệu 1",
    },
  ]);
  const [students, setStudents] = useState([
    {
      name: "Chủ đề 1",
      date: "21/06/2024",
      author: "Lê Thị A",
    },
    {
      name: "Chủ đề 1",
      date: "21/06/2024",
      author: "Lê Thị A",
    },
    {
      name: "Chủ đề 1",
      date: "21/06/2024",
      author: "Lê Thị A",
    },
  ]);
  return (
    <div className="pt-6 px-4">
      <AddResourceModal
        open={openAddResourceModal}
        onOk={() => {
          setOpenAddResourceModal(false);
        }}
        onClose={() => {
          setOpenAddResourceModal(false);
        }}
      />
      <div className="flex gap-3 w-72">
        <div className="text-title text-lg font-medium">
          Bài Giảng và Tài Nguyên
        </div>
        <img src="/assets/svg/reload.svg" alt="" />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            setManagers([]);
            setTeachers([]);
            setStudents([]);
          }}
          className="w-fit"
        >
          reset về 0
        </Button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <div className="text-base font-medium">#1. Danh sách khóa học</div>
          <Space>
            <span className="text-sm font-semibold">1 môn học</span>
            <img src="/assets/svg/account-plus.svg" alt="" />
          </Space>
        </div>
        <div className="mt-4">
          {managers.length > 0 ? (
            managers.map((manager) => (
              <Card className="mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-primary">
                    {manager.name}
                  </span>
                  <Space size="large">
                    <Space>
                      <span className="text-grey">Ẩn/Hiện</span>{" "}
                      <span>Chỉnh sửa</span>
                    </Space>
                    <img src="/assets/svg/trash-red.svg" alt="" />
                  </Space>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col text-grey justify-center items-center">
              <div>Danh sách Tài Nguyên trống. Mời bạn thêm Tài Nguyên</div>
              <Button
                onClick={() => {
                  setOpenAddResourceModal(true);
                }}
                className="w-fit mt-4"
                style={{ color: "#1167B4", borderColor: "#1167B4" }}
              >
                Thêm Tài Nguyên{" "}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <div className="text-base font-medium">#2. Thư viện tài liệu</div>
          <Space>
            <span className="text-sm font-semibold">2 tài liệu</span>
            <img src="/assets/svg/account-plus.svg" alt="" />
          </Space>
        </div>
        <div className="mt-4">
          {teachers.length > 0 ? (
            teachers.map((manager) => (
              <Card className="mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-primary">
                    {manager.name}
                  </span>
                  <Space size="large">
                    <Space>
                      <span className="text-grey">Ẩn/Hiện</span>{" "}
                      <span>Chỉnh sửa</span>
                    </Space>
                    <img src="/assets/svg/trash-red.svg" alt="" />
                  </Space>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col text-grey justify-center items-center">
              <div>Danh sách Tài Nguyên trống. Mời bạn thêm Tài Nguyên</div>
              <Button
                onClick={() => {
                  setOpenAddResourceModal(true);
                }}
                className="w-fit mt-4"
                style={{ color: "#1167B4", borderColor: "#1167B4" }}
              >
                Thêm Tài Nguyên{" "}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <div className="text-base font-medium">#3. Tài Khoản Học Viên</div>
          <Space>
            <span className="text-sm font-semibold">10 mục</span>
            <img src="/assets/svg/account-plus.svg" alt="" />
          </Space>
        </div>
        <div className="mt-4">
          {students.length > 0 ? (
            students.map((manager) => (
              <Card className="mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-primary">
                    {manager.name}
                  </span>
                  <Space size="large">
                    <Space>
                      <span className="text-grey">Ẩn/Hiện</span>{" "}
                      <span>{manager.date}</span>
                    </Space>
                    <Space>
                      <span className="text-grey">Tác giả</span>
                      <span className="text-primary">{manager.author}</span>
                    </Space>
                    <img src="/assets/svg/trash-red.svg" alt="" />
                  </Space>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col text-grey justify-center items-center">
              <div>Danh sách Tài Nguyên trống. Mời bạn thêm Tài Nguyên</div>
              <Button
                onClick={() => {
                  setOpenAddResourceModal(true);
                }}
                className="w-fit mt-4"
                style={{ color: "#1167B4", borderColor: "#1167B4" }}
              >
                Thêm Tài Nguyên{" "}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
