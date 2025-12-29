# Skill Up API - Deployment Guide

Complete guide for local Docker testing and Cloud Run deployment.

---

## 🚀 Quick 2-Step Deployment

### Step 1: Test Locally with Docker

```bash
cd packages/api
docker-compose up --build
```

**Test endpoints:**

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/health
```

### Step 2: Deploy to Cloud Run

```bash
# Setup secrets (ONE TIME)
export GCP_PROJECT_ID="your-project-id"
./scripts/setup-secrets.sh

# Deploy
./scripts/deploy.sh production
```

---

## 🐳 Local Docker Testing

### Method 1: Docker Compose (Recommended)

**Start:**

```bash
docker-compose up --build
```

**Test endpoints:**

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/health
curl http://localhost:8080/api/courses
```

**View logs:**

```bash
docker-compose logs -f
```

**Stop:**

```bash
docker-compose down
```

### Method 2: Automated Test Script

```bash
./scripts/test-docker.sh
```

Automatically:

- Builds image
- Starts container
- Tests health endpoints
- Shows logs

### Testing Checklist

- ✅ `curl http://localhost:8080/health` returns 200
- ✅ `curl http://localhost:8080/api/health` returns 200
- ✅ Database connection works
- ✅ No errors in logs
- ✅ Container starts within 10 seconds

---

## ☁️ Cloud Run Deployment

### Prerequisites

**Install gcloud CLI:**

```bash
# macOS
brew install --cask google-cloud-sdk

# Verify
gcloud --version
```

**Login:**

```bash
gcloud auth login
gcloud config set project your-project-id
```

### Step-by-Step Deployment

**1. Get Supabase credentials from dashboard:**

- Settings → Database → Connection strings
- Settings → API → URL and service role key

**2. Setup Google Cloud secrets (ONE TIME):**

```bash
export GCP_PROJECT_ID="your-project-id"
./scripts/setup-secrets.sh
```

Provide:

```
DATABASE_URL: postgresql://postgres.xxxxx:5432/postgres?pgbouncer=true
DATABASE_DIRECT_URL: postgresql://postgres:pass@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL: https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOi...
```

**3. Deploy:**

```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"
./scripts/deploy.sh production
```

**4. Test deployed service:**

```bash
SERVICE_URL=$(gcloud run services describe skillup-api-production --region=us-central1 --format='value(status.url)')
curl ${SERVICE_URL}/health
```

**5. Update frontend:**

```bash
# Add to Vercel environment
NEXT_PUBLIC_API_URL=https://your-service.run.app
```

### Deployment Options

**With local testing:**

```bash
LOCAL_TEST=true ./scripts/deploy.sh production
```

**To staging:**

```bash
./scripts/deploy.sh staging
```

### Monitoring

**View logs:**

```bash
gcloud run services logs tail skillup-api-production --region=us-central1
```

**Service details:**

```bash
gcloud run services describe skillup-api-production --region=us-central1
```

---

## 🔧 Configuration

### Cloud Run Settings

- **Min instances**: 1
- **Max instances**: 10
- **Memory**: 512Mi
- **CPU**: 1 vCPU
- **Timeout**: 300s
- **Concurrency**: 80

**Update:**

```bash
gcloud run services update skillup-api-production \
  --min-instances=2 \
  --max-instances=20 \
  --region=us-central1
```

---

## 🐛 Troubleshooting

### Local Issues

**Port in use:**

```bash
lsof -i :8080
kill -9 <PID>
```

**Environment not loading:**

```bash
ls -la ../../.env
cat ../../.env | grep DATABASE_URL
```

### Cloud Run Issues

**Build fails:**

```bash
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>
```

**Container won't start:**

```bash
gcloud run services logs read skillup-api-production --limit=50
```

**Database connection fails:**

```bash
gcloud secrets versions access latest --secret=skillup-database-url
```

---

## 📊 Cost Estimates

Monthly (moderate usage):

- Cloud Run: $5-20
- Artifact Registry: $0.10
- Secret Manager: $0.06

Free tier: 2M requests/month

---

## 🔄 Rollback

```bash
# List revisions
gcloud run revisions list --service=skillup-api-production --region=us-central1

# Rollback
gcloud run services update-traffic skillup-api-production \
  --to-revisions=REVISION_NAME=100 \
  --region=us-central1
```

---

## 📚 Additional Documentation

- [Complete Setup Guide](../../docs/deployment/CLOUD_RUN_SETUP_GUIDE.md)
- [Local Testing](../../docs/deployment/LOCAL_DOCKER_TESTING.md)
- [Quick Deploy](../../docs/deployment/QUICK_DEPLOY.md)
