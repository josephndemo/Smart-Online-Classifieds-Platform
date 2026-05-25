import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchDashboard();
  }, [token]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/listings/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyListings(res.data.my_listings);
      setFavorites(res.data.favorites);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSold = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Sold' : 'Available';
    try {
      await axios.put(`http://localhost:5001/api/listings/${id}`, { status: nextStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAd = async (id) => {
    if(!window.confirm("Verify removal request validation?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Personal Account Matrix Dashboard</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Your Posted Advertisements ({myListings.length})</h2>
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-gray-600 text-sm font-semibold">
                <th className="p-4">Item Title</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myListings.map(item => (
                <tr key={item.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-bold text-gray-800">{item.title}</td>
                  <td className="p-4">${item.price}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex gap-3 justify-end">
                    <button onClick={() => toggleSold(item.id, item.status)} className="text-xs bg-slate-100 px-3 py-1.5 border rounded font-medium hover:bg-slate-200">
                      Toggle Sold/Available
                    </button>
                    <button onClick={() => deleteAd(item.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded font-medium hover:bg-red-100">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Saved Wishlist / Saved Favorites ({favorites.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map(fav => (
            <div key={fav.id} className="p-4 border bg-white rounded-xl shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">{fav.title}</p>
                <p className="text-sm text-indigo-600 font-semibold">${fav.price}</p>
              </div>
              <button onClick={() => navigate(`/listings/${fav.id}`)} className="text-xs text-indigo-600 hover:underline">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}