import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState('Hello, I am interested in this listing. Is it available?');
  const [statusMsg, setStatusMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:5001/api/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(() => navigate('/'));
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    try {
      const res = await axios.post(`http://localhost:5001/api/listings/${id}/inquiry`, { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatusMsg(res.data.msg);
    } catch (err) {
      setStatusMsg('Error processing transaction pipeline initialization operations.');
    }
  };

  const handleFavorite = async () => {
    if (!token) return navigate('/login');
    try {
      await axios.post(`http://localhost:5001/api/listings/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Updated application configuration wishlist parameters!');
    } catch (err) {
      console.error(err);
    }
  };

  if (!listing) return <div className="text-center py-20 font-medium">Loading catalog parameters...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img src={listing.image_url} alt={listing.title} className="w-full h-96 object-cover rounded-2xl border shadow-sm" />
      </div>
      <div>
        <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider bg-indigo-50 px-3 py-1 rounded-full">{listing.category}</span>
        <h1 className="text-3xl font-black mt-2 text-gray-900">{listing.title}</h1>
        <p className="text-2xl font-extrabold text-indigo-600 mt-2">${listing.price.toLocaleString()}</p>
        <div className="mt-4 border-t border-b py-4 my-4">
          <p className="text-sm font-semibold text-gray-500">Seller Identity Details:</p>
          <p className="text-base font-bold text-gray-800">{listing.owner.username} ({listing.owner.email})</p>
        </div>
        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
        
        <div className="mt-6 flex gap-4">
          <button onClick={handleFavorite} className="border border-slate-300 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium">❤️ Save Item</button>
        </div>

        <form onSubmit={handleInquiry} className="mt-8 bg-slate-50 p-4 border rounded-xl">
          <h3 className="font-bold text-lg mb-2">Message Seller</h3>
          {statusMsg && <p className="text-sm font-semibold text-indigo-600 mb-2">{statusMsg}</p>}
          <textarea rows="3" className="w-full border p-2.5 rounded-lg text-sm mb-3" value={message} onChange={e => setMessage(e.target.value)}></textarea>
          <button className="bg-slate-900 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-800">Dispatch Request Notification</button>
        </form>
      </div>
    </div>
  );
}