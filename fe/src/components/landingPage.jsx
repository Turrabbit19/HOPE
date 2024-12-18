import React, { useState } from "react";
import Slider from "react-slick";
import { Button, Card } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import instance from "../config/axios";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const navigate = useNavigate();
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
  };

  const slides = [
    {
      id: 1,
      img: "https://via.placeholder.com/1200x500",
      alt: "Slide 1",
      caption: "Welcome to HOPE EDU NO1 #1",
    },
    {
      id: 2,
      img: "https://via.placeholder.com/1200x500",
      alt: "Slide 2",
      caption: "Welcome to HOPE EDU NO1 #2",
    },
    {
      id: 3,
      img: "https://via.placeholder.com/1200x500",
      alt: "Slide 3",
      caption: "Welcome to HOPE EDU NO1 #3",
    },
  ];

  const cards = [
    {
      title: "Cán bộ đào tạo",
      description: "Mô tả cho mục cán bộ đào tạo",
      icon: "👨‍🏫",
    },
    {
      title: "Giảng viên",
      description: "Mô tả cho mục giảng viên",
      icon: "🧑‍🏫",
    },
    {
      title: "Phụ huynh",
      description: "Mô tả cho mục phụ huynh",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      title: "Sinh viên",
      description: "Mô tả cho mục sinh viên",
      icon: "🎓",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCardClick = () => {
    setShowGoogleLogin(true);
  };

  const onFinish = async (credentialResponse) => {
    try {
      console.log("Google Credential:", credentialResponse.credential);
      const { data } = await instance.post("google-login", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("token", data.token);
      console.log("Server Response:", data);
      setShowGoogleLogin(false);
      const role = data.user.role;
      if (role === "Sinh viên") {
        navigate("/student/home");
      } else if (role === "Quản trị viên") {
        navigate("/admin");
      } else if (role === "Giảng viên") {
        navigate("/teacher/home");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-orange-500 text-3xl font-bold">
            HOPE POLYTECHNIC
          </h1>
          {/* Responsive nav */}
          <nav>
            <ul className="hidden md:flex space-x-6">
              {cards.map((card, index) => (
                <li key={index}>
                  <Button
                    onClick={handleCardClick}
                    className="text-gray-700 hover:text-orange-500 transition-colors duration-300"
                  >
                    {card.title}
                  </Button>
                </li>
              ))}
            </ul>
            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <button aria-label="Menu" onClick={toggleMenu}>
                <MenuOutlined className="text-2xl text-gray-700 hover:text-orange-500 transition-colors duration-300" />
              </button>
            </div>
          </nav>
        </div>
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <ul className="flex flex-col space-y-4 p-4">
              {cards.map((card, index) => (
                <li key={index}>
                  <Link
                    to={card.link}
                    className="text-gray-700 hover:text-orange-500 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)} // Close menu on click
                  >
                    {card.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Slider */}
      <section className="w-full">
        <Slider {...sliderSettings}>
          {slides.map((slide) => (
            <div key={slide.id} className="relative">
              <img
                src={slide.img}
                alt={slide.alt}
                className="w-full h-[60vh] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h2 className="text-white text-2xl sm:text-4xl font-semibold">
                  {slide.caption}
                </h2>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Card Grid */}
      <section className="max-w-7xl mt-12 mx-auto p-6 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Card
              key={index}
              hoverable
              className="shadow-lg transition-transform transform hover:scale-105"
              onClick={handleCardClick} // Trigger Google login on card click
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {showGoogleLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Login with Google</h2>
            <GoogleOAuthProvider clientId="727074021020-s38ks3vfp5kb1iugpsj275fldko3h8fp.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={onFinish}
                onError={() => {
                  console.log("Login Failed");
                }}
              ></GoogleLogin>
            </GoogleOAuthProvider>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white shadow-inner">
        <div className="max-w-7xl mx-auto p-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} HOPE POLYTECHNIC. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
