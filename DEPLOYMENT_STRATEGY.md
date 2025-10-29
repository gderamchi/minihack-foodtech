# 🚀 Deployment Strategy - Separate Frontend & Backend

## Problem with Monorepo Deployment

The initial `vercel.json` configuration tried to deploy both frontend and backend together, which caused build issues. 

**Better Approach:** Deploy frontend and backend separately.

---

## ✅ Recommended Deployment Strategy

### Option 1: Frontend on Vercel + Backend on Render (Recommended)

This is the **easiest and most reliable** approach:

#### **Frontend (Vercel):**
- Deploy React app to Vercel
- Fast, free, automatic HTTPS
- Perfect for static sites

#### **Backend (Render):**
- Deploy Express API to Render
- Free tier available
- Supports Node.js perfectly
- Always-on server

---

## 📋 Step-by-Step Deployment

### Part 1: Deploy Backend to Render

1. **Go to Render Dashboard:**
   - Visit: https://render.com
   - Sign up/Login with GitHub

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `gderamchi/minihack-foodtech`
   - Click "Connect"

3. **Configure Service:**
   ```
   Name: vegan-diet-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node src/server.js
   ```

4. **Add Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   BLACKBOX_API_KEY=your_blackbox_api_key
   JWT_SECRET=your_random_32_char_string
   NODE_ENV=production
   PORT=5001
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy your backend URL: `https://vegan-diet-backend.onrender.com`

---

### Part 2: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository:**
   - Click "Import Git Repository"
   - Select: `gderamchi/minihack-foodtech`
   - Click "Import"

3. **Configure Project:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://vegan-diet-backend.onrender.com/api
   ```
   (Use the Render backend URL from Part 1)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

---

### Part 3: Update CORS (Important!)

After deploying frontend, update backend CORS:

1. **Go to Render Dashboard** → Your Backend Service → Environment
2. **Add/Update:**
   ```
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```
3. **Redeploy** backend service

---

## 🎯 Alternative: Both on Vercel (Advanced)

If you want both on Vercel, you need to deploy them as **separate projects**:

### Backend Project:
1. Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

2. Deploy backend separately:
   - Import repo to Vercel
   - Set Root Directory: `backend`
   - Deploy

### Frontend Project:
1. Deploy frontend separately:
   - Import repo to Vercel again
   - Set Root Directory: `frontend`
   - Add `VITE_API_URL` pointing to backend Vercel URL
   - Deploy

---

## 🔧 Quick Fix for Current Deployment

To fix the current Vercel deployment error:

### Option A: Deploy Frontend Only

1. **Update Vercel Project Settings:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Add Environment Variable:**
   ```
   VITE_API_URL=http://localhost:5001/api
   ```
   (Update later when backend is deployed)

3. **Redeploy**

### Option B: Remove vercel.json

1. Delete `vercel.json` from root
2. Let Vercel auto-detect (it will find frontend)
3. Configure in Vercel Dashboard as above

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────┐
│  Frontend (Vercel)              │
│  https://your-app.vercel.app    │
│  - React + Vite                 │
│  - Static files                 │
└─────────────────────────────────┘
           ↓ API Calls
┌─────────────────────────────────┐
│  Backend (Render)               │
│  https://backend.onrender.com   │
│  - Express API                  │
│  - Node.js server               │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│  MongoDB Atlas                  │
│  Cloud Database                 │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│  Blackbox AI                    │
│  Recipe Generation              │
└─────────────────────────────────┘
```

---

## 💰 Cost Comparison

### Vercel + Render (Recommended):
- **Frontend (Vercel):** Free
- **Backend (Render):** Free tier (spins down after 15min inactivity)
- **Total:** $0/month

### Both on Vercel:
- **Frontend:** Free
- **Backend:** Serverless functions (may have cold starts)
- **Total:** $0/month (with limitations)

### Render Pro (Best Performance):
- **Frontend (Vercel):** Free
- **Backend (Render Pro):** $7/month (always on, no cold starts)
- **Total:** $7/month

---

## 🎯 Recommended: Vercel (Frontend) + Render (Backend)

**Why this is best:**
1. ✅ **Easiest setup** - No complex configuration
2. ✅ **Free tier** - Both platforms have generous free tiers
3. ✅ **Reliable** - Render keeps backend always running (free tier spins down)
4. ✅ **Fast** - Vercel CDN for frontend, Render for API
5. ✅ **Simple** - Each service does what it's best at

---

## 🚀 Quick Start Commands

### Deploy Backend to Render:
```bash
# No commands needed - use Render Dashboard
# Just connect GitHub and configure as shown above
```

### Deploy Frontend to Vercel:
```bash
# Option 1: Use Vercel Dashboard (recommended)
# Option 2: Use Vercel CLI
cd frontend
vercel --prod
```

---

## ✅ Deployment Checklist

**Backend (Render):**
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Configure build settings (root: backend)
- [ ] Add environment variables
- [ ] Deploy and get backend URL
- [ ] Test API endpoints

**Frontend (Vercel):**
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure build settings (root: frontend)
- [ ] Add VITE_API_URL environment variable
- [ ] Deploy and get frontend URL
- [ ] Test website

**Final Steps:**
- [ ] Update backend CORS with frontend URL
- [ ] Test full application flow
- [ ] Verify recipe generation works
- [ ] Verify store locator works

---

## 🐛 Troubleshooting

### Issue: "Build failed on Vercel"
**Solution:** Set Root Directory to `frontend` in project settings

### Issue: "API calls failing"
**Solution:** Check VITE_API_URL is correct and backend is running

### Issue: "CORS error"
**Solution:** Add frontend URL to backend FRONTEND_URL env variable

### Issue: "Render backend sleeping"
**Solution:** Free tier spins down after 15min. Upgrade to $7/month for always-on

---

## 📚 Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Blackbox AI:** https://www.blackbox.ai/dashboard

---

## 🎊 Success!

Once deployed:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **Full App:** Working together seamlessly!

Your vegan diet rotation app is now live! 🌱🚀
