import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaRegCopy, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authAPI, walletAPI } from "../services/api";
import reownWalletService from "../services/reownWalletService";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Connect wallet using Reown modal
  const connectWallet = async () => {
    try {
      const result = await reownWalletService.connectWallet();
      
      if (result.success) {
        setConnectedWallet(result.account);
        Swal.fire({
          icon: "success",
          title: "Wallet Connected!",
          text: `Connected: ${result.account.substring(0, 6)}...${result.account.substring(38)}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Connection Failed",
          text: result.error,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to connect wallet",
      });
    }
  };

  const copyWallet = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Wallet address copied",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!connectedWallet) {
      Swal.fire({
        icon: "warning",
        title: "Wallet Required",
        text: "Please connect your crypto wallet first",
      });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Password and Confirm Password must match",
      });
      setLoading(false);
      return;
    }

    try {
      // Step 1: Register user
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        walletAddress: connectedWallet,
        referralCode: formData.referralCode || undefined
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Show registration success and start payment
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Now processing $10 payment to activate your account...",
        timer: 2000,
        showConfirmButton: false
      });

      // Step 2: Automatically start payment process after 2 seconds
      setTimeout(async () => {
        await handlePayment();
      }, 2000);
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      if (!connectedWallet) {
        Swal.fire({
          icon: "error",
          title: "Wallet Not Connected",
          text: "Please connect your Trust Wallet",
        });
        setLoading(false);
        return;
      }

      // Company wallet address (valid Ethereum address)
      const companyWallet = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87";
      
      // Send payment using Reown service
      const payment = await reownWalletService.sendPayment(companyWallet);
      
      if (!payment.success) {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: payment.error,
        });
        setLoading(false);
        return;
      }

      // Activate wallet on backend
      await walletAPI.activate({
        txHash: payment.txHash,
        walletAddress: connectedWallet
      });

      Swal.fire({
        icon: "success",
        title: "Payment Successful 🎉",
        text: "Your account is activated successfully",
        confirmButtonColor: "#0f7a4a",
        confirmButtonText: "Go to Dashboard",
      }).then(() => {
        navigate("/dashbord");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Processing Failed",
        text: error.response?.data?.message || error.message,
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen bg-[#eaf4ee] flex justify-center items-start md:items-center">
      <div className="w-full max-w-[390px] h-full bg-white flex flex-col overflow-hidden md:max-w-[820px] md:h-[90vh] md:rounded-2xl md:shadow-2xl">
        {/* TOP */}
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
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div>
                  <label className="text-sm font-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>

                <div className="mt-4 md:mt-0">
                  <label className="text-sm font-semibold">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold">Referral Code (Optional)</label>
                  <input
                    type="text"
                    name="referralCode"
                    placeholder="Enter referral code if you have one"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>
              </div>

              {/* WALLET CONNECTION */}
              <div className="mt-4">
                <label className="text-sm font-semibold">Crypto Wallet Address</label>
                <div className="mt-2">
                  {!connectedWallet ? (
                    <button
                      type="button"
                      onClick={connectWallet}
                      className="w-full bg-[#0f7a4a] text-white py-3 px-4 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                    >
                      <FaWallet />
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="relative">
                      <input
                        readOnly
                        value={connectedWallet}
                        className="w-full px-4 py-[14px] pr-16 rounded-md bg-green-50 border border-green-200 text-xs"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <button type="button" onClick={copyWallet}>
                          <FaRegCopy className="text-green-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PASSWORD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-4">
                <div>
                  <label className="text-sm font-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>
                <div className="mt-4 md:mt-0">
                  <label className="text-sm font-semibold">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-4 py-[14px] rounded-md bg-[#eef6f1] border"
                  />
                </div>
              </div>

              <div className="mt-5 p-3 bg-[#eef6f1] border rounded-md text-sm">
                💳 <b>$10 One-Time Payment</b> required to activate your account
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0f7a4a] text-white py-4 rounded-md font-bold mt-6 disabled:opacity-50"
              >
                {loading ? "Processing Registration & Payment..." : "Register & Pay $10"}
              </button>

              <p className="text-center text-sm my-5">
                Already registered?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#0f7a4a] font-semibold cursor-pointer"
                >
                  Login here
                </span>
              </p>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                <p className="text-blue-800">
                  ℹ️ <b>Supported Wallets:</b>
                </p>
                <ul className="text-blue-700 mt-2 space-y-1">
                  <li>• <b>MetaMask:</b> Browser extension</li>
                  <li>• <b>Trust Wallet:</b> Mobile app with QR scan</li>
                  <li>• <b>Coinbase Wallet:</b> Mobile & browser</li>
                  <li>• <b>WalletConnect:</b> 300+ supported wallets</li>
                  <li>• Get free test ETH from <a href="https://sepoliafaucet.com" target="_blank" className="text-[#0f7a4a] underline">Sepolia Faucet</a></li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
