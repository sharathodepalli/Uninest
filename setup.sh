#!/bin/bash

# UniNest Development Setup Script
echo "🏠 Setting up UniNest development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your Supabase credentials"
fi

# Install Supabase CLI if not present
if ! command -v supabase &> /dev/null; then
    echo "🔧 Installing Supabase CLI..."
    if command -v brew &> /dev/null; then
        brew install supabase/tap/supabase
    else
        echo "📥 Please install Supabase CLI manually:"
        echo "https://supabase.com/docs/guides/cli"
    fi
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ Type check passed!"
else
    echo "❌ Type check failed. Please fix TypeScript errors."
    exit 1
fi

# Build the project
echo "🏗️  Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check errors above."
    exit 1
fi

echo ""
echo "🎉 UniNest setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase project: https://supabase.com"
echo "2. Update .env.local with your Supabase credentials"
echo "3. Run database migrations: npm run db:push"
echo "4. Start development server: npm run dev"
echo ""
echo "Happy coding! 🚀"
