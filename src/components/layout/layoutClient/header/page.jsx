// src/components/Header.jsx

import React, { useState } from 'react';

const HeaderClient = () => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    // Hàm để toggle hiển thị thông báo
    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    return (
        <header className="flex items-center justify-between mb-6 relative">
            <div className="flex items-center">
                <input
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-64 mr-4"
                    placeholder="Search" type="search" />
                <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                    {/* Icon tìm kiếm */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="w-5 h-5">
                        <path
                            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>
            </div>
            <div className="flex items-center space-x-4">
                {/* Các nút khác */}
                <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="w-5 h-5">
                        <rect width="16" height="13" x="6" y="4" rx="2"></rect>
                        <path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7"></path>
                        <path d="M2 8v11c0 1.1.9 2 2 2h14"></path>
                    </svg>
                </button>
                <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="w-5 h-5">
                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"></path>
                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                    </svg>
                </button>
                <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="w-5 h-5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </button>
                {/* Icon chuông với số đếm */}
                <div className="relative inline-flex items-center justify-center h-10 w-10">
                    <button
                        onClick={toggleNotification}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="w-5 h-5">
                            <path d="M18 8a6 6 0 0 1-12 0v3a6 6 0 0 1-2 4.58V18h16v-2.42A6 6 0 0 1 18 11V8z"></path>
                            <path d="M13 18h-2v1h2v-1z"></path>
                        </svg>
                    </button>
                    <span className="absolute -top-2 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-xs">
                        3
                    </span>
                </div>
            </div>

            {/* Thông báo */}
            {isNotificationOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full transform transition-all duration-300 scale-95 hover:scale-100">
                        <h2 className="text-xl font-bold text-center text-blue-600">Thông báo</h2>
                        <p className="mt-2 text-gray-700 text-center">Bạn có một thông báo mới!</p>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={toggleNotification}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-200">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </header>
    );
};

export default HeaderClient;
