FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY packages/locales/package.json ./packages/locales/
COPY packages/typescript-config ./packages/typescript-config/
COPY packages/eslint-config ./packages/eslint-config/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY packages/db ./packages/db/
COPY packages/shared ./packages/shared/
COPY packages/locales ./packages/locales/
COPY packages/api ./packages/api/

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
ENV DATABASE_DIRECT_URL="postgresql://postgres:postgres@localhost:5432/postgres"

WORKDIR /app/packages/db
RUN pnpm exec prisma generate --schema=prisma/schema.prisma

WORKDIR /app/packages/api
RUN pnpm build

# Create a standalone package.json for npm install
RUN cat package.json | node -e "const p=JSON.parse(require('fs').readFileSync(0,'utf8')); \
    delete p.devDependencies; \
    delete p.dependencies['@repo/db']; \
    delete p.dependencies['@repo/shared']; \
    delete p.dependencies['@repo/locales']; \
    p.dependencies['@prisma/client']='^7.1.0'; \
    p.dependencies['@prisma/adapter-pg']='^7.1.0'; \
    p.dependencies['pg']='^8.16.3'; \
    console.log(JSON.stringify(p,null,2))" > /tmp/package.json

# Create deploy directory with npm (flat node_modules)
RUN mkdir -p /deploy && \
    cp /tmp/package.json /deploy/package.json && \
    cp -r dist /deploy/dist && \
    cd /deploy && npm install --production --legacy-peer-deps

# Copy generated Prisma client
RUN PRISMA_GEN=$(find /app/node_modules/.pnpm -type d -path "*/@prisma+client@*/node_modules/.prisma" | head -1) && \
    cp -rL "$PRISMA_GEN" /deploy/node_modules/.prisma

FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy deployed package with flat npm node_modules
COPY --chown=nodejs:nodejs --from=builder /deploy ./

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
