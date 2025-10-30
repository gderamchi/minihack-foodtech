#!/bin/bash

echo "🧪 COMPREHENSIVE USER ENDPOINTS TEST"
echo "===================================="
echo ""

BASE_URL="https://minihack-foodtech.vercel.app/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test 1: Health Check
echo "📋 Test 1: Health Check"
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

# Test 2: Profile endpoint without auth (should return 401)
echo "�� Test 2: Profile endpoint without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/users/profile?firebaseUid=test123")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Profile requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Profile should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 3: Create-or-update without auth (should return 401)
echo "📋 Test 3: Create-or-update without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/create-or-update" \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test","email":"test@test.com","name":"Test"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Create-or-update requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Create-or-update should require auth: $HTTP_CODE"
    echo "Response: $(echo "$RESPONSE" | head -n-1)"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 4: Update profile without auth (should return 401)
echo "📋 Test 4: Update profile without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/users/update-profile" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Update profile requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Update profile should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 5: Onboarding without auth (should return 401)
echo "📋 Test 5: Onboarding without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/onboarding" \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"test","step":1,"data":{}}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Onboarding requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Onboarding should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 6: Delete account without auth (should return 401)
echo "📋 Test 6: Delete account without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/users/delete-account?firebaseUid=test")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Delete account requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Delete account should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 7: Menus endpoint (public)
echo "📋 Test 7: Menus endpoint (public)"
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
echo "📋 Test 8: Dishes endpoint (public)"
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

# Test 9: Stores endpoint (public)
echo "📋 Test 9: Stores endpoint (public)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/stores?lat=48.8566&lng=2.3522")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Stores endpoint: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Stores endpoint: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Test 10: Weekly menu endpoint without auth (should return 401)
echo "📋 Test 10: Weekly menu endpoint without auth (expect 401)"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/weekly-menu")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Weekly menu requires auth: $HTTP_CODE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC} - Weekly menu should require auth: $HTTP_CODE"
    FAILED=$((FAILED + 1))
fi
echo ""

# Summary
echo "===================================="
echo "📊 TEST SUMMARY"
echo "===================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    exit 1
fi
