import React from "react";
import HeaderLandingPage from "./header";
import CarouselLandingPage from "./carousel";
import HeaderAdmin from "./layout/layoutAdmin/header";

const LandingPage = () => {
    return (
        <>
            <HeaderLandingPage />
            <CarouselLandingPage />
        </>
    );
};

export default LandingPage;
