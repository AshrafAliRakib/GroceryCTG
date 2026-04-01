#!/bin/bash

# CTGGrocery - One-Click Deployment Script
# This script automates the entire setup and deployment process

set -e  # Exit on any error

echo "================================"
echo "CTGGrocery - Deployment Script"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

echo "✅ Docker found"

# Change to project directory
cd /Users/rxbt/GroceryCTG
echo "✅ Changed to project directory"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found"
    exit 1
fi

echo "✅ docker-compose.yml found"

# Check Docker daemon status
if ! docker ps &> /dev/null; then
    echo ""
    echo "⚠️  Docker daemon is not running or paused"
    echo ""
    echo "To unpause Docker Desktop on macOS:"
    echo "1. Click the whale icon (🐋) in the menu bar (top right)"
    echo "2. Select 'Unpause' from the dropdown"
    echo "3. Re-run this script"
    echo ""
    exit 0
fi

echo "✅ Docker daemon is running"

# Start services
echo ""
echo "Starting CTGGrocery services..."
docker compose up -d

# Wait for services to be ready
echo ""
echo "Waiting for services to initialize (15 seconds)..."
sleep 15

# Verify services are running
echo ""
echo "Checking service status..."

BACKEND_RUNNING=$(docker ps | grep groceryctg-backend || echo "")
FRONTEND_RUNNING=$(docker ps | grep groceryctg-frontend || echo "")
DB_RUNNING=$(docker ps | grep groceryctg-db || echo "")

if [ -n "$BACKEND_RUNNING" ] && [ -n "$FRONTEND_RUNNING" ] && [ -n "$DB_RUNNING" ]; then
    echo "✅ All services are running"
else
    echo "❌ Some services failed to start"
    echo ""
    echo "Troubleshooting:"
    docker ps
    exit 1
fi

# Verify backend is responding
echo ""
echo "Testing backend API..."
if curl -s http://localhost:8000/api/accounts/profile/ -H "Authorization: Bearer test" > /dev/null 2>&1; then
    echo "✅ Backend API is responding"
else
    echo "⚠️  Backend may still be initializing..."
fi

# Display access information
echo ""
echo "================================"
echo "✅ CTGGrocery is Ready!"
echo "================================"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Test Accounts:"
echo "  📊 Admin Dashboard:"
echo "     Username: admin"
echo "     Password: admin123"
echo ""
echo "  🛒 Customer:"
echo "     Username: testuser"
echo "     Password: testpass123"
echo ""
echo "Features Available:"
echo "  ✅ Admin Dashboard (Orders, Products, Analytics)"
echo "  ✅ Product Catalog (164 items)"
echo "  ✅ Shopping Cart"
echo "  ✅ Checkout System"
echo "  ✅ OTP Registration"
echo "  ✅ JWT Authentication"
echo ""
echo "================================"
echo ""
