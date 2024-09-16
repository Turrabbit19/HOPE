import React from "react";
import { useRoutes } from "react-router-dom";
import HeaderAdmin from "./pages/admin/components/header";

const app = () => {
    const routes = useRoutes([
        {
            path: "admin",
            element: <HeaderAdmin />,
        },
    ]);
    return routes;
};

export default app;
