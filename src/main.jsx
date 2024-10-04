import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/index.jsx";
// import ThemeProvisder from "./theme/themeContext/index.jsx";
import "./i18n/i18n";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ThemeProvider> */}
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#1167B4",

          borderRadius: 4,

          // Alias Token
          // colorBgContainer: "#f6ffed",
        },
      }}
    >

      <RouterProvider router={Router} />
    </ConfigProvider>
    {/* </ThemeProvider> */}
  </StrictMode>
);
