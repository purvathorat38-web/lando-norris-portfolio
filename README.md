# Lando Norris Portfolio

A visually stunning, cinematic portfolio website for Formula 1 driver Lando Norris. This full-stack web application features a highly interactive frontend with smooth animations, an e-commerce store for merchandise, and a secure admin dashboard for managing orders and analytics.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Installation & Running](#installation--running)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Admin Access](#admin-access)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This project is a full-stack portfolio and e-commerce website showcasing Lando Norris's Formula 1 career. It includes:

- **Portfolio Landing Page** - Animated hero sections, achievements showcase, statistics, and helmet gallery
- **E-commerce Store** - Browse and purchase Lando Norris helmet replicas
- **Checkout System** - Complete order processing with customer information and shipping details
- **Admin Dashboard** - Secure portal for managing orders, viewing analytics, and tracking visitor activity
- **Contact & Newsletter** - User engagement features with backend integration

---

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Lenis** - Smooth scroll library
- **Recharts** - Data visualization for admin dashboard
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Python 3.11+** - Programming language
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Pydantic** - Data validation using Python type hints
- **JWT (python-jose)** - JSON Web Tokens for authentication
- **Passlib + Bcrypt** - Password hashing
- **Uvicorn** - ASGI server

---

## 📁 Project Structure

```
Portfolio-LandonNoris/
├── backend/
│   ├── venv/                    # Python virtual environment
│   ├── __pycache__/             # Python cache files
│   ├── main.py                  # FastAPI application & API routes
│   ├── models.py                # SQLAlchemy database models
│   ├── schemas.py               # Pydantic schemas for validation
│   ├── database.py              # Database connection setup
│   └── auth.py                  # Authentication & JWT logic
├── frontend/
│   ├── node_modules/            # Node.js dependencies
│   ├── public/                  # Static assets (images, icons)
│   │   ├── helmet1.jpg - helmet5.jpg
│   │   ├── lando5.png.png - lando9.png.png
│   │   ├── Landon.jpg.png - landon4.jpg.png
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/              # React assets
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   └── WebGLBackground.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Store.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Admin.jsx
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   ├── index.css            # Global styles
│   │   └── App.css              # Component styles
│   ├── .gitignore
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── eslint.config.js         # ESLint configuration
├── sqlite.db                    # SQLite database file
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

---

## 🔧 Environment Setup

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Python** (v3.11 or higher)
   - Download from: https://www.python.org/
   - Verify: `python --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### System Requirements

- **Operating System:** Windows 10/11, macOS, or Linux
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** ~500MB for dependencies

---

## 🚀 Installation & Running

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd Portfolio-LandonNoris

# Or download and extract the ZIP file
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic pyjwt passlib bcrypt python-multipart python-jose
   ```

4. **Run the backend server:**
   ```bash
   # From project root (important!)
   backend\venv\Scripts\uvicorn.exe backend.main:app --reload --port 8000

   # Or if inside backend folder with venv activated
   cd ..
   uvicorn backend.main:app --reload --port 8000
   ```

   ✅ Backend will run on: **http://localhost:8000**

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Run the frontend development server:**
   ```bash
   npm run dev
   ```

   ✅ Frontend will run on: **http://localhost:5173**

### Step 4: Access the Application

Open your browser and visit:
- **Main Website:** http://localhost:5173
- **Store Page:** http://localhost:5173/store
- **Admin Portal:** http://localhost:5173/admin

---

## ✨ Features

### 1. Landing Page (Home)
- **Animated Intro Section** - WebGL particle background with Lando's name
- **Hero Section** - Word-by-word animated headline with scroll effects
- **Marquee Text** - Scrolling text banners with quotes
- **Portrait Section** - Grayscale portrait with lime signature overlay
- **Achievements Grid** - Editorial-style layout showcasing career milestones
- **Statistics Counter** - Animated counters for wins, podiums, pole positions
- **Helmet Gallery** - Masonry grid of iconic helmet designs

### 2. Store Page
- **Product Catalog** - Display all helmet merchandise
- **Product Cards** - Image, name, description, price, badge, shipping date
- **Add to Cart** - Shopping cart functionality with local storage
- **Featured Product Section** - Highlighted product with detailed view
- **Newsletter Signup** - Join LN4 community banner

### 3. Checkout Page
- **Multi-Step Form** - Personal info → Shipping → Confirmation
- **Order Summary** - Cart items with quantities and total
- **Form Validation** - Client-side validation for all fields
- **Order Placement** - Submit orders to backend API
- **Success Confirmation** - Order confirmation with order ID

### 4. Admin Dashboard
- **Authentication** - JWT-based secure login
- **Analytics Overview** - Total views, orders, revenue, subscribers
- **Order Management** - View all orders, update status (pending/shipped/delivered)
- **Activity Tracking** - Recent visitor activity and page views
- **Contact Messages** - View all contact form submissions
- **Newsletter Subscribers** - List of all email subscribers
- **Data Visualization** - Charts for revenue and order trends

### 5. Additional Features
- **Custom Cursor** - Animated dot and ring cursor
- **Smooth Scrolling** - Lenis smooth scroll implementation
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Cart Drawer** - Slide-in cart with quantity controls
- **Visitor Tracking** - Automatic page view tracking
- **Contact Form** - User inquiry submission

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login (returns JWT token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin only)
- `PATCH /api/orders/{id}/status` - Update order status (admin only)

### Contact & Newsletter
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin only)
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Get all subscribers (admin only)

### Analytics
- `POST /api/track` - Track visitor activity
- `GET /api/admin/activity` - Get recent activity (admin only)
- `GET /api/admin/stats` - Get dashboard statistics (admin only)

---

## 🗄 Database Schema

### Tables

1. **products**
   - id, name, description, price, image_url, category, badge, scale, ship_date, in_stock

2. **orders**
   - id, customer_name, customer_email, customer_phone, product_id, product_name, quantity, total_price, address_line1, address_line2, city, state, postcode, country, status, notes, timestamp

3. **contacts**
   - id, name, email, message, timestamp

4. **newsletters**
   - id, email, timestamp

5. **actions**
   - id, page, action_type, timestamp, ip_address, referrer, user_agent

6. **news**
   - id, title, content, image_url, date

---

## 🔐 Admin Access

### Admin Credentials
- **Email:** `purvathorat38@gmail.com`
- **Password:** `LandoNorris2026`

### Accessing Admin Portal

**Method 1: Direct URL**
- Navigate to: http://localhost:5173/admin

**Method 2: Hidden Footer Trigger**
1. Scroll to the bottom of the homepage
2. In the footer's bottom-right corner, click exactly **10 times rapidly**
3. You'll be redirected to the admin login page

### Admin Features
- View dashboard with key metrics
- Manage orders (view, update status)
- View contact form submissions
- View newsletter subscribers
- Track visitor activity and analytics
- View revenue charts and trends

---

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `dist` folder** to Vercel or Netlify

3. **Update API base URL** in `frontend/src/App.jsx`:
   ```javascript
   axios.defaults.baseURL = 'https://your-backend-url.com';
   ```

### Backend Deployment (Railway/Render/Heroku)

1. **Update database** from SQLite to PostgreSQL for production

2. **Add environment variables:**
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   ADMIN_EMAIL=purvathorat38@gmail.com
   ADMIN_PASSWORD=LandoNorris2026
   ```

3. **Deploy** using platform-specific instructions

4. **Update CORS settings** in `backend/main.py`:
   ```python
   allow_origins=["https://your-frontend-url.com"]
   ```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'backend'`
- **Solution:** Run uvicorn from the project root, not inside the backend folder
  ```bash
  cd ..  # Go to project root
  backend\venv\Scripts\uvicorn.exe backend.main:app --reload --port 8000
  ```

**Problem:** `ImportError: cannot import name 'X' from 'backend'`
- **Solution:** Ensure you're using relative imports in backend files (`. import models`)

**Problem:** Database errors
- **Solution:** Delete `sqlite.db` and restart the backend to recreate tables

### Frontend Issues

**Problem:** Blank page after starting dev server
- **Solution:** Check browser console for errors. Ensure all `motion` imports are present in files using Framer Motion

**Problem:** `npm install` fails
- **Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Problem:** Cart not persisting
- **Solution:** Check browser's local storage. Clear cache and reload

### Port Conflicts

**Problem:** Port 8000 or 5173 already in use
- **Solution:** 
  ```bash
  # Backend - use different port
  uvicorn backend.main:app --reload --port 8001
  
  # Frontend - Vite will auto-assign next available port
  ```

### CORS Errors

**Problem:** API requests blocked by CORS
- **Solution:** Ensure backend CORS middleware allows frontend origin:
  ```python
  allow_origins=["http://localhost:5173"]
  ```

---

## 📝 Environment Variables

### Backend (.env file - optional)
```env
SECRET_KEY=your-secret-key-here
ADMIN_EMAIL=purvathorat38@gmail.com
ADMIN_PASSWORD=LandoNorris2026
DATABASE_URL=sqlite:///./sqlite.db
```

### Frontend (.env file - optional)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🤝 Contributing

This is a portfolio project. If you'd like to contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is for educational purposes. All Lando Norris images and branding are property of their respective owners.

---

## 👨‍💻 Developer

Created by **Purva Thorat**
- Email: purvathorat38@gmail.com

---

## 🙏 Acknowledgments

- Lando Norris for the inspiration
- McLaren F1 Team
- React, FastAPI, and open-source community

---

**Enjoy the website! 🏎️💨**
