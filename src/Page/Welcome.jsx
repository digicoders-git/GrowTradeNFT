import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

const WelcomeCard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-[#dff1e6] overflow-hidden">
      <div className="w-full h-full bg-[#ededed] flex flex-col">
        {/* ===== LOTTIE SECTION (TOUCHING CURVE) ===== */}
        <div className="relative h-[55%] flex items-end justify-center overflow-hidden">
          <div className="w-full max-w-[320px]">
            <Lottie
              path="/WelcomeGreen.json"
              loop
              autoplay
              className="w-full h-auto"
            />
          </div>

          {/* CURVE */}
          <svg
            viewBox="0 0 1440 120"
            className="absolute bottom-0 w-full h-[60px]"
            preserveAspectRatio="none"
          >
            <path
              d="
                M0,0
                C240,120 480,120 720,120
                C960,120 1200,120 1440,0
                L1440,120
                L0,120
                Z
              "
              fill="white"
            />
          </svg>
        </div>

        {/* ===== TEXT SECTION ===== */}
        <div className="flex-1 bg-white px-6 pt-6 pb-4">
          <h1 className="text-[26px] font-bold text-gray-900 leading-tight">
            Welcome To <br /> Change Token
          </h1>

          <p className="text-gray-400 text-[13px] mt-3 max-w-[260px]">
            Discover, trade, and manage next-generation NFTs powered by secure
            blockchain technology.
          </p>

          {/* BUTTON */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold"
            >
              Explore NFTs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
