import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartLine, FaDollarSign, FaEye } from 'react-icons/fa';
import axios from 'axios';

const MLMTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMLMData();
  }, []);

  const fetchMLMData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [treeRes, earningsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/user/mlm-tree', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/user/mlm-earnings', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setTreeData(treeRes.data.tree);
      setEarnings(earningsRes.data.earnings);
      setStats(earningsRes.data.stats);
    } catch (error) {
      console.error('Error fetching MLM data:', error);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">MLM Network</h2>
        <FaUsers className="text-[#0f7a4a]" size={24} />
      </div>

      {/* MLM Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <FaUsers className="mx-auto text-blue-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Total Referrals</p>
          <p className="text-lg font-bold text-blue-600">{stats.totalReferrals || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <FaUsers className="mx-auto text-green-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Active Team</p>
          <p className="text-lg font-bold text-green-600">{stats.activeReferrals || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <FaDollarSign className="mx-auto text-purple-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Total Earnings</p>
          <p className="text-lg font-bold text-purple-600">${stats.totalEarnings || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl text-center">
          <FaDollarSign className="mx-auto text-red-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Missed Income</p>
          <p className="text-lg font-bold text-red-600">${stats.missedEarnings || 0}</p>
        </div>
      </div>

      {/* Level-wise Earnings */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Level-wise Earnings</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1,2,3,4,5,6,7,8,9,10].map((level) => (
            <div key={level} className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600">Level {level}</p>
              <p className="text-sm font-bold text-[#0f7a4a]">
                ${earnings.find(e => e.level === level)?.amount || 0}
              </p>
              <p className="text-xs text-gray-500">
                {earnings.find(e => e.level === level)?.count || 0} users
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-gradient-to-r from-[#0f7a4a] to-green-600 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-2">Your Referral Link</h3>
        <div className="bg-white/20 p-3 rounded-lg">
          <p className="text-sm break-all">
            https://growtradenfts.com/signup?ref={stats.referralCode}
          </p>
        </div>
        <button 
          onClick={() => navigator.clipboard.writeText(`https://growtradenfts.com/signup?ref=${stats.referralCode}`)}
          className="mt-3 bg-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/30"
        >
          Copy Link
        </button>
      </div>

      {/* Team Members */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Direct Team Members</h3>
        <div className="space-y-3">
          {treeData?.directReferrals?.length > 0 ? (
            treeData.directReferrals.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-xs text-gray-400">
                    Joined: {new Date(member.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Team: {member.teamSize || 0}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FaUsers size={48} className="mx-auto mb-4 opacity-50" />
              <p>No direct referrals yet</p>
              <p className="text-sm">Share your referral link to build your team!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLMTree;