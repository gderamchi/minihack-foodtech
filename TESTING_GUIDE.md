# Testing Guide - Vegan Diet Rotation App

## 🎯 Application Overview

A full-stack MERN application that helps users transition to a vegan diet by:
- Finding vegan alternatives to non-vegan dishes using AI
- Browsing community and curated vegan menus
- Locating nearby stores with vegan ingredients

## 🚀 Quick Start

### Start Both Servers
```bash
# Terminal 1 - Backend (Port 5001)
cd backend && npm run dev

# Terminal 2 - Frontend (Port 3000)
cd frontend && npm run dev
```

Or use the quick start script:
```bash
./start.sh
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/health

## 🧪 Testing Checklist

### ✅ Backend API Tests

#### 1. Health Check
```bash
curl http://localhost:5001/health
```
Expected: `{"status":"ok","message":"Vegan Diet API is running",...}`

#### 2. Get All Dishes
```bash
curl http://localhost:5001/api/dishes | python3 -m json.tool
```
Expected: List of dishes including "Tofu Scramble", "Vegan Buddha Bowl", etc.

#### 3. Get All Menus
```bash
curl http://localhost:5001/api/menus | python3 -m json.tool
```
Expected: List of menus including "Healthy Vegan Week", "Quick Vegan Meals"

#### 4. Find Nearby Stores (Paris coordinates)
```bash
curl "http://localhost:5001/api/stores/nearby?latitude=48.8566&longitude=2.3522&maxDistance=5000" | python3 -m json.tool
```
Expected: List of stores near Paris including "Whole Foods Market", "Bio c' Bon"

#### 5. **Generate Vegan Alternative (Blackbox AI)**
```bash
curl -X POST http://localhost:5001/api/dishes/generate-vegan-alternative \
  -H "Content-Type: application/json" \
  -d '{
    "dishName": "Beef Burger",
    "description": "Classic beef burger with cheese",
    "cuisine": "American"
  }' | python3 -m json.tool
```
Expected: AI-generated vegan burger recipe with ingredients and instructions

#### 6. Search Dishes
```bash
curl "http://localhost:5001/api/dishes/search?q=tofu" | python3 -m json.tool
```
Expected: Dishes containing "tofu"

#### 7. Get Single Dish
```bash
# First get a dish ID from the dishes list, then:
curl http://localhost:5001/api/dishes/{DISH_ID} | python3 -m json.tool
```

### ✅ Frontend Tests

#### 1. Home Page
- Navigate to http://localhost:3000
- Should see hero section with "Transform Your Diet to Vegan"
- Should see feature cards (AI-Powered, Community Driven, Store Locator)
- Should see statistics section

#### 2. Dish Input Page
- Click "Get Started" or navigate to http://localhost:3000/dish-input
- Enter a non-vegan dish (e.g., "Chicken Parmesan")
- Add description and select cuisine
- Click "Generate Vegan Alternative"
- Should see AI-generated vegan recipe with:
  - Dish name
  - Description
  - Ingredients list
  - Cooking instructions
  - Prep/cook time
  - Nutritional info

#### 3. Menu Browser
- Navigate to http://localhost:3000/menus
- Should see list of vegan menus
- Filter by type (base/community/referenced)
- Search for specific menus
- Click on a menu to view details

#### 4. Store Locator
- Navigate to http://localhost:3000/stores
- Should see map with store markers
- Enter your location or use current location
- Adjust search radius
- Filter by store type
- Click on store markers for details

#### 5. Navigation
- Test all navigation links in header
- Verify responsive design on mobile/tablet
- Check that logo links back to home

### ✅ Integration Tests

#### 1. End-to-End Dish Replacement Flow
1. Go to Dish Input page
2. Enter "Spaghetti Carbonara"
3. Generate vegan alternative
4. Verify AI response is saved to database
5. Check that dish appears in dishes list
6. View dish details page

#### 2. Store Recommendations for Dish
```bash
# Get a dish ID first, then:
curl -X POST http://localhost:5001/api/stores/recommendations-for-dish \
  -H "Content-Type: application/json" \
  -d '{
    "dishId": "YOUR_DISH_ID",
    "latitude": 48.8566,
    "longitude": 2.3522
  }' | python3 -m json.tool
```

#### 3. Find Stores with Specific Ingredients
```bash
# Get ingredient IDs first, then:
curl -X POST http://localhost:5001/api/stores/find-with-ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "ingredientIds": ["INGREDIENT_ID_1", "INGREDIENT_ID_2"],
    "latitude": 48.8566,
    "longitude": 2.3522,
    "maxDistance": 5000
  }' | python3 -m json.tool
```

## 🔍 What to Look For

### Backend
- ✅ MongoDB connection successful
- ✅ All routes responding correctly
- ✅ Blackbox API integration working
- ✅ Geospatial queries returning results
- ✅ Error handling working properly

### Frontend
- ✅ Pages load without errors
- ✅ API calls successful (check Network tab)
- ✅ UI responsive and styled correctly
- ✅ Forms validate input
- ✅ Loading states display
- ✅ Error messages show when needed
- ✅ Map displays correctly with markers

### AI Integration
- ✅ Blackbox API responds with valid JSON
- ✅ Generated recipes are complete and sensible
- ✅ Ingredients are vegan-appropriate
- ✅ Instructions are clear and detailed
- ✅ Nutritional info is included

## 🐛 Common Issues & Solutions

### Issue: Port 5000 already in use
**Solution**: Changed to port 5001 in `.env` and `vite.config.js`

### Issue: MongoDB connection fails
**Solution**: Check `MONGODB_URI` in `.env` file

### Issue: Blackbox API errors
**Solution**: Verify `BLACKBOX_API_KEY` in `.env` file

### Issue: Frontend can't connect to backend
**Solution**: Check CORS settings and proxy configuration in `vite.config.js`

### Issue: Map not displaying
**Solution**: Check Leaflet CSS is imported in `index.css`

### Issue: PostCSS errors
**Solution**: Use `postcss.config.cjs` instead of `.js`

## 📊 Test Data

The database is seeded with:
- **20 ingredients** (tofu, quinoa, chickpeas, etc.)
- **4 dishes** (Tofu Scramble, Buddha Bowl, Lentil Curry, Chickpea Salad)
- **2 menus** (Healthy Vegan Week, Quick Vegan Meals)
- **3 stores** (Whole Foods Market, Bio c' Bon, Naturalia)

## 🎨 UI/UX Testing

### Visual Tests
- [ ] Colors match design (green theme)
- [ ] Typography is readable
- [ ] Spacing is consistent
- [ ] Buttons have hover states
- [ ] Cards have proper shadows
- [ ] Images load correctly

### Interaction Tests
- [ ] Forms submit correctly
- [ ] Buttons respond to clicks
- [ ] Links navigate properly
- [ ] Modals open/close
- [ ] Dropdowns work
- [ ] Search filters results

### Responsive Tests
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Navigation menu collapses on mobile

## 🔐 Security Tests

- [ ] API endpoints validate input
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS prevention (React escapes by default)
- [ ] CORS configured correctly
- [ ] Environment variables not exposed

## 📈 Performance Tests

- [ ] API responses < 500ms
- [ ] Page load time < 3s
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Database queries optimized with indexes

## 🎯 Success Criteria

The application is working correctly if:
1. ✅ Backend server runs on port 5001
2. ✅ Frontend server runs on port 3000
3. ✅ MongoDB connection established
4. ✅ All API endpoints return valid responses
5. ✅ Blackbox AI generates vegan alternatives
6. ✅ Frontend pages load without errors
7. ✅ User can input dish and get vegan alternative
8. ✅ Store locator shows nearby stores on map
9. ✅ Menu browser displays all menus
10. ✅ Navigation works across all pages

## 📝 Next Steps

After testing, consider:
1. Add user authentication
2. Implement favorites/bookmarks
3. Add recipe ratings and reviews
4. Integrate with Marmiton API
5. Add meal planning calendar
6. Implement shopping list feature
7. Add nutritional tracking
8. Create mobile app version

## 🆘 Support

If you encounter issues:
1. Check terminal logs for errors
2. Verify environment variables
3. Ensure MongoDB is running
4. Check API key is valid
5. Clear browser cache
6. Restart both servers

---

**Happy Testing! 🌱**
