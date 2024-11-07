import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/page.jsx";
// import ThemeProvisder from "./theme/themeContext/index.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* <ThemeProvider> */}
        <RouterProvider router={Router} />
        {/* </ThemeProvider> */}
    </StrictMode>
);
