#!/bin/bash
set -e  # Exit on any error

echo -e "\033[1mStarting server setup...\033[0m\n"

# Install dependencies
echo -e "\033[1mInstalling dependencies...\033[0m\n"
npm install

# Generate Prisma client only (skip migrations)
echo -e "\033[1mGenerating Prisma client...\033[0m\n"
npx prisma generate

# Apply migrations (production-safe way)
echo -e "\033[1mApplying database migrations...\033[0m\n"
npx prisma migrate deploy

# Build the Nuxt application
echo -e "\033[1mBuilding Nuxt application...\033[0m\n"
npx nuxt build

# Start the preview server
echo -e "\033[1mStarting preview server...\033[0m\n"
npx nuxt preview
