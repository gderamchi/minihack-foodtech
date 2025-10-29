sk-daEnTPqCdIvh5yqR4u0wDg#!/bin/bash

# Vegan Diet App - Quick Start Script
# This script helps you start both backend and frontend servers

echo "🌱 Vegan Diet Rotation App - Quick Start"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running (optional check)
echo "📊 Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.version()" &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB might not be running. Please start MongoDB:"
        echo "   macOS: brew services start mongodb-community"
        echo "   Linux: sudo systemctl start mongod"
        echo "   Or use MongoDB Atlas (cloud)"
    fi
else
    echo "⚠️  MongoDB CLI not found. Make sure MongoDB is installed and running."
fi
echo ""

# Check if dependencies are installed
echo "📦 Checking dependencies..."

if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies not installed. Installing..."
    cd backend && npm install && cd ..
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies found"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not installed. Installing..."
    cd frontend && npm install && cd ..
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies found"
fi
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env file not found. Creating from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please add your Blackbox API key to backend/.env"
    echo "   Get your key from: https://www.blackbox.ai/dashboard"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit and add your API key..."
fi

# Check if API key is set
if grep -q "your_blackbox_api_key_here" backend/.env; then
    echo "⚠️  WARNING: Blackbox API key not set in backend/.env"
    echo "   The app will work but AI generation will fail."
    echo "   Get your key from: https://www.blackbox.ai/dashboard"
    echo ""
fi

# Ask if user wants to seed the database
echo "🌱 Database Seeding"
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    cd backend && npm run seed && cd ..
    echo ""
fi

echo "🚀 Starting servers..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers using trap to handle Ctrl+C
trap 'kill $(jobs -p)' EXIT

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
cd frontend && npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
