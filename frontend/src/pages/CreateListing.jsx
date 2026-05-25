import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ["Electronics", "Vehicles", "Real Estate", "Jobs", "Fashion", "Services", "Furniture", "Other Classifieds"];

export default function CreateListing() {
  const [formData, setFormData] = useState({ title: '', price: '', category: 'Electronics', description: '', image_url: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5001/api/listings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      alert('Error allocating system context configurations.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 border rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Post a New Advertisement</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Item Listing Title</label>
            <input type="text" required className="w-full border p-3 rounded-xl" onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Price (Ksh.)</label>
            <input type="number" step="0.01" required className="w-full border p-3 rounded-xl" onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Item Category</label>
            <select className="w-full border p-3 rounded-xl" onChange={e => setFormData({...formData, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Image Endpoint URL (Optional)</label>
          <input type="text" className="w-full border p-3 rounded-xl" placeholder="https://example.com/image.jpg" onChange={e => setFormData({...formData, image_url: e.target.value})} />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Item Specification Summary</label>
          <textarea rows="4" required className="w-full border p-3 rounded-xl" onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700">Publish Advert</button>
      </form>
    </div>
  );
}