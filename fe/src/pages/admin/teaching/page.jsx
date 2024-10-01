import { Pagination } from "antd";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Teach = () => {
    return (
        <>
            <div className="teaching">
                <div className="container">
                    <div className="row justify-between">
                        <h1 className="flex gap-2 items-center text-[#7017E2] text-[18px] font-semibold">
                            Quản Lý Chuyên Ngành
                            <button>
                                <img
                                    src="/assets/svg/reload.svg"
                                    alt="reload..."
                                />
                            </button>
                        </h1>

                        <div>
                            <button className="btn btn--outline text-[#1167B4] ">
                                <img src="/assets/svg/filter.svg" alt="" />
                                Bộ Lọc
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <Link
                            to={`add`}
                            className="btn btn--outline  text-[#7017E2] "
                        >
                            <img src="/assets/svg/plus.svg" alt="" />
                            Tạo mới
                        </Link>

                        <span className="font-bold text-[14px] text-[#000]">
                            6 items
                        </span>
                    </div>

                    {/* Teaching program */}
                    <div className=" row row-cols-2 g-3">
                        {/* Teaching__Card 1 */}
                        <div className="col ">
                            <div className="teaching__card">
                                <div className="teaching__card-top">
                                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                        <img
                                            src="/assets/svg/share.svg"
                                            alt=""
                                        />
                                        Chuyên ngành:{" "}
                                        <p className="text-red-300 uppercase ml-2 font-bold">
                                            Thiết kế website
                                        </p>
                                    </h2>
                                    <button>
                                        <img
                                            src="/assets/svg/more_detail.svg"
                                            alt=""
                                        />
                                    </button>
                                </div>

                                <div className="teaching__card-body">
                                    {/* Content */}
                                    <div className="mt-6 flex flex-col gap-8 pb-6">
                                        <div className="flex gap-6">
                                            <p className="text-[#9E9E9E]">
                                                Trạng thái :
                                            </p>
                                            <div className="teaching__card-status">
                                                <img
                                                    className="svg-green"
                                                    src="/assets/svg/status.svg"
                                                    alt=""
                                                />
                                                <span className="text-[#44CC15] text-[12px]">
                                                    Kích hoạt
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <p className="text-[#9E9E9E]">
                                                Code :
                                            </p>
                                            <p className="font-bold text-[#000]">
                                                0000000001
                                            </p>
                                        </div>
                                        <div className="">
                                            <p className="text-[#9E9E9E] mb-3">
                                                Mô tả :
                                            </p>
                                            <p className="text-[14px] line-clamp-2">
                                                The Nagasaki Lander is the
                                                trademarked name of several
                                                series of Nagasaki sport bikes.
                                                The Nagasaki Lander is the
                                                trademarked name of several
                                                series of ...
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="teaching__card-bottom">
                                    <Link
                                        to="list"
                                        className="flex items-center gap-3 text-[#1167B4] font-bold"
                                    >
                                        <img
                                            src="/assets/svg/setting.svg"
                                            alt=""
                                        />
                                        Quản Lý Chương Trình Dạy
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Teaching__Card 1 */}
                        <div className="col ">
                            <div className="teaching__card">
                                <div className="teaching__card-top">
                                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                        <img
                                            src="/assets/svg/share.svg"
                                            alt=""
                                        />
                                        Chuyên ngành:{" "}
                                        <p className="text-red-300 uppercase ml-2 font-bold">
                                            Thiết kế website
                                        </p>
                                    </h2>
                                    <button>
                                        <img
                                            src="/assets/svg/more_detail.svg"
                                            alt=""
                                        />
                                    </button>
                                </div>

                                <div className="teaching__card-body">
                                    {/* Content */}
                                    <div className="mt-6 flex flex-col gap-8 pb-6">
                                        <div className="flex gap-6">
                                            <p className="text-[#9E9E9E]">
                                                Trạng thái :
                                            </p>
                                            <div className="teaching__card-status">
                                                <img
                                                    className="svg-green"
                                                    src="/assets/svg/status.svg"
                                                    alt=""
                                                />
                                                <span className="text-[#44CC15] text-[12px]">
                                                    Kích hoạt
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <p className="text-[#9E9E9E]">
                                                Code :
                                            </p>
                                            <p className="font-bold text-[#000]">
                                                0000000001
                                            </p>
                                        </div>
                                        <div className="">
                                            <p className="text-[#9E9E9E] mb-3">
                                                Mô tả :
                                            </p>
                                            <p className="text-[14px] line-clamp-2">
                                                The Nagasaki Lander is the
                                                trademarked name of several
                                                series of Nagasaki sport bikes.
                                                The Nagasaki Lander is the
                                                trademarked name of several
                                                series of ...
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="teaching__card-bottom">
                                    <Link
                                        to="list"
                                        className="flex items-center gap-3 text-[#1167B4] font-bold"
                                    >
                                        <img
                                            src="/assets/svg/setting.svg"
                                            alt=""
                                        />
                                        Quản Lý Chương Trình Dạy
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Teaching__Card 1 */}
                        <div className="col ">
                            <div className="teaching__card">
                                <div className="teaching__card-top">
                                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                        <img
                                            src="/assets/svg/share.svg"
                                            alt=""
                                        />
                                        Chuyên ngành:{" "}
                                        <p className="text-red-300 uppercase ml-2 font-bold">
                                            Thiết kế website
                                        </p>
                                    </h2>
                                    <button>
                                        <img
                                            src="/assets/svg/more_detail.svg"
                                            alt=""
                                        />
                                    </button>
                                </div>

                                <div className="teaching__card-body">
                                    {/* Content */}
                                    <div className="mt-6 flex flex-col gap-8 pb-6">
                                        <div className="flex gap-6">
                                            <p className="text-[#9E9E9E]">
                                                Trạng thái :
                                            </p>
                                            <div className="teaching__card-status">
                                                <img
                                                    className="svg-green"
                                                    src="/assets/svg/status.svg"
                                                    alt=""
                                                />
                                                <span className="text-[#44CC15] text-[12px]">
                                                    Kích hoạt
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <p className="text-[#9E9E9E]">
                                                Code :
                                            </p>
                                            <p className="font-bold text-[#000]">
                                                0000000001
                                            </p>
                                        </div>
                                        <div className="">
                                            <p className="text-[#9E9E9E] mb-3">
                                                Mô tả :
                                            </p>
                                            <p className="text-[14px] line-clamp-2">
                                                The Nagasaki Lander is the
                                                trademarked name of several
                                                series of Nagasaki sport bikes.
                                                The Nagasaki Lander is the
                                                trademarked name of several
                                                series of ...
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="teaching__card-bottom">
                                    <Link
                                        to="list"
                                        className="flex items-center gap-3 text-[#1167B4] font-bold"
                                    >
                                        <img
                                            src="/assets/svg/setting.svg"
                                            alt=""
                                        />
                                        Quản Lý Chương Trình Dạy
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Teaching__Card 1 */}
                        <div className="col ">
                            <div className="teaching__card">
                                <div className="teaching__card-top">
                                    <h2 className="teaching_card-title flex items-center gap-2 text-[#1167B4] font-bold text-[16px]">
                                        <img
                                            src="/assets/svg/share.svg"
                                            alt=""
                                        />
                                        Chuyên ngành:{" "}
                                        <p className="text-red-300 uppercase ml-2 font-bold">
                                            Thiết kế website
                                        </p>
                                    </h2>
                                    <button>
                                        <img
                                            src="/assets/svg/more_detail.svg"
                                            alt=""
                                        />
                                    </button>
                                </div>

                                <div className="teaching__card-body">
                                    {/* Content */}
                                    <div className="mt-6 flex flex-col gap-8 pb-6">
                                        <div className="flex gap-6">
                                            <p className="text-[#9E9E9E]">
                                                Trạng thái :
                                            </p>
                                            <div className="teaching__card-status">
                                                <img
                                                    className="svg-green"
                                                    src="/assets/svg/status.svg"
                                                    alt=""
                                                />
                                                <span className="text-[#44CC15] text-[12px]">
                                                    Kích hoạt
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <p className="text-[#9E9E9E]">
                                                Code :
                                            </p>
                                            <p className="font-bold text-[#000]">
                                                0000000001
                                            </p>
                                        </div>
                                        <div className="">
                                            <p className="text-[#9E9E9E] mb-3">
                                                Mô tả :
                                            </p>
                                            <p className="text-[14px] line-clamp-2">
                                                The Nagasaki Lander is the
                                                trademarked name of several
                                                series of Nagasaki sport bikes.
                                                The Nagasaki Lander is the
                                                trademarked name of several
                                                series of ...
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="teaching__card-bottom">
                                    <Link
                                        to="list"
                                        className="flex items-center gap-3 text-[#1167B4] font-bold"
                                    >
                                        <img
                                            src="/assets/svg/setting.svg"
                                            alt=""
                                        />
                                        Quản Lý Chương Trình Dạy
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Page */}
                    {/* <div className="next__page-group font-bold my-20 gap-y-3">
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
                                <img src="/assets/svg/arrow_right.svg" alt="" />
                            </button>
                        </div>

                        <div className="next_page-list">(1 ~ 3 | 10)</div>
                    </div> */}

                    <Pagination
                        className="mt-12"
                        align="center"
                        defaultCurrent={1}
                        total={50}
                    />
                </div>
            </div>
        </>
    );
};

export default Teach;
