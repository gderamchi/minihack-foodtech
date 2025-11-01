#!/bin/bash

echo "Testing Menu Generation API..."
echo ""

# Test the generate endpoint structure
echo "1. Testing API response structure..."
curl -s -X POST https://minihack-foodtech.vercel.app/api/weekly-menu/generate \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test123"}' | jq '.' 2>/dev/null || echo "Response is not JSON or error occurred"

echo ""
echo "2. Testing with actual structure..."
curl -s -X POST https://minihack-foodtech.vercel.app/api/weekly-menu/generate \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test123"}' | head -100

