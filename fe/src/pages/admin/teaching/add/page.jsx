import { Form, Input, InputNumber, Select } from "antd";
import React, { useState } from "react";

const TeachAdd = () => {

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className="teaching_add">
        <div className="container">
          <div className="row justify-between">
            <h1 className="flex gap-2 items-center text-[#7017E2] text-[24px] font-semibold">
              Tạo Mới Chuyên Ngành
            </h1>

            <div className="flex gap-5">
              {/* close */}
              <button className="btn">
                <a href="/admin/teaching">
                  <img
                    className="w-[16px] h-[16px] object-cover"
                    src="/assets/svg/close.svg"
                    alt="close..."
                  />
                </a>
              </button>
              {/* save */}
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
          <Form
            autoComplete="off"
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 26 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="flex row-cols-2  justify-between items-center teaching__add   ">
              <div className="col-5">
                <div className="teaching_add-form-left ">
                  <h1 className="text-[#1167B4] text-[20px] mt-4 font-semibold">
                    Tổng quan
                  </h1>

                  <div className="teaching__add-form-group mt-14">
                    <Form.Item
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền vào trường này",
                        },
                        {
                          min: 5,
                          message: "Mã chương trình phải có ít nhất 5 ký tự",
                        },
                      ]}
                    >
                      <Input placeholder="Code" className="input_form" />
                    </Form.Item>
                  </div>

                  <div className="teaching__add-form-group mt-14">
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền vào trường này",
                        },
                        {
                          min: 5,
                          message: "Mã chương trình phải có ít nhất 5 ký tự",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Tên chuyên ngành"
                        className="input_form"
                      />
                    </Form.Item>
                  </div>

                  <div className="teaching__add-form-group mt-14 mb-8">
                    <Select
                      showSearch
                      placeholder="Chọn trạng thái"
                      optionFilterProp="label"
                      onChange={onChange}
                      onSearch={onSearch}
                      options={[
                        {
                          value: "Kích Hoạt",
                          label: "Kích Hoạt",
                        },
                        {
                          value: "Chưa Kích Hoạt",
                          label: "Chưa Kích Hoạt",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="teaching_add-form-lef">
                  <div className="teaching__add-form-group mt-14 mb-8">
                    <Form.Item
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền vào trường này",
                        },
                      ]}
                    >
                      <Input.TextArea placeholder="Mô tả" rows={8} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center items-center gap-4 mt-16">
              <button type="reset" className="btn btn--cancel">
                Reset
              </button>
              <button className="btn btn--primary">Thêm mới</button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default TeachAdd;
