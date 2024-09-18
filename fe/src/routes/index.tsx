import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LayoutAdmin from "../pages/admin/layout";
import Teach from "../pages/admin/teaching/page";
import TeachAdd from "../pages/admin/teaching/add/page";

const Router = createBrowserRouter([
    {
        path: "admin",
        element: <LayoutAdmin />,
        children: [
            {
                path: "teaching",
                element: <Teach />,
            },
            {
                path: "teaching/add",
                element: <TeachAdd />,
            },
        ],
    },
]);

export default Router;
