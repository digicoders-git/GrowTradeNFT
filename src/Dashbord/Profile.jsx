import React from 'react';
import { FaUser, FaEdit, FaCog } from 'react-icons/fa';

const Profile = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Profile</h2>
        <FaEdit className="text-[#0f7a4a]" size={20} />
      </div>
      
      <div className="bg-gradient-to-r from-[#0f7a4a] to-green-600 p-6 sm:p-8 rounded-xl text-white text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaUser size={32} />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold">John Doe</h3>
        <p className="text-sm sm:text-base opacity-90">john.doe@example.com</p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {[
          { label: 'Personal Info', icon: <FaUser />, value: 'Update your details' },
          { label: 'Security', icon: <FaCog />, value: 'Password & Security' },
          { label: 'Notifications', icon: <FaCog />, value: 'Manage preferences' },
          { label: 'Privacy', icon: <FaCog />, value: 'Privacy settings' }
        ].map((item, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#0f7a4a]">{item.icon}</span>
              <div>
                <h4 className="font-medium text-sm sm:text-base">{item.label}</h4>
                <p className="text-sm text-gray-500">{item.value}</p>
              </div>
            </div>
            <span className="text-gray-400 text-lg sm:text-xl">›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;