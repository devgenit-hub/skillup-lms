#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ID=$(gcloud config get-value project)
REGION=${GCP_REGION:-"asia-southeast1"}

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project set${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}🚀 Deploying SkillUp API via Cloud Build${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo ""

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${YELLOW}🔌 Enabling APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    --quiet

echo -e "${YELLOW}📦 Creating Artifact Registry...${NC}"
gcloud artifacts repositories create skillup-repo \
    --repository-format=docker \
    --location=${REGION} \
    --description="SkillUp API images" 2>/dev/null || echo "Repository already exists"

# Build substitutions - only simple values, URLs are hardcoded in cloudbuild.yaml
SUBSTITUTIONS="_REGION=${REGION}"

echo -e "${YELLOW}☁️  Starting Cloud Build...${NC}"
echo "This builds on Google's servers (takes 3-5 minutes)"
echo ""

gcloud builds submit \
    --config=packages/api/cloudbuild.yaml \
    --substitutions="${SUBSTITUTIONS}" \
    --region=${REGION}

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"

# Get service URL
SERVICE_URL=$(gcloud run services describe skillup-api --region=${REGION} --format='value(status.url)' 2>/dev/null || echo "")

if [ -n "$SERVICE_URL" ]; then
    echo -e "${GREEN}🌐 Service URL: ${SERVICE_URL}${NC}"
    echo ""
    echo -e "${YELLOW}Testing health endpoint...${NC}"
    sleep 5
    curl -s ${SERVICE_URL}/health || echo "Health check pending..."
    echo ""
    echo -e "${YELLOW}📍 Key Endpoints:${NC}"
    echo "  Health: ${SERVICE_URL}/health"
    echo "  API:    ${SERVICE_URL}/api"
    echo "  Docs:   ${SERVICE_URL}/api-docs"
fi
