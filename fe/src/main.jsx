import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/index.jsx";
// import ThemeProvisder from "./theme/themeContext/index.jsx";
import "./i18n/i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ThemeProvider> */}
      <RouterProvider router={Router} />
    {/* </ThemeProvider> */}
  </StrictMode>
);
