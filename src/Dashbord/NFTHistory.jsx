import React from 'react';
import { FaImage, FaEye } from 'react-icons/fa';

const NFTHistory = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">NFT History</h2>
        <FaImage className="text-[#0f7a4a]" size={20} />
      </div>
      
      <div className="bg-[#0f7a4a]/10 p-4 sm:p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <FaImage className="text-[#0f7a4a]" size={24} />
          <div>
            <h3 className="font-semibold text-base sm:text-lg">NFT Collection</h3>
            <p className="text-sm sm:text-base text-gray-600">Your digital assets</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
            <div className="aspect-square bg-gradient-to-br from-[#0f7a4a] to-green-600 rounded-lg mb-3 flex items-center justify-center">
              <FaImage className="text-white" size={24} />
            </div>
            <h4 className="font-medium text-sm sm:text-base">NFT #{item}</h4>
            <p className="text-xs sm:text-sm text-gray-500">Owned</p>
            <button className="w-full mt-2 bg-[#0f7a4a]/10 text-[#0f7a4a] py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1">
              <FaEye size={12} />
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTHistory;