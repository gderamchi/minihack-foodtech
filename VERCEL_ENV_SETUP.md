# 🔧 Vercel Environment Variables Setup

## ⚠️ Important: Backend Won't Work Without These!

The backend API functions are deployed but won't work until you add the required environment variables in Vercel.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project: **minihack-foodtech**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add These 3 Variables

Click **"Add New"** for each variable:

#### 1. MONGODB_URI
```
mongodb+srv://username:password@cluster.mongodb.net/vegan-diet-app?retryWrites=true&w=majority
```

**How to get it:**
1. Go to https://mongodb.com/cloud/atlas
2. Sign up/login (free)
3. Create a free cluster (M0)
4. Create database user with password
5. Network Access → Add IP → Allow from anywhere (0.0.0.0/0)
6. Click "Connect" → "Connect your application" → Copy connection string
7. Replace `<password>` with your actual password
8. Add `/vegan-diet-app` before the `?`

**Example:**
```
mongodb+srv://veganuser:MyP@ssw0rd@cluster0.abc123.mongodb.net/vegan-diet-app?retryWrites=true&w=majority
```

#### 2. BLACKBOX_API_KEY
```
your_blackbox_api_key_here
```

**You mentioned you already have this!** ✅
- Get from: https://www.blackbox.ai/dashboard
- Copy your API key

#### 3. JWT_SECRET
```
Generate a random 32-character string
```

**Generate it now:**

**Option A - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B - Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Option C - Online:**
Visit: https://randomkeygen.com/ and copy a "CodeIgniter Encryption Key"

**Example output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Step 3: Set Environment for Each Variable

For **each** of the 3 variables above:
1. **Key**: Enter the variable name (e.g., `MONGODB_URI`)
2. **Value**: Paste the value
3. **Environment**: Select **Production** ✅
4. Click **"Save"**

### Step 4: Redeploy

After adding all 3 variables:
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

---

## ✅ Test After Redeployment

### Test 1: Health Check
```bash
curl https://minihack-foodtech.vercel.app/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Vegan Diet API is running",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### Test 2: AI Vegan Generation
```bash
curl -X POST https://minihack-foodtech.vercel.app/api/dishes/generate-vegan-alternative \
  -H "Content-Type: application/json" \
  -d '{"name": "Chicken Parmesan", "description": "Breaded chicken with marinara and cheese"}'
```

**Expected:** JSON response with vegan alternative recipe

### Test 3: Frontend
Visit: https://minihack-foodtech.vercel.app

Try:
1. Enter "Chicken Parmesan" in the dish input
2. Click "Generate Vegan Alternative"
3. Wait for AI response (10-30 seconds)
4. See vegan recipe!

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- ✅ Check MongoDB connection string is correct
- ✅ Verify password has no special characters (or URL encode them)
- ✅ Ensure IP whitelist includes 0.0.0.0/0
- ✅ Database name is included: `/vegan-diet-app?`

### "BLACKBOX_API_KEY is not defined"
- ✅ Verify you added the env var in Vercel
- ✅ Check it's set for "Production" environment
- ✅ Redeploy after adding

### "Function execution timeout"
- ⏱️ First request takes 30-60 seconds (cold start)
- ⏱️ Subsequent requests are faster
- ⏱️ This is normal for Vercel free tier

### Still not working?
1. Check Vercel deployment logs for errors
2. Verify all 3 environment variables are set
3. Make sure you redeployed after adding variables
4. Wait a few minutes for propagation

---

## 📋 Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained and tested
- [ ] Blackbox API key ready
- [ ] JWT secret generated
- [ ] All 3 environment variables added to Vercel (Production)
- [ ] Project redeployed
- [ ] Waited 2-3 minutes for deployment
- [ ] Health check tested
- [ ] AI generation tested
- [ ] Frontend tested

---

## 🎉 Once Complete

Your full-stack vegan diet application will be live with:
- ✅ Frontend React app
- ✅ Backend API serverless functions
- ✅ AI-powered vegan recipe generation
- ✅ All on one domain (no CORS issues!)

**Live URL:** https://minihack-foodtech.vercel.app

---

## 💡 Quick Reference

**Environment Variables:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vegan-diet-app?retryWrites=true&w=majority
BLACKBOX_API_KEY=your_api_key_here
JWT_SECRET=your_generated_secret_here
```

**Test Commands:**
```bash
# Health check
curl https://minihack-foodtech.vercel.app/health

# AI generation
curl -X POST https://minihack-foodtech.vercel.app/api/dishes/generate-vegan-alternative \
  -H "Content-Type: application/json" \
  -d '{"name": "Beef Burger"}'
```

---

Need help? The deployment logs in Vercel will show detailed error messages!
