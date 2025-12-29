#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}
PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="skillup-api-${ENVIRONMENT}"
ARTIFACT_REGISTRY_REPO="skillup-repo"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/skillup-api"
LOCAL_TEST=${LOCAL_TEST:-false}

echo -e "${GREEN}🚀 Deploying to Cloud Run${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo ""

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found${NC}"
    exit 1
fi

if [ "$LOCAL_TEST" = "true" ]; then
    echo -e "${YELLOW}🐳 Testing Docker container locally first...${NC}"
    echo ""
    
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    cd ${SCRIPT_DIR}/../../../
    ./packages/api/scripts/test-docker.sh
    
    echo ""
    echo -e "${YELLOW}Continue with Cloud Run deployment? (y/n)${NC}"
    read -r CONTINUE_DEPLOY
    
    if [ "$CONTINUE_DEPLOY" != "y" ]; then
        echo -e "${YELLOW}Deployment cancelled${NC}"
        exit 0
    fi
fi

echo -e "${YELLOW}📋 Verifying authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated. Run 'gcloud auth login'${NC}"
    exit 1
fi

gcloud config set project ${PROJECT_ID}

echo -e "${YELLOW}🔌 Enabling APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    --quiet

echo -e "${YELLOW}📦 Checking Artifact Registry...${NC}"
if ! gcloud artifacts repositories describe ${ARTIFACT_REGISTRY_REPO} --location=${REGION} &> /dev/null; then
    gcloud artifacts repositories create ${ARTIFACT_REGISTRY_REPO} \
        --repository-format=docker \
        --location=${REGION} \
        --description="Skill Up API images"
fi

echo -e "${YELLOW}🏗️  Building image...${NC}"
cd ../../../
docker build -t ${IMAGE_NAME}:latest -f packages/api/Dockerfile .

echo -e "${YELLOW}⬆️  Pushing image...${NC}"
docker push ${IMAGE_NAME}:latest

echo -e "${YELLOW}🚢 Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
    --image=${IMAGE_NAME}:latest \
    --region=${REGION} \
    --platform=managed \
    --allow-unauthenticated \
    --port=8080 \
    --min-instances=1 \
    --max-instances=10 \
    --memory=512Mi \
    --cpu=1 \
    --timeout=300 \
    --concurrency=80 \
    --set-env-vars="NODE_ENV=production" \
    --set-secrets="DATABASE_URL=skillup-database-url:latest,DATABASE_DIRECT_URL=skillup-database-direct-url:latest,SUPABASE_URL=skillup-supabase-url:latest,SUPABASE_SERVICE_ROLE_KEY=skillup-supabase-service-key:latest"

SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)')

echo ""
echo -e "${GREEN}✅ Deployment successful${NC}"
echo -e "${GREEN}🌐 URL: ${SERVICE_URL}${NC}"
echo ""
echo -e "${YELLOW}Testing deployed service...${NC}"

if curl -f ${SERVICE_URL}/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    curl ${SERVICE_URL}/health 2>/dev/null | jq . || curl ${SERVICE_URL}/health
else
    echo -e "${RED}⚠️  Health check failed - check logs${NC}"
fi

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. curl ${SERVICE_URL}/health"
echo "2. curl ${SERVICE_URL}/api/health"
echo "3. gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
