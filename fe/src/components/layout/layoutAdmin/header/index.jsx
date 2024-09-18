import React, { useState } from "react";
import { Layout, Menu, Select } from "antd";
import { useTranslation } from "react-i18next";
const HeaderAdmin = () => {
  const { Header } = Layout;
  const { t, i18n } = useTranslation();
  const items1 = [t("hello"), "2", "3"].map((key) => ({
    key,
    label: `${key}`,
  }));
  const handleChange = (value) => {
    if(value == "vi"){
      i18n.changeLanguage("vi")
    }else {
      i18n.changeLanguage("en")
    }
  };
  const labelOfVietNam = (
    <div className="flex items-center gap-1">
      <svg
        width="30"
        height="20"
        viewBox="0 0 30 20"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <rect width="30" height="20" fill="#da251d" />
        <polygon
          points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85"
          fill="#ff0"
        />
      </svg>{" "}
      <span>Tiếng Việt</span>
    </div>
  );
  const labelOfEnglish = (
    <div className="flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 30"
        width={40}
        height={20}
      >
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth={6} />
          <path
            d="M0,0 L60,30 M60,0 L0,30"
            clipPath="url(#t)"
            stroke="#C8102E"
            strokeWidth={4}
          />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth={10} />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth={6} />
        </g>
      </svg>
      <span>Tiếng Anh</span>
    </div>
  );

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        background: "black",
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items1}
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          alignItems: "center",
          background: "black",
        }}
      />
      <div>
        <Select
          defaultValue="vi"
          onChange={handleChange}
          style={{
            width: 120,
          }}
          options={[
            {
              value: "vi",
              label: labelOfVietNam,
            },
            {
              value: "en",
              label: labelOfEnglish,
            },
          ]}
        />
      </div>
    </Header>
  );
};

export default HeaderAdmin;
