# Teacher Dashboard Implementation Plan

## Overview

Transform the teacher dashboard from static dummy data to a fully dynamic, authenticated system that fetches real data from the backend API.

---

## Current State Analysis

### Frontend Issues

1. **Teacher Dashboard (`/teacher/page.tsx`)**
   - Uses dummy data from `@/lib/dummy-data`
   - Hardcoded `currentTeacherId`
   - Manually filters courses by teacher ID
   - No real-time data from API

2. **Teacher Layout (`/teacher/layout.tsx`)**
   - Hardcoded course list in sidebar ("Intro to React")
   - Static navigation, not dynamic based on assigned courses
   - No course data fetching

3. **Teacher Settings (`/teacher/settings/page.tsx`)**
   - ❌ Missing URL field for profile image (needs to match superuser pattern)
   - Only allows file upload, not URL input
   - Needs both upload and URL field like admin settings

4. **Course Management Page (`/teacher/course/[id]/page.tsx`)**
   - Uses dummy course data
   - No API integration for curriculum management
   - Cannot save changes to backend

### Backend Analysis

✅ **Available APIs:**

- `GET /api/teachers/me` - Get current teacher profile
- `PATCH /api/teachers/me` - Update current teacher profile
- `GET /api/courses` - Get courses (supports `teacherId` filter)
- `GET /api/courses/:id` - Get single course with full details

❌ **Missing APIs Needed:**

- None! The backend already supports filtering courses by teacher
- Course API includes `courseTeachers` relation with teacher data
- Curriculum modules included in course details

---

## Implementation Plan

### **PHASE 1: Fix Teacher Settings Page** ⚡ Priority

**Goal:** Add URL field for profile image (match admin pattern)

#### Tasks:

1. **Update Teacher Settings Form**
   - Add "Profile Image URL" input field alongside file upload
   - Add toggle/tabs between "Upload File" and "Paste URL"
   - Show preview for both upload and URL
   - Validate URL format
   - Update form submission to handle both methods

2. **Backend Validation**
   - ✅ Already supports `profileImage` field as string
   - No changes needed to API

**Files to Modify:**

- `apps/dashboard/src/app/teacher/settings/page.tsx`

**Estimated Time:** 30-45 minutes

---

### **PHASE 2: Dynamic Teacher Dashboard** 🎯 Core Feature

**Goal:** Fetch and display teacher's assigned courses from API

#### Tasks:

1. **Fetch Assigned Courses**
   - Get current teacher's ID from auth
   - Call `GET /api/courses?teacherId={id}` with teacher filter
   - Handle loading/error states
   - Display actual course count

2. **Update Dashboard UI**
   - Map API response to course cards
   - Show real course status (Active/Deactive based on `published` field)
   - Display actual video/PDF counts from curriculum modules
   - Handle empty state (no assigned courses)

3. **Add Refresh Functionality**
   - Add refresh button to reload courses
   - Integrate with app context refresh

**Files to Modify:**

- `apps/dashboard/src/app/teacher/page.tsx`

**API Endpoints Used:**

```typescript
// Already available
GET /api/teachers/me → { id, name, email, ... }
GET /api/courses?teacherId={id}&published=true
```

**Estimated Time:** 1-1.5 hours

---

### **PHASE 3: Dynamic Sidebar Navigation** 📋

**Goal:** Show teacher's actual assigned courses in sidebar

#### Tasks:

1. **Fetch Courses in Layout**
   - Use app context or local state
   - Fetch teacher's courses on layout mount
   - Cache course list to avoid repeated fetches

2. **Dynamic Course Links**
   - Map over actual courses from API
   - Generate `/teacher/course/{courseId}` links
   - Show course titles
   - Highlight active course
   - Handle loading skeleton for sidebar courses

3. **Handle Edge Cases**
   - Empty state: "No courses assigned yet"
   - Error state: Show retry option
   - Loading state: Show skeleton loaders

**Files to Modify:**

- `apps/dashboard/src/app/teacher/layout.tsx`
- Possibly create `@/hooks/useTeacherCourses.ts` for reusability

**Estimated Time:** 1 hour

---

### **PHASE 4: Dynamic Course Management Page** 🎓

**Goal:** Load real course data and curriculum from API

#### Tasks:

1. **Fetch Course Data**
   - Call `GET /api/courses/:id` with full includes
   - Parse curriculum modules, classes, materials
   - Handle 404 if course not found or not assigned to teacher

2. **Transform API Data**
   - Map `curriculumModules` → `ExtendedModule[]`
   - Map `classes` → video lessons
   - Map `materials` → downloadable files
   - Preserve existing UI state management

3. **Verify Teacher Access**
   - Check if logged-in teacher is assigned to this course
   - Show error if trying to access unassigned course
   - Redirect to dashboard if unauthorized

4. **Display Real Data**
   - Show actual module names, video titles, materials
   - Display file URLs instead of dummy data
   - Show real course title, description, status

**Files to Modify:**

- `apps/dashboard/src/app/teacher/course/[id]/page.tsx`

**Data Transformation Example:**

```typescript
// API Response
{
  id: "c123",
  title: "Advanced React",
  curriculumModules: [
    {
      id: "mod1",
      title: "Introduction",
      order: 1,
      classes: [
        { id: "cls1", title: "Video 1", videoUrl: "...", order: 1 }
      ],
      materials: [
        { id: "mat1", title: "Slides", fileUrl: "...", order: 1 }
      ]
    }
  ]
}

// Transform to ExtendedModule
{
  id: "mod1",
  title: "Introduction",
  classes: [{ id: "cls1", title: "Video 1", videoUrl: "..." }],
  materials: [{ id: "mat1", title: "Slides", file: null }],
  isOpen: true
}
```

**Estimated Time:** 1.5-2 hours

---

### **PHASE 5: Save Curriculum Changes (Future)** 🔮

**Goal:** Allow teachers to update curriculum via API

**Note:** This requires backend endpoints for:

- `POST /api/courses/:id/modules` - Add module
- `PATCH /api/courses/:id/modules/:moduleId` - Update module
- `DELETE /api/courses/:id/modules/:moduleId` - Delete module
- Similar endpoints for classes and materials

**This is out of scope for current implementation** but should be planned for future phases.

---

## Technical Considerations

### 1. **Authentication Flow**

```typescript
// Current flow:
useAuthStore → supabaseId → API (verifies via middleware)

// Teacher-specific:
GET /api/teachers/me → returns teacher profile with ID
Use teacher.id to filter courses
```

### 2. **API Client Updates Needed**

```typescript
// apps/dashboard/src/lib/api-client.ts

// Add method:
getTeacherCourses: async (teacherId: string) => {
  return apiClient.get(`/api/courses?teacherId=${teacherId}&published=true`);
}

// Already exists:
getCurrentTeacher() ✅
updateCurrentTeacher() ✅
getCourses() ✅ (with query params)
getCourseById(id) ✅
```

### 3. **Type Definitions**

```typescript
// Add to types:
interface TeacherCourse {
  id: string;
  title: string;
  description: string | null;
  published: boolean;
  feeType: 'FREE' | 'PAID';
  price: number | null;
  courseTeachers: {
    teacher: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  _count: {
    enrollments: number;
    lessons: number;
  };
  curriculumModules: CurriculumModule[];
}
```

### 4. **Error Handling**

- Network errors: Show toast, retry option
- 404 courses: Redirect to dashboard
- Unauthorized access: Show error message
- Empty states: Friendly "No courses yet" message

### 5. **Loading States**

- Skeleton loaders for dashboard cards
- Spinner for course details page
- Shimmer effect for sidebar course list

---

## Testing Checklist

### Settings Page

- [ ] Upload profile image via file
- [ ] Upload profile image via URL
- [ ] Preview shows for both methods
- [ ] URL validation works
- [ ] Save persists to database
- [ ] Image displays in dashboard header

### Dashboard

- [ ] Shows only courses assigned to logged-in teacher
- [ ] Course count is accurate
- [ ] Click course card navigates to management page
- [ ] Empty state shows when no courses assigned
- [ ] Refresh button reloads data

### Sidebar

- [ ] Shows all assigned courses dynamically
- [ ] Clicking course link navigates correctly
- [ ] Active course is highlighted
- [ ] Empty state shows friendly message

### Course Management

- [ ] Loads actual course data from API
- [ ] Shows real curriculum modules
- [ ] Cannot access unassigned courses
- [ ] 404 handling works
- [ ] Module collapse/expand works
- [ ] Video and material display correctly

---

## Migration Steps

### Step 1: Settings Fix (Start Here)

```bash
# 1. Update settings page UI
# 2. Test upload + URL
# 3. Verify backend saves correctly
```

### Step 2: Dashboard Dynamic Data

```bash
# 1. Remove dummy data imports
# 2. Add API call with teacherId filter
# 3. Update UI to use real data
# 4. Test with different teachers
```

### Step 3: Sidebar Courses

```bash
# 1. Fetch courses in layout
# 2. Map to navigation links
# 3. Test navigation
```

### Step 4: Course Management

```bash
# 1. Fetch full course with curriculum
# 2. Transform data structure
# 3. Verify teacher access
# 4. Test UI with real data
```

---

## Timeline Estimate

- **Phase 1 (Settings):** 30-45 min
- **Phase 2 (Dashboard):** 1-1.5 hours
- **Phase 3 (Sidebar):** 1 hour
- **Phase 4 (Course Management):** 1.5-2 hours

**Total: 4-5.5 hours**

---

## Priority Order

1. 🔴 **Phase 1** - Settings (Quick fix, user-facing)
2. 🔴 **Phase 2** - Dashboard (Core functionality)
3. 🟡 **Phase 3** - Sidebar (Nice to have, enhances UX)
4. 🟡 **Phase 4** - Course Page (Important but can work with existing UI)

---

## Success Metrics

✅ Teacher can upload profile image via URL or file  
✅ Dashboard shows only assigned courses from API  
✅ Sidebar dynamically lists teacher's courses  
✅ Course management page loads real curriculum  
✅ No dummy data remaining in teacher portal  
✅ Proper error handling and loading states

---

## Next Steps

1. Review and approve this plan
2. Start with Phase 1 (Settings fix)
3. Test each phase before moving to next
4. Document any API issues encountered
5. Update types as needed
