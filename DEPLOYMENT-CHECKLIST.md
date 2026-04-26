# ✅ DEPLOYMENT CHECKLIST

Use this checklist to ensure you don't miss any steps!

---

## 📦 BEFORE YOU START

- [ ] Project is working locally (both frontend and backend)
- [ ] You have a GitHub account
- [ ] Git is installed on your computer
- [ ] All changes are saved

---

## 🔧 PREPARATION

- [ ] Created `backend/requirements.txt` file
- [ ] Created `backend/runtime.txt` file
- [ ] Created `vercel.json` file in project root
- [ ] Tested that everything still works locally

---

## 📤 GITHUB

- [ ] Created new repository on GitHub
- [ ] Initialized git in project folder (`git init`)
- [ ] Added all files (`git add .`)
- [ ] Committed changes (`git commit -m "Initial commit"`)
- [ ] Added remote origin (`git remote add origin ...`)
- [ ] Pushed to GitHub (`git push -u origin main`)
- [ ] Verified code is visible on GitHub

---

## 🖥️ BACKEND DEPLOYMENT (Render)

- [ ] Signed up for Render account
- [ ] Connected GitHub account to Render
- [ ] Created new Web Service
- [ ] Selected correct repository
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command: `pip install -r requirements.txt`
- [ ] Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Selected Free plan
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment to complete
- [ ] Copied backend URL (e.g., `https://lando-norris-backend.onrender.com`)
- [ ] Tested backend URL in browser (should see 404 or API response)

---

## 🌐 FRONTEND DEPLOYMENT (Vercel)

- [ ] Updated `frontend/src/App.jsx` with backend URL
  ```javascript
  axios.defaults.baseURL = 'https://your-backend-url.onrender.com';
  ```
- [ ] Committed and pushed changes to GitHub
- [ ] Signed up for Vercel account
- [ ] Connected GitHub account to Vercel
- [ ] Imported project from GitHub
- [ ] Set Root Directory to `frontend`
- [ ] Verified Framework Preset is `Vite`
- [ ] Clicked "Deploy"
- [ ] Waited for deployment to complete
- [ ] Copied frontend URL (e.g., `https://lando-norris-portfolio.vercel.app`)

---

## 🔒 SECURITY & CORS

- [ ] Updated CORS in `backend/main.py` with Vercel URL
- [ ] Committed and pushed CORS changes
- [ ] Waited for Render to auto-redeploy backend
- [ ] Verified no CORS errors in browser console

---

## 🧪 TESTING

- [ ] Visited frontend URL
- [ ] Homepage loads correctly
- [ ] Images are displaying
- [ ] Animations are working
- [ ] Navigated to Store page
- [ ] Products are loading
- [ ] Added item to cart
- [ ] Cart drawer opens
- [ ] Navigated to Checkout page
- [ ] Filled out checkout form
- [ ] Submitted order successfully
- [ ] Navigated to Admin page (`/admin`)
- [ ] Logged in with credentials
- [ ] Dashboard loads with stats
- [ ] Orders are visible
- [ ] Activity tracking works

---

## 📝 DOCUMENTATION

- [ ] Updated README.md with live URLs
- [ ] Saved backend URL for future reference
- [ ] Saved frontend URL for future reference
- [ ] Shared links with others (if applicable)

---

## 🎉 FINAL STEPS

- [ ] Bookmarked Vercel dashboard
- [ ] Bookmarked Render dashboard
- [ ] Tested website on mobile device
- [ ] Tested website on different browser
- [ ] Celebrated successful deployment! 🎊

---

## 📋 YOUR DEPLOYMENT URLS

Fill these in once deployed:

**Frontend (Vercel):**
```
https://_____________________________.vercel.app
```

**Backend (Render):**
```
https://_____________________________.onrender.com
```

**Admin Portal:**
```
https://_____________________________.vercel.app/admin
```

---

## 🔄 FUTURE UPDATES

When you make changes:

1. Make changes in code
2. Test locally
3. `git add .`
4. `git commit -m "Description"`
5. `git push`
6. Wait for auto-deployment (2-10 minutes)
7. Test live website

---

**Good luck with your deployment! 🚀**
