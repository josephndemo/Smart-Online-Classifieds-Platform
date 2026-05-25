🛒 Smart Online Classifieds Platform

A secure, modern full-stack marketplace web application that connects buyers and sellers through a centralized online platform. It features JWT-based authentication, advanced search and filtering, user dashboards for listing management, and interactive marketplace functionality.

🚀 Key Features
🛡️ Authentication & Authorization
Secure Registration & Login: Token-based authentication using JSON Web Tokens (JWT) via Flask-JWT-Extended.
Protected Routes: Frontend route guards prevent unauthorized access to dashboard and listing operations.
📦 Advertisement Management
Full CRUD Operations: Users can create, read, update, and delete listings with image URLs and detailed descriptions.
Status Control: Listings can be marked as Available or Sold dynamically.
🔍 Discovery & Interaction Engine
Advanced Search & Filters: Multi-parameter filtering across categories and keywords.
Wishlist System: Many-to-many relationship enabling users to save favorite listings.
Messaging/Inquiry System: Buyers can send inquiries directly to sellers for each listing.
🛠️ Tech Stack
Frontend
Framework: React 18 (Hooks: useState, useEffect)
Routing: React Router DOM v6
HTTP Client: Axios
Styling: Tailwind CSS (utility-first responsive design)
Backend
Framework: Flask (Python)
Database: SQLite with Flask-SQLAlchemy
Authentication: Flask-JWT-Extended + Werkzeug Security
Migrations: Flask-Migrate
CORS: Flask-CORS
📁 Project Structure
classifieds-platform/
│
├── backend/
│   ├── instance/            # SQLite database storage
│   ├── config.py            # App configuration
│   ├── extensions.py        # DB, JWT, and migration instances
│   ├── models.py            # Database models
│   ├── seed.py              # Database seeding script
│   ├── app.py               # Application entry point
│   └── routes/
│       ├── auth.py          # Authentication routes
│       └── listings.py      # Listing & marketplace logic
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Application pages (Home, Dashboard, etc.)
    │   ├── App.jsx          # Route configuration
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Tailwind styles
    ├── tailwind.config.js   # Tailwind configuration
    └── vite.config.js       # Vite dev server config
⚙️ Setup & Installation
1. Prerequisites

Make sure you have installed:

Python 3.8+
Node.js (v16+)
npm
2. Backend Setup
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

# Install dependencies
pip install flask flask-sqlalchemy flask-jwt-extended flask-migrate flask-cors
🗄️ Initialize Database
python seed.py

This creates a fresh SQLite database inside the instance/ folder.

▶️ Run Backend Server
python app.py

Backend runs at:

http://localhost:5001
3. Frontend Setup
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

Frontend runs at:

http://localhost:3000
📊 Database Design Overview
One-to-Many Relationship
User → Listings
Each user can create multiple listings.
Deleting a user cascades and removes their listings.
Many-to-Many Relationship
User ↔ Listings (Wishlist System)
Implemented using a join table.
Users can save unlimited favorite listings without modifying original data.
👨‍💻 Author

Joseph M Ndemo