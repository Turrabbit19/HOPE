import React, { useState } from "react";
import { Layout, Menu, Select } from "antd";
import { useTranslation } from "react-i18next";
const HeaderAdmin = ({ toggleAside }) => {
    const { Header } = Layout;
    const { t, i18n } = useTranslation();

    const handleChange = (value) => {
        if (value == "vi") {
            i18n.changeLanguage("vi");
        } else {
            i18n.changeLanguage("en");
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
                    <path
                        d="M0,0 L60,30 M60,0 L0,30"
                        stroke="#fff"
                        strokeWidth={6}
                    />
                    <path
                        d="M0,0 L60,30 M60,0 L0,30"
                        clipPath="url(#t)"
                        stroke="#C8102E"
                        strokeWidth={4}
                    />
                    <path
                        d="M30,0 v30 M0,15 h60"
                        stroke="#fff"
                        strokeWidth={10}
                    />
                    <path
                        d="M30,0 v30 M0,15 h60"
                        stroke="#C8102E"
                        strokeWidth={6}
                    />
                </g>
            </svg>
            <span>Tiếng Anh</span>
        </div>
    );

    return (
        <header className="header_wrapper">
            <div className="container">
                <div className="header">
                    <div className="header__right">
                        <button
                            className="header__btn-more"
                            onClick={toggleAside}
                        >
                            <img src="/assets/svg/more.svg" alt="" />
                        </button>
                        <a href="/" className="logo">
                            <img
                                src="/assets/img/logo.png"
                                alt=""
                                className="logo__img"
                            />
                        </a>
                    </div>
                    <div className="header__left">
                        <button className="header__btn-select">
                            <img src="/assets/svg/selection.svg" alt="" />
                        </button>
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
                        <div className="header__user">
                            <img
                                src="/assets/img/avatar.jpg"
                                alt=""
                                className="header__user-avatar"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;
