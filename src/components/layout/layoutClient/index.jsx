import React from 'react';
import HeaderClient from './header/page';
import AsideClient from './aside/page';
import { Outlet } from 'react-router-dom';
import Footer from './footer/page';


const LayoutClient = () => {
    return (
        <div className="flex h-screen">
            <AsideClient />
            
            {/* Phần nội dung chính của ứng dụng */}
            <main className="flex-1 p-6 bg-white overflow-y-auto"> {}
                <HeaderClient />
                <div className="container">

                    {/* Các nội dung khác của bảng điều khiển */}
                    <div className="flex items-center justify-between mb-4">
                    <Outlet/>
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
};
export default LayoutClient;