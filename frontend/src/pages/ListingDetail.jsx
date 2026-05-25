import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Is this item still available?');
  const [statusMsg, setStatusMsg] = useState('');
  
  // Extract user tokens for seller notification queries
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchListingDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/listings/${id}`);
        setListing(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to retrieve entry details.');
        setLoading(false);
      }
    };
    fetchListingDetail();
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatusMsg('Please log in or create an account to drop a transaction message line.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      // Secure backtick string structure safely connecting to backend endpoint
      const res = await axios.post(`http://localhost:5001/api/listings/${id}/inquiry`, { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatusMsg(res.data.msg);
    } catch (err) {
      setStatusMsg('Error processing inquiry transaction.');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500 font-medium">Loading asset components...</div>;
  if (error) return <div className="text-center py-12 text-red-500 font-medium">{error}</div>;
  if (!listing) return <div className="text-center py-12 text-gray-500">Classified listing could not be found.</div>;

  return (
    <div>
      {/* Return to Catalog Utility Navigation Links */}
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 mb-6 group transition">
        ← Back to Marketplace Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl">
        {/* Listing Media Left Compartment */}
        <div>
          <img 
            src={listing.image_url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=500'} 
            alt={listing.title} 
            className="w-full rounded-2xl h-[400px] object-cover bg-gray-50 border border-gray-100 shadow-sm"
          />
        </div>

        {/* Info Layout Right Context Panels */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 rounded-lg">
                {listing.category}
              </span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${listing.status === 'Available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                ● {listing.status}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{listing.title}</h1>
            <p className="text-2xl font-black text-gray-900 mb-6">Ksh.{listing.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            
            <hr className="border-gray-100 my-4" />
            
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Item Description</h3>
            <p className="text-gray-600 leading-relaxed text-base mb-6 whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Secure Seller Contact Interface Channel */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Contact Owner Regarding This Ad</h3>
            {statusMsg && (
              <p className={`text-sm font-semibold p-2.5 rounded-xl mb-3 ${statusMsg.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {statusMsg}
              </p>
            )}
            
            <form onSubmit={handleInquiry} className="space-y-3">
              <textarea 
                rows="3"
                required
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl shadow-md hover:shadow transition text-sm">
                Send Direct Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}