#!/bin/bash

echo "🚀 Starting deployment process..."

# Exit on any error
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building client..."
npm run build:client

echo "🔨 Building backend..."
npm run build:backend

echo "✅ Build completed successfully!"

echo "🌐 Starting production server..."
echo "The server will be available at http://localhost:8080"
echo "Press Ctrl+C to stop the server"

# Start the production server
NODE_ENV=production npm start 