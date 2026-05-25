import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
      // Direct targeting to port 5001 to bypass macOS conflicts
      const res = await axios.get(`http://localhost:5001/api/listings?search=${search}&category=${category}`);
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching marketplace items:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div>
      {/* Search and Filters Strip */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <input 
          type="text" 
          placeholder="Search items, brands, keywords..." 
          className="flex-1 border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Jobs">Jobs</option>
          <option value="Fashion">Fashion</option>
          <option value="Services">Services</option>
          <option value="Furniture">Furniture</option>
          <option value="Other Classifieds">Other Classifieds</option>
        </select>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Search
        </button>
      </form>

      {/* Catalog Grid View Layout */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No classified advertisements found matching your search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <img 
                src={item.image_url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=500'} 
                alt={item.title} 
                className="h-48 w-full object-cover bg-gray-50"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mt-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1 mb-2">{item.description}</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mt-2 mb-3">
                    <span className="text-xl font-extrabold text-gray-900">${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    <span className={`text-xs px-2.5 py-1 font-semibold rounded-full ${item.status === 'Available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                  </div>
                  {/* Fixed Navigation Trigger Hook */}
                  <button 
                    onClick={() => navigate(`/listings/${item.id}`)}
                    className="w-full text-center bg-gray-50 hover:bg-indigo-50 border border-gray-200 text-gray-700 hover:text-indigo-600 py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}