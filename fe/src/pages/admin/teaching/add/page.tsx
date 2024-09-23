import React, { useState } from "react";

const TeachAdd = () => {
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

    return (
        <>
            <div className="teaching_add">
                <div className="container">
                    <div className="row justify-between">
                        <h1 className="flex gap-2 items-center text-[#7017E2] text-[24px] font-semibold">
                            Tạo Mới Chương Trình Dạy
                        </h1>

                        <div className="flex gap-5">
                            <button className="btn">
                                <img
                                    className="w-[16px] h-[16px] object-cover"
                                    src="/assets/svg/close.svg"
                                    alt="close..."
                                />
                            </button>
                            <button className="btn">
                                <img
                                    className="w-[16px] h-[16px] object-cover"
                                    src="/assets/svg/save.svg"
                                    alt="save..."
                                />
                            </button>
                        </div>
                    </div>

                    {/* FORM */}
                    <form autoComplete="off">
                        <div className="flex row-cols-2 justify-between items-center teaching__add   ">
                            <div className="col-5">
                                <div className="teaching_add-form-left ">
                                    <h1 className="text-[#1167B4] text-[20px] mt-4 font-semibold">
                                        Tổng quan
                                    </h1>

                                    <div className="teaching__add-form-group mt-14">
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

                                    <div className="teaching__add-form-group mt-14">
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

                                    <div className="teaching__add-form-group mt-14 mb-8">
                                        <textarea
                                            className="input_form"
                                            placeholder="Mô tả"
                                            rows={3}
                                        ></textarea>
                                        {/* <span className="ml-1 text-red-600 text-[12px] font-bold italic">
                                            Vui lòng điền vào trường này
                                        </span> */}
                                    </div>
                                </div>
                            </div>

                            <div className="col-6">
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
                                                    onChange={handleFileChange} // Gọi hàm khi file thay đổi
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
                                                    src={preview}
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

                    {/* Actions */}
                    <div className="flex justify-center items-center gap-4 mt-16">
                        <button className="btn btn--cancel">
                            <img src="/assets/svg/cancel.svg" alt="" />
                            Hủy bỏ
                        </button>
                        <button className="btn btn--primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="18"
                                viewBox="0 0 19 18"
                                fill="none"
                            >
                                <g clip-path="url(#clip0_2067_204)">
                                    <path
                                        d="M13.25 2.25H4.25C3.4175 2.25 2.75 2.925 2.75 3.75V14.25C2.75 15.075 3.4175 15.75 4.25 15.75H14.75C15.575 15.75 16.25 15.075 16.25 14.25V5.25L13.25 2.25ZM9.5 14.25C8.255 14.25 7.25 13.245 7.25 12C7.25 10.755 8.255 9.75 9.5 9.75C10.745 9.75 11.75 10.755 11.75 12C11.75 13.245 10.745 14.25 9.5 14.25ZM11.75 6.75H4.25V3.75H11.75V6.75Z"
                                        fill="white"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2067_204">
                                        <rect
                                            width="18"
                                            height="18"
                                            fill="white"
                                            transform="translate(0.5)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                            Lưu lại
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeachAdd;
