# @repo/api

Express API with TypeScript and Prisma for SkillShikho LMS.

## Local Development

### Option 1: Direct Run (Development)

```bash
# From project root
pnpm dev

# Or just the API
turbo run dev --filter=@repo/api
```

### Option 2: Docker Container (Production-like)

```bash
# From project root
pnpm docker:api

# Or from packages/api
./scripts/run-local.sh

# Rebuild image
pnpm docker:api:rebuild
```

**Endpoints:**

- Root: `http://localhost:4000`
- Health: `http://localhost:4000/health`
- API Docs: `http://localhost:4000/api-docs`

## Deployment

See [docs/deployment/CLOUD_RUN_SETUP_GUIDE.md](../../docs/deployment/CLOUD_RUN_SETUP_GUIDE.md) for Cloud Run deployment.

### Quick Deploy to Cloud Run

```bash
cd packages/api
./scripts/deploy.sh
```

## Scripts

- `run-local.sh` - Run API in Docker locally
- `deploy.sh` - Deploy to Google Cloud Run
- `setup-secrets.sh` - Setup Cloud Run secrets

## Environment Variables

Required in `.env`:

```env
DATABASE_URL=postgresql://...
DATABASE_DIRECT_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...
PORT=4000
NODE_ENV=development
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```
