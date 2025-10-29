# ⚡ Quick Deploy Reference

## 🎯 What You Need Right Now

### 1. MongoDB Atlas Connection String
```
mongodb+srv://USERNAME:PASSWORD@cluster.xxxxx.mongodb.net/vegan-diet-app?retryWrites=true&w=majority
```
👉 Get it from: https://mongodb.com/cloud/atlas

### 2. Blackbox API Key
```
your_blackbox_api_key_here
```
👉 Get it from: https://www.blackbox.ai/dashboard

### 3. JWT Secret (Generate Now)
Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Deploy in 3 Steps

### Step 1: MongoDB Atlas (5 min)
1. Create free cluster at https://mongodb.com/cloud/atlas
2. Create database user with password
3. Allow access from anywhere (0.0.0.0/0)
4. Get connection string

### Step 2: Render (10 min)
1. Go to https://render.com
2. New + → Web Service
3. Connect GitHub: `gderamchi/minihack-foodtech`
4. Add environment variables:
   - `MONGODB_URI` = your connection string
   - `BLACKBOX_API_KEY` = your API key
   - `JWT_SECRET` = generated secret
5. Deploy!

### Step 3: Update Vercel (2 min)
1. Go to https://vercel.com/dashboard
2. Your project → Settings → Environment Variables
3. Add/Update:
   - `VITE_API_URL` = `https://vegan-diet-backend.onrender.com/api`
4. Redeploy

---

## ✅ Test

**Backend:** https://vegan-diet-backend.onrender.com/health
**Frontend:** https://minihack-foodtech.vercel.app

---

## 📚 Full Guide

See `RENDER_DEPLOYMENT_STEPS.md` for detailed instructions with screenshots and troubleshooting.

---

## 🆘 Need Help?

**Common Issues:**
- Backend slow? Free tier has cold starts (30-60s first request)
- CORS error? Check FRONTEND_URL in Render
- Can't connect? Verify MongoDB connection string

**Still stuck?** Check the full guide in `RENDER_DEPLOYMENT_STEPS.md`
