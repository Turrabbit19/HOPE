import React from "react";
import HeaderAdmin from "./components/Header";
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
    return (
        <>
            <HeaderAdmin />
            <Outlet />
        </>
    );
};

export default LayoutAdmin;
