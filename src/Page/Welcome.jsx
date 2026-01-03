import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomeCard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-[#dff1e6]">
      <div className="w-full h-full bg-[#ededed] relative overflow-hidden">
        {/* IMAGE SECTION */}
        <div className="relative h-[70%] flex items-end justify-center">
          <img
            src="/girl.png"
            alt="NFT Girl"
            className="h-[97%] object-contain"
          />

          {/* CURVE BETWEEN IMAGE & TEXT */}
          <svg
            viewBox="0 0 1440 120"
            className="absolute bottom-0 w-full h-[80px] z-10"
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

        {/* WHITE TEXT SECTION */}
        <div className="h-[30%] bg-white px-6 pt-6 relative overflow-hidden">
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
            Welcome To <br /> Change Token
          </h1>

          <p className="text-gray-400 text-[13px] mt-3 max-w-[260px]">
            Discover, trade, and manage next-generation NFTs powered by secure
            blockchain technology.
          </p>

          {/* BUTTON CURVED CORNER */}
          <div className="absolute bottom-0 right-0 w-[150px] h-[90px] bg-white rounded-tl-[70px] flex items-center justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold"
            >
              explore NFTs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
