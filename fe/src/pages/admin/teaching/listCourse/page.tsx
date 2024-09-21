import React, { useState } from "react";
import { Link } from "react-router-dom";

const ListCourse = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreatingNewCourse, setIsCreatingNewCourse] = useState(false);
    const [courseForm, setCourseForm] = useState({
        code: "",
        name: "",
        description: "",
        type: "offline",
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const courses = [
        { name: "Môn Học 01", code: "COURSE_01" },
        { name: "Môn Học 02", code: "COURSE_02" },
        { name: "Môn Học 03", code: "COURSE_03" },
    ];

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        setIsCreatingNewCourse(false);
        setCourseForm({
            code: "",
            name: "",
            description: "",
            type: "online",
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateNewCourse = () => {
        setIsCreatingNewCourse(true);
    };

    const handleSelectCourse = () => {
        console.log("Course selected");
    };

    const handleFormSubmit = () => {
        console.log("Form data:", courseForm);

        togglePopup();
    };
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
                            {isCreatingNewCourse ? (
                                <div className="createCourseForm pb-6">
                                    <h3 className="text-[#7017E2] text-[20px] font-semibold mb-4">
                                        Tạo Nhanh Môn Học Mới
                                    </h3>

                                    <form autoComplete="off">
                                        <div className=" teaching__add   ">
                                            <div className="">
                                                <div className="teaching_add-form-left ">
                                                    <div className="teaching__add-form-group mt-8">
                                                        <input
                                                            className="input_form"
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            placeholder="Code"
                                                        />
                                                        {/* <span className="ml-1 text-red-600 text-[12px] font-bold italic">
                                            Vui lòng điền vào trường này
                                        </span> */}
                                                    </div>

                                                    <div className="teaching__add-form-group mt-8">
                                                        <input
                                                            className="input_form"
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            placeholder="Tên"
                                                        />
                                                        {/* <span className="ml-1 text-red-600 text-[12px] font-bold italic">
                                            Vui lòng điền vào trường này
                                        </span> */}
                                                    </div>

                                                    <div className="teaching__add-form-group mt-8">
                                                        <textarea
                                                            className="input_form"
                                                            placeholder="Mô tả"
                                                            rows={3}
                                                        ></textarea>
                                                        {/* <span className="ml-1 text-red-600 text-[12px] font-bold italic">
                                            Vui lòng điền vào trường này
                                        </span> */}
                                                    </div>

                                                    <div className="teaching__add-form-group mt-8">
                                                        <select
                                                            className="input_form "
                                                            defaultValue=""
                                                        >
                                                            <option
                                                                className="black"
                                                                value=""
                                                                disabled
                                                                hidden
                                                            >
                                                                Chọn hình thức
                                                                học
                                                                online/offline
                                                            </option>
                                                            <option value="online">
                                                                Online
                                                            </option>
                                                            <option value="offline">
                                                                Offline
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="my-5">
                                                <div className="teaching_add-form-lef">
                                                    <div className="row justify-between items-center">
                                                        <p>Logo</p>
                                                        <div className="flex">
                                                            <div className="file-input-wrapper">
                                                                <input
                                                                    className="input_form"
                                                                    type="file"
                                                                    id="file-input"
                                                                    accept="image/*"
                                                                    onChange={
                                                                        handleFileChange
                                                                    } // Gọi hàm khi file thay đổi
                                                                />
                                                                <label htmlFor="file-input">
                                                                    <img
                                                                        src="/assets/svg/img_small.svg"
                                                                        alt="Upload"
                                                                        className="upload-image"
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <img
                                                                    src="/assets/svg/trash.svg"
                                                                    alt="Trash"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Preview Image */}
                                                    <div className="image-preview-group mt-1">
                                                        <div id="image-preview">
                                                            {preview ? (
                                                                <img
                                                                    src={
                                                                        preview
                                                                    }
                                                                    alt="Preview"
                                                                    className="max-w-full h-auto"
                                                                />
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="81"
                                                                    height="80"
                                                                    viewBox="0 0 81 80"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M17.4167 73.3334C14.639 73.3334 12.2779 72.3612 10.3334 70.4167C8.38897 68.4723 7.41675 66.1112 7.41675 63.3334V16.6667C7.41675 13.889 8.38897 11.5279 10.3334 9.58341C12.2779 7.63897 14.639 6.66675 17.4167 6.66675H64.0834C66.8612 6.66675 69.2223 7.63897 71.1667 9.58341C73.1112 11.5279 74.0834 13.889 74.0834 16.6667V63.3334C74.0834 66.1112 73.1112 68.4723 71.1667 70.4167C69.2223 72.3612 66.8612 73.3334 64.0834 73.3334H17.4167ZM17.4167 66.6667H64.0834C65.0279 66.6667 65.819 66.3467 66.4567 65.7067C67.0967 65.069 67.4167 64.2779 67.4167 63.3334V16.6667C67.4167 15.7223 67.0967 14.9301 66.4567 14.2901C65.819 13.6523 65.0279 13.3334 64.0834 13.3334H17.4167C16.4723 13.3334 15.6801 13.6523 15.0401 14.2901C14.4023 14.9301 14.0834 15.7223 14.0834 16.6667V63.3334C14.0834 64.2779 14.4023 65.069 15.0401 65.7067C15.6801 66.3467 16.4723 66.6667 17.4167 66.6667ZM20.7501 60.0001L34.0834 46.6667L40.0834 52.5834L47.4167 43.3334L60.7501 60.0001H20.7501ZM27.4167 33.3334C25.5834 33.3334 24.0145 32.6801 22.7101 31.3734C21.4034 30.069 20.7501 28.5001 20.7501 26.6667C20.7501 24.8334 21.4034 23.2645 22.7101 21.9601C24.0145 20.6534 25.5834 20.0001 27.4167 20.0001C29.2501 20.0001 30.8201 20.6534 32.1267 21.9601C33.4312 23.2645 34.0834 24.8334 34.0834 26.6667C34.0834 28.5001 33.4312 30.069 32.1267 31.3734C30.8201 32.6801 29.2501 33.3334 27.4167 33.3334Z"
                                                                        fill="black"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Url Image */}
                                                    <div className="mt-3 url-img-group">
                                                        <img
                                                            src="/assets/svg/img_small.svg"
                                                            alt="Image Icon"
                                                        />
                                                        <p>
                                                            {fileName
                                                                ? fileName
                                                                : "No image selected"}
                                                        </p>
                                                        {/* Hiển thị tên file */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <>
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

                                    {filteredCourses.length === 0 &&
                                    searchTerm ? (
                                        <div className="flex flex-col gap-4 items-center mb-36">
                                            <p className="text-[#9E9E9E] text-[14px] mt-3 text-center">
                                                Không tìm thấy kết quả cho "
                                                {searchTerm}
                                                "
                                                <br />
                                                Mời bạn tìm kiếm lại hoặc Tạo
                                                nhanh môn học.
                                            </p>
                                            <button
                                                className="btn btn--outline text-[#1167B4]"
                                                onClick={handleCreateNewCourse}
                                            >
                                                Tạo Nhanh Môn Học
                                            </button>
                                        </div>
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
                                                                    {
                                                                        course.code
                                                                    }
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

                                    {/* Next Page */}
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
                                </>
                            )}

                            {/* Action buttons */}
                            <div className="flex justify-end items-center gap-4">
                                <button
                                    className="btn btn--cancel"
                                    onClick={togglePopup}
                                >
                                    Hủy bỏ
                                </button>
                                {isCreatingNewCourse ? (
                                    <button
                                        className="btn btn--primary"
                                        onClick={handleFormSubmit}
                                    >
                                        Thêm mới
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn--primary"
                                        onClick={handleSelectCourse}
                                    >
                                        Lựa chọn
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Overlay */}
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
