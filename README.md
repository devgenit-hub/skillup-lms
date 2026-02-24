# SkillShikho - Learning Management Platform

A modern Learning Management System built with Turborepo monorepo architecture.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `website`: Public-facing [Next.js](https://nextjs.org/) app for students (port 3000)
- `dashboard`: Admin [Next.js](https://nextjs.org/) app for course management (port 3001)
- `@repo/api`: Express API server with REST endpoints (port 4000)
- `@repo/db`: Shared Prisma database client and schema
- `@repo/locales`: Shared localization package with auto-generated imports (supports en, bn)
- `@repo/ui`: Shared React component library used by both applications
- `@repo/eslint-config`: Shared ESLint configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: Shared TypeScript configurations used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Getting Started

Install dependencies:

```bash
pnpm install
```

### Generate

Generate all necessary files (Prisma client, locale imports, etc.):

```bash
pnpm generate
```

This will run:

- `pnpm generate:db` - Generates Prisma Client from schema
- `pnpm generate:locales` - Auto-generates locale imports from JSON files

Run individual generators:

```bash
# Generate only Prisma client
pnpm generate:db

# Generate only locale imports
pnpm generate:locales
```

**Note**: Run `pnpm generate` after:

- Cloning the repository for the first time
- Modifying Prisma schema
- Adding new languages or translation files

### Build

To build all apps and packages:

```bash
pnpm build
```

Build a specific app:

```bash
pnpm turbo build --filter=website
# or
pnpm turbo build --filter=dashboard
```

### Develop

Start all apps in development mode:

```bash
pnpm dev
```

This will start:

- Website at `http://localhost:3000`
- Dashboard at `http://localhost:3001`

Run a specific app:

```bash
pnpm turbo dev --filter=website
# or
pnpm turbo dev --filter=dashboard
```

## Project Structure

```bash
skill-up/
├── apps/
│   ├── website/          # Student-facing application (Next.js)
│   └── dashboard/        # Admin dashboard (Next.js)
├── packages/
│   ├── api/             # Express REST API
│   ├── db/              # Prisma database client & schema
│   ├── locales/         # i18n translations (en, bn)
│   ├── ui/              # Shared UI components
│   ├── eslint-config/   # Shared ESLint configs
│   └── typescript-config/ # Shared TypeScript configs
└── turbo.json           # Turborepo configuration
```

## Tech Stack

### Frontend

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack
- **React Compiler**: Enabled for better performance

### Backend

- **API**: Express 5.1.0
- **Database ORM**: Prisma 6.18.0
- **Database**: PostgreSQL
- **Validation**: Zod

### Tooling

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- **[API Architecture](./docs/API_ARCHITECTURE.md)** - Complete guide to the enterprise-grade API architecture
- **[Error Handling Flow](./docs/ERROR_HANDLING_FLOW.md)** - Comprehensive error handling system documentation

Package-specific READMEs:

- [API Package](./packages/api/README.md)
- [Database Package](./packages/db/README.md)
- [Locales Package](./packages/locales/README.md)

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
