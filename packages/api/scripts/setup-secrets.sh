#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ID=$(gcloud config get-value project)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project set${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}🔐 Setting up Secret Manager${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"
echo ""

echo -e "${YELLOW}🔌 Enabling Secret Manager API...${NC}"
gcloud services enable secretmanager.googleapis.com --quiet

create_secret() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2
    
    echo -e "${YELLOW}📝 ${SECRET_NAME}${NC}"
    
    if gcloud secrets describe ${SECRET_NAME} --project=${PROJECT_ID} &> /dev/null; then
        echo "${SECRET_VALUE}" | gcloud secrets versions add ${SECRET_NAME} --data-file=-
        echo -e "${GREEN}✓ Updated${NC}"
    else
        echo "${SECRET_VALUE}" | gcloud secrets create ${SECRET_NAME} --data-file=- --replication-policy="automatic"
        echo -e "${GREEN}✓ Created${NC}"
    fi
}

echo ""
echo -e "${YELLOW}Enter your environment variables:${NC}"
echo ""

read -p "DATABASE_URL: " DATABASE_URL
read -p "DATABASE_DIRECT_URL: " DATABASE_DIRECT_URL
read -p "SUPABASE_URL: " SUPABASE_URL
read -sp "SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
echo ""
read -sp "SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
echo ""
read -sp "SUPABASE_JWT_SECRET: " SUPABASE_JWT_SECRET
echo ""
read -p "ADMIN_EMAILS (comma-separated): " ADMIN_EMAILS
read -sp "ADMIN_PASSWORDS (comma-separated, same order as emails): " ADMIN_PASSWORDS
echo ""
read -p "UDDOKTA_PAY_API_URL: " UDDOKTA_PAY_API_URL
read -sp "UDDOKTA_PAY_API_KEY: " UDDOKTA_PAY_API_KEY
echo ""
read -p "ALLOWED_ORIGINS (comma-separated): " ALLOWED_ORIGINS
echo ""

echo ""
echo -e "${YELLOW}Creating secrets...${NC}"

create_secret "skillup-database-url" "${DATABASE_URL}"
create_secret "skillup-database-direct-url" "${DATABASE_DIRECT_URL}"
create_secret "skillup-supabase-url" "${SUPABASE_URL}"
create_secret "skillup-supabase-service-key" "${SUPABASE_SERVICE_ROLE_KEY}"
create_secret "skillup-supabase-anon-key" "${SUPABASE_ANON_KEY}"
create_secret "skillup-supabase-jwt-secret" "${SUPABASE_JWT_SECRET}"
create_secret "skillup-admin-passwords" "${ADMIN_PASSWORDS}"
create_secret "skillup-uddokta-pay-api-key" "${UDDOKTA_PAY_API_KEY}"

echo ""
echo -e "${YELLOW}🔑 Granting Cloud Run access...${NC}"

SERVICE_ACCOUNT="${PROJECT_ID}-compute@developer.gserviceaccount.com"

SECRETS=(
    "skillup-database-url"
    "skillup-database-direct-url"
    "skillup-supabase-url"
    "skillup-supabase-service-key"
    "skillup-supabase-anon-key"
    "skillup-supabase-jwt-secret"
    "skillup-admin-passwords"
    "skillup-uddokta-pay-api-key"
)

for SECRET in "${SECRETS[@]}"; do
    gcloud secrets add-iam-policy-binding ${SECRET} \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet 2>/dev/null || true
done

echo ""
echo -e "${GREEN}✅ Secrets setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Environment variables for deploy.sh:${NC}"
echo "export ADMIN_EMAILS='${ADMIN_EMAILS}'"
echo "export UDDOKTA_PAY_API_URL='${UDDOKTA_PAY_API_URL}'"
echo "export ALLOWED_ORIGINS='${ALLOWED_ORIGINS}'"
echo ""
echo -e "${YELLOW}Next: Run ./scripts/deploy.sh${NC}"
