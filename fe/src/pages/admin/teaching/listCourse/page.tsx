import React, { useState } from "react";
import { Link } from "react-router-dom";

const ListCourse = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const courses = [
        { name: "Môn Học 01", code: "COURSE_01" },
        { name: "Môn Học 02", code: "COURSE_02" },
        { name: "Môn Học 03", code: "COURSE_03" },
    ];

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <>
            <div className="listCourse">
                <div className="container">
                    <div className="row row-cols-2 relative">
                        {/* SideBar */}
                        <div className="col-2 !pr-0">
                            <div className="listCourse__left flex flex-col ">
                                <div>
                                    <h1 className="flex items-center text-[18px] gap-3 text-[#1167B4] font-bold">
                                        Q.lý chương trình dạy
                                    </h1>
                                    <p className="text-[15px] my-2">CTD0001</p>
                                    <div className="border-b border-solid border-[#9E9E9E] ml-[-48px]"></div>
                                </div>
                                {/* Content */}
                                <div className="flex-1">
                                    {/* Management */}
                                    <div className="my-8">
                                        <h3 className="text-[#9E9E9E] text-[16px] font-bold">
                                            Management:
                                        </h3>
                                        <div className="ml-8">
                                            <button
                                                onClick={togglePopup}
                                                className="flex gap-4 my-10"
                                            >
                                                <img
                                                    src="/assets/svg/book.svg"
                                                    alt=""
                                                />
                                                <p className="text-[#1167B4] text-[16px] font-bold">
                                                    Danh Sách Môn Học
                                                </p>
                                            </button>
                                            <div className="flex gap-4">
                                                <img
                                                    src="/assets/svg/cart.svg"
                                                    alt=""
                                                />
                                                <Link
                                                    to={"/"}
                                                    className="text-[#1167B4] text-[16px] font-bold"
                                                >
                                                    Thông Tin Bán Hàng
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Setting */}
                                    <div className="my-8 pt-3">
                                        <h3 className="text-[#9E9E9E] text-[16px] font-bold">
                                            Settings:
                                        </h3>
                                        <div className="ml-8">
                                            <div className="flex gap-4 my-10">
                                                <img
                                                    src="/assets/svg/book.svg"
                                                    alt=""
                                                />
                                                <Link
                                                    to={"/"}
                                                    className="text-[#1167B4] text-[16px] font-bold"
                                                >
                                                    Unit Info
                                                </Link>
                                            </div>
                                            <div className="flex gap-4 mb-10">
                                                <img
                                                    src="/assets/svg/cart.svg"
                                                    alt=""
                                                />
                                                <Link
                                                    to={"/"}
                                                    className="text-[#1167B4] text-[16px] font-bold"
                                                >
                                                    Lock Unit
                                                </Link>
                                            </div>
                                            <div className="flex gap-4">
                                                <img
                                                    src="/assets/svg/cart.svg"
                                                    alt=""
                                                />
                                                <Link
                                                    to={"/"}
                                                    className="text-[#1167B4] text-[16px] font-bold"
                                                >
                                                    Close Unit
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b border-solid border-[#9E9E9E] ml-[-48px]"></div>
                                <div className="my-8 pt-3 text-[13px] mt-auto">
                                    <p>(c) CXM Pro 5.0</p>
                                    <p>Version 1.5.2 - 2024</p>
                                </div>
                            </div>
                        </div>

                        {/*  Item */}
                        <div className="col-10">
                            <div>
                                <h1 className="flex gap-2 items-center text-[#7017E2] text-[20px] font-semibold">
                                    Danh Sách Môn Học
                                    <button>
                                        <img
                                            src="/assets/svg/reload.svg"
                                            alt="reload..."
                                        />
                                    </button>
                                </h1>

                                <div className="flex justify-between  items-center mt-6">
                                    <Link
                                        to={`add`}
                                        className="btn btn--outline  text-[#7017E2] "
                                    >
                                        <img
                                            src="/assets/svg/plus.svg"
                                            alt=""
                                        />
                                        Thêm Môn Học
                                    </Link>

                                    <span className="font-bold text-[14px] text-[#000]">
                                        6 items
                                    </span>
                                </div>

                                {/* List Course Item */}
                                <div className="listCourse__group my-10">
                                    {/* Item 1 */}
                                    <div className="listCourse__item">
                                        <div className="listCourse__item-top flex justify-between items-center">
                                            <h2 className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                #1 Môn Học 01
                                            </h2>
                                            <button>
                                                <img
                                                    src="/assets/svg/more_detail.svg"
                                                    alt=""
                                                />
                                            </button>
                                        </div>

                                        <div className="listCourse__item-body">
                                            <div className="flex gap-8 ">
                                                <div className="teaching__card-thumb">
                                                    <img
                                                        src="/assets/svg/img_preview.svg"
                                                        alt=""
                                                        className="teaching_card-img"
                                                    />
                                                </div>
                                                <div className="listCourse__item-status_group">
                                                    <div className="flex gap-10 listCourse__item-status">
                                                        <div className="flex gap-1 bg-[#44cc151a]">
                                                            <img
                                                                className="fill-current svg-green"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#44CC15] text-[12px]">
                                                                Active
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-1  bg-[#ff53531a]">
                                                            <img
                                                                className="fill-current svg-red"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#FF5353] text-[13px]">
                                                                LOCKED
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-[#9E9E9E] mt-3 ml-3">
                                                        Code:
                                                        <span className="text-black ml-2">
                                                            COURSE_01
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="listCourse__item-bottom">
                                            <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/eye.svg"
                                                    alt=""
                                                />
                                                Chi Tiết
                                            </button>
                                            <button className="text-[#7017E2] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/arrow_circle_up.svg"
                                                    alt=""
                                                />
                                                Lên
                                            </button>
                                            <button className="text-[#7017E2] mb-1 font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/arrow_circle_down.svg"
                                                    alt=""
                                                />
                                                Xuống
                                            </button>
                                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/remove.svg"
                                                    alt=""
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </div>
                                    </div>
                                    {/* Item 1 */}
                                    <div className="listCourse__item">
                                        <div className="listCourse__item-top flex justify-between items-center">
                                            <h2 className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                #1 Môn Học 01
                                            </h2>
                                            <button>
                                                <img
                                                    src="/assets/svg/more_detail.svg"
                                                    alt=""
                                                />
                                            </button>
                                        </div>

                                        <div className="listCourse__item-body">
                                            <div className="flex gap-8 ">
                                                <div className="teaching__card-thumb">
                                                    <img
                                                        src="/assets/svg/img_preview.svg"
                                                        alt=""
                                                        className="teaching_card-img"
                                                    />
                                                </div>
                                                <div className="listCourse__item-status_group">
                                                    <div className="flex gap-10 listCourse__item-status">
                                                        <div className="flex gap-1 bg-[#44cc151a]">
                                                            <img
                                                                className="fill-current svg-green"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#44CC15] text-[12px]">
                                                                Active
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-1  bg-[#ff53531a]">
                                                            <img
                                                                className="fill-current svg-red"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#FF5353] text-[13px]">
                                                                LOCKED
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-[#9E9E9E] mt-3 ml-3">
                                                        Code:
                                                        <span className="text-black ml-2">
                                                            COURSE_01
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="listCourse__item-bottom">
                                            <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/eye.svg"
                                                    alt=""
                                                />
                                                Chi Tiết
                                            </button>
                                            <button className="text-[#7017E2] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/arrow_circle_up.svg"
                                                    alt=""
                                                />
                                                Lên
                                            </button>
                                            <button className="text-[#7017E2] mb-1 font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/arrow_circle_down.svg"
                                                    alt=""
                                                />
                                                Xuống
                                            </button>
                                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/remove.svg"
                                                    alt=""
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </div>
                                    </div>
                                    {/* Item 1 */}
                                    <div className="listCourse__item">
                                        <div className="listCourse__item-top flex justify-between items-center">
                                            <h2 className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                #1 Môn Học 01
                                            </h2>
                                            <button>
                                                <img
                                                    src="/assets/svg/more_detail.svg"
                                                    alt=""
                                                />
                                            </button>
                                        </div>

                                        <div className="listCourse__item-body">
                                            <div className="flex gap-8 ">
                                                <div className="teaching__card-thumb">
                                                    <img
                                                        src="/assets/svg/img_preview.svg"
                                                        alt=""
                                                        className="teaching_card-img"
                                                    />
                                                </div>
                                                <div className="listCourse__item-status_group">
                                                    <div className="flex gap-10 listCourse__item-status">
                                                        <div className="flex gap-1 bg-[#44cc151a]">
                                                            <img
                                                                className="fill-current svg-green"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#44CC15] text-[12px]">
                                                                Active
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-1  bg-[#ff53531a]">
                                                            <img
                                                                className="fill-current svg-red"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#FF5353] text-[13px]">
                                                                LOCKED
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-[#9E9E9E] mt-3 ml-3">
                                                        Code:
                                                        <span className="text-black ml-2">
                                                            COURSE_01
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="listCourse__item-bottom">
                                            <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/eye.svg"
                                                    alt=""
                                                />
                                                Chi Tiết
                                            </button>
                                            <button className="text-[#7017E2] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/arrow_circle_up.svg"
                                                    alt=""
                                                />
                                                Lên
                                            </button>
                                            <button className="text-[#7017E2] mb-1 font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/arrow_circle_down.svg"
                                                    alt=""
                                                />
                                                Xuống
                                            </button>
                                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/remove.svg"
                                                    alt=""
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </div>
                                    </div>
                                    {/* Item 1 */}
                                    <div className="listCourse__item">
                                        <div className="listCourse__item-top flex justify-between items-center">
                                            <h2 className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                #1 Môn Học 01
                                            </h2>
                                            <button>
                                                <img
                                                    src="/assets/svg/more_detail.svg"
                                                    alt=""
                                                />
                                            </button>
                                        </div>

                                        <div className="listCourse__item-body">
                                            <div className="flex gap-8 ">
                                                <div className="teaching__card-thumb">
                                                    <img
                                                        src="/assets/svg/img_preview.svg"
                                                        alt=""
                                                        className="teaching_card-img"
                                                    />
                                                </div>
                                                <div className="listCourse__item-status_group">
                                                    <div className="flex gap-10 listCourse__item-status">
                                                        <div className="flex gap-1 bg-[#44cc151a]">
                                                            <img
                                                                className="fill-current svg-green"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#44CC15] text-[12px]">
                                                                Active
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-1  bg-[#ff53531a]">
                                                            <img
                                                                className="fill-current svg-red"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#FF5353] text-[13px]">
                                                                LOCKED
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-[#9E9E9E] mt-3 ml-3">
                                                        Code:
                                                        <span className="text-black ml-2">
                                                            COURSE_01
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="listCourse__item-bottom">
                                            <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/eye.svg"
                                                    alt=""
                                                />
                                                Chi Tiết
                                            </button>
                                            <button className="text-[#7017E2] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/arrow_circle_up.svg"
                                                    alt=""
                                                />
                                                Lên
                                            </button>
                                            <button className="text-[#7017E2] mb-1 font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/arrow_circle_down.svg"
                                                    alt=""
                                                />
                                                Xuống
                                            </button>
                                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/remove.svg"
                                                    alt=""
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </div>
                                    </div>
                                    {/* Item 1 */}
                                    <div className="listCourse__item">
                                        <div className="listCourse__item-top flex justify-between items-center">
                                            <h2 className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                #1 Môn Học 01
                                            </h2>
                                            <button>
                                                <img
                                                    src="/assets/svg/more_detail.svg"
                                                    alt=""
                                                />
                                            </button>
                                        </div>

                                        <div className="listCourse__item-body">
                                            <div className="flex gap-8 ">
                                                <div className="teaching__card-thumb">
                                                    <img
                                                        src="/assets/svg/img_preview.svg"
                                                        alt=""
                                                        className="teaching_card-img"
                                                    />
                                                </div>
                                                <div className="listCourse__item-status_group">
                                                    <div className="flex gap-10 listCourse__item-status">
                                                        <div className="flex gap-1 bg-[#44cc151a]">
                                                            <img
                                                                className="fill-current svg-green"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#44CC15] text-[12px]">
                                                                Active
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-1  bg-[#ff53531a]">
                                                            <img
                                                                className="fill-current svg-red"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#FF5353] text-[13px]">
                                                                LOCKED
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-[#9E9E9E] mt-3 ml-3">
                                                        Code:
                                                        <span className="text-black ml-2">
                                                            COURSE_01
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="listCourse__item-bottom">
                                            <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/eye.svg"
                                                    alt=""
                                                />
                                                Chi Tiết
                                            </button>
                                            <button className="text-[#7017E2] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/arrow_circle_up.svg"
                                                    alt=""
                                                />
                                                Lên
                                            </button>
                                            <button className="text-[#7017E2] mb-1 font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/arrow_circle_down.svg"
                                                    alt=""
                                                />
                                                Xuống
                                            </button>
                                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/remove.svg"
                                                    alt=""
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </div>
                                    </div>
                                    {/* Item 1 */}
                                    <div className="listCourse__item">
                                        <div className="listCourse__item-top flex justify-between items-center">
                                            <h2 className="teaching__item-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                                <img
                                                    src="/assets/svg/share.svg"
                                                    alt=""
                                                />
                                                #1 Môn Học 01
                                            </h2>
                                            <button>
                                                <img
                                                    src="/assets/svg/more_detail.svg"
                                                    alt=""
                                                />
                                            </button>
                                        </div>

                                        <div className="listCourse__item-body">
                                            <div className="flex gap-8 ">
                                                <div className="teaching__card-thumb">
                                                    <img
                                                        src="/assets/svg/img_preview.svg"
                                                        alt=""
                                                        className="teaching_card-img"
                                                    />
                                                </div>
                                                <div className="listCourse__item-status_group">
                                                    <div className="flex gap-10 listCourse__item-status">
                                                        <div className="flex gap-1 bg-[#44cc151a]">
                                                            <img
                                                                className="fill-current svg-green"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#44CC15] text-[12px]">
                                                                Active
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-1  bg-[#ff53531a]">
                                                            <img
                                                                className="fill-current svg-red"
                                                                src="/assets/svg/status.svg"
                                                                alt=""
                                                            />
                                                            <span className="text-[#FF5353] text-[13px]">
                                                                LOCKED
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-[#9E9E9E] mt-3 ml-3">
                                                        Code:
                                                        <span className="text-black ml-2">
                                                            COURSE_01
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="listCourse__item-bottom">
                                            <button className="text-[#1167B4] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/eye.svg"
                                                    alt=""
                                                />
                                                Chi Tiết
                                            </button>
                                            <button className="text-[#7017E2] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/arrow_circle_up.svg"
                                                    alt=""
                                                />
                                                Lên
                                            </button>
                                            <button className="text-[#7017E2] mb-1 font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    src="/assets/svg/arrow_circle_down.svg"
                                                    alt=""
                                                />
                                                Xuống
                                            </button>
                                            <button className="text-[#FF5252] font-bold flex items-center gap-2 justify-center">
                                                <img
                                                    className=""
                                                    src="/assets/svg/remove.svg"
                                                    alt=""
                                                />
                                                Xóa khỏi Danh Sách
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isPopupVisible && (
                        <div className="listCourse__popup show">
                            <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
                                Tìm Kiếm Môn Học
                            </h3>

                            <input
                                className="input_form my-6"
                                type="text"
                                placeholder="Nhập từ khóa tìm kiếm..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />

                            <div className="border-b border-solid border-[#0000001f] mx-[-24px] py-3 mb-12"></div>

                            {filteredCourses.length === 0 && searchTerm ? (
                                <p className="text-[#9E9E9E] text-[14px] mt-3">
                                    Không tìm thấy kết quả cho "{searchTerm}"
                                </p>
                            ) : (
                                <div className="listCourse__popup-list">
                                    {filteredCourses.map((course) => (
                                        <div
                                            key={course.code}
                                            className="listCourse__popup-item flex items-center justify-between"
                                        >
                                            <div className="flex gap-5 items-center">
                                                <div className="teaching__card-thumb !w-[80px] h-[60px]">
                                                    <img
                                                        src="/assets/svg/img_preview.svg"
                                                        alt=""
                                                        className="teaching_card-img"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[#1167B4] text-[16px] font-bold">
                                                        {course.name}
                                                    </p>
                                                    <p className="text-[#9E9E9E] text-[14px] mt-3">
                                                        Code:
                                                        <span className="text-black text-[14px] ml-2">
                                                            {course.code}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="ui-checkbox"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {filteredCourses.length > 0 && (
                                <div className="next__page-group font-bold my-4 gap-y-3">
                                    <div className="next__page flex items-center gap-4">
                                        <button>
                                            <img
                                                src="/assets/svg/arrow_left_gray.svg"
                                                alt=""
                                            />
                                        </button>
                                        <span>1</span>
                                        <span>2</span>
                                        <button>
                                            <img
                                                src="/assets/svg/arrow_right.svg"
                                                alt=""
                                            />
                                        </button>
                                    </div>

                                    <div className="next_page-list">
                                        (1 ~ 3 | 10)
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end items-center gap-4">
                                <button
                                    className="btn btn--cancel"
                                    onClick={togglePopup}
                                >
                                    Hủy bỏ
                                </button>
                                <button className="btn btn--primary">
                                    Lưu lại
                                </button>
                            </div>
                        </div>
                    )}

                    {isPopupVisible && (
                        <div
                            className="overlay js-toggle"
                            onClick={togglePopup}
                        ></div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ListCourse;
