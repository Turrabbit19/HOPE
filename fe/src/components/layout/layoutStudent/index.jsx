import HeaderClient from "./header/page";
import AsideClient from "./aside/page";
import { Outlet } from "react-router-dom";
import Footer from "./footer/page";

const LayoutClient = () => {
  return (
    <div className="flex h-screen">
      {/* Thanh điều hướng bên trái */}
      <AsideClient />

      {/* Phần nội dung chính của ứng dụng */}
      <main className="flex-1 p-8 bg-white overflow-y-auto">
        <HeaderClient />

        <div className="max-w-[1470px] mx-auto">
          {/* Nội dung từ route con sẽ được hiển thị tại đây */}
          <Outlet />
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default LayoutClient;
