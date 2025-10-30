#!/bin/bash

# Phase 3 Comprehensive Testing Script
# Tests Weekly Menu Generation, Shopping Lists, and Meal Swapping

echo "🧪 Phase 3 - Weekly Menu Generation - Comprehensive Testing"
echo "============================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="https://minihack-foodtech.vercel.app/api"

# Test user credentials (you'll need to replace with actual Firebase UID)
FIREBASE_UID="test-user-uid-12345"

# Counter for tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test
run_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    TEST_NAME=$1
    COMMAND=$2
    
    echo -e "${YELLOW}Test $TOTAL_TESTS: $TEST_NAME${NC}"
    
    RESPONSE=$(eval $COMMAND 2>&1)
    STATUS=$?
    
    if [ $STATUS -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "Response: $RESPONSE" | head -n 5
    else
        echo -e "${RED}✗ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "Error: $RESPONSE"
    fi
    echo ""
}

echo "📋 Testing Weekly Menu API Endpoints"
echo "======================================"
echo ""

# Test 1: Health Check
run_test "Health Check" \
    "curl -s -X GET '$BASE_URL/health' -H 'Content-Type: application/json'"

# Test 2: Generate Weekly Menu
echo "⏳ Test 2: Generate Weekly Menu (This may take 1-2 minutes...)"
MENU_RESPONSE=$(curl -s -X POST "$BASE_URL/weekly-menu/generate" \
    -H "Content-Type: application/json" \
    -d "{\"firebaseUid\": \"$FIREBASE_UID\"}")

if echo "$MENU_RESPONSE" | grep -q "menu"; then
    echo -e "${GREEN}✓ PASSED - Menu Generated${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    MENU_ID=$(echo "$MENU_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Menu ID: $MENU_ID"
else
    echo -e "${RED}✗ FAILED - Menu Generation${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo "Response: $MENU_RESPONSE"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

# Test 3: Get Current Menu
run_test "Get Current Weekly Menu" \
    "curl -s -X GET '$BASE_URL/weekly-menu/current?firebaseUid=$FIREBASE_UID' -H 'Content-Type: application/json'"

# Test 4: Swap Meal (if menu was created)
if [ ! -z "$MENU_ID" ]; then
    run_test "Swap Meal in Menu" \
        "curl -s -X POST '$BASE_URL/weekly-menu/swap-meal' \
        -H 'Content-Type: application/json' \
        -d '{\"menuId\": \"$MENU_ID\", \"dayIndex\": 0, \"mealIndex\": 0, \"firebaseUid\": \"$FIREBASE_UID\"}'"
fi

# Test 5: Generate Shopping List (if menu was created)
if [ ! -z "$MENU_ID" ]; then
    run_test "Generate Shopping List" \
        "curl -s -X POST '$BASE_URL/weekly-menu/shopping-list' \
        -H 'Content-Type: application/json' \
        -d '{\"menuId\": \"$MENU_ID\", \"firebaseUid\": \"$FIREBASE_UID\"}'"
fi

echo ""
echo "🧪 Testing Edge Cases"
echo "====================="
echo ""

# Test 6: Generate menu without Firebase UID
run_test "Generate Menu - Missing Firebase UID (Should Fail)" \
    "curl -s -X POST '$BASE_URL/weekly-menu/generate' \
    -H 'Content-Type: application/json' \
    -d '{}'"

# Test 7: Get menu for non-existent user
run_test "Get Menu - Non-existent User (Should Return No Menu)" \
    "curl -s -X GET '$BASE_URL/weekly-menu/current?firebaseUid=non-existent-user' \
    -H 'Content-Type: application/json'"

# Test 8: Swap meal with invalid indices
if [ ! -z "$MENU_ID" ]; then
    run_test "Swap Meal - Invalid Indices (Should Fail)" \
        "curl -s -X POST '$BASE_URL/weekly-menu/swap-meal' \
        -H 'Content-Type: application/json' \
        -d '{\"menuId\": \"$MENU_ID\", \"dayIndex\": 99, \"mealIndex\": 99, \"firebaseUid\": \"$FIREBASE_UID\"}'"
fi

echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review the output above.${NC}"
    exit 1
fi
