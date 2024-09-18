import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <App /> {/* Đã có RouterProvider trong App.tsx */}
        </React.StrictMode>
    </QueryClientProvider>
);
