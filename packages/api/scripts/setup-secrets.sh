#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}

echo -e "${GREEN}🔐 Setting up Secret Manager${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"
echo ""

gcloud config set project ${PROJECT_ID}

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
echo -e "${YELLOW}Provide environment variables:${NC}"
echo ""

read -p "DATABASE_URL: " DATABASE_URL
read -p "DATABASE_DIRECT_URL: " DATABASE_DIRECT_URL
read -p "SUPABASE_URL: " SUPABASE_URL
read -sp "SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
echo ""

create_secret "skillup-database-url" "${DATABASE_URL}"
create_secret "skillup-database-direct-url" "${DATABASE_DIRECT_URL}"
create_secret "skillup-supabase-url" "${SUPABASE_URL}"
create_secret "skillup-supabase-service-key" "${SUPABASE_SERVICE_ROLE_KEY}"

echo ""
echo -e "${YELLOW}🔑 Granting Cloud Run access...${NC}"

SERVICE_ACCOUNT="${PROJECT_ID}-compute@developer.gserviceaccount.com"

for SECRET in "skillup-database-url" "skillup-database-direct-url" "skillup-supabase-url" "skillup-supabase-service-key"; do
    gcloud secrets add-iam-policy-binding ${SECRET} \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet
done

echo ""
echo -e "${GREEN}✅ Setup complete${NC}"
echo ""
echo -e "${YELLOW}Secrets created:${NC}"
echo "- skillup-database-url"
echo "- skillup-database-direct-url"
echo "- skillup-supabase-url"
echo "- skillup-supabase-service-key"
echo ""
echo -e "${YELLOW}Deploy with: ./scripts/deploy.sh${NC}"
