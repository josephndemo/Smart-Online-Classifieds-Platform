import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateListing from './pages/CreateListing';
import ListingDetail from './pages/ListingDetail';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}