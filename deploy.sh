#!/bin/bash

echo "Starting deployment process..."

# Navigate to your project directory (adjust the path to match your setup)
cd /home/aimo/fe-front-end

# Pull the latest changes
echo "Pulling latest changes..."
git pull gitea main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Restart PM2 process
echo "Restarting PM2..."
pm2 restart 0

echo "Deployment completed!"
