import React from "react";
import { RouterProvider } from "react-router-dom";
import Router from "./routes"; // File routes của bạn đã cấu hình

function App() {
    return <RouterProvider router={Router} />;
}

export default App;
