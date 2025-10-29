# 🌱 Vegan Diet Rotation App

A comprehensive web application to help users transition to a vegan diet by providing AI-powered vegan alternatives to their favorite dishes, complete with recipes and nearby store recommendations.

## ✨ Features

- **🤖 AI-Powered Vegan Alternatives**: Enter any non-vegan dish and get a complete vegan recipe generated using Blackbox AI
- **📚 Menu Browser**: Browse curated vegan menus from the community and experts
- **🗺️ Store Locator**: Find nearby stores that carry the ingredients you need
- **🔍 Smart Matching**: Automatically matches dishes with existing vegan alternatives in the database
- **📍 Location-Based Recommendations**: Get store suggestions based on your location
- **⭐ Community Features**: Rate and review dishes and menus

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API with MongoDB database
- Blackbox AI integration for vegan recipe generation
- Geospatial queries for store location
- JWT authentication

### Frontend (React + Vite)
- Modern React with hooks
- Tailwind CSS for styling
- React Router for navigation
- Leaflet for interactive maps
- React Toastify for notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Blackbox API Key ([Get it here](https://www.blackbox.ai/dashboard))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd minihack-foodtech
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

3. **Configure Backend Environment Variables**

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vegan-diet-app
BLACKBOX_API_KEY=your_blackbox_api_key_here
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

5. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
```

6. **Seed the Database** (Optional but recommended)
```bash
cd backend
npm run seed
```

7. **Start the Application**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

8. **Access the Application**

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 API Documentation

### Dishes Endpoints

- `GET /api/dishes` - Get all dishes
- `GET /api/dishes/:id` - Get single dish
- `POST /api/dishes` - Create new dish (auth required)
- `POST /api/dishes/generate-vegan-alternative` - Generate vegan alternative using AI
- `POST /api/dishes/analyze-vegan` - Analyze if ingredients are vegan
- `PUT /api/dishes/:id` - Update dish (auth required)
- `DELETE /api/dishes/:id` - Delete dish (auth required)

### Menus Endpoints

- `GET /api/menus` - Get all menus
- `GET /api/menus/:id` - Get single menu
- `GET /api/menus/featured/base` - Get featured base menus
- `POST /api/menus` - Create new menu (auth required)
- `PUT /api/menus/:id` - Update menu (auth required)
- `DELETE /api/menus/:id` - Delete menu (auth required)

### Stores Endpoints

- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get single store
- `GET /api/stores/nearby/search` - Find nearby stores
- `POST /api/stores/find-with-ingredients` - Find stores with specific ingredients
- `POST /api/stores/recommendations-for-dish` - Get store recommendations for a dish

### Users Endpoints

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile (auth required)
- `PUT /api/users/me` - Update user profile (auth required)
- `PUT /api/users/me/location` - Update user location (auth required)

## 🔑 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| BLACKBOX_API_KEY | Blackbox AI API key | Yes |
| JWT_SECRET | Secret for JWT tokens | Yes |
| FRONTEND_URL | Frontend URL for CORS | Yes |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | No (defaults to http://localhost:5000/api) |

## 🧪 Testing the Application

1. **Generate a Vegan Alternative**
   - Go to "Find Vegan Alternative"
   - Enter a non-vegan dish (e.g., "Chicken Parmesan")
   - Click "Get Vegan Alternative"
   - View the AI-generated vegan recipe

2. **Browse Menus**
   - Navigate to "Menus"
   - Filter by type, cuisine, or occasion
   - Click on a menu to view details

3. **Find Stores**
   - Go to "Stores"
   - Allow location access or use default location
   - View nearby vegan-friendly stores on the map
   - Click on stores to see details

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Blackbox AI** - LLM for recipe generation
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Leaflet** - Maps
- **React Icons** - Icons
- **React Toastify** - Notifications

## 📁 Project Structure

```
minihack-foodtech/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── server.js        # Express server
│   │   └── seed.js          # Database seeding
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Blackbox AI** for providing the LLM API
- **OpenStreetMap** for map tiles
- **Leaflet** for the mapping library

## 📧 Support

For support, please open an issue in the repository or contact the development team.

---

Made with 💚 for a healthier, more sustainable world
