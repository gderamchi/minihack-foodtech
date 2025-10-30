# 🔧 Vercel Environment Variables Setup

## 📋 Firebase Admin Credentials

Add these **3 environment variables** to your Vercel project:

---

### 1. FIREBASE_PROJECT_ID
```
vegan-diet-18831
```

---

### 2. FIREBASE_CLIENT_EMAIL
```
firebase-adminsdk-fbsvc@vegan-diet-18831.iam.gserviceaccount.com
```

---

### 3. FIREBASE_PRIVATE_KEY

**IMPORTANT:** Copy this EXACTLY as shown, including the quotes and all `\n` characters:

```
"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDXoxyRXsVoiAto\nutDQO8QnQPWLhtnmb2i9ACGIc/D5mAeREfw1kuIQYzq3JCQtCqly93mSQkG9VbCW\noIYNa77rEBfpIinxDU+q/ruKM4vVKlqqMjHU0EVz4m3ZqVYQqiuuGFeojlW7mx2/\nyrnJcKvQqyV0WIJLMNt47PoPyQpbMUK+FKTIei6Y3NRPrvXPbWdsIaEjgIP4jgoT\npQGMqvPS0M4961B/bnVEFakL6fgsueptYdzHzqbuRV5kztBEQIvPlsyAqXs18n3h\nLhXhiTy2iboIvVmNChhSbbSrQOHjvh0QflDWp9lOVxLo0tQRCvVZfgiVNBnzmK0x\n+X/x0jNXAgMBAAECggEAQpMTy1fYl7zE1Pk0Zc3F8h6OkJy6InhL/GoRcEjnYY/L\n6kCEvt+R1uBj7M4GMzfC+AEqsfqtxDAz/FUj/fnBcF5AG5SWIVtsOM07hmACsHXK\nlxg3JU6F2tDR/GzY6v02ziGq0pnbIzgxN5j1whj8msh0IFcBJwi3Ab8cNwppHZzn\nNdiF8lVkOrsn/86CO4VpODMPE10rEvoAPiD3vaOGQqKKUdX816j+bTLoMj7AQkO1\nOJ2XQBe/YH8VeJ/RNcIzKv5qYzoxPoE/7wbIMRz1aJ4SpMMc0jGxxuq19sqlF03w\neRTOCklBhNronnlsRErsqYs0fDt64wKl10k3pYin4QKBgQDvJRwLknTUj8LVWYsV\n0RktwKdsEBGXCx/LEDgPssQB1q4dU+1yFX+nd8Rb0qbvT1jla9qVjvPm9qhaenWe\nJVE8Lj2AFLfq2+B7FaxBLJyBqMUhMBOQsH4iRDNHWUu128QmfwctV+fsCbZEPeDb\nx4CtzkmLkvImmM2OVS9ON/WH4QKBgQDm1dnWSq8jY4dkGRXs4sIDLm5rEg0WDua8\nxoPKQsYIF77NRpPDtZOa6h2maF+Qw0Pcz9hkycR4Noo7v1B5YKbj6z5Rq6jVI8rJ\nIPBgoTKqeNTyY35V6v7U5H0OM0MKvl8SBGBRl7I+7+prKlPu91RbIuA/wOpTYRmk\ne+xWWEpCNwKBgHjiYVLYLYZlRS9jnBLjJ78g64CMftfDH8cd47jLvJjRVCIvEo/g\nni6hM/jWetvtWBpgcpW3NUNC28cgr+PJKU8qcJwV3QIzMz4ErpYjXtmL3lnwW3OA\nQ8I+h01Briu3c2eiPpaFIQ8HucK1JLz0E+/HnxWWqiEojH+uP8NiNhMBAoGAMZCJ\njbHLmVWtpJieVJb8AaLeoq7lkG7yrGYTtkJQMzymA328DLHYV9MdOrX+jx7eW3Nl\ni36naQiM9fdGWEmgjB/e6bpqLhnZWQZxls4GCwSW9NTYM6qZvSyyjXIEWzI1R7EY\n3WwtIcZyF0CndRA2VLtQW2AY8H5Q+ziArqmWiFECgYBftgqBwlQFLWbgn2jxMpHr\nNTzPIM1uKBoElKzsD6WPGqiAwVVry+zOPtOw/M4rAoP6nC2RcCYCf0G8agtSFkJv\nkGewJ4YFOZuvx2VEwsNF5z+w2eK4M3qqduuYIEM2g/2sfx0Ck0K+TJRjgDAhW4tn\nqkGezc71YjERtBsdJyd9NQ==\n-----END PRIVATE KEY-----\n"
```

**Note:** Include the quotes at the beginning and end!

---

## 🚀 How to Add to Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project: **minihack-foodtech**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Each Variable

For each of the 3 variables above:

1. Click **"Add New"** button
2. **Key:** Enter the variable name (e.g., `FIREBASE_PROJECT_ID`)
3. **Value:** Copy and paste the value from above
4. **Environment:** Select **Production**, **Preview**, and **Development** (all 3)
5. Click **Save**

### Step 3: Redeploy

After adding all 3 variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for deployment to complete

---

## ✅ Verification

After redeployment, test:

1. Go to https://minihack-foodtech.vercel.app/register
2. Try registering with email/password or Google
3. **Expected:** No more "Missing Firebase Admin credentials" error!

---

## 🔒 Security Note

**IMPORTANT:** Never commit these credentials to Git! They are sensitive and should only be in:
- Vercel environment variables (for production)
- Local `.env` file (for development, already in `.gitignore`)

---

## 📝 Summary

**Variables to Add:**
1. ✅ FIREBASE_PROJECT_ID
2. ✅ FIREBASE_CLIENT_EMAIL  
3. ✅ FIREBASE_PRIVATE_KEY (with quotes!)

**Where:** Vercel Dashboard → Settings → Environment Variables

**Then:** Redeploy the project

**Test:** Registration should work without 500 errors!
