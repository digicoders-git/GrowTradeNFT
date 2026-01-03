import React from 'react';
import { FaWallet, FaPlus, FaMinus } from 'react-icons/fa';

const Wallet = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Wallet</h2>
        <FaWallet className="text-[#0f7a4a]" size={20} />
      </div>
      
      <div className="bg-gradient-to-r from-[#0f7a4a] to-green-600 p-6 sm:p-8 rounded-xl text-white">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Total Balance</h3>
        <p className="text-3xl sm:text-4xl font-bold">$1,234.56</p>
        <p className="text-sm sm:text-base opacity-90 mt-1">USDT</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button className="bg-[#0f7a4a]/10 p-4 sm:p-6 rounded-xl flex flex-col items-center gap-2 hover:bg-[#0f7a4a]/20">
          <FaPlus className="text-[#0f7a4a]" size={20} />
          <span className="font-medium text-[#0f7a4a] text-sm sm:text-base">Add Money</span>
        </button>
        <button className="bg-red-50 p-4 sm:p-6 rounded-xl flex flex-col items-center gap-2 hover:bg-red-100">
          <FaMinus className="text-red-600" size={20} />
          <span className="font-medium text-red-700 text-sm sm:text-base">Withdraw</span>
        </button>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100">
        <h4 className="font-semibold mb-3 text-base sm:text-lg">Recent Transactions</h4>
        <div className="space-y-2 sm:space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Transaction {item}</p>
                <p className="text-sm text-gray-500">Today</p>
              </div>
              <span className="font-bold text-[#0f7a4a] text-sm sm:text-base">+$100</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;