# 🚀 Backend Deployment to Render

Your frontend is now live at Vercel! Now let's deploy the backend to Render.

---

## 📋 Quick Summary

**What you need:**
1. Render account (free)
2. MongoDB Atlas account (free)
3. Blackbox API key

**Time:** 15-20 minutes

---

## Step 1: Set Up MongoDB Atlas (5 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create FREE cluster (M0)
4. Create database user with password
5. Allow network access (0.0.0.0/0)
6. Get connection string

**Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vegan-diet-app?retryWrites=true&w=majority
```

---

## Step 2: Deploy to Render (10 min)

### Create Web Service

1. Go to https://render.com
2. New + → Web Service
3. Connect GitHub: `gderamchi/minihack-foodtech`

### Configure

```
Name: vegan-diet-backend
Region: Choose closest
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node src/server.js
Instance: Free
```

### Environment Variables

Add these in Render:

```bash
MONGODB_URI=your_mongodb_connection_string
BLACKBOX_API_KEY=your_blackbox_api_key
JWT_SECRET=generate_random_32_char_string
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://minihack-foodtech.vercel.app
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Deploy

Click "Create Web Service" and wait 3-5 minutes.

---

## Step 3: Connect Frontend to Backend (2 min)

### Update Vercel

1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add/Update:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
4. Redeploy frontend

---

## Step 4: Test

Visit: `https://minihack-foodtech.vercel.app`

Try:
- ✅ Generate vegan alternative
- ✅ Browse menus
- ✅ Store locator

---

## 🐛 Troubleshooting

**"Cannot connect to database"**
- Check MongoDB connection string
- Verify IP whitelist (0.0.0.0/0)

**"CORS error"**
- Verify FRONTEND_URL matches Vercel URL

**"Backend slow/sleeping"**
- Free tier spins down after 15min
- First request takes 30-60 seconds
- Upgrade to $7/month for always-on

---

## 💰 Cost

**Total: $0/month** (free tiers)

Optional upgrades:
- Render Starter: $7/month (always-on)

---

## ✅ Success!

Your full-stack app is now live! 🌱🚀

**Frontend:** https://minihack-foodtech.vercel.app
**Backend:** https://your-backend.onrender.com
