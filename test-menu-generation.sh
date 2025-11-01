#!/bin/bash

echo "🧪 Testing Menu Generation Response Structure"
echo "=============================================="
echo ""

# First, let's see what the API actually returns
echo "Testing menu generation API response..."
curl -s -X POST https://minihack-foodtech.vercel.app/api/weekly-menu/generate \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test123"}' | jq '.' 2>/dev/null || echo "Not JSON or error"

echo ""
echo "=============================================="
