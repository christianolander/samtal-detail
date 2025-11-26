#!/bin/bash

# Prepare for deployment to Netlify
# This script switches from yalc (local development) to npm package (production)

set -e

echo "🚀 Preparing for deployment..."

# Remove yalc files
echo "📦 Removing yalc files..."
rm -rf .yalc yalc.lock

# Update package.json to use npm registry version
echo "📝 Updating package.json..."
# Use sed to replace yalc version with npm version
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' 's/"@c.olander\/proto-ui": "file:.*"/"@c.olander\/proto-ui": "^0.2.0"/' package.json
else
  # Linux
  sed -i 's/"@c.olander\/proto-ui": "file:.*"/"@c.olander\/proto-ui": "^0.2.0"/' package.json
fi

# Clean install
echo "🧹 Clean installing dependencies..."
rm -rf node_modules package-lock.json
npm install

# Build to verify it works
echo "🔨 Testing production build..."
npm run build

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Commit changes: git add ."
echo "2. Push to GitHub: git push"
echo "3. After deployment, restore yalc: npx yalc add @c.olander/proto-ui && npm install"
