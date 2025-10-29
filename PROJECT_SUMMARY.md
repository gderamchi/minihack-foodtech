# 🌱 Vegan Diet Rotation App - Project Summary

## 📋 What We Built

A full-stack web application that helps users transition to a vegan diet by:
1. **AI-Powered Recipe Generation**: Using Blackbox AI to create vegan alternatives to any dish
2. **Smart Database Matching**: Checking existing vegan recipes before generating new ones
3. **Location-Based Store Finder**: Finding nearby stores with required ingredients
4. **Community Features**: Browsing and sharing vegan menus

## 🏗️ Complete Architecture

### Backend (Node.js + Express + MongoDB)
```
backend/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User schema with location
│   │   ├── Dish.js                  # Dish schema with vegan alternatives
│   │   ├── Menu.js                  # Menu schema with dishes
│   │   ├── Ingredient.js            # Ingredient schema
│   │   └── Store.js                 # Store schema with geolocation
│   ├── routes/
│   │   ├── dishes.js                # Dish CRUD + AI generation
│   │   ├── menus.js                 # Menu CRUD
│   │   ├── stores.js                # Store location queries
│   │   └── users.js                 # Auth + user management
│   ├── services/
│   │   ├── blackboxService.js       # Blackbox AI integration
│   │   ├── matchingService.js       # Dish matching algorithm
│   │   └── locationService.js       # Geospatial queries
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── errorHandler.js          # Error handling
│   ├── server.js                    # Express server setup
│   └── seed.js                      # Database seeding
├── package.json
└── .env                             # Environment variables
```

### Frontend (React + Vite + Tailwind)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── DishInput.jsx            # AI generation interface
│   │   ├── MenuBrowser.jsx          # Browse menus
│   │   ├── MenuDetail.jsx           # Menu details
│   │   ├── DishDetail.jsx           # Dish details
│   │   └── StoreLocator.jsx         # Map + store finder
│   ├── services/
│   │   └── api.js                   # API client
│   ├── App.jsx                      # Main app with routing
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Tailwind styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Key Features Implemented

### 1. AI-Powered Vegan Recipe Generation
- **Endpoint**: `POST /api/dishes/generate-vegan-alternative`
- **Process**:
  1. User enters non-vegan dish name
  2. System checks database for existing matches
  3. If no match, calls Blackbox AI API
  4. AI generates complete vegan recipe with:
     - Ingredients with quantities
     - Step-by-step instructions
     - Nutritional information
     - Cooking times
  5. Recipe saved to database for future use

### 2. Smart Dish Matching
- **Service**: `matchingService.js`
- **Algorithm**:
  - Text search on dish names
  - Ingredient overlap analysis
  - Cuisine type matching
  - Similarity scoring (0-1)
- **Benefit**: Reduces AI API calls and provides instant results

### 3. Location-Based Store Recommendations
- **Endpoint**: `POST /api/stores/recommendations-for-dish`
- **Features**:
  - MongoDB geospatial queries (2dsphere index)
  - Ingredient coverage calculation
  - Distance-based sorting
  - Interactive Leaflet map
  - Store details with contact info

### 4. Menu Management
- **Types**: Base (curated), Community (user-submitted), Referenced (external)
- **Features**:
  - Multi-dish menus with categories
  - Filtering by cuisine, occasion, type
  - Rating system
  - Full CRUD operations

### 5. User Authentication
- **JWT-based** authentication
- **Features**:
  - User registration/login
  - Profile management
  - Location tracking
  - Saved dishes/menus

## 🔧 Technical Highlights

### Blackbox AI Integration
```javascript
// backend/src/services/blackboxService.js
- Model: blackboxai/openai/gpt-4
- Structured JSON responses
- Prompt engineering for vegan recipes
- Error handling and fallbacks
```

### Geospatial Queries
```javascript
// MongoDB 2dsphere index for location-based searches
location: {
  type: 'Point',
  coordinates: [longitude, latitude]
}
```

### React + Vite Setup
- Fast HMR (Hot Module Replacement)
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Leaflet for maps

## 📊 Database Schema

### Collections
1. **users** - User accounts with location
2. **dishes** - Vegan and non-vegan dishes
3. **menus** - Curated meal plans
4. **ingredients** - Ingredient database
5. **stores** - Store locations with inventory

### Key Relationships
- Dishes ↔ Ingredients (many-to-many)
- Menus ↔ Dishes (many-to-many)
- Stores ↔ Ingredients (many-to-many)
- Dishes ↔ Vegan Alternatives (one-to-one)

## 🚀 Getting Started

### Quick Start (3 Steps)
```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Add Blackbox API key to backend/.env
BLACKBOX_API_KEY=your_key_here

# 3. Start both servers
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

### With Database Seeding
```bash
# After step 2, before step 3:
cd backend && npm run seed
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on mobile, tablet, desktop
- **Modern UI**: Tailwind CSS with custom green theme
- **Interactive Maps**: Leaflet integration
- **Real-time Feedback**: Toast notifications
- **Loading States**: Spinners and skeletons
- **Error Handling**: User-friendly error messages

## 📈 Scalability Considerations

### Current Setup
- Single server architecture
- MongoDB for data persistence
- JWT for stateless auth
- RESTful API design

### Future Enhancements
- Redis caching for frequent queries
- CDN for static assets
- Load balancing for multiple instances
- Database replication
- Rate limiting for API
- Image upload for dishes/menus
- Social features (following, sharing)
- Meal planning calendar
- Shopping list generation
- Nutrition tracking

## 🔐 Security Features

- Password hashing (bcryptjs)
- JWT token authentication
- CORS configuration
- Input validation
- MongoDB injection prevention
- Environment variable protection

## 📝 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: Configure in deployment

### Authentication
```
Authorization: Bearer <jwt_token>
```

### Key Endpoints
- `POST /api/dishes/generate-vegan-alternative` - AI generation
- `GET /api/menus` - Browse menus
- `POST /api/stores/recommendations-for-dish` - Find stores
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

## 🧪 Testing the App

### Test Scenarios
1. **Generate Vegan Alternative**
   - Input: "Beef Burger"
   - Expected: Vegan burger recipe with plant-based patty

2. **Browse Menus**
   - Filter by "dinner"
   - Expected: Evening meal menus

3. **Find Stores**
   - Allow location access
   - Expected: Map with nearby vegan stores

## 📦 Dependencies

### Backend (12 packages)
- express, mongoose, dotenv, cors
- axios, bcryptjs, jsonwebtoken
- express-validator, nodemon

### Frontend (10 packages)
- react, react-dom, react-router-dom
- axios, leaflet, react-leaflet
- react-icons, react-toastify
- vite, tailwindcss

## 🎯 Project Goals Achieved

✅ AI-powered vegan recipe generation (Blackbox AI)
✅ Database matching before AI generation
✅ Location-based store recommendations
✅ Menu browsing and management
✅ User authentication
✅ Responsive modern UI
✅ Complete documentation
✅ Seed data for testing

## 🚀 Next Steps

To continue development:
1. Add your Blackbox API key
2. Test all features
3. Customize seed data
4. Add more features (see Future Enhancements)
5. Deploy to production

## 📞 Support

- Check `README.md` for detailed documentation
- See `SETUP.md` for installation guide
- Review code comments for implementation details

---

**Built with 💚 for a healthier, plant-based future!**
