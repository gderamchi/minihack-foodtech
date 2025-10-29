# 🚀 Quick Setup Guide

Follow these steps to get your Vegan Diet Rotation App up and running!

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Blackbox API Key

1. Go to [Blackbox AI Dashboard](https://www.blackbox.ai/dashboard)
2. Get your API key
3. Open `backend/.env`
4. Replace `your_blackbox_api_key_here` with your actual API key:

```env
BLACKBOX_API_KEY=your_actual_api_key_here
```

## Step 3: Start MongoDB

### Option A: Local MongoDB

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vegan-diet-app
```

## Step 4: Seed the Database (Optional but Recommended)

This will populate your database with sample data:

```bash
cd backend
npm run seed
```

You should see:
```
✅ Database seeded successfully!
   - 20 ingredients
   - 4 dishes
   - 2 menus
   - 3 stores
```

## Step 5: Start the Application

Open **two terminal windows**:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🌱 Vegan Diet Rotation API Server                  ║
║                                                       ║
║   Server running on port 5000                        ║
║   Environment: development                           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 6: Access the Application

Open your browser and go to: **http://localhost:3000**

## 🎉 You're Ready!

Try these features:

1. **Generate Vegan Alternative**
   - Click "Find Vegan Alternative"
   - Enter "Chicken Parmesan"
   - Click "Get Vegan Alternative"
   - See the AI-generated vegan recipe!

2. **Browse Menus**
   - Click "Menus" in the navigation
   - Explore curated vegan menus

3. **Find Stores**
   - Click "Stores"
   - Allow location access (or use default Paris location)
   - See nearby vegan-friendly stores on the map

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For Atlas, ensure your IP is whitelisted

### Blackbox API Error
- Verify your API key is correct
- Check you have API credits available
- Ensure no extra spaces in the `.env` file

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Restart the backend server after changing `.env`

## 📝 Next Steps

- Add your Blackbox API key to start generating vegan alternatives
- Customize the seed data in `backend/src/seed.js`
- Explore the API at http://localhost:5000
- Check the full documentation in `README.md`

## 💡 Tips

- Use `npm run dev` for development (auto-restart on changes)
- Use `npm start` for production
- Keep both terminals open while developing
- Check browser console for any frontend errors
- Check terminal for backend errors

---

Need help? Check the main README.md or open an issue!
