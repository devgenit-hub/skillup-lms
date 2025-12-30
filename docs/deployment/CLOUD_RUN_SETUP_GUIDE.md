# Complete Cloud Run Deployment Guide

## Prerequisites

- Google Cloud account with billing enabled
- `gcloud` CLI installed
- Docker installed
- Project repository cloned

## Step 1: Install Google Cloud SDK

### macOS

```bash
brew install --cask google-cloud-sdk
```

### Linux

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Verify Installation

```bash
gcloud --version
```

## Step 2: Authenticate & Setup Project

### Login to Google Cloud

```bash
gcloud auth login
```

### Create or Select Project

```bash
# Create new project
gcloud projects create skillup-production --name="Skill Up Production"

# Or list existing projects
gcloud projects list

# Set active project
gcloud config set project skillup-production

# Set default region
gcloud config set run/region us-central1
```

### Enable Billing

```bash
# List billing accounts
gcloud billing accounts list

# Link billing account to project
gcloud billing projects link skillup-production \
  --billing-account=YOUR_BILLING_ACCOUNT_ID
```

## Step 3: Configure Environment Variables

### Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Copy these values:

**Connection Pooler (Transaction Mode)**:

```
postgresql://postgres.xxxxx:5432/postgres?pgbouncer=true
```

**Direct Connection**:

```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

4. Navigate to **Settings** → **API**
5. Copy:
   - Project URL: `https://xxxxx.supabase.co`
   - Service Role Key: `eyJhbGciOi...`

### Create .env.production (Local Reference Only)

```bash
cd /path/to/skillup
cat > .env.production << 'EOF'
# Database
DATABASE_URL="postgresql://postgres.xxxxx:5432/postgres?pgbouncer=true"
DATABASE_DIRECT_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"

# Supabase
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# Application URLs
NEXT_PUBLIC_BACKEND_URL="https://api.skillshikho.com"
NEXT_PUBLIC_FRONTEND_URL="https://skillshikho.com"

# API
NODE_ENV="production"
PORT="8080"
EOF
```

**⚠️ Never commit this file to Git**

## Step 4: Setup Google Cloud Secret Manager

### Run Setup Script

```bash
cd packages/api
./scripts/setup-secrets.sh
```

### Or Manual Setup

```bash
# Set project
export GCP_PROJECT_ID="skillup-production"
gcloud config set project ${GCP_PROJECT_ID}

# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# Create secrets
echo "postgresql://postgres.xxxxx:5432/postgres?pgbouncer=true" | \
  gcloud secrets create skillup-database-url --data-file=-

echo "postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres" | \
  gcloud secrets create skillup-database-direct-url --data-file=-

echo "https://xxxxx.supabase.co" | \
  gcloud secrets create skillup-supabase-url --data-file=-

echo "eyJhbGciOi..." | \
  gcloud secrets create skillup-supabase-service-key --data-file=-
```

### Grant Cloud Run Access

```bash
PROJECT_NUMBER=$(gcloud projects describe ${GCP_PROJECT_ID} --format='value(projectNumber)')
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

for SECRET in skillup-database-url skillup-database-direct-url skillup-supabase-url skillup-supabase-service-key; do
  gcloud secrets add-iam-policy-binding ${SECRET} \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor"
done
```

## Step 5: Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  compute.googleapis.com
```

## Step 6: Create Artifact Registry

```bash
gcloud artifacts repositories create skillup-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Skill Up API Docker images"
```

## Step 7: Configure Docker for GCP

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## Step 8: Deploy Application

### Option A: Automated Script

```bash
cd packages/api
export GCP_PROJECT_ID="skillup-production"
export GCP_REGION="us-central1"
./scripts/deploy.sh production
```

### Option B: Manual Deployment

#### Build Docker Image

```bash
cd /path/to/skillup

docker build \
  -t us-central1-docker.pkg.dev/skillup-production/skillup-repo/skillup-api:latest \
  -f packages/api/Dockerfile \
  .
```

#### Push to Artifact Registry

```bash
docker push us-central1-docker.pkg.dev/skillup-production/skillup-repo/skillup-api:latest
```

#### Deploy to Cloud Run

```bash
gcloud run deploy skillup-api-production \
  --image=us-central1-docker.pkg.dev/skillup-production/skillup-repo/skillup-api:latest \
  --region=us-central1 \
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
```

## Step 9: Verify Deployment

### Get Service URL

```bash
gcloud run services describe skillup-api-production \
  --region=us-central1 \
  --format='value(status.url)'
```

### Test Health Endpoint

```bash
SERVICE_URL=$(gcloud run services describe skillup-api-production --region=us-central1 --format='value(status.url)')

curl ${SERVICE_URL}/health
curl ${SERVICE_URL}/api/health
```

### Expected Response

```json
{
  "status": "ok",
  "timestamp": "2025-12-29T...",
  "uptime": 123.45
}
```

## Step 10: Configure CORS for Frontend

Update your frontend environment to use the Cloud Run URL:

### Vercel (Dashboard/Website)

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-cloud-run-url.run.app
```

### Update API CORS Settings

If needed, update allowed origins in `packages/api/src/index.ts`:

```typescript
const allowedOrigins = [
  'https://your-dashboard.vercel.app',
  'https://your-website.vercel.app',
  'http://localhost:3000',
];
```

## Step 11: Database Migration

### Run Migrations on Production Database

```bash
# From local machine with DATABASE_DIRECT_URL in .env.production
DATABASE_DIRECT_URL="your-direct-url" pnpm --filter @repo/db db:migrate:deploy
```

### Or Create Cloud Build Job

```bash
gcloud builds submit \
  --config=packages/db/cloudbuild-migrate.yaml \
  --substitutions=_SECRET_NAME=skillup-database-direct-url
```

## Step 12: Setup Monitoring

### Cloud Logging

```bash
# View logs
gcloud run services logs read skillup-api-production \
  --region=us-central1 \
  --limit=100

# Tail logs
gcloud run services logs tail skillup-api-production \
  --region=us-central1
```

### Cloud Monitoring Alerts

```bash
# Create alert for high error rate
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL_ID \
  --display-name="API Error Rate" \
  --condition-display-name="High 5xx errors" \
  --condition-threshold-value=10 \
  --condition-threshold-duration=60s
```

### Uptime Check

```bash
gcloud monitoring uptime create skillup-api-health \
  --resource-type=uptime-url \
  --display-name="API Health Check" \
  --http-check-path=/health \
  --period=60 \
  --timeout=10s
```

## Step 13: Setup Custom Domain (Optional)

### Map Custom Domain

```bash
gcloud run domain-mappings create \
  --service=skillup-api-production \
  --domain=api.yourdomain.com \
  --region=us-central1
```

### Update DNS

Add the DNS records shown in the output to your domain provider.

## Troubleshooting

### Issue: Build Fails

**Check Build Logs**

```bash
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>
```

**Common Solutions**

- Ensure all package.json dependencies are correct
- Verify Dockerfile paths
- Check pnpm-lock.yaml is committed

### Issue: Container Won't Start

**Check Logs**

```bash
gcloud run services logs read skillup-api-production --limit=50
```

**Common Solutions**

- Verify port 8080 is exposed
- Check environment variables are set
- Ensure database connection is accessible

### Issue: Database Connection Fails

**Verify Secrets**

```bash
gcloud secrets versions access latest --secret=skillup-database-url
```

**Test Connection Locally**

```bash
psql "postgresql://postgres.xxxxx:5432/postgres?pgbouncer=true"
```

**Common Solutions**

- Check Supabase IP allowlist
- Verify connection string format
- Ensure Prisma client is generated

### Issue: 403 Forbidden

**Grant Public Access**

```bash
gcloud run services add-iam-policy-binding skillup-api-production \
  --region=us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

## Cost Optimization

### Set Minimum Instances to 0 (Cold Starts)

```bash
gcloud run services update skillup-api-production \
  --min-instances=0 \
  --region=us-central1
```

### Monitor Usage

```bash
gcloud billing accounts list
gcloud billing projects describe skillup-production
```

### Budget Alert

```bash
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="Skill Up Budget" \
  --budget-amount=50 \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90
```

## Rollback Strategy

### List Revisions

```bash
gcloud run revisions list \
  --service=skillup-api-production \
  --region=us-central1
```

### Rollback to Previous Version

```bash
PREVIOUS_REVISION=$(gcloud run revisions list \
  --service=skillup-api-production \
  --region=us-central1 \
  --format='value(name)' \
  --limit=2 | tail -1)

gcloud run services update-traffic skillup-api-production \
  --to-revisions=${PREVIOUS_REVISION}=100 \
  --region=us-central1
```

## CI/CD Setup

### Connect GitHub Repository

1. Go to Cloud Build → Triggers
2. Click "Connect Repository"
3. Select GitHub and authorize
4. Choose your repository
5. Create trigger with:
   - **Name**: Deploy API Production
   - **Event**: Push to branch
   - **Branch**: `^main$`
   - **Build configuration**: `packages/api/cloudbuild.yaml`

### Or Via CLI

```bash
gcloud builds triggers create github \
  --repo-name=skillup \
  --repo-owner=your-github-username \
  --branch-pattern="^main$" \
  --build-config=packages/api/cloudbuild.yaml \
  --description="Deploy API on main push"
```

## Security Checklist

- ✅ Secrets stored in Secret Manager (not in code)
- ✅ Non-root user in container
- ✅ HTTPS only (Cloud Run default)
- ✅ IAM roles properly configured
- ✅ CORS configured for specific origins
- ✅ Rate limiting enabled in API
- ✅ Database connection uses SSL
- ✅ Environment variables validated

## Next Steps

1. Setup staging environment
2. Configure Cloud CDN
3. Add Cloud Armor for DDoS protection
4. Setup Cloud Trace for performance monitoring
5. Configure backup strategy
6. Setup disaster recovery plan

## Support

**GCP Documentation**: https://cloud.google.com/run/docs
**Supabase Documentation**: https://supabase.com/docs
**Project Issues**: Check Cloud Run logs and service status
