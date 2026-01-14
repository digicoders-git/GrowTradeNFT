import React, { useState, useEffect } from 'react';
import { FaImage, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const NFTManagement = () => {
  const [nfts, setNfts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/nft/my-nfts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNfts(response.data.nfts);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  const buyNFT = async () => {
    const { value: quantity } = await Swal.fire({
      title: 'Buy NFT',
      input: 'number',
      inputLabel: 'Quantity',
      inputValue: 1,
      inputAttributes: { min: 1, max: 10 },
      showCancelButton: true,
      confirmButtonColor: '#0f7a4a',
      inputValidator: (value) => {
        if (!value || value < 1) return 'Please enter valid quantity';
      }
    });

    if (quantity) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/nft/buy', 
          { quantity: parseInt(quantity) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        Swal.fire({
          icon: 'success',
          title: 'NFT Purchased!',
          text: `Successfully bought ${quantity} NFT(s)`,
          confirmButtonColor: '#0f7a4a'
        });
        
        fetchNFTs();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Purchase Failed',
          text: error.response?.data?.message || 'Something went wrong'
        });
      }
      setLoading(false);
    }
  };

  const sellNFT = async (nftId) => {
    const result = await Swal.fire({
      title: 'Sell NFT',
      text: 'Sell for $20 (40% = $8 profit)',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f7a4a',
      confirmButtonText: 'Sell Now'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:5000/api/nft/sell/${nftId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          icon: 'success',
          title: 'NFT Sold!',
          text: 'You earned $8 profit',
          confirmButtonColor: '#0f7a4a'
        });
        
        fetchNFTs();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Sale Failed',
          text: error.response?.data?.message || 'Something went wrong'
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">NFT Management</h2>
        <button
          onClick={buyNFT}
          disabled={loading}
          className="bg-[#0f7a4a] text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <FaShoppingCart />
          Buy NFT
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <FaImage className="mx-auto text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Total NFTs</p>
          <p className="text-xl font-bold text-blue-600">{stats.total || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <FaImage className="mx-auto text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Holding</p>
          <p className="text-xl font-bold text-green-600">{stats.holding || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl text-center">
          <FaImage className="mx-auto text-yellow-600 mb-2" />
          <p className="text-sm text-gray-600">Sold</p>
          <p className="text-xl font-bold text-yellow-600">{stats.sold || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <FaDollarSign className="mx-auto text-purple-600 mb-2" />
          <p className="text-sm text-gray-600">Profit</p>
          <p className="text-xl font-bold text-purple-600">${stats.totalProfit || 0}</p>
        </div>
      </div>

      {/* NFT List */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-semibold mb-4">My NFTs</h3>
        {nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <div key={nft._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{nft.nftId}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    nft.status === 'hold' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {nft.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Buy: ${nft.buyPrice} → Sell: ${nft.sellPrice}
                </p>
                {nft.status === 'hold' && (
                  <button
                    onClick={() => sellNFT(nft.nftId)}
                    className="w-full bg-[#0f7a4a] text-white py-2 rounded text-sm"
                  >
                    Sell for $20
                  </button>
                )}
                {nft.status === 'sold' && (
                  <p className="text-sm text-green-600 font-medium">
                    Profit: ${nft.profit}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaImage size={48} className="mx-auto mb-4 opacity-50" />
            <p>No NFTs found. Buy your first NFT!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTManagement;