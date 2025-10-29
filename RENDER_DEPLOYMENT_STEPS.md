# 🚀 Deploy Backend to Render - Step by Step

## Prerequisites Checklist
- ✅ GitHub repository pushed (commit: 8b00f8e)
- ✅ render.yaml configuration file created
- ⏳ Render account (free) - https://render.com
- ⏳ MongoDB Atlas account (free) - https://mongodb.com/cloud/atlas
- ⏳ Blackbox API key - https://www.blackbox.ai/dashboard

---

## Step 1: Set Up MongoDB Atlas (5 minutes)

### 1.1 Create MongoDB Cluster
1. Go to https://mongodb.com/cloud/atlas
2. Sign up or log in
3. Click **"Build a Database"**
4. Select **FREE** tier (M0)
5. Choose **AWS** provider
6. Select region closest to you (e.g., Oregon for US West)
7. Name your cluster: `vegan-diet-cluster`
8. Click **"Create"**

### 1.2 Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `veganapp`
5. Click **"Autogenerate Secure Password"** - **SAVE THIS PASSWORD!**
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 1.3 Allow Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://veganapp:<password>@vegan-diet-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>` with your actual password from step 1.2**
6. **Add database name before the `?`**:
   ```
   mongodb+srv://veganapp:YOUR_PASSWORD@vegan-diet-cluster.xxxxx.mongodb.net/vegan-diet-app?retryWrites=true&w=majority
   ```

**SAVE THIS CONNECTION STRING!** You'll need it in Step 2.

---

## Step 2: Deploy to Render (10 minutes)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository: `gderamchi/minihack-foodtech`
4. Click **"Connect"**

### 2.3 Configure Service
Render will auto-detect the `render.yaml` file. Verify these settings:

```
Name: vegan-diet-backend
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node src/server.js
Plan: Free
```

### 2.4 Add Environment Variables
Click **"Advanced"** and add these environment variables:

**Required Variables:**

1. **MONGODB_URI**
   - Value: Your connection string from Step 1.4
   - Example: `mongodb+srv://veganapp:YOUR_PASSWORD@vegan-diet-cluster.xxxxx.mongodb.net/vegan-diet-app?retryWrites=true&w=majority`

2. **BLACKBOX_API_KEY**
   - Get from: https://www.blackbox.ai/dashboard
   - Value: `your_blackbox_api_key_here`

3. **JWT_SECRET**
   - Generate a random 32-character string
   - Run this command to generate:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Or use: https://randomkeygen.com/
   - Value: `your_generated_secret_here`

**Auto-configured Variables (already set in render.yaml):**
- NODE_ENV: `production`
- PORT: `10000`
- FRONTEND_URL: `https://minihack-foodtech.vercel.app`

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Watch the logs for any errors

### 2.6 Get Your Backend URL
Once deployed, your backend URL will be:
```
https://vegan-diet-backend.onrender.com
```

**SAVE THIS URL!** You'll need it in Step 3.

---

## Step 3: Connect Frontend to Backend (2 minutes)

### 3.1 Update Vercel Environment Variable
1. Go to https://vercel.com/dashboard
2. Select your project: `minihack-foodtech`
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` or add it:
   - Key: `VITE_API_URL`
   - Value: `https://vegan-diet-backend.onrender.com/api`
   - Environment: **Production**
5. Click **"Save"**

### 3.2 Redeploy Frontend
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## Step 4: Test Your Application! 🎉

### 4.1 Test Backend
Visit: `https://vegan-diet-backend.onrender.com/health`

Expected response:
```json
{
  "status": "ok",
  "message": "Vegan Diet API is running",
  "timestamp": "2024-..."
}
```

### 4.2 Test Frontend
Visit: `https://minihack-foodtech.vercel.app`

Try these features:
1. ✅ Enter a non-vegan dish (e.g., "Chicken Parmesan")
2. ✅ Click "Generate Vegan Alternative"
3. ✅ Wait for AI to generate recipe
4. ✅ Browse menus
5. ✅ Use store locator

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to database"**
- Check MongoDB connection string
- Verify password is correct (no < > brackets)
- Ensure IP whitelist includes 0.0.0.0/0

**"BLACKBOX_API_KEY is not defined"**
- Verify you added the environment variable in Render
- Check the API key is valid at https://www.blackbox.ai/dashboard

**"Service Unavailable" (first request)**
- Free tier spins down after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- This is normal for free tier

### Frontend Issues

**"Network Error" or "Cannot connect"**
- Verify VITE_API_URL is set correctly in Vercel
- Make sure it ends with `/api`
- Redeploy frontend after changing env vars

**CORS Errors**
- Check FRONTEND_URL in Render matches your Vercel URL
- Redeploy backend if you changed it

---

## 💰 Cost Summary

**Total: $0/month** (free tiers)

- ✅ Vercel: Free (hobby plan)
- ✅ Render: Free (with cold starts)
- ✅ MongoDB Atlas: Free (512MB storage)
- ✅ Blackbox API: Pay per use (very cheap)

**Optional Upgrades:**
- Render Starter: $7/month (no cold starts, always-on)
- MongoDB M10: $9/month (more storage, better performance)

---

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained and tested
- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] All environment variables added
- [ ] Backend health check passes
- [ ] Frontend environment variable updated
- [ ] Frontend redeployed
- [ ] Full application tested and working

---

## 🎊 You're Done!

Your full-stack vegan diet application is now live! 🌱🚀

**Frontend:** https://minihack-foodtech.vercel.app
**Backend:** https://vegan-diet-backend.onrender.com

Share it with the world! 🌍
