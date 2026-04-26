# ⚡ QUICK DEPLOYMENT GUIDE (5 Minutes)

Follow these steps to deploy your website in under 10 minutes!

---

## 🚀 STEP 1: Push to GitHub (2 minutes)

```bash
# Open terminal in project root folder
git init
git add .
git commit -m "Initial commit"

# Go to github.com, create new repository named: lando-norris-portfolio
# Then run (replace YOUR-USERNAME):
git remote add origin https://github.com/YOUR-USERNAME/lando-norris-portfolio.git
git branch -M main
git push -u origin main
```

---

## 🖥️ STEP 2: Deploy Backend to Render (3 minutes)

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your `lando-norris-portfolio` repository
4. Fill in:
   - **Name:** `lando-norris-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **"Create Web Service"** (Free plan)
6. **COPY YOUR BACKEND URL** (e.g., `https://lando-norris-backend.onrender.com`)

---

## 🌐 STEP 3: Update Frontend & Deploy to Vercel (3 minutes)

### Update API URL:
1. Open `frontend/src/App.jsx`
2. Change line 12:
   ```javascript
   axios.defaults.baseURL = 'https://YOUR-BACKEND-URL.onrender.com';
   ```
3. Save, commit, and push:
   ```bash
   git add .
   git commit -m "Update API URL"
   git push
   ```

### Deploy to Vercel:
1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your `lando-norris-portfolio` repository
4. Set **Root Directory:** `frontend`
5. Click **"Deploy"**
6. **COPY YOUR FRONTEND URL** (e.g., `https://lando-norris-portfolio.vercel.app`)

---

## ✅ STEP 4: Update CORS (1 minute)

1. Open `backend/main.py`
2. Update CORS (around line 14):
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://YOUR-FRONTEND-URL.vercel.app",
           "http://localhost:5173"
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update CORS"
   git push
   ```

---

## 🎉 DONE!

Your website is now LIVE at:
- **Frontend:** `https://YOUR-PROJECT.vercel.app`
- **Admin:** `https://YOUR-PROJECT.vercel.app/admin`

**Admin Login:**
- Email: `purvathorat38@gmail.com`
- Password: `LandoNorris2026`

---

## ⚠️ Important Notes:

1. **Backend may sleep** after 15 min of inactivity (free tier)
   - First request after sleep takes ~30 seconds
   - Subsequent requests are instant

2. **Database (SQLite) doesn't persist** on Render free tier
   - Data resets when backend restarts
   - For production, upgrade to PostgreSQL (see DEPLOYMENT.md)

3. **Auto-deployment enabled**
   - Any push to GitHub automatically redeploys
   - Vercel: ~2 minutes
   - Render: ~5-10 minutes

---

## 🐛 Troubleshooting:

**Backend not responding?**
- Visit backend URL directly to wake it up
- Wait 30 seconds and try again

**CORS errors?**
- Make sure you updated CORS with correct Vercel URL
- Wait for Render to redeploy (check Render dashboard)

**Images not loading?**
- Check browser console for errors
- Verify images are in `frontend/public/` folder

---

**Need detailed instructions? See DEPLOYMENT.md**

**Good luck! 🏎️💨**
