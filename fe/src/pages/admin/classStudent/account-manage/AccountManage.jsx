import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Space } from "antd";
import React, { useState } from "react";
import { AddUserModal } from "../../../../components/modals/AddUserModal";
import { AddParentModal } from "../../../../components/modals/AddParentModal";

export const AccountManage = () => {
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openAddParentModal, setOpenAddParentModal] = useState(false);

  let [managers, setManagers] = useState([
    {
      name: "Nguyễn Văn A",
      sdt: "0912789789",
    },
  ]);
  const [teachers, setTeachers] = useState([
    {
      name: "Nguyễn Văn A",
      sdt: "0912789789",
    },
    {
      name: "Nguyễn Văn A",
      sdt: "0912789789",
    },
  ]);
  const [students, setStudents] = useState([
    {
      name: "Nguyễn Văn A",
      sdt: "0912789789",
      parent: "",
    },
    {
      name: "Nguyễn Văn A",
      sdt: "0912789789",
      parent: "Lê Thị A",
    },
    {
      name: "Nguyễn Văn A",
      sdt: "0912789789",
      parent: "Lê Thị A",
    },
  ]);
  return (
    <div className="pt-6 px-4">
      <AddUserModal
        onClose={() => {
          setOpenAddUserModal(false);
        }}
        onOk={() => {
          setOpenAddUserModal(false);
        }}
        open={openAddUserModal}
      />
      <AddParentModal
        onClose={() => {
          setOpenAddParentModal(false);
        }}
        onOk={() => {
          setOpenAddParentModal(false);
        }}
        open={openAddParentModal}
      />
      <div className="flex gap-3 w-56">
        <div className="text-title text-lg font-medium">
          Danh Sách Tài Khoản
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
          <div className="text-base font-medium">#1. Tài Khoản Quản Lý Lớp</div>
          <Space>
            <span className="text-sm font-semibold">1 tài khoản</span>
            <img src="/assets/svg/account-plus.svg" alt="" />
          </Space>
        </div>
        <div className="mt-4">
          {managers.length > 0 ? (
            managers.map((manager) => (
              <Card className="mt-2">
                <div className="flex justify-between">
                  <Space>
                    <Avatar size={36} icon={<UserOutlined />} />{" "}
                    <span className="font-semibold text-primary">
                      {manager.name}
                    </span>
                  </Space>
                  <Space size="large">
                    <Space>
                      <span className="text-grey">Điện Thoại</span>{" "}
                      <span>{manager.sdt}</span>
                    </Space>
                    <img src="/assets/svg/trash-red.svg" alt="" />
                  </Space>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col text-grey justify-center items-center">
              <div>Danh sách Tài Khoản trống. Mời bạn thêm Tài Khoản.</div>
              <Button
                onClick={() => {
                  setOpenAddUserModal(true);
                }}
                className="w-fit mt-4"
                style={{ color: "#1167B4", borderColor: "#1167B4" }}
              >
                Thêm Quản Lý Lớp
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <div className="text-base font-medium">#2. Tài Khoản Giảng Viên</div>
          <Space>
            <span className="text-sm font-semibold">1 tài khoản</span>
            <img src="/assets/svg/account-plus.svg" alt="" />
          </Space>
        </div>
        <div className="mt-4">
          {teachers.length > 0 ? (
            teachers.map((manager) => (
              <Card className="mt-2">
                <div className="flex justify-between">
                  <Space>
                    <Avatar size={36} icon={<UserOutlined />} />{" "}
                    <span className="font-semibold text-primary">
                      {manager.name}
                    </span>
                  </Space>
                  <Space size="large">
                    <Space>
                      <span className="text-grey">Điện Thoại</span>{" "}
                      <span>{manager.sdt}</span>
                    </Space>
                    <img src="/assets/svg/trash-red.svg" alt="" />
                  </Space>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col text-grey justify-center items-center">
              <div>Danh sách Tài Khoản trống. Mời bạn thêm Tài Khoản.</div>
              <Button
                onClick={() => {
                  setOpenAddUserModal(true);
                }}
                className="w-fit mt-4"
                style={{ color: "#1167B4", borderColor: "#1167B4" }}
              >
                Thêm Giảng Viên{" "}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <div className="text-base font-medium">#3. Tài Khoản Học Viên</div>
          <Space>
            <span className="text-sm font-semibold">1 tài khoản</span>
            <img src="/assets/svg/account-plus.svg" alt="" />
          </Space>
        </div>
        <div className="mt-4">
          {students.length > 0 ? (
            students.map((manager) => (
              <Card className="mt-2">
                <div className="flex justify-between">
                  <Space>
                    <Avatar size={36} icon={<UserOutlined />} />{" "}
                    <span className="font-semibold text-primary">
                      {manager.name}
                    </span>
                  </Space>
                  <Space size="large">
                    <Space>
                      <span className="text-grey">Điện Thoại</span>{" "}
                      <span>{manager.sdt}</span>
                    </Space>

                    {manager.parent ? (
                      <Space>
                        <span className="text-grey">Phụ Huynh:</span>{" "}
                        <span>{manager.parent}</span>
                      </Space>
                    ) : (
                      <span
                        onClick={() => {
                          setOpenAddParentModal(true);
                        }}
                        className="text-[#E98C36] cursor-pointer"
                      >
                        Thêm phụ huynh
                      </span>
                    )}

                    <img src="/assets/svg/trash-red.svg" alt="" />
                  </Space>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col text-grey justify-center items-center">
              <div>Danh sách Tài Khoản trống. Mời bạn thêm Tài Khoản.</div>
              <Button
                onClick={() => {
                  setOpenAddParentModal(true);
                }}
                className="w-fit mt-4"
                style={{ color: "#1167B4", borderColor: "#1167B4" }}
              >
                Thêm Học Viên{" "}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
