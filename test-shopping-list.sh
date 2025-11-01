#!/bin/bash

echo "🧪 COMPREHENSIVE SHOPPING LIST TESTING"
echo "========================================"
echo ""

BASE_URL="https://minihack-foodtech.vercel.app/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

echo "📋 PHASE 1: Backend API Testing"
echo "================================"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Health endpoint: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Health endpoint: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 2: Shopping List GET without auth (should return 401)
echo "Test 2: Shopping List GET without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/shopping-list")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Shopping list requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Shopping list should require auth: $HTTP_CODE"
    echo "Response: $(echo "$RESPONSE" | head -n-1)"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 3: Shopping List POST without auth (should return 401)
echo "Test 3: Shopping List POST without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/shopping-list" \
  -H "Content-Type: application/json" \
  -d '{"items":[]}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Shopping list POST requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Shopping list POST should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 4: Shopping List PUT without auth (should return 401)
echo "Test 4: Shopping List PUT without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/shopping-list" \
  -H "Content-Type: application/json" \
  -d '{"checkedItems":{}}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Shopping list PUT requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Shopping list PUT should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 5: Shopping List DELETE without auth (should return 401)
echo "Test 5: Shopping List DELETE without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/shopping-list")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Shopping list DELETE requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Shopping list DELETE should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 6: Weekly Menu API (generates shopping list)
echo "Test 6: Weekly Menu API without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/weekly-menu/generate" \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Weekly menu requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Weekly menu should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 7: Menus endpoint (public)
echo "Test 7: Menus endpoint (public)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/menus")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Menus endpoint: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Menus endpoint: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 8: Dishes endpoint (public)
echo "Test 8: Dishes endpoint (public)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/dishes")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Dishes endpoint: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Dishes endpoint: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

echo ""
echo "======================================"
echo "📊 BACKEND API TEST SUMMARY"
echo "======================================"
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL BACKEND TESTS PASSED!${NC}"
else
    echo -e "${YELLOW}⚠️  SOME TESTS FAILED${NC}"
fi

echo ""
echo "======================================"
echo "📋 PHASE 2: Frontend File Verification"
echo "======================================"
echo ""

# Check if shopping list files exist
echo "Checking Shopping List files..."
echo ""

FILES=(
    "frontend/src/pages/ShoppingList.jsx"
    "api/shopping-list.js"
    "frontend/package.json"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file exists"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌${NC} $file missing"
        FAILED=$((FAILED + 1))
    fi
done

echo ""

# Check for jsPDF in package.json
echo "Checking dependencies..."
if grep -q "jspdf" frontend/package.json; then
    echo -e "${GREEN}✅${NC} jsPDF installed"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌${NC} jsPDF not found in package.json"
    FAILED=$((FAILED + 1))
fi

echo ""

# Check ShoppingList.jsx for key features
echo "Checking ShoppingList.jsx features..."
FEATURES=(
    "viewMode:View mode state"
    "customItems:Custom items state"
    "itemNotes:Item notes state"
    "shoppingListAPI:API integration"
    "jsPDF:PDF export"
    "handleEmailList:Email functionality"
    "addCustomItem:Add custom items"
    "saveNote:Save notes"
    "FaCalendarDay:Day view icon"
    "FaStore:Store view icon"
)

for feature in "${FEATURES[@]}"; do
    SEARCH="${feature%%:*}"
    DESC="${feature##*:}"
    if grep -q "$SEARCH" frontend/src/pages/ShoppingList.jsx; then
        echo -e "${GREEN}✅${NC} $DESC"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌${NC} $DESC missing"
        FAILED=$((FAILED + 1))
    fi
done

echo ""
echo "======================================"
echo "📊 FINAL TEST SUMMARY"
echo "======================================"
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo ""
    echo "✅ Backend API: All endpoints secured"
    echo "✅ Frontend Files: All files present"
    echo "✅ Features: All features implemented"
    echo ""
    echo "🚀 Shopping List System is READY!"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo ""
    echo "Please review the failures above."
    exit 1
fi
