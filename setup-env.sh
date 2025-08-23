#!/bin/bash

# JobPortal Environment Setup Script
echo "🔐 JobPortal Environment Setup"
echo "================================"

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Copy example file
if [ -f "env.example" ]; then
    cp env.example .env
    echo "✅ Created .env file from env.example"
else
    echo "❌ env.example file not found!"
    exit 1
fi

echo ""
echo "📝 Please edit the .env file with your actual values:"
echo "   - API keys for AI services"
echo "   - Email credentials"
echo "   - Database connection string"
echo "   - JWT secret"
echo ""
echo "🔗 See ENVIRONMENT_SETUP.md for detailed instructions"
echo ""
echo "✅ Environment setup completed!"
echo "   Don't forget to restart your application after editing .env"
