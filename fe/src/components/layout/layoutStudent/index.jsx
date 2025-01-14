import HeaderClient from "./header/page";
import AsideClient from "./aside/page";
import { Outlet } from "react-router-dom";
import Footer from "./footer/page";

const LayoutClient = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Thanh điều hướng bên trái */}
            <AsideClient />

            {/* Phần nội dung chính của ứng dụng */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <HeaderClient />

                {/* Nội dung chính */}
                <main className="flex-1 p-6 md:p-8 bg-white">
                    <div className="mx-auto">
                        {/* Nội dung từ route con sẽ được hiển thị tại đây */}
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default LayoutClient;
