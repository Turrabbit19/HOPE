// src/main.jsx hoặc src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import Router from "./routes/page.jsx";
import AuthProvider from "./context/authProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </React.StrictMode>
);
