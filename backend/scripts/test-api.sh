#!/bin/bash

# API Testing Script for GramVaani Backend
# Tests all endpoints with sample data

set -e

# Configuration
API_BASE_URL=${API_BASE_URL:-http://localhost:3000}

echo "🧪 Testing GramVaani API"
echo "========================"
echo "Base URL: $API_BASE_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Submit a new complaint
echo -e "${YELLOW}Test 1: POST /complaints - Submit new complaint${NC}"
response=$(curl -s -X POST "$API_BASE_URL/complaints" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Paani ki tanki kharab hai",
    "village": "Rampur"
  }')

if echo "$response" | grep -q "success"; then
  echo -e "${GREEN}✓ Test passed${NC}"
  echo "Response: $response"
else
  echo -e "${RED}✗ Test failed${NC}"
  echo "Response: $response"
fi
echo ""

# Test 2: Get all complaints
echo -e "${YELLOW}Test 2: GET /complaints - Get all complaints${NC}"
response=$(curl -s "$API_BASE_URL/complaints")

if echo "$response" | grep -q "complaints"; then
  echo -e "${GREEN}✓ Test passed${NC}"
  count=$(echo "$response" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
  echo "Found $count complaints"
else
  echo -e "${RED}✗ Test failed${NC}"
  echo "Response: $response"
fi
echo ""

# Test 3: Get complaints filtered by village
echo -e "${YELLOW}Test 3: GET /complaints?village=Rampur - Filter by village${NC}"
response=$(curl -s "$API_BASE_URL/complaints?village=Rampur")

if echo "$response" | grep -q "complaints"; then
  echo -e "${GREEN}✓ Test passed${NC}"
  count=$(echo "$response" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
  echo "Found $count complaints in Rampur"
else
  echo -e "${RED}✗ Test failed${NC}"
  echo "Response: $response"
fi
echo ""

# Test 4: Get complaints filtered by category
echo -e "${YELLOW}Test 4: GET /complaints?category=Water - Filter by category${NC}"
response=$(curl -s "$API_BASE_URL/complaints?category=Water")

if echo "$response" | grep -q "complaints"; then
  echo -e "${GREEN}✓ Test passed${NC}"
  count=$(echo "$response" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
  echo "Found $count water complaints"
else
  echo -e "${RED}✗ Test failed${NC}"
  echo "Response: $response"
fi
echo ""

# Test 5: Get statistics
echo -e "${YELLOW}Test 5: GET /stats - Get statistics${NC}"
response=$(curl -s "$API_BASE_URL/stats")

if echo "$response" | grep -q "stats"; then
  echo -e "${GREEN}✓ Test passed${NC}"
  echo "Response: $response" | head -c 200
  echo "..."
else
  echo -e "${RED}✗ Test failed${NC}"
  echo "Response: $response"
fi
echo ""

echo -e "${GREEN}All tests completed!${NC}"
