import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaRegCopy } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const generateWallet = () => {
    const random = Math.random().toString(16).substring(2, 10);
    return `0x${random}${Date.now().toString(16).slice(-8)}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    referenceId: "",
    password: "",
    confirmPassword: "",
    walletAddress: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      walletAddress: generateWallet(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const regenerateWallet = () => {
    setFormData((prev) => ({
      ...prev,
      walletAddress: generateWallet(),
    }));
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(formData.walletAddress);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Wallet address copied",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "success",
      title: "Payment Successful 🎉",
      text: "Your wallet is activated successfully",
      confirmButtonColor: "#0f7a4a",
      confirmButtonText: "Go to Login",
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="w-screen h-screen bg-[#eaf4ee] flex justify-center items-start md:items-center">
      <div className="w-full max-w-[390px] h-full bg-white flex flex-col overflow-hidden md:max-w-[820px] md:h-[90vh] md:rounded-2xl md:shadow-2xl">

        {/* TOP CURVE */}
        <div className="relative h-[230px] shrink-0 overflow-hidden">
          <svg
            viewBox="0 0 375 230"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path d="M0 0 H375 V140 C300 200 75 200 0 140 Z" fill="#0f7a4a" />
          </svg>

          <div className="absolute -top-16 right-[-60px] w-[180px] h-[180px] bg-[#7fc8a2] rounded-full"></div>

          <div className="relative z-10 px-6 pt-10 text-white">
            <p className="text-sm font-medium">Hi,</p>
            <h1 className="text-[22px] font-bold">Create Account</h1>
          </div>
        </div>

        {/* FORM */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-6">
            <div className="h-[10px]" />

            <form onSubmit={handleSubmit}>
              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div>
                  <label className="text-sm font-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@test.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>

                <div className="mt-4 md:mt-0">
                  <label className="text-sm font-semibold">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="+91XXXXXXXXXX"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>

                <div className="mt-4 md:mt-0">
                  <label className="text-sm font-semibold">
                    Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="referenceId"
                    placeholder="REF12345"
                    value={formData.referenceId}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>
              </div>

              {/* WALLET */}
              <div className="mt-4">
                <label className="text-sm font-semibold">
                  Wallet Address (Auto Generated)
                </label>
                <div className="relative mt-2">
                  <input
                    readOnly
                    value={formData.walletAddress}
                    className="w-full px-4 py-[14px] pr-20 rounded-md bg-gray-100 border text-xs"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 text-gray-600">
                    <button type="button" onClick={copyWallet}>
                      <FaRegCopy />
                    </button>
                    <button type="button" onClick={regenerateWallet}>
                      <FaArrowsRotate />
                    </button>
                  </div>
                </div>
              </div>

              {/* PASSWORD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-4">
                <div>
                  <label className="text-sm font-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>

                <div className="mt-4 md:mt-0">
                  <label className="text-sm font-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>
              </div>

              {/* PAYMENT */}
              <div className="mt-5 p-3 bg-[#eef6f1] border rounded-md text-sm">
                💳 <b>$10 One-Time Payment</b> required to activate your wallet
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-[#0f7a4a] text-white py-4 rounded-md font-bold mt-6"
              >
                Create Account & Pay $10
              </button>

              {/* 🔑 ALREADY REGISTERED */}
              <p className="text-center text-sm text-gray-600 mt-5">
                Already registered?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#0f7a4a] font-semibold cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </p>
            </form>

            <div className="h-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
