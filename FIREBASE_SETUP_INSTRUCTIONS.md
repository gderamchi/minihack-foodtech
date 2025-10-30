# 🔥 Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it: "vegan-diet-app" (or your preferred name)
4. Disable Google Analytics (optional for now)
5. Click "Create project"

## Step 2: Add Web App

1. In your Firebase project, click the **Web icon** (</>)
2. Register app name: "Vegan Diet Web App"
3. **Don't** check "Firebase Hosting" (we use Vercel)
4. Click "Register app"

## Step 3: Copy Configuration

You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable these providers:
   - ✅ **Email/Password** (click, toggle on, save)
   - ✅ **Google** (click, toggle on, add support email, save)
   - ✅ **Facebook** (optional - requires Facebook App ID)

## Step 5: Add to Vercel Environment Variables

Go to your Vercel project settings and add these environment variables:

```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important:** All variables must start with `VITE_` to be accessible in the frontend!

## Step 6: Configure Authorized Domains

1. In Firebase Console → Authentication → Settings
2. Under "Authorized domains", add:
   - `localhost` (for development)
   - `minihack-foodtech.vercel.app` (your production domain)
   - Any other domains you use

## Step 7: Firestore Database (for user data)

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll set rules later)
4. Select location closest to your users
5. Click "Enable"

## Step 8: Set Firestore Security Rules

Go to **Firestore Database → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read public recipes
    match /recipes/{recipeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users can read/write their own menus
    match /weeklyMenus/{menuId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

Click "Publish"

## Step 9: Test Configuration

Once you add the environment variables to Vercel and redeploy, the app will:
1. Show Google Sign-in button
2. Allow users to create accounts
3. Store user data in Firestore
4. Sync with MongoDB for backend operations

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Authorized domains in Firebase Console

### "Firebase: Error (auth/api-key-not-valid)"
- Check that API key is correct in Vercel environment variables
- Make sure it starts with `VITE_`

### "Cannot read properties of undefined"
- Verify all 6 environment variables are set in Vercel
- Redeploy after adding variables

## Ready to Proceed?

Once you've completed these steps, let me know and I'll continue with the implementation!

**What I need from you:**
Just confirm you've added the Firebase environment variables to Vercel, and I'll build the rest! 🚀
