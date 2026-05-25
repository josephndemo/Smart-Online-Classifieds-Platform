import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <img src={listing.image_url} alt={listing.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
          {listing.category}
        </span>
        <h3 className="text-lg font-bold text-gray-900 mt-2 truncate">{listing.title}</h3>
        <p className="text-xl font-extrabold text-slate-900 mt-1">Ksh.{listing.price.toLocaleString()}</p>
        <div className="flex justify-between items-center mt-4">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${listing.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {listing.status}
          </span>
          <Link to={`/listings/${listing.id}`} className="text-indigo-600 font-semibold text-sm hover:underline">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}