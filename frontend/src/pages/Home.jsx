import { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard';

const CATEGORIES = ["Electronics", "Vehicles", "Real Estate", "Jobs", "Fashion", "Services", "Furniture", "Other Classifieds"];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchListings();
  }, [category]);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/listings?search=${search}&category=${category}`);
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-slate-100 p-6 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-inner mb-8">
        <input 
          type="text" 
          placeholder="Search for item listings..." 
          className="w-full md:w-1/2 p-3 rounded-xl border border-gray-300 focus:outline-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="w-full md:w-1/4 p-3 rounded-xl border border-gray-300 focus:outline-indigo-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button onClick={fetchListings} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium w-full md:w-auto hover:bg-indigo-700">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.length > 0 ? (
          listings.map(l => <ListingCard key={l.id} listing={l} />)
        ) : (
          <p className="text-gray-500 text-center col-span-full py-10">No listings found matching criteria.</p>
        )}
      </div>
    </div>
  );
}