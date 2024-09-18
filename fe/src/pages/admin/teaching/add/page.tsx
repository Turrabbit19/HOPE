import React, { useState } from "react";

const TeachAdd = () => {
    // State để lưu URL preview của hình ảnh
    const [preview, setPreview] = useState<string | null>(null);

    // Hàm xử lý khi người dùng chọn file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Lấy file đầu tiên được chọn
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string); // Đặt URL của hình ảnh vào state
            };
            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
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
                    <form autoComplete="off" className="teaching__add-form">
                        <div className="row row-cols-2 g-3 items-center">
                            <div className="col-5">
                                <div className="teaching_add-form-left ">
                                    <h1 className="text-[#1167B4] text-[20px] font-semibold">
                                        Tổng quan
                                    </h1>

                                    <div className="teaching__add-form-group mt-8">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Code"
                                        />
                                        <span className="ml-1 text-red-600 text-[12px] font-bold italic">
                                            Vui lòng điền vào trường này
                                        </span>
                                    </div>

                                    <div className="teaching__add-form-group mt-8">
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Code"
                                        />
                                        <span className="ml-1 text-red-600 text-[12px] font-bold italic">
                                            Vui lòng điền vào trường này
                                        </span>
                                    </div>

                                    <div className="teaching__add-form-group mt-8">
                                        <textarea
                                            placeholder="Mô tả"
                                            rows={5}
                                        ></textarea>
                                        <span className="ml-1 text-red-600 text-[12px] font-bold italic">
                                            Vui lòng điền vào trường này
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-7">
                                <div className="teaching_add-form-left bg-slate-100">
                                    <div className="row justify-between items-center">
                                        <p>Logo</p>
                                        <div className="flex gap-3">
                                            <div className="file-input-wrapper">
                                                <input
                                                    type="file"
                                                    id="file-input"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
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

                                    <div id="image-preview">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="max-w-full h-auto"
                                            />
                                        ) : (
                                            <p>No image selected</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TeachAdd;
