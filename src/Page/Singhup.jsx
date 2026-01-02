import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Singhup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    referralId: '',
    walletAddress: ''
  });

  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    backgroundColor: '#0E547D',
    paddingTop: '60px',
    ...(isMobile && {
      paddingTop: '80px',
      paddingLeft: '10px', 
      paddingRight: '10px',
      paddingBottom: '80px'
    })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateWalletAddress = () => {
    const randomAddress = '0x' + Math.random().toString(16).substr(2, 40);
    setFormData(prev => ({
      ...prev,
      walletAddress: randomAddress
    }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!formData.name || !formData.email || !formData.mobile || !formData.password || !formData.walletAddress) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill all required fields before payment!',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    // Simulate payment process
    console.log('Processing payment...');
    Swal.fire({
      icon: 'info',
      title: 'Processing Payment',
      text: 'Please wait while we process your payment...',
      showConfirmButton: false,
      timer: 2000
    });
    
    // Simulate payment completion after 2 seconds
    setTimeout(() => {
      setPaymentCompleted(true);
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: 'Your payment has been completed successfully!',
        confirmButtonColor: '#10b981'
      });
    }, 2000);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    console.log('Registration Data:', formData);
    Swal.fire({
      icon: 'success',
      title: 'Registration Complete!',
      text: 'Your registration has been completed successfully!',
      confirmButtonColor: '#10b981'
    }).then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={containerStyle}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-300 opacity-20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300 opacity-15 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-cyan-300 opacity-25 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-indigo-300 opacity-20 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-3 sm:p-6 relative z-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Sign Up</h2>
        <p className="text-center text-gray-600 mb-6 text-base font-semibold">Join our platform today</p>
        
        <form className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-base font-bold text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-base font-bold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>

          {/* Mobile Number Field */}
          <div>
            <label htmlFor="mobile" className="block text-base font-bold text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-base font-bold text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>

          {/* Referral ID Field */}
          <div>
            <label htmlFor="referralId" className="block text-base font-bold text-gray-700 mb-2">Referral ID </label>
            <input
              type="text"
              id="referralId"
              name="referralId"
              value={formData.referralId}
              onChange={handleInputChange}
              placeholder="Enter referral ID if any"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Wallet Address Section */}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Wallet Address <span className="text-red-500">*</span></label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={generateWalletAddress}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Generate Wallet Address
              </button>
              {formData.walletAddress && (
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <small className="text-gray-600 text-xs">Generated Address:</small>
                  <p className="font-mono text-xs text-gray-800 break-all mt-1">{formData.walletAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Registration Fee */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-5 rounded-xl border-2 border-blue-200 shadow-lg">
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-gray-800 mb-1">💳 Registration Fee</h3>
              <p className="text-xs text-gray-600">One-time platform activation fee</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-inner border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">$</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Amount Due</p>
                    <p className="text-xs text-gray-500">USDT Payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-green-600">$10</span>
                  <p className="text-xs text-gray-500 font-medium">USDT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment/Registration Button */}
          {!paymentCompleted ? (
            <button 
              type="button" 
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-extrabold text-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 hover:shadow-lg mt-6"
            >
              <div className="flex flex-col items-center">
                <span>Pay $10 USDT</span>
                {/* <span className="text-sm opacity-90 font-normal">Company Wallet</span> */}
              </div>
            </button>
          ) : (
            <button 
              type="submit" 
              onClick={handleRegistration}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-extrabold text-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-1 hover:shadow-lg mt-6"
            >
              Complete Registration
            </button>
          )}
          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account? 
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:text-blue-700 font-bold ml-1 underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Singhup;