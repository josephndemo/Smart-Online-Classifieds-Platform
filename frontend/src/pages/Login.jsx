import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication verification failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to System</h2>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2.5 rounded">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input type="email" required className="w-full border p-3 rounded-xl" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input type="password" required className="w-full border p-3 rounded-xl" onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition">Sign In</button>
        <p className="text-sm mt-4 text-center">Don't have an account? <Link to="/register" className="text-indigo-600 font-medium">Sign up</Link></p>
      </form>
    </div>
  );
}