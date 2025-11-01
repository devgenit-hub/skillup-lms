# @repo/api

Express API with TypeScript and Prisma for Skill Up LMS.

## Features

- ✅ Express.js with TypeScript
- ✅ Prisma ORM with PostgreSQL
- ✅ CORS enabled
- ✅ Hot reload with tsx
- ✅ Type-safe database queries
- ✅ RESTful API structure

## Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Setup database:**

   Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

   Update `DATABASE_URL` in `.env`:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/skillup?schema=public"
   ```

3. **Generate Prisma Client:**

   ```bash
   pnpm db:generate
   ```

4. **Push schema to database:**

   ```bash
   pnpm db:push
   ```

   Or run migrations:

   ```bash
   pnpm db:migrate
   ```

## Development

Start the dev server:

```bash
pnpm dev
```

API will run on http://localhost:4000

## Database Commands

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database (no migration)
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio (GUI for database)

## API Endpoints

### Health Check

- `GET /` - API health status

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course
- `PATCH /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments

- `GET /api/enrollments` - Get all enrollments
- `POST /api/enrollments` - Create enrollment
- `PATCH /api/enrollments/:id` - Update enrollment
- `DELETE /api/enrollments/:id` - Delete enrollment

## Database Schema

### Models

- **User** - Students, instructors, and admins
- **Course** - Learning courses
- **Lesson** - Individual lessons within courses
- **Enrollment** - Student course enrollments

## Build

Build for production:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```
