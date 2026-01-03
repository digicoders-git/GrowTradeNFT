import React, { useState } from "react";
import Swal from 'sweetalert2';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill all fields',
        confirmButtonColor: '#0f7a4a'
      });
      return;
    }

    console.log("Login Data:", formData);
  };

  return (
    <div className="w-screen h-screen bg-[#eaf4ee] flex justify-center">
      <div className="w-full max-w-[390px] h-full bg-white relative overflow-hidden flex flex-col">
        {/* ===== TOP CURVE ===== */}
        <div className="relative h-[230px] overflow-hidden shrink-0">
          <svg
            viewBox="0 0 375 230"
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="
                M0 0
                H375
                V140
                C300 200 75 200 0 140
                Z
              "
              fill="#0f7a4a"
            />
          </svg>

          <div className="absolute -top-16 right-[-60px] w-[180px] h-[180px] bg-[#7fc8a2] rounded-full"></div>

          <div className="relative z-10 px-6 pt-10 text-white">
            <p className="text-sm font-medium">Hi,</p>
            <h1 className="text-[22px] font-bold leading-tight">
              Please Login
            </h1>
          </div>
        </div>

        {/* ===== CENTER FORM AREA ===== */}
        <div className="flex-1 flex  pt-10 justify-center">
          <form onSubmit={handleSubmit} className="w-full px-6">
            {/* EMAIL */}
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@test.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border border-[#b7d9c6] text-sm focus:outline-none focus:border-[#0f7a4a]"
            />

            {/* PASSWORD */}
            <label className="text-sm font-semibold text-gray-700 mt-4 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border border-[#b7d9c6] text-sm focus:outline-none focus:border-[#0f7a4a]"
            />

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-[#0f7a4a] text-white py-4 rounded-md font-bold mt-8"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
