# ✅ Vercel Deployment Checklist

## 🎉 Code Successfully Pushed to GitHub!

Your code is now on GitHub and ready for Vercel deployment.

**Repository:** https://github.com/gderamchi/minihack-foodtech
**Branch:** main
**Commit:** 37768ca - "Prepare for Vercel deployment: Remove API keys, add pagination, configure deployment"

---

## 🔐 Security Status: ✅ CLEAN

- ✅ All `.env` files removed
- ✅ No hardcoded API keys in code
- ✅ No hardcoded MongoDB URIs
- ✅ `.gitignore` updated to prevent future leaks
- ✅ Only `.env.example` files remain (safe templates)

---

## 📋 Next Steps: Deploy to Vercel

### Step 1: Import Project to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Repository:**
   - Click "Import Git Repository"
   - Select: `gderamchi/minihack-foodtech`
   - Click "Import"

3. **Configure Project Settings:**
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: cd frontend && npm install && npm run build
   Output Directory: frontend/dist
   Install Command: npm install
   ```

---

### Step 2: Configure Environment Variables

**CRITICAL:** Add these environment variables in Vercel Dashboard:

#### Go to: Project Settings → Environment Variables

#### Backend Variables (Required):

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `BLACKBOX_API_KEY` | `your_api_key` | https://www.blackbox.ai/dashboard |
| `JWT_SECRET` | Random 32+ chars | Generate: `openssl rand -base64 32` |
| `NODE_ENV` | `production` | Fixed value |
| `PORT` | `5001` | Fixed value |

#### Frontend Variables (Required):

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your Vercel backend URL | `https://your-app.vercel.app/api` |

**Note:** You'll get the backend URL after first deployment, then update `VITE_API_URL` and redeploy.

---

### Step 3: Deploy!

1. **Click "Deploy"** in Vercel Dashboard
2. **Wait for build** (2-3 minutes)
3. **Check deployment logs** for any errors
4. **Get your URL:** `https://your-app.vercel.app`

---

### Step 4: Update Frontend API URL

After first deployment:

1. **Copy your Vercel URL:** `https://your-app-name.vercel.app`
2. **Add environment variable:**
   - Go to: Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-app-name.vercel.app/api`
3. **Redeploy:**
   - Go to: Deployments → Latest → ⋯ → Redeploy

---

### Step 5: Configure MongoDB Atlas

**Allow Vercel IPs:**

1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Access List
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

**Why?** Vercel uses dynamic IPs, so we need to allow all IPs.

---

### Step 6: Test Your Deployment

#### Test Backend API:
```bash
# Test dishes endpoint
curl https://your-app.vercel.app/api/dishes

# Test menus endpoint
curl https://your-app.vercel.app/api/menus

# Test stores endpoint
curl "https://your-app.vercel.app/api/stores/nearby?latitude=48.8566&longitude=2.3522&limit=10"
```

#### Test Frontend:
1. Visit: `https://your-app.vercel.app`
2. Navigate to "Generate Vegan Recipe"
3. Enter a dish name (e.g., "Beef Bourguignon")
4. Click "Generate" - should work with Blackbox API
5. Go to "Store Locator" - should load stores with pagination

---

## 🐛 Troubleshooting

### Issue: "Module not found" Error

**Solution:**
```bash
# Ensure all dependencies are in package.json
cd backend && npm install
cd frontend && npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### Issue: "Environment variables not working"

**Solution:**
1. Check variable names match exactly (case-sensitive)
2. Redeploy after adding variables
3. Check Vercel logs: Deployments → View Function Logs

### Issue: "CORS Error"

**Solution:**
Add `FRONTEND_URL` environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```

Then update `backend/src/server.js` if needed.

### Issue: "MongoDB Connection Failed"

**Solution:**
1. Verify MongoDB Atlas allows 0.0.0.0/0
2. Check connection string is correct
3. Ensure database user has correct permissions

### Issue: "Blackbox API Not Working"

**Solution:**
1. Verify API key is correct
2. Check you have credits/quota remaining
3. Test API key locally first

---

## 📊 Deployment Architecture

```
GitHub (main branch)
    ↓
Vercel (Auto-deploy on push)
    ↓
┌─────────────────────────────────┐
│  Frontend (React + Vite)        │
│  https://your-app.vercel.app    │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Backend API (Express)          │
│  https://your-app.vercel.app/api│
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  MongoDB Atlas (Cloud Database) │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Blackbox AI (Recipe Generation)│
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  OpenStreetMap (Store Data)     │
└─────────────────────────────────┘
```

---

## 🎯 Environment Variables Summary

### Required for Backend:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vegan-diet-app
BLACKBOX_API_KEY=your_blackbox_api_key_here
JWT_SECRET=your_secure_random_32_character_string
NODE_ENV=production
PORT=5001
```

### Required for Frontend:
```bash
VITE_API_URL=https://your-app.vercel.app/api
```

### Optional:
```bash
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🔄 Continuous Deployment

Once connected to GitHub:

1. **Make changes locally**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Vercel auto-deploys** (2-3 minutes)
4. **Check deployment status** in Vercel Dashboard

---

## 📱 Custom Domain (Optional)

1. Go to: Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

---

## 🎊 Success Criteria

Your deployment is successful when:

- ✅ Frontend loads at `https://your-app.vercel.app`
- ✅ All pages navigate correctly
- ✅ Recipe generation works (Blackbox API)
- ✅ Store locator shows real stores (OpenStreetMap)
- ✅ Pagination works (50 stores at a time)
- ✅ No console errors
- ✅ Mobile responsive
- ✅ HTTPS enabled (automatic)

---

## 📚 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Blackbox AI:** https://www.blackbox.ai/dashboard
- **GitHub Repo:** https://github.com/gderamchi/minihack-foodtech
- **Vercel Docs:** https://vercel.com/docs

---

## 🚀 Quick Deploy Commands

```bash
# If you need to make changes and redeploy:

# 1. Make your changes
# 2. Commit and push
git add .
git commit -m "Update: description of changes"
git push origin main

# 3. Vercel will auto-deploy!
# Check status at: https://vercel.com/dashboard
```

---

## 💡 Pro Tips

1. **Preview Deployments:** Every branch gets a preview URL
2. **Rollback:** Can rollback to previous deployment in one click
3. **Analytics:** Enable Vercel Analytics for insights
4. **Logs:** Check Function Logs for debugging
5. **Environment:** Use different env vars for Production/Preview/Development

---

## 🎉 You're Ready!

Your vegan diet rotation app is ready for deployment!

**Next Action:** Go to https://vercel.com/new and import your repository!

Good luck! 🌱
