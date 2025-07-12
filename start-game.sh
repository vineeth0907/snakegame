#!/bin/bash

echo "🎮 Snake Game Server Launcher"
echo "=============================="

# Kill any existing servers
pkill -f "python3 -m http.server" 2>/dev/null
pkill -f "node server.js" 2>/dev/null

echo "Starting Node.js server on port 8080..."
node server.js &

sleep 2

echo ""
echo "🎮 Snake Game is ready!"
echo "Open your browser and visit:"
echo "   📍 http://localhost:8080"
echo "   📍 http://127.0.0.1:8080"
echo ""
echo "If those don't work, try:"
echo "   📍 http://localhost:3000 (Python server)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Keep the script running
wait