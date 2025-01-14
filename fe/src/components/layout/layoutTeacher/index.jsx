import React from "react";
import HeaderTeacher from "./header/page";
import AsideTeacher from "./aside/page";
import { Outlet } from "react-router-dom";
import Footer from "./footer/page";

const LayoutTeacher = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Thanh điều hướng bên trái */}
            <AsideTeacher />

            {/* Phần nội dung chính của ứng dụng */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <HeaderTeacher />

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

export default LayoutTeacher;
