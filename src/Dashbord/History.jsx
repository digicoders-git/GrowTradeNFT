import React from 'react';
import { FaHistory, FaClock } from 'react-icons/fa';

const History = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">History</h2>
        <FaHistory className="text-[#0f7a4a]" size={20} />
      </div>
      
      <div className="bg-[#0f7a4a]/10 p-4 sm:p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <FaClock className="text-[#0f7a4a]" size={24} />
          <div>
            <h3 className="font-semibold text-base sm:text-lg">Activity History</h3>
            <p className="text-sm sm:text-base text-gray-600">Your recent activities</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {[
          { action: 'Login', time: '2 hours ago', status: 'success' },
          { action: 'Payment', time: '1 day ago', status: 'success' },
          { action: 'Profile Update', time: '3 days ago', status: 'success' },
          { action: 'Withdrawal', time: '1 week ago', status: 'pending' }
        ].map((item, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-sm sm:text-base">{item.action}</h4>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                item.status === 'success' 
                  ? 'bg-[#0f7a4a]/10 text-[#0f7a4a]' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;