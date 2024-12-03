import React, { useState } from "react";
import slide1 from "../../assets/slide1.jpg";
import slide2 from "../../assets/slide2.jpg";
import slide3 from "../../assets/slide3.jpg";
import "./style.css";

const CarouselLandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const sliderItems = [
    { src: slide1, type: "FLOWER" },
    { src: slide2, type: "NATURE" },
    { src: slide3, type: "PLANT" },
  ];

  const moveSlider = (direction) => {
    setDirection(direction);
    setCurrentIndex((prevIndex) => {
      const newIndex =
        direction === "next"
          ? (prevIndex + 1) % sliderItems.length
          : (prevIndex - 1 + sliderItems.length) % sliderItems.length;
      return newIndex;
    });
  };

  const handleAnimationEnd = () => {
    setDirection(null);
  };
  return (
    <>
      <div
        className={`slider relative overflow-hidden h-screen w-screen mt-[-50px] ${
          direction || ""
        }`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="list absolute inset-0 w-full h-full">
          {sliderItems.map((item, index) => (
            <div
              key={index}
              className={`item absolute inset-0 w-full h-full ${
                index === currentIndex ? "block" : "hidden"
              }`}
            >
              <img
                src={item.src}
                alt=""
                className="w-full h-full object-fill"
              />
            </div>
          ))}
        </div>

        <div className="thumbnail absolute bottom-12 left-[70%] transform -translate-x-1/2 flex gap-5 z-10">
          {sliderItems.map((item, index) => (
            <div
              key={index}
              className={`item w-[150px] h-[220px] flex-shrink-0 relative ${
                index === currentIndex ? "opacity-100" : "opacity-50"
              }`}
            >
              <img
                src={item.src}
                alt=""
                className="w-full h-full object-cover rounded-[20px] shadow-md"
              />
            </div>
          ))}
        </div>

        <div className="nextPrevArrows absolute top-[80%] right-[70%] z-10 flex gap-2">
          <button
            className="w-10 h-10 rounded-full bg-black border-none text-white font-mono font-bold transition-all duration-500 hover:bg-white hover:text-black"
            onClick={() => moveSlider("prev")}
          >
            ◄
          </button>
          <button
            className="w-10 h-10 rounded-full bg-black border-none text-white font-mono font-bold transition-all duration-500 hover:bg-white hover:text-black"
            onClick={() => moveSlider("next")}
          >
            ►
          </button>
        </div>
      </div>
    </>
  );
};

export default CarouselLandingPage;
