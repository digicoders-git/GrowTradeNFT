import React from 'react';
import { FaUsers, FaUserPlus } from 'react-icons/fa';

const MyTeam = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Team</h2>
        <FaUserPlus className="text-[#0f7a4a]" size={20} />
      </div>
      
      <div className="bg-[#0f7a4a]/10 p-4 sm:p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <FaUsers className="text-[#0f7a4a]" size={24} />
          <div>
            <h3 className="font-semibold text-base sm:text-lg">Team Members</h3>
            <p className="text-sm sm:text-base text-gray-600">Manage your team</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0f7a4a] rounded-full flex items-center justify-center text-white font-bold">
                U{item}
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base">Team Member {item}</h4>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTeam;