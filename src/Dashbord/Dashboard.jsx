import React from 'react';
import { FaHome, FaChartLine, FaUsers, FaWallet } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>
        <FaHome className="text-[#0f7a4a]" size={20} />
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-[#0f7a4a] to-green-600 p-4 sm:p-6 rounded-xl text-white">
          <FaWallet size={24} className="mb-2" />
          <h3 className="font-semibold text-sm sm:text-base">Balance</h3>
          <p className="text-2xl sm:text-3xl font-bold">$1,234</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-[#0f7a4a] p-4 sm:p-6 rounded-xl text-white">
          <FaUsers size={24} className="mb-2" />
          <h3 className="font-semibold text-sm sm:text-base">Team</h3>
          <p className="text-2xl sm:text-3xl font-bold">12</p>
        </div>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <FaChartLine className="text-[#0f7a4a]" size={20} />
          <h3 className="font-semibold text-base sm:text-lg">Recent Activity</h3>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {[
            'New team member joined',
            'Payment received $100',
            'Profile updated',
            'NFT purchased'
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
              <span className="text-sm sm:text-base">{activity}</span>
              <span className="text-xs sm:text-sm text-gray-500">Now</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-[#0f7a4a] to-green-600 p-4 sm:p-6 rounded-xl text-white">
        <h3 className="font-semibold mb-2 text-base sm:text-lg">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button className="bg-white/20 p-2 sm:p-3 rounded-lg text-sm sm:text-base">Add Money</button>
          <button className="bg-white/20 p-2 sm:p-3 rounded-lg text-sm sm:text-base">Invite Team</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;