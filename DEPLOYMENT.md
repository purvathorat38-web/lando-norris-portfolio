# 🚀 DEPLOYMENT GUIDE - Lando Norris Portfolio

This guide will help you deploy your project to the internet for FREE using Vercel (Frontend) and Render (Backend).

---

## 📋 Prerequisites

Before you start, make sure you have:
1. ✅ A GitHub account (create at https://github.com)
2. ✅ Git installed on your computer
3. ✅ Your project code ready

---

## PART 1: Push Your Code to GitHub

### Step 1: Create a GitHub Repository

1. Go to https://github.com and log in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Name it: `lando-norris-portfolio`
5. Keep it **Public** (or Private if you prefer)
6. **DO NOT** initialize with README (we already have one)
7. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

Open your terminal in the project root folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Lando Norris Portfolio"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/lando-norris-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

## PART 2: Deploy Backend to Render

### Step 1: Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with your **GitHub account** (easiest option)

### Step 2: Create a New Web Service

1. Click **"New +"** button in the top-right
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect account"** if needed
   - Find and select your `lando-norris-portfolio` repository
4. Click **"Connect"**

### Step 3: Configure the Web Service

Fill in the following settings:

- **Name:** `lando-norris-backend` (or any name you like)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 4: Environment Variables (Optional)

Scroll down to **"Environment Variables"** and add:

- `SECRET_KEY` = `your-secret-key-here-change-this`
- `ADMIN_EMAIL` = `purvathorat38@gmail.com`
- `ADMIN_PASSWORD` = `LandoNorris2026`

### Step 5: Deploy

1. Select **"Free"** plan
2. Click **"Create Web Service"**
3. Wait 5-10 minutes for deployment to complete
4. Once done, you'll see a URL like: `https://lando-norris-backend.onrender.com`

**IMPORTANT:** Copy this URL! You'll need it for the frontend.

---

## PART 3: Deploy Frontend to Vercel

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with your **GitHub account**

### Step 2: Update Frontend API URL

Before deploying, update the API URL in your frontend:

1. Open `frontend/src/App.jsx`
2. Find this line:
   ```javascript
   axios.defaults.baseURL = '';
   ```
3. Change it to your Render backend URL:
   ```javascript
   axios.defaults.baseURL = 'https://lando-norris-backend.onrender.com';
   ```
4. Save the file
5. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update API URL for deployment"
   git push
   ```

### Step 3: Import Project to Vercel

1. In Vercel dashboard, click **"Add New..."**
2. Select **"Project"**
3. Click **"Import"** next to your `lando-norris-portfolio` repository
4. If you don't see it, click **"Adjust GitHub App Permissions"**

### Step 4: Configure Project Settings

- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Once done, you'll get a URL like: `https://lando-norris-portfolio.vercel.app`

**🎉 Your website is now LIVE!**

---

## PART 4: Update Backend CORS (Important!)

After deploying frontend, update backend CORS to allow your Vercel domain:

1. Open `backend/main.py`
2. Find the CORS middleware section:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Change this
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. Update to:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://lando-norris-portfolio.vercel.app",  # Your Vercel URL
           "http://localhost:5173"  # Keep for local development
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
4. Commit and push:
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```
5. Render will automatically redeploy your backend

---

## 🎯 Testing Your Deployed Website

1. Visit your Vercel URL: `https://lando-norris-portfolio.vercel.app`
2. Test the store page
3. Try adding items to cart
4. Test the checkout process
5. Access admin portal: `https://lando-norris-portfolio.vercel.app/admin`
   - Email: `purvathorat38@gmail.com`
   - Password: `LandoNorris2026`

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend API not responding
**Solution:** 
- Check if Render service is running (it may sleep after 15 min of inactivity on free plan)
- Visit your backend URL directly to wake it up
- Wait 30 seconds and try again

### Issue 2: CORS errors in browser console
**Solution:**
- Make sure you updated CORS in `backend/main.py` with your Vercel URL
- Push changes to GitHub
- Wait for Render to redeploy

### Issue 3: Database not persisting data
**Solution:**
- Render's free tier doesn't persist SQLite files
- For production, upgrade to PostgreSQL (see below)

### Issue 4: Images not loading
**Solution:**
- Make sure all images are in `frontend/public/` folder
- Check image paths in code (should start with `/`)
- Redeploy frontend

---

## 🔄 Updating Your Deployed Website

Whenever you make changes:

```bash
# Make your changes in code
# Then commit and push
git add .
git commit -m "Description of changes"
git push
```

- **Vercel** will automatically redeploy frontend (takes 2-3 min)
- **Render** will automatically redeploy backend (takes 5-10 min)

---

## 💾 Upgrade to PostgreSQL (Recommended for Production)

SQLite doesn't work well on Render. To use PostgreSQL:

### Step 1: Create PostgreSQL Database on Render

1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Name it: `lando-norris-db`
4. Select **Free** plan
5. Click **"Create Database"**
6. Copy the **"Internal Database URL"**

### Step 2: Update Backend Code

1. Install psycopg2 in `backend/requirements.txt`:
   ```
   psycopg2-binary==2.9.9
   ```

2. Update `backend/database.py`:
   ```python
   import os
   from sqlalchemy import create_engine
   from sqlalchemy.ext.declarative import declarative_base
   from sqlalchemy.orm import sessionmaker

   # Use PostgreSQL in production, SQLite in development
   DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sqlite.db")
   
   # Fix for Render's postgres:// URL
   if DATABASE_URL.startswith("postgres://"):
       DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

   engine = create_engine(DATABASE_URL)
   SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
   Base = declarative_base()
   ```

3. Add environment variable in Render:
   - Go to your backend service settings
   - Add `DATABASE_URL` = (paste the Internal Database URL)

4. Push changes and redeploy

---

## 📊 Monitoring Your Website

### Vercel Analytics
- Go to your project in Vercel
- Click **"Analytics"** tab
- See visitor stats, page views, etc.

### Render Logs
- Go to your service in Render
- Click **"Logs"** tab
- See API requests, errors, etc.

---

## 💰 Cost Breakdown

### Free Tier (What you're using):
- **Vercel:** Unlimited bandwidth, 100GB/month
- **Render:** 750 hours/month (enough for 1 service running 24/7)
- **Total Cost:** $0/month

### Limitations:
- Backend sleeps after 15 min of inactivity (wakes up in 30 sec)
- SQLite data doesn't persist on Render (use PostgreSQL)
- Limited to 1 backend service on free tier

---

## 🎉 You're Done!

Your website is now live and accessible from anywhere in the world!

**Share your links:**
- Frontend: `https://lando-norris-portfolio.vercel.app`
- Backend API: `https://lando-norris-backend.onrender.com`

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Check Render logs for backend errors
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

**Good luck! 🏎️💨**
