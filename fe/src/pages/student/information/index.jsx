import { Avatar } from "antd";
import React from "react";
import { AntDesignOutlined } from "@ant-design/icons";

const StudentInformation = () => {
  return (
    <div className="grid grid-cols-6 grid-rows-5 gap-4">
      <div className="col-span-2 row-span-5  rounded font-normal h-[220px]">
        <div className="grid grid-cols-2 grid-rows-5 gap-2">
          <div className="flex justify-center mt-5">
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 75, xxl: 85 }}
              icon={<AntDesignOutlined />}
            />
          </div>
          <div className="col-start-2 row-start-1 flex flex-col justify-center mt-5">
            <p className="font-medium text-[#48465b]">Đỗ Tiến Ngọc</p>
            <p>Sinh viên</p>
          </div>
          <div className="row-span-3 col-start-1 row-start-2 flex flex-col mt-3 pl-12">
            <span>Email:</span>
            <span>Số điện thoại:</span>
            <span>Trạng thái:</span>
          </div>
          <div className="row-span-3 col-start-2 row-start-2 flex flex-col mt-3">
            <span>ngocdotien@gmail.com</span>
            <span>0333.567.998</span>
            <span>Bảo lưu</span>
          </div>
        </div>
      </div>
      <div className="col-span-4 row-span-5 col-start-3 border-2 border-black rounded font-normal h-[500px]">
        <h1 className="font-bold text-xl my-5 pl-4">Thông tin cá nhân</h1>
        <hr />
      </div>
    </div>
  );
};

export default StudentInformation;
