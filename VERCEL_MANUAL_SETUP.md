# 🚀 Vercel Manual Setup Guide

Since automatic configuration had issues, here's how to set up Vercel manually through the dashboard.

---

## ⚠️ Important: Manual Configuration Required

The `vercel.json` has been simplified to let Vercel auto-detect the project. However, you need to **manually configure the project settings** in the Vercel dashboard.

---

## 📋 Step-by-Step Setup

### 1. Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select: `gderamchi/minihack-foodtech`
4. Click "Import"

---

### 2. Configure Build Settings

**IMPORTANT:** Before clicking "Deploy", configure these settings:

#### **Framework Preset:**
- Select: `Vite`

#### **Root Directory:**
- Set to: `frontend`
- Click "Edit" next to Root Directory
- Type: `frontend`
- Click "Continue"

#### **Build and Output Settings:**
- Build Command: `npm run build` (or leave default)
- Output Directory: `dist` (or leave default)
- Install Command: `npm install` (or leave default)

---

### 3. Add Environment Variables

Before deploying, add this environment variable:

**Key:** `VITE_API_URL`  
**Value:** `http://localhost:5001/api` (temporary - update after backend deployment)

To add:
1. Scroll down to "Environment Variables"
2. Click "Add"
3. Enter key and value
4. Click "Add"

---

### 4. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your frontend will be live! 🎉

---

## 🎯 After Frontend Deployment

### Deploy Backend to Render

1. **Go to Render:** https://render.com
2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub: `gderamchi/minihack-foodtech`
   
3. **Configure:**
   ```
   Name: vegan-diet-backend
   Region: Choose closest
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
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy** and copy your backend URL

---

### Update Frontend Environment Variable

1. Go to Vercel Dashboard → Your Project
2. Go to Settings → Environment Variables
3. Edit `VITE_API_URL`
4. Change to: `https://your-backend.onrender.com/api`
5. Redeploy frontend

---

## ✅ Verification Checklist

After both deployments:

- [ ] Frontend loads at Vercel URL
- [ ] Backend responds at Render URL
- [ ] Can generate vegan recipes (tests Blackbox API)
- [ ] Store locator works (tests OpenStreetMap)
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### Issue: "Build failed"
**Solution:** Make sure Root Directory is set to `frontend` in Vercel settings

### Issue: "API calls failing"
**Solution:** Check `VITE_API_URL` environment variable is correct

### Issue: "CORS error"
**Solution:** Add frontend URL to backend `FRONTEND_URL` environment variable

### Issue: "Render backend sleeping"
**Solution:** Free tier spins down after 15min. First request will be slow. Upgrade to $7/month for always-on.

---

## 📊 Expected Configuration

### Vercel (Frontend):
```
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Environment Variables:
  - VITE_API_URL=https://backend.onrender.com/api
```

### Render (Backend):
```
Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: node src/server.js
Environment Variables:
  - MONGODB_URI=mongodb+srv://...
  - BLACKBOX_API_KEY=sk-...
  - JWT_SECRET=random_string
  - NODE_ENV=production
  - FRONTEND_URL=https://app.vercel.app
```

---

## 🎊 Success!

Once configured:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **Full App:** Working together! 🌱🚀

---

## 💡 Why Manual Setup?

The automatic `vercel.json` configuration had issues with:
1. Monorepo structure (frontend + backend in same repo)
2. Vite module resolution
3. Build command execution context

**Manual setup through Vercel dashboard is more reliable** and gives you full control over the configuration.

---

## 📚 Additional Resources

- **Vercel Vite Docs:** https://vercel.com/docs/frameworks/vite
- **Render Node.js Docs:** https://render.com/docs/deploy-node-express-app
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Blackbox AI:** https://www.blackbox.ai/dashboard

---

## 🔐 Security Reminder

✅ All sensitive data is in environment variables  
✅ No API keys in code  
✅ `.env` files are gitignored  
✅ Safe to deploy publicly

---

**Need help?** Check `DEPLOYMENT_STRATEGY.md` for alternative deployment approaches!
