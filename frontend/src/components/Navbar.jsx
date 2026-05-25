import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold tracking-wide text-indigo-400">SmartClassifieds</Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-indigo-300">Browse</Link>
        {token ? (
          <>
            <Link to="/create-listing" className="bg-indigo-600 px-4 py-2 rounded font-medium hover:bg-indigo-500">Post Ad</Link>
            <Link to="/dashboard" className="hover:text-indigo-300 font-medium">Dashboard ({user?.username})</Link>
            <button onClick={logout} className="text-gray-400 hover:text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-300">Login</Link>
            <Link to="/register" className="bg-slate-800 border border-slate-700 px-4 py-2 rounded hover:bg-slate-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}