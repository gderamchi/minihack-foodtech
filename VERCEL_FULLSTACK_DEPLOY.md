# 🚀 Deploy Full Stack to Vercel - Complete Guide

## ✅ What's Been Done

Your application is now configured to deploy **both frontend AND backend** to Vercel on the same domain!

**Changes Made:**
1. ✅ Updated `vercel.json` to build both frontend and backend
2. ✅ Configured API routes to `/api/*` 
3. ✅ Frontend uses relative URLs in production (`/api`)
4. ✅ Added `vercel-build` script to frontend
5. ✅ Pushed to GitHub (commit: d50d187)

---

## 🎯 Deploy to Vercel (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Your project should auto-deploy from the latest commit
3. If not, click **"Redeploy"** on the latest deployment

### Step 2: Add Environment Variables

Click on your project → **Settings** → **Environment Variables**

Add these **3 required variables**:

#### 1. MONGODB_URI
```
mongodb+srv://username:password@cluster.mongodb.net/vegan-diet-app?retryWrites=true&w=majority
```
- Get from: https://mongodb.com/cloud/atlas
- **Quick Setup:**
  1. Create free cluster
  2. Create database user
  3. Allow access from anywhere (0.0.0.0/0)
  4. Get connection string

#### 2. BLACKBOX_API_KEY
```
your_blackbox_api_key_here
```
- You mentioned you already have this! ✅
- Get from: https://www.blackbox.ai/dashboard

#### 3. JWT_SECRET
```
Generate a random 32-character string
```
- Run this command to generate:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Or use: https://randomkeygen.com/

**Important:** Set all variables for **Production** environment!

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

---

## 🎉 Test Your Application

### Backend Health Check
Visit: `https://minihack-foodtech.vercel.app/health`

Expected response:
```json
{
  "status": "ok",
  "message": "Vegan Diet API is running",
  "timestamp": "2024-..."
}
```

### Frontend
Visit: `https://minihack-foodtech.vercel.app`

Test these features:
1. ✅ Enter a dish (e.g., "Chicken Parmesan")
2. ✅ Click "Generate Vegan Alternative"
3. ✅ Wait for AI response
4. ✅ Browse menus
5. ✅ Use store locator

---

## 📋 Architecture

```
https://minihack-foodtech.vercel.app
├── /                    → Frontend (React + Vite)
├── /api/*              → Backend API (Node.js + Express)
├── /health             → Backend health check
└── All other routes    → Frontend (SPA routing)
```

**Benefits:**
- ✅ Single domain (no CORS issues!)
- ✅ Faster (no cross-domain requests)
- ✅ Simpler deployment
- ✅ Free tier friendly

---

## 🐛 Troubleshooting

### "Cannot connect to database"
**Solution:**
1. Check MongoDB connection string in Vercel env vars
2. Verify password has no special characters (or URL encode them)
3. Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas

### "BLACKBOX_API_KEY is not defined"
**Solution:**
1. Verify you added the env var in Vercel
2. Check it's set for "Production" environment
3. Redeploy after adding env vars

### "Function execution timeout"
**Solution:**
- Vercel free tier has 10s timeout for serverless functions
- First AI request might be slow (cold start)
- Subsequent requests will be faster

### API returns 404
**Solution:**
1. Check the API route starts with `/api/`
2. Verify `vercel.json` routes are correct
3. Redeploy

---

## 💰 Cost

**Total: $0/month** (free tier)

- ✅ Vercel: Free (100GB bandwidth, 100 serverless function invocations/day)
- ✅ MongoDB Atlas: Free (512MB storage)
- ✅ Blackbox API: Pay per use (very cheap)

**Note:** Vercel free tier limits:
- 100 GB bandwidth/month
- 100 serverless function executions/day
- 10s function timeout

For production with more traffic, consider:
- Vercel Pro: $20/month (unlimited functions, 1000GB bandwidth)

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Blackbox API key ready
- [ ] JWT secret generated
- [ ] All 3 environment variables added to Vercel
- [ ] Project redeployed
- [ ] Backend health check passes (`/health`)
- [ ] Frontend loads successfully
- [ ] AI dish generation works
- [ ] Store locator works

---

## 🎊 You're Done!

Your full-stack vegan diet application is now live on Vercel! 🌱🚀

**Live URL:** https://minihack-foodtech.vercel.app

**What works:**
- ✅ Frontend React app
- ✅ Backend API on same domain
- ✅ AI-powered vegan recipe generation (Blackbox API)
- ✅ Store locator with 2000+ stores
- ✅ Menu browsing
- ✅ Dish management
- ✅ No CORS issues!

---

## 🔄 Future Updates

To update your app:
1. Make changes locally
2. Commit and push to GitHub
3. Vercel auto-deploys! ✨

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically build and deploy in 2-3 minutes.

---

## 📚 Additional Resources

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Blackbox API: https://www.blackbox.ai/docs

Need help? Check the Vercel deployment logs for detailed error messages.
