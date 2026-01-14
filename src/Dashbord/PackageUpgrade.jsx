import React, { useState, useEffect } from 'react';
import { FaRocket, FaStar, FaCrown } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const PackageUpgrade = () => {
  const [packages, setPackages] = useState({});
  const [currentPackage, setCurrentPackage] = useState('basic');
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/package/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(response.data.packages);
      setCurrentPackage(response.data.currentPackage);
      setUserBalance(response.data.userBalance);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const upgradePackage = async (packageType) => {
    const packageInfo = packages[packageType];
    
    if (userBalance < packageInfo.amount) {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient Balance',
        text: `You need $${packageInfo.amount} to upgrade. Current balance: $${userBalance}`
      });
      return;
    }

    const result = await Swal.fire({
      title: `Upgrade to ${packageType.toUpperCase()}`,
      text: `Cost: $${packageInfo.amount} | Unlock: ${packageInfo.levels} levels`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f7a4a',
      confirmButtonText: 'Upgrade Now'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/package/upgrade', 
          { packageType },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Upgrade Successful!',
          text: `You are now on ${packageType.toUpperCase()} package`,
          confirmButtonColor: '#0f7a4a'
        });
        
        fetchPackages();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Upgrade Failed',
          text: error.response?.data?.message || 'Something went wrong'
        });
      }
      setLoading(false);
    }
  };

  const getPackageIcon = (type) => {
    if (type.includes('5')) return <FaCrown className="text-purple-600" />;
    if (type.includes('4') || type.includes('3')) return <FaStar className="text-yellow-600" />;
    return <FaRocket className="text-blue-600" />;
  };

  const getPackageColor = (type) => {
    if (type.includes('5')) return 'from-purple-500 to-pink-500';
    if (type.includes('4')) return 'from-yellow-500 to-orange-500';
    if (type.includes('3')) return 'from-green-500 to-teal-500';
    if (type.includes('2')) return 'from-blue-500 to-indigo-500';
    if (type.includes('1')) return 'from-gray-500 to-gray-600';
    return 'from-green-600 to-green-700';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Package Upgrades</h2>
        <p className="text-gray-600">Current Balance: <span className="font-bold text-green-600">${userBalance}</span></p>
        <p className="text-sm text-gray-500">Current Package: <span className="font-semibold text-blue-600">{currentPackage.toUpperCase()}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(packages).map(([type, info]) => (
          <div key={type} className={`relative rounded-xl p-6 text-white bg-gradient-to-br ${getPackageColor(type)} ${currentPackage === type ? 'ring-4 ring-white ring-opacity-50' : ''}`}>
            {currentPackage === type && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                CURRENT
              </div>
            )}
            
            <div className="text-center">
              <div className="text-4xl mb-3">
                {getPackageIcon(type)}
              </div>
              <h3 className="text-xl font-bold mb-2">{type.toUpperCase()}</h3>
              <div className="text-3xl font-bold mb-2">${info.amount}</div>
              <p className="text-sm opacity-90 mb-4">Unlock {info.levels} Levels</p>
              
              <div className="space-y-2 text-sm opacity-90 mb-6">
                <p>✓ MLM Income up to Level {info.levels}</p>
                <p>✓ NFT Buy/Sell Access</p>
                <p>✓ Team Building</p>
                {info.levels >= 6 && <p>✓ Advanced Features</p>}
                {info.levels >= 8 && <p>✓ Premium Support</p>}
                {info.levels >= 10 && <p>✓ VIP Status</p>}
              </div>

              {currentPackage !== type && (
                <button
                  onClick={() => upgradePackage(type)}
                  disabled={loading || userBalance < info.amount}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {userBalance < info.amount ? 'Insufficient Balance' : 'Upgrade Now'}
                </button>
              )}
              
              {currentPackage === type && (
                <div className="w-full bg-white bg-opacity-20 text-white font-semibold py-2 px-4 rounded-lg">
                  Active Package
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2">📈 Level Unlock System</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-700">
          <p>• 1 Direct Member = 2 Levels</p>
          <p>• 2 Direct Members = 4 Levels</p>
          <p>• 3 Direct Members = 6 Levels</p>
          <p>• 4 Direct Members = 8 Levels</p>
          <p>• 5+ Direct Members = 10 Levels</p>
          <p>• Higher packages = More earning potential</p>
        </div>
      </div>
    </div>
  );
};

export default PackageUpgrade;