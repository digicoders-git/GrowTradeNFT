import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill all required fields!',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    // Simulate login process
    console.log('Login Data:', formData);
    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      text: 'Welcome back!',
      confirmButtonColor: '#10b981'
    }).then(() => {
      navigate('/dashboard');
    });
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 relative" style={containerStyle}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-300 opacity-20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300 opacity-15 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-cyan-300 opacity-25 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-indigo-300 opacity-20 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-3 sm:p-6 relative z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Login</h2>
        <p className="text-center text-gray-600 mb-6 text-sm font-bold">Welcome back to our platform</p>
        
        <form className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
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

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
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

          {/* Login Button */}
          <button 
            type="button" 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 hover:shadow-lg mt-6"
          >
            Login
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="text-blue-500 hover:text-blue-700 font-bold ml-1"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
