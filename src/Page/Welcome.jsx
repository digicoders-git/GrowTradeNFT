import React from "react";

const WelcomeCard = () => {
  return (
    <div className="w-screen h-screen bg-[#dff1e6]">
      <div className="w-full h-full bg-[#ededed] relative overflow-hidden">
        {/* Fake iOS Status Bar */}
        <div className="absolute top-4 left-4 text-xs text-gray-500 z-20">
          9:41
        </div>

        {/* IMAGE SECTION */}
        <div className="relative h-[70%] flex items-end justify-center">
          <img
            src="/girl.png"
            alt="Girl"
            className="h-[97%] object-contain "
          />

          {/* CURVE BETWEEN IMAGE & TEXT */}
          {/* CURVE BETWEEN IMAGE & TEXT (SYMMETRIC) */}
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
        <div className="h-[30%] bg-white px-6 pt-6">
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
            Welcome To <br /> UiLover
          </h1>

          <p className="text-gray-400 text-[13px] mt-3 max-w-[260px]">
            Download all the designs available on the uilover channel for free
          </p>

          <div className="flex justify-end mt-6">
            <button className="bg-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold">
              get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
