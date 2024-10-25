import React, { useState } from "react";
import slide1 from "../../assets/slide1.jpg";
import slide2 from "../../assets/slide2.jpg";
import slide3 from "../../assets/slide3.jpg";
import "./style.css";
import { Carousel } from "antd";
import {
  LeftCircleOutlined,
  LeftOutlined,
  RightCircleFilled,
  RightCircleTwoTone,
  RightOutlined,
} from "@ant-design/icons";

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

  const contentStyle = {
    margin: 0,
    height: "160px",
    lineHeight: "160px",
    textAlign: "center",
  };
  return (
    <div>
      <Carousel arrows>
        <div>
          <div>
            <img
              className="px-8 pb-10 h-[1000px] w-full"
              src={sliderItems[0].src}
              alt=""
            />
          </div>
        </div>
        <div>
          <div>
            <img
              className="px-8 pb-10 h-[1000px] w-full"
              src={sliderItems[1].src}
              alt=""
            />
          </div>{" "}
        </div>
        <div>
          <div>
            <img
              className="px-8 pb-10 h-[1000px] w-full"
              src={sliderItems[2].src}
              alt=""
            />
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselLandingPage;
