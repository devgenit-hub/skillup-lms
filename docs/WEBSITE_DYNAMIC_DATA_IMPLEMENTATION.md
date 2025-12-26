# Website Dynamic Data Implementation

**Date:** December 26, 2025  
**Status:** ✅ Completed

## Overview

Implemented unified public API endpoint for website initial data fetching (courses, webinars, categories) and integrated dynamic data across the website frontend.

## Changes Summary

### 1. Backend - Unified Public Endpoint

#### New Files

- **`packages/api/src/controllers/public.controller.ts`**
  - Created `getInitialData()` method
  - Returns courses (9 items), webinars (9 items), and categories in one call
  - Extracts data from Course/Webinar metadata JSON fields
  - Fields: `heroImage`, `category`, `level`, `language` from metadata

- **`packages/api/src/routes/public.ts`**
  - Route: `GET /api/public/initial`
  - No authentication required

#### Modified Files

- **`packages/api/src/index.ts`**
  - Added `publicRouter` import and registration
  - Route: `/api/public`

- **`packages/api/src/controllers/course.controller.ts`**
  - Updated `getPublicCategories()` to extract from metadata
  - No direct category field in schema

### 2. Frontend - Dynamic Data Integration

#### Modified Files

- **`apps/website/src/lib/zustand/app-store.ts`**
  - Added `categories: string[]` state
  - Added `categoriesLoading` state
  - Added `setCategories()` and `setCategoriesLoading()` methods

- **`apps/website/src/lib/api-client.ts`**
  - Added `getInitialData()` method
  - Endpoint: `/api/public/initial`

- **`apps/website/src/context/auth-context.tsx`**
  - Updated to call unified `getInitialData()` endpoint
  - Fetches all data in one API call on app mount
  - Sets courses, webinars, and categories in Zustand store

- **`apps/website/src/components/landing-page/OurCourses.tsx`**
  - **REMOVED:** All hardcoded data (categories, courseData arrays)
  - **ADDED:** Dynamic data from `useAppStore()`
  - Categories from API with "All" filter
  - Courses filtered by selected category
  - Loading states and empty states
  - Maps API data to CourseCard component props

#### Backup Files

- **`apps/website/BACKUP_OLD_DATA.tsx`**
  - Contains original hardcoded categories and courseData
  - **DO NOT DELETE** - kept for reference

### 3. Database Schema Notes

#### Course Model

```typescript
// Fields stored in metadata JSON:
{
  "level": "beginner",
  "category": "Web",
  "heroImage": "url",
  "language": "bn",
  "batchNo": "BATCH-002",
  "courseType": "live",
  "numClasses": 20
}
```

#### Webinar Model

- Has direct fields: `category`, `image`, `status`
- No metadata field needed for basic info

### 4. API Response Structure

**Endpoint:** `GET /api/public/initial`

**Response:**

```json
{
  "status": "success",
  "data": {
    "courses": [
      {
        "id": "string",
        "title": "string",
        "image": "string | null",
        "feeType": "free" | "paid",
        "price": "number | null",
        "category": "string | null",
        "level": "string | null",
        "language": "string | null",
        "_count": {
          "enrollments": "number",
          "curriculumModules": "number"
        }
      }
    ],
    "webinars": [
      {
        "id": "string",
        "title": "string",
        "image": "string | null",
        "category": "string",
        "scheduleDateTime": "Date",
        "duration": "number",
        "feeType": "string",
        "price": "number | null",
        "status": "string",
        "_count": {
          "registrations": "number"
        }
      }
    ],
    "categories": ["string"]
  }
}
```

## Benefits

1. **Single API Call:** Reduced from 3 separate calls to 1 unified endpoint
2. **Performance:** Parallel database queries using `Promise.all()`
3. **Maintainability:** All initial data logic centralized in one controller
4. **Type Safety:** Proper TypeScript interfaces and metadata handling
5. **No Hardcoded Data:** All content dynamic from database

## Next Steps

1. ✅ Complete - Unified endpoint created
2. ✅ Complete - Frontend integrated with dynamic data
3. ✅ Complete - Old hardcoded data backed up and removed
4. ⏳ Pending - Apply same pattern to other website sections:
   - WebinarSection component
   - TestimonialsSection (if needed)
   - CourseSection filters integration
   - AllCourses page

## Testing Checklist

- [ ] Verify `/api/public/initial` returns correct data
- [ ] Check OurCourses section displays dynamic courses
- [ ] Test category filtering works
- [ ] Verify loading states appear correctly
- [ ] Test empty states when no data
- [ ] Check console for TypeScript errors
- [ ] Verify no performance issues on page load

## Related Files

**Backend:**

- `packages/api/src/controllers/public.controller.ts`
- `packages/api/src/routes/public.ts`
- `packages/api/src/index.ts`
- `packages/api/src/controllers/course.controller.ts`

**Frontend:**

- `apps/website/src/context/auth-context.tsx`
- `apps/website/src/lib/api-client.ts`
- `apps/website/src/lib/zustand/app-store.ts`
- `apps/website/src/components/landing-page/OurCourses.tsx`

**Backup:**

- `apps/website/BACKUP_OLD_DATA.tsx`

## Migration Notes

- Course metadata structure must include: `category`, `heroImage`, `level`, `language`
- Webinar uses direct schema fields, not metadata
- Categories list is extracted from all published courses' metadata
- Initial fetch happens in AuthProvider on app mount
