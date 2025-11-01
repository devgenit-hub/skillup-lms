# Error Handling Flow - Complete Guide

## 🔄 Error Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                              │
│                     POST /api/courses                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ROUTE LAYER                               │
│  src/routes/courses.ts                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  coursesRouter.post("/", CourseController.create);        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                              │
│  src/controllers/course.controller.ts                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  static create = asyncHandler(async (req, res) => {       │ │
│  │    const data = createCourseSchema.parse(req.body);  ◄────┼─┼─ VALIDATION
│  │    const course = await prisma.course.create({data}); ◄───┼─┼─ DATABASE
│  │    ApiResponse.created(res, course);                      │ │
│  │  });                                                       │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────┴─────────────┐
         │   ERROR THROWN?          │
         └────────┬────────┬────────┘
                  │        │
             NO   │        │   YES
                  │        │
                  ▼        ▼
         ┌─────────────────────────────────────────────────────┐
         │  SUCCESS           ERROR CAUGHT BY asyncHandler     │
         │  Response          src/middleware/asyncHandler.ts   │
         │  returned          ┌──────────────────────────────┐ │
         │                    │ Promise.resolve(fn)          │ │
         │                    │   .catch(next)  ◄────────────┼─┼─ Passes to next()
         │                    └──────────────────────────────┘ │
         └────────────────────────────┬────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLER MIDDLEWARE                      │
│  src/middleware/errorHandler.ts                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  export const errorHandler = (err, req, res, next) => {   │ │
│  │                                                            │ │
│  │    if (err instanceof AppError) {                         │ │
│  │      // NotFoundError, ValidationError, ConflictError...  │ │
│  │      return res.status(err.statusCode).json({             │ │
│  │        status: "error",                                   │ │
│  │        statusCode: err.statusCode,                        │ │
│  │        message: err.message                               │ │
│  │      });                                                   │ │
│  │    }                                                       │ │
│  │                                                            │ │
│  │    if (err instanceof ZodError) {                         │ │
│  │      // Validation errors from schemas                    │ │
│  │      return res.status(400).json({ ... });               │ │
│  │    }                                                       │ │
│  │                                                            │ │
│  │    if (err instanceof Prisma.PrismaClientKnownError) {   │ │
│  │      // Database errors (P2002, P2025, etc.)             │ │
│  │      return res.status(...).json({ ... });               │ │
│  │    }                                                       │ │
│  │                                                            │ │
│  │    // Unknown errors → 500                                │ │
│  │    return res.status(500).json({ ... });                 │ │
│  │  }                                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT RESPONSE                             │
│  {                                                               │
│    "status": "error",                                           │
│    "statusCode": 404,                                           │
│    "message": "Course not found"                                │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 📍 Where NotFoundError is Handled - Step by Step

### Step 1: Error is Thrown in Controller

**File**: `src/controllers/course.controller.ts` (line 68)

```typescript
static getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);

  const course = await prisma.course.findUnique({
    where: { id },
    include: { /* ... */ },
  });

  // 👇 ERROR THROWN HERE
  if (!course) {
    throw new NotFoundError('Course');  // Creates: 404 "Course not found"
  }

  ApiResponse.success(res, course);
});
```

### Step 2: Error is Caught by asyncHandler

**File**: `src/middleware/asyncHandler.ts`

```typescript
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    // 👇 CATCHES ALL ERRORS from async functions
    Promise.resolve(fn(req, res, next)).catch(next); // Passes error to Express error handling
  };
};
```

**What happens**:

1. `CourseController.getById` is wrapped with `asyncHandler`
2. When `throw new NotFoundError('Course')` executes, the Promise rejects
3. `.catch(next)` catches the error
4. `next(error)` passes it to Express's error handling chain
5. Express routes it to the `errorHandler` middleware

### Step 3: Error is Processed by errorHandler

**File**: `src/middleware/errorHandler.ts` (lines 18-26)

```typescript
export const errorHandler = (err, _req, res, _next) => {
  let error = {
    status: 'error',
    statusCode: 500,
    message: 'Internal server error',
  };

  // 👇 CHECKS IF IT'S AN AppError (which NotFoundError extends)
  if (err instanceof AppError) {
    error = {
      status: 'error',
      statusCode: err.statusCode, // 404
      message: err.message, // "Course not found"
    };
  }
  // ... other error type checks

  // Log the error
  console.error('Error:', {
    name: err.name, // "NotFoundError"
    message: err.message, // "Course not found"
    statusCode: error.statusCode, // 404
    stack: err.stack,
  });

  // 👇 SENDS RESPONSE TO CLIENT
  res.status(error.statusCode).json(error);
};
```

### Step 4: Response Sent to Client

```json
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "status": "error",
  "statusCode": 404,
  "message": "Course not found"
}
```

## 🎯 All Error Types and Their Handlers

### 1. Custom AppErrors (NotFoundError, ValidationError, etc.)

**Defined in**: `src/utils/errors.ts`
**Handled by**: `errorHandler` (lines 18-26)

```typescript
// Throwing errors in controllers:
throw new NotFoundError('Course'); // → 404
throw new ValidationError('Invalid email'); // → 400
throw new ConflictError('Already exists'); // → 409
throw new UnauthorizedError('Not logged in'); // → 401
throw new ForbiddenError('No permission'); // → 403
```

**Handler**:

```typescript
if (err instanceof AppError) {
  error = {
    status: 'error',
    statusCode: err.statusCode, // 404, 400, 409, etc.
    message: err.message,
  };
}
```

### 2. Zod Validation Errors

**From**: Schema validation in controllers
**Handled by**: `errorHandler` (lines 28-37)

```typescript
// When this fails:
const data = createCourseSchema.parse(req.body);

// Error handler catches it:
if (err instanceof ZodError) {
  error = {
    status: 'error',
    statusCode: 400,
    message: 'Validation failed',
    details: err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    })),
  };
}
```

### 3. Prisma Database Errors

**From**: Database operations
**Handled by**: `handlePrismaError()` function (lines 83-118)

```typescript
// When database operations fail:
await prisma.course.create({ data }); // P2002: Unique constraint

// Error handler catches it:
if (err instanceof Prisma.PrismaClientKnownRequestError) {
  error = handlePrismaError(err);
}

// handlePrismaError function:
function handlePrismaError(err) {
  switch (err.code) {
    case 'P2002': // Unique constraint violation
      return { statusCode: 409, message: 'Record already exists' };
    case 'P2025': // Record not found
      return { statusCode: 404, message: 'Record not found' };
    case 'P2003': // Foreign key constraint
      return { statusCode: 400, message: 'Invalid reference' };
    default:
      return { statusCode: 500, message: 'Database error' };
  }
}
```

### 4. Unknown Errors

**From**: Unexpected errors
**Handled by**: `errorHandler` (lines 53-60)

```typescript
else {
  error = {
    status: 'error',
    statusCode: 500,
    message: process.env.NODE_ENV === 'development'
      ? err.message           // Show real error in dev
      : 'Internal server error',  // Hide details in production
  };
}
```

## 🔍 Real Usage Examples

### Example 1: Course Not Found

```typescript
// File: src/controllers/course.controller.ts

static getById = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) {
    throw new NotFoundError('Course');  // ← THROWN HERE
  }

  ApiResponse.success(res, course);
});
```

**Flow**:

1. ✅ `asyncHandler` wraps the function
2. ✅ Database returns `null`
3. ✅ `throw new NotFoundError('Course')` executes
4. ✅ `asyncHandler` catches it via Promise.catch()
5. ✅ Passes to `errorHandler` via `next(error)`
6. ✅ `errorHandler` checks `err instanceof AppError` → TRUE
7. ✅ Extracts `statusCode: 404` and `message: "Course not found"`
8. ✅ Sends JSON response to client

### Example 2: Validation Error (Zod)

```typescript
static create = asyncHandler(async (req, res) => {
  const data = createCourseSchema.parse(req.body);  // ← THROWS IF INVALID
  const course = await prisma.course.create({ data });
  ApiResponse.created(res, course);
});
```

**Flow**:

1. ✅ Schema validation fails (e.g., missing required field)
2. ✅ Zod throws `ZodError`
3. ✅ `asyncHandler` catches it
4. ✅ `errorHandler` checks `err instanceof ZodError` → TRUE
5. ✅ Formats validation errors with field names
6. ✅ Sends 400 response with details

### Example 3: Duplicate Email (Prisma P2002)

```typescript
static create = asyncHandler(async (req, res) => {
  const data = createUserSchema.parse(req.body);
  const user = await prisma.user.create({ data });  // ← PRISMA ERROR
  ApiResponse.created(res, user);
});
```

**Flow**:

1. ✅ Email already exists in database
2. ✅ Prisma throws `PrismaClientKnownRequestError` (P2002)
3. ✅ `asyncHandler` catches it
4. ✅ `errorHandler` checks Prisma error type → TRUE
5. ✅ Calls `handlePrismaError(err)`
6. ✅ Returns 409 "Record already exists"

## 📊 Error Handler Registration

**File**: `src/index.ts` (lines 70-74)

```typescript
// API Routes
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);
app.use('/api/enrollments', enrollmentsRouter);

// 404 handler for undefined routes
app.use(notFoundHandler);

// 👇 GLOBAL ERROR HANDLER (must be last!)
app.use(errorHandler);
```

**Important**: The `errorHandler` MUST be registered **after** all routes. Express middleware order matters!

## 🎓 Key Takeaways

1. **asyncHandler**: Wraps all controller methods to catch async errors
2. **Custom Errors**: Extend `AppError` with specific status codes
3. **errorHandler**: Centralized middleware that transforms all errors
4. **No try-catch needed**: Just throw errors, they're handled automatically!
5. **Type-safe**: TypeScript ensures correct error types
6. **Production-ready**: Sanitizes errors based on environment

## 🚀 How to Add New Error Types

```typescript
// 1. Create new error class (src/utils/errors.ts)
export class RateLimitError extends AppError {
  constructor() {
    super(429, 'Too many requests');
    this.name = 'RateLimitError';
  }
}

// 2. Use in controller
static someMethod = asyncHandler(async (req, res) => {
  if (requestCount > limit) {
    throw new RateLimitError();  // Automatically handled!
  }
  // ...
});

// 3. Error handler automatically processes it (no changes needed!)
// Because RateLimitError extends AppError
```

That's the complete error handling system! 🎉
