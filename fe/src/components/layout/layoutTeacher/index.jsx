import HeaderTeacher from "./header/page";
import AsideTeacher from "./aside/page";
import { Outlet } from "react-router-dom";
import Footer from "./footer/page";

const LayoutTeacher = () => {
  return (
    <div className="flex h-screen">
      {/* Thanh điều hướng bên trái */}
      <AsideTeacher />

      {/* Phần nội dung chính của ứng dụng */}
      <main className="flex-1 p-8 bg-white overflow-y-auto">
        <HeaderTeacher />

        <div className="max-w-[1470px] mx-auto">
          {/* Nội dung từ route con sẽ được hiển thị tại đây */}
          <Outlet />
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default LayoutTeacher;
