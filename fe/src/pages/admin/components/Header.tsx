import React from "react";

const HeaderAdmin = () => {
    return (
        <>
            <header className="header_wrapper">
                <div className="container">
                    <div className="header">
                        <div className="header__right">
                            <button className="header__btn-more">
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
        </>
    );
};

export default HeaderAdmin;
