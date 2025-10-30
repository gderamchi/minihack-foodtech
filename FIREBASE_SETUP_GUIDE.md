# 🔥 Firebase Setup Guide - Fix Login Issues

## ⚠️ Current Issue

**Error:** "Firebase UID and email are required" (400 Bad Request)

**Cause:** Firebase environment variables are not configured in Vercel, so Firebase authentication cannot initialize properly.

---

## 🛠️ Solution: Add Firebase Environment Variables

### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name (e.g., "vegan-diet-app")
4. Disable Google Analytics (optional)
5. Click "Create project"

### **Step 2: Enable Authentication**

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"
4. Enable **Google Sign-in**:
   - Click "Google"
   - Toggle "Enable"
   - Select support email
   - Click "Save"

### **Step 3: Register Web App**

1. In Firebase Console, click the gear icon (⚙️) → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon (</>) to add a web app
4. Enter app nickname: "Vegan Diet Web App"
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"

### **Step 4: Copy Firebase Configuration**

You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Copy these 6 values!**

### **Step 5: Add Environment Variables to Vercel**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: "minihack-foodtech"
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar
5. Add these 6 variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_FIREBASE_API_KEY` | Your apiKey | Production, Preview, Development |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your authDomain | Production, Preview, Development |
| `VITE_FIREBASE_PROJECT_ID` | Your projectId | Production, Preview, Development |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your storageBucket | Production, Preview, Development |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your messagingSenderId | Production, Preview, Development |
| `VITE_FIREBASE_APP_ID` | Your appId | Production, Preview, Development |

**Important:** 
- Click "Add" after each variable
- Select all 3 environments (Production, Preview, Development)
- Variable names must start with `VITE_` for Vite to expose them

### **Step 6: Configure Authorized Domains**

1. In Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Add these domains:
   - `minihack-foodtech.vercel.app`
   - `localhost` (already there)
4. Click "Add domain" for each

### **Step 7: Redeploy**

1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Click "..." menu on latest deployment
4. Click "Redeploy"
5. Wait 2-3 minutes for deployment

---

## ✅ Verification

After redeployment, test the following:

### **Test 1: Check Environment Variables**

Visit: https://minihack-foodtech.vercel.app/api/health

Should show:
```json
{
  "hasBlackboxKey": true,
  "hasMongoUri": true,
  "hasJwtSecret": true
}
```

### **Test 2: Try Registration**

1. Go to https://minihack-foodtech.vercel.app
2. Click "Get Started" or "Register"
3. Try Email/Password registration:
   - Enter email: test@example.com
   - Enter password: Test123456
   - Enter name: Test User
   - Click "Sign Up"
4. Should redirect to onboarding (no errors!)

### **Test 3: Try Google Sign-in**

1. Go to https://minihack-foodtech.vercel.app/login
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to onboarding (no errors!)

### **Test 4: Check Console**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Should see NO errors about Firebase
4. Should see successful authentication

---

## 🐛 Troubleshooting

### **Issue: "Firebase: Error (auth/invalid-api-key)"**

**Solution:** 
- Double-check API key is correct
- Make sure variable name is `VITE_FIREBASE_API_KEY` (with VITE_ prefix)
- Redeploy after adding variables

### **Issue: "Firebase: Error (auth/unauthorized-domain)"**

**Solution:**
- Add `minihack-foodtech.vercel.app` to Authorized domains in Firebase Console
- Wait 5 minutes for changes to propagate

### **Issue: Still getting 400 error**

**Solution:**
1. Check all 6 environment variables are added
2. Check variable names have `VITE_` prefix
3. Check all environments are selected (Production, Preview, Development)
4. Redeploy the application
5. Clear browser cache (Ctrl+Shift+Delete)
6. Try in incognito/private window

### **Issue: "Cannot read properties of undefined"**

**Solution:**
- Firebase config is undefined
- Environment variables not loaded
- Redeploy and wait 3-5 minutes

---

## 📋 Quick Checklist

Before testing, verify:

- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Google Sign-in enabled
- [ ] Web app registered in Firebase
- [ ] All 6 environment variables added to Vercel
- [ ] Variable names start with `VITE_`
- [ ] All 3 environments selected for each variable
- [ ] Authorized domains configured
- [ ] Application redeployed
- [ ] Waited 3-5 minutes after deployment

---

## 🎯 Expected Result

After completing these steps:

✅ **Registration works** - Users can sign up with email/password  
✅ **Google Sign-in works** - Users can sign in with Google  
✅ **No console errors** - Clean console, no Firebase errors  
✅ **Onboarding loads** - Users redirected to onboarding after signup  
✅ **Dashboard accessible** - Users can access dashboard after onboarding  

---

## 📞 Need Help?

If you're still having issues after following this guide:

1. Check browser console for specific error messages
2. Verify all environment variables in Vercel Settings
3. Try in incognito/private window
4. Clear browser cache completely
5. Wait 5-10 minutes after redeployment

---

## 🔐 Security Notes

- ✅ API keys are safe to expose in frontend (Firebase designed this way)
- ✅ Firebase security rules protect your data
- ✅ Never commit `.env` files to Git
- ✅ Use Vercel environment variables for production

---

**Time to complete:** 10-15 minutes  
**Difficulty:** Easy  
**Required:** Firebase account (free)
