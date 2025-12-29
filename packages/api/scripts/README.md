# SkillUp API - Scripts Guide

## Quick Start

### Prerequisites

- Docker Desktop installed and running
- Node.js 20+ & pnpm
- Google Cloud CLI (`gcloud`) for deployment

---

## 🏠 Local Development

### 1. Setup Environment Variables

Create `.env` in the **project root** with these values:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DATABASE_DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_JWT_SECRET="your-jwt-secret"

# API Config
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# Admin
ADMIN_EMAILS="admin@example.com"
ADMIN_PASSWORDS="your-password"

# Payment (Uddokta Pay)
UDDOKTA_PAY_API_URL="https://sandbox.uddoktapay.com/api"
UDDOKTA_PAY_API_KEY="your-api-key"
```

### 2. Run Locally with Docker

From project root:

```bash
pnpm docker:api
```

Or with rebuild:

```bash
pnpm docker:api:rebuild
```

This will:

- Build the Docker image
- Run the container on port 4000
- Auto-load environment variables from `.env`

### 3. Test the API

```bash
curl http://localhost:4000/health
# Expected: {"status":"success","database":"connected",...}
```

**Endpoints:**

- Health: http://localhost:4000/health
- API: http://localhost:4000/api
- Docs: http://localhost:4000/api-docs

---

## ☁️ Cloud Run Deployment

### 1. One-Time Setup

**Login to Google Cloud:**

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**Create secrets in Secret Manager:**

```bash
cd packages/api
./scripts/setup-secrets.sh
```

This creates all required secrets from your `.env` file.

### 2. Deploy

From project root:

```bash
pnpm deploy:api
```

Or from packages/api:

```bash
./scripts/deploy.sh
```

**What happens:**

1. Enables required GCP APIs
2. Creates Artifact Registry repository
3. Builds Docker image on Cloud Build (linux/amd64)
4. Pushes to Artifact Registry
5. Deploys to Cloud Run (Singapore region)

### 3. After Deployment

You'll get a URL like:

```
https://skillup-api-xxxxx-as.a.run.app
```

Update your frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL="https://skillup-api-xxxxx-as.a.run.app"
```

---

## 📁 Scripts Overview

| Script             | Purpose                             |
| ------------------ | ----------------------------------- |
| `run-local.sh`     | Run API in Docker locally           |
| `setup-secrets.sh` | Create GCP secrets from .env        |
| `deploy.sh`        | Deploy to Cloud Run via Cloud Build |

---

## 🔧 Configuration

### Change Region

Edit `deploy.sh` and `cloudbuild.yaml`:

```bash
REGION=${GCP_REGION:-"asia-southeast1"}  # Singapore
```

Available regions: `us-central1`, `asia-southeast1`, `europe-west1`, etc.

### Environment Variables

**Stored as Secrets (sensitive):**

- DATABASE_URL, DATABASE_DIRECT_URL
- SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET
- ADMIN_PASSWORDS, UDDOKTA_PAY_API_KEY
- UDDOKTA_PAY_API_URL, ALLOWED_ORIGINS

**Stored as Env Vars:**

- NODE_ENV=production
- ADMIN_EMAILS

---

## 🐛 Troubleshooting

### Docker build fails locally

```bash
# Rebuild without cache
docker build --no-cache -t skillup-api -f packages/api/Dockerfile .
```

### Cloud Run permission denied on secrets

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Check Cloud Run logs

```bash
gcloud run services logs read skillup-api --region=asia-southeast1
```

### Update a secret value

```bash
echo "new-value" | gcloud secrets versions add SECRET_NAME --data-file=-
```
