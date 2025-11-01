# @repo/db

Shared database package for Skill Up LMS using Prisma and PostgreSQL.

## Features

- ✅ Prisma 6.18.0 ORM
- ✅ PostgreSQL database
- ✅ TypeScript support
- ✅ Shared types exported
- ✅ Database migrations
- ✅ Seeding script

## Setup

1. **Copy environment variables:**

   ```bash
   cp .env.example .env
   ```

2. **Update DATABASE_URL in .env:**

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/skillup?schema=public"
   ```

3. **Generate Prisma Client:**

   ```bash
   pnpm db:generate
   ```

4. **Push schema to database:**

   ```bash
   pnpm db:push
   # or create a migration
   pnpm db:migrate
   ```

5. **Seed database (optional):**
   ```bash
   pnpm db:seed
   ```

## Usage in Other Packages

```typescript
// In API or other packages
import { prisma } from '@repo/db';
import type { User, Course } from '@repo/db';

// Use Prisma client
const courses = await prisma.course.findMany();
```

## Scripts

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database (no migration)
- `pnpm db:migrate` - Create and apply migration
- `pnpm db:migrate:deploy` - Apply migrations in production
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database with test data

## Database Schema

### Models

- **User** - Students, instructors, and admins
- **Course** - Learning courses
- **Lesson** - Individual lessons within courses
- **Enrollment** - User course enrollments

### Relations

- User → Courses (as instructor)
- User → Enrollments
- Course → Lessons
- Course → Enrollments
