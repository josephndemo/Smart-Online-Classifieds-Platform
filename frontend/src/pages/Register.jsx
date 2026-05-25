import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5001/api/auth/register', { username, email, password });
      setMsg('Account setup finalized! Redirecting to login dashboard page...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration runtime pipeline failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Marketplace Account</h2>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2.5 rounded">{error}</p>}
        {msg && <p className="text-green-600 text-sm mb-4 bg-green-50 p-2.5 rounded">{msg}</p>}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input type="text" required className="w-full border p-3 rounded-xl" onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input type="email" required className="w-full border p-3 rounded-xl" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input type="password" required className="w-full border p-3 rounded-xl" onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition">Complete Registration</button>
        <p className="text-sm mt-4 text-center">Already signed up? <Link to="/login" className="text-indigo-600 font-medium">Log in</Link></p>
      </form>
    </div>
  );
}