import React, { useState, useEffect } from 'react';
import { FaImage, FaLock, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const NFTMarketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const [stats, setStats] = useState({});
  const [currentBatch, setCurrentBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketplace();
    fetchMyNFTs();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/nft/marketplace', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNfts(response.data.nfts);
      setCurrentBatch(response.data.batch);
    } catch (error) {
      console.error('Error fetching marketplace:', error);
    }
  };

  const fetchMyNFTs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/nft/my-nfts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyNfts(response.data.nfts);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching my NFTs:', error);
    }
    setLoading(false);
  };

  const buyNFT = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/nft/buy', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        icon: 'success',
        title: 'NFT Purchased!',
        text: response.data.message,
        confirmButtonColor: '#0f7a4a'
      });

      fetchMarketplace();
      fetchMyNFTs();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Purchase Failed',
        text: error.response?.data?.message || 'Something went wrong',
        confirmButtonColor: '#0f7a4a'
      });
    }
  };

  const sellNFT = async (nftId) => {
    try {
      const result = await Swal.fire({
        title: 'Sell NFT?',
        text: 'This will sell your NFT at 2x price and create 2 new NFTs',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0f7a4a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, sell it!'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:5000/api/nft/sell/${nftId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire({
          icon: 'success',
          title: 'NFT Sold!',
          text: `Profit: $${response.data.profit}`,
          confirmButtonColor: '#0f7a4a'
        });

        fetchMyNFTs();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Sale Failed',
        text: error.response?.data?.message || 'Something went wrong',
        confirmButtonColor: '#0f7a4a'
      });
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
        <h2 className="text-2xl font-bold text-gray-800">NFT Marketplace</h2>
        <FaImage className="text-[#0f7a4a]" size={24} />
      </div>

      {/* Current Batch Info */}
      {currentBatch && (
        <div className="bg-gradient-to-r from-[#0f7a4a] to-green-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Current Batch #{currentBatch.batchNumber}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-90">Available NFTs</p>
              <p className="text-2xl font-bold">{currentBatch.totalNFTs - currentBatch.soldNFTs}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Base Price</p>
              <p className="text-2xl font-bold">${currentBatch.basePrice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Buy NFT Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Purchase NFT</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Price: $10</p>
            <p className="text-sm text-gray-500">Sell at: $20 (2x profit)</p>
          </div>
          <button
            onClick={buyNFT}
            className="bg-[#0f7a4a] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700"
          >
            <FaShoppingCart />
            Buy NFT
          </button>
        </div>
      </div>

      {/* My NFTs Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <FaImage className="mx-auto text-blue-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-lg font-bold text-blue-600">{stats.total || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <FaImage className="mx-auto text-green-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Holding</p>
          <p className="text-lg font-bold text-green-600">{stats.holding || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl text-center">
          <FaLock className="mx-auto text-yellow-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Locked</p>
          <p className="text-lg font-bold text-yellow-600">{stats.locked || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <FaDollarSign className="mx-auto text-purple-600 mb-2" size={20} />
          <p className="text-xs text-gray-600">Profit</p>
          <p className="text-lg font-bold text-purple-600">${stats.totalProfit || 0}</p>
        </div>
      </div>

      {/* My NFTs List */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">My NFTs</h3>
        <div className="space-y-3">
          {myNfts.length > 0 ? (
            myNfts.map((nft) => (
              <div key={nft._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{nft.nftId}</p>
                  <p className="text-sm text-gray-500">
                    Buy: ${nft.buyPrice} | Sell: ${nft.sellPrice}
                  </p>
                  <p className="text-xs text-gray-400">
                    Status: <span className={`font-medium ${
                      nft.status === 'hold' ? 'text-green-600' :
                      nft.status === 'locked' ? 'text-yellow-600' :
                      nft.status === 'listed' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {nft.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                {nft.status === 'hold' && (
                  <button
                    onClick={() => sellNFT(nft.nftId)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Sell 2x
                  </button>
                )}
                {nft.status === 'locked' && (
                  <span className="text-yellow-600 text-sm font-medium flex items-center gap-1">
                    <FaLock size={12} />
                    Locked
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FaImage size={48} className="mx-auto mb-4 opacity-50" />
              <p>No NFTs owned yet</p>
              <p className="text-sm">Purchase your first NFT to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTMarketplace;