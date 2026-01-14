import React, { useState, useEffect } from 'react';
import { FaUsers, FaCog, FaChartBar, FaImage, FaLock, FaUnlock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDashboardStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'nfts') fetchNFTs();
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/admin/users?search=${searchTerm}&status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchNFTs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/nfts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNfts(response.data.nfts);
      setBatches(response.data.batches);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  const toggleUserFreeze = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/freeze`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        icon: 'success',
        title: `User ${currentStatus ? 'Unfrozen' : 'Frozen'}`,
        timer: 1500,
        showConfirmButton: false
      });
      
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong'
      });
    }
  };

  const toggleUserTrading = async (userId, canTrade) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/trading`, 
        { canTrade: !canTrade },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Swal.fire({
        icon: 'success',
        title: `Trading ${!canTrade ? 'Enabled' : 'Disabled'}`,
        timer: 1500,
        showConfirmButton: false
      });
      
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong'
      });
    }
  };

  const createNFTBatch = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: 'Create NFT Batch',
        html: `
          <input id="totalNFTs" class="swal2-input" placeholder="Total NFTs (default: 4)" value="4">
          <input id="basePrice" class="swal2-input" placeholder="Base Price (default: 10)" value="10">
        `,
        focusConfirm: false,
        preConfirm: () => {
          return {
            totalNFTs: document.getElementById('totalNFTs').value || 4,
            basePrice: document.getElementById('basePrice').value || 10
          };
        }
      });

      if (formValues) {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/admin/nft-batch', formValues, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire('Success!', 'NFT batch created successfully', 'success');
        fetchNFTs();
      }
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const unlockBatch = async (batchId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/admin/nft-batch/${batchId}/unlock`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire('Success!', 'Batch unlocked successfully', 'success');
      fetchNFTs();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Something went wrong', 'error');
    }
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
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <FaCog className="text-[#0f7a4a]" size={24} />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
          { id: 'users', label: 'Users', icon: FaUsers },
          { id: 'nfts', label: 'NFTs', icon: FaImage }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-[#0f7a4a] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <FaUsers className="text-blue-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <FaUsers className="text-green-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl">
            <FaLock className="text-red-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Frozen Users</p>
            <p className="text-2xl font-bold text-red-600">{stats.frozenUsers}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <FaImage className="text-purple-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Total NFTs</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalNFTs}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl">
            <FaImage className="text-yellow-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Locked NFTs</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.lockedNFTs}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <FaChartBar className="text-green-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-green-600">${stats.totalRevenue}</p>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="frozen">Frozen</option>
            </select>
            <button
              onClick={fetchUsers}
              className="bg-[#0f7a4a] text-white px-4 py-2 rounded-lg"
            >
              Search
            </button>
          </div>

          <div className="space-y-3">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.walletAddress}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {user.isFrozen && (
                        <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                          Frozen
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleUserFreeze(user._id, user.isFrozen)}
                      className={`px-3 py-1 rounded text-sm ${
                        user.isFrozen
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.isFrozen ? 'Unfreeze' : 'Freeze'}
                    </button>
                    <button
                      onClick={() => toggleUserTrading(user._id, user.canTrade)}
                      className={`px-3 py-1 rounded text-sm ${
                        user.canTrade
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {user.canTrade ? 'Disable Trading' : 'Enable Trading'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFTs Tab */}
      {activeTab === 'nfts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">NFT Management</h3>
            <button
              onClick={createNFTBatch}
              className="bg-[#0f7a4a] text-white px-4 py-2 rounded-lg"
            >
              Create Batch
            </button>
          </div>

          {/* NFT Batches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {batches.map((batch) => (
              <div key={batch._id} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Batch #{batch.batchNumber}</h4>
                    <p className="text-sm text-gray-500">
                      {batch.soldNFTs}/{batch.totalNFTs} sold
                    </p>
                    <p className="text-xs text-gray-400">Price: ${batch.basePrice}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {batch.isUnlocked ? (
                      <FaUnlock className="text-green-600" />
                    ) : (
                      <button
                        onClick={() => unlockBatch(batch.batchNumber)}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm hover:bg-yellow-200"
                      >
                        Unlock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;