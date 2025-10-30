#!/bin/bash

echo "Testing Weekly Menu APIs..."
echo "================================"

echo -e "\n1. Testing /api/weekly-menu/current"
curl -s "https://minihack-foodtech.vercel.app/api/weekly-menu/current?firebaseUid=test" | python3 -m json.tool | head -5

echo -e "\n2. Testing /api/weekly-menu/generate"
curl -s -X POST "https://minihack-foodtech.vercel.app/api/weekly-menu/generate" \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test"}' | python3 -m json.tool | head -5

echo -e "\n3. Testing /api/weekly-menu/swap-meal"
curl -s -X POST "https://minihack-foodtech.vercel.app/api/weekly-menu/swap-meal" \
  -H "Content-Type: application/json" \
  -d '{"menuId":"test","dayIndex":0,"mealIndex":0,"firebaseUid":"test"}' | python3 -m json.tool | head -5

echo -e "\n4. Testing /api/weekly-menu/shopping-list"
curl -s -X POST "https://minihack-foodtech.vercel.app/api/weekly-menu/shopping-list" \
  -H "Content-Type: application/json" \
  -d '{"menuId":"test","firebaseUid":"test"}' | python3 -m json.tool | head -5

echo -e "\n================================"
echo "All endpoints tested!"
