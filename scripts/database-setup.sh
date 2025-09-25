#!/bin/bash
# database-setup.sh

set -e

echo "🗄️  Starting SAFe Project Manager Database Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5448}
DB_NAME=${DB_NAME:-safe_pm_dev}
DB_USER=${DB_USER:-safe_user}
DB_PASSWORD=${DB_PASSWORD:-safe_password}

echo -e "${BLUE}📊 Database Configuration:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if PostgreSQL is running
echo -e "${YELLOW}🔍 Checking PostgreSQL connection...${NC}"
if ! pg_isready -h $DB_HOST -p $DB_PORT; then
    echo -e "${RED}❌ PostgreSQL is not running on $DB_HOST:$DB_PORT${NC}"
    echo "Please start PostgreSQL or check your connection settings."
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Check if database exists
echo -e "${YELLOW}🔍 Checking if database exists...${NC}"
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✅ Database '$DB_NAME' exists${NC}"
else
    echo -e "${YELLOW}⚠️  Database '$DB_NAME' does not exist, creating...${NC}"
    createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    echo -e "${GREEN}✅ Database '$DB_NAME' created${NC}"
fi

# Enable required extensions
echo -e "${YELLOW}🔧 Enabling PostgreSQL extensions...${NC}"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" || true
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"pg_trgm\";" || true
echo -e "${GREEN}✅ Extensions enabled${NC}"

# Run migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
cd /Users/daniel/Documents/Projektledning/backend
npx knex migrate:latest
echo -e "${GREEN}✅ Migrations completed${NC}"

# Run seeds
echo -e "${YELLOW}🌱 Running database seeds...${NC}"
npx knex seed:run
echo -e "${GREEN}✅ Seeds completed${NC}"

# Verify setup
echo -e "${YELLOW}🔍 Verifying database setup...${NC}"
ORGANIZATION_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM organizations;")
USER_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users;")
RELEASE_TRAIN_COUNT=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM release_trains;")

echo -e "${GREEN}✅ Database setup verification:${NC}"
echo "  Organizations: $ORGANIZATION_COUNT"
echo "  Users: $USER_COUNT"
echo "  Release Trains: $RELEASE_TRAIN_COUNT"

echo ""
echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "  1. Start the backend server: npm run dev"
echo "  2. Test the API endpoints"
echo "  3. Verify dashboard functionality"
echo ""
echo -e "${BLUE}🔗 Useful commands:${NC}"
echo "  View tables: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c '\dt'"
echo "  Reset database: npx knex migrate:rollback --all && npx knex migrate:latest && npx knex seed:run"
echo "  Database console: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
