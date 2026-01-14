import React, { useState, useEffect } from 'react';
import { FaHome, FaChartLine, FaUsers, FaWallet, FaImage, FaRocket } from 'react-icons/fa';
import { userAPI } from '../services/api';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    balance: 0,
    totalEarnings: 0,
    teamSize: 0,
    activeTeamMembers: 0,
    totalTransactions: 0,
    recentTransactions: [],
    nftCount: 0
  });
  const [nftStats, setNftStats] = useState({ total: 0, holding: 0, sold: 0, totalProfit: 0 });
  const [currentPackage, setCurrentPackage] = useState('basic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchNFTStats();
    fetchPackageInfo();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchNFTStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/nft/my-nfts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNftStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching NFT stats:', error);
    }
  };

  const fetchPackageInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/package/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentPackage(response.data.currentPackage);
    } catch (error) {
      console.error('Error fetching package info:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f7a4a]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>
        <FaHome className="text-[#0f7a4a]" size={20} />
      </div>
      
      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-[#0f7a4a] to-green-600 p-4 sm:p-6 rounded-xl text-white">
          <FaWallet size={24} className="mb-2" />
          <h3 className="font-semibold text-sm sm:text-base">Balance</h3>
          <p className="text-2xl sm:text-3xl font-bold">${stats.balance}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-[#0f7a4a] p-4 sm:p-6 rounded-xl text-white">
          <FaUsers size={24} className="mb-2" />
          <h3 className="font-semibold text-sm sm:text-base">Team</h3>
          <p className="text-2xl sm:text-3xl font-bold">{stats.teamSize}</p>
        </div>
      </div>

      {/* NFT & Package Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <FaImage className="mx-auto text-blue-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Total NFTs</p>
          <p className="text-lg font-bold text-blue-600">{nftStats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <FaImage className="mx-auto text-green-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Holding</p>
          <p className="text-lg font-bold text-green-600">{nftStats.holding}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl text-center">
          <FaChartLine className="mx-auto text-yellow-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">NFT Profit</p>
          <p className="text-lg font-bold text-yellow-600">${nftStats.totalProfit}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <FaRocket className="mx-auto text-purple-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Package</p>
          <p className="text-lg font-bold text-purple-600">{currentPackage.toUpperCase()}</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <FaChartLine className="text-[#0f7a4a]" size={20} />
          <h3 className="font-semibold text-base sm:text-lg">Recent Activity</h3>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {stats.recentTransactions.length > 0 ? (
            stats.recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
                <div>
                  <span className="text-sm sm:text-base font-medium">{transaction.description}</span>
                  <p className="text-xs text-gray-500">${transaction.amount}</p>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No recent activity
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#0f7a4a] to-green-600 p-4 sm:p-6 rounded-xl text-white">
        <h3 className="font-semibold mb-2 text-base sm:text-lg">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button className="bg-white/20 p-2 sm:p-3 rounded-lg text-sm sm:text-base hover:bg-white/30 transition-colors">
            Buy NFT
          </button>
          <button className="bg-white/20 p-2 sm:p-3 rounded-lg text-sm sm:text-base hover:bg-white/30 transition-colors">
            Invite Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;