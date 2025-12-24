# Quick Testing Guide - Superuser Features

## 🎯 Testing Order

### 1. Start the Development Servers

```bash
# Terminal 1 - Start Backend API
cd packages/api
pnpm dev

# Terminal 2 - Start Dashboard
cd apps/dashboard
pnpm dev
```

### 2. Login as Superuser

Navigate to: `http://localhost:3000/login`

- Use superuser credentials
- Should redirect to `/superuser`

---

## 📊 Feature 1: Dashboard Analytics

**URL:** `/superuser`

### Test Cases:

1. **Initial Load**
   - ✅ Should show loading skeletons
   - ✅ Should load real stats from API
   - ✅ Should display three cards: Revenue, Students, Webinars

2. **Refresh Button**
   - ✅ Click refresh button
   - ✅ Button should show spinning icon
   - ✅ Stats should reload
   - ✅ Toast notification on error

3. **Data Display**
   - ✅ Revenue formatted as BDT currency
   - ✅ Growth percentage shown (+ or -)
   - ✅ Active students count
   - ✅ Webinars count

---

## 🎥 Feature 2: Webinars Management

**URL:** `/superuser/webinars`

### Test Cases:

#### Webinars List Page

1. **Initial Load**
   - ✅ Should show loading skeletons
   - ✅ Should load webinars from API
   - ✅ Should display stats cards (Total, Active, Upcoming)
   - ✅ Should show webinar cards

2. **Pagination**
   - ✅ Previous button disabled on first page
   - ✅ Click Next to go to next page
   - ✅ Click Previous to go back
   - ✅ Page info displayed (e.g., "Page 1 of 3")

3. **Search Functionality**
   - ✅ Type in search box
   - ✅ Webinars filtered in real-time
   - ✅ Show "No webinars found" if no results

4. **Empty State**
   - ✅ If no webinars, show "No webinars available"
   - ✅ Show helpful message

#### Webinar Details Modal

5. **View Details**
   - ✅ Click "View Details" on any webinar card
   - ✅ Modal opens with all details
   - ✅ Shows: title, description, dates, duration, status, live link

6. **Edit Webinar**
   - ✅ Click "Edit" in modal
   - ✅ Form appears with current values
   - ✅ Modify any field
   - ✅ Click "Save Changes"
   - ✅ Should show loading state
   - ✅ Toast notification on success/error
   - ✅ Modal closes on success
   - ✅ List refreshes with updated data

7. **Update Live Link**
   - ✅ Click "Update Live Link" tab
   - ✅ Enter new link
   - ✅ Click "Update Link"
   - ✅ Toast notification on success
   - ✅ Link updated in database

8. **Toggle Status**
   - ✅ Click "Toggle Status" button
   - ✅ Status changes (draft ↔ upcoming)
   - ✅ Toast notification
   - ✅ Badge updates in UI

9. **Delete Webinar**
   - ✅ Click "Delete Webinar" button
   - ✅ Confirmation dialog appears
   - ✅ Click "Cancel" - nothing happens
   - ✅ Click "Yes, Delete" - webinar deleted
   - ✅ Toast notification
   - ✅ Modal closes
   - ✅ List refreshes without deleted webinar

---

## 🔒 Feature 3: Password Change

**URL:** `/superuser/settings`

### Test Cases:

1. **Form Validation**
   - ✅ Leave current password empty - error message
   - ✅ Enter new password < 8 chars - error message
   - ✅ Passwords don't match - error message
   - ✅ Same current and new password - error message

2. **Incorrect Current Password**
   - ✅ Enter wrong current password
   - ✅ Submit form
   - ✅ Should show error toast
   - ✅ Error message: "Current password is incorrect"

3. **Successful Password Change**
   - ✅ Enter correct current password
   - ✅ Enter new password (min 8 chars)
   - ✅ Confirm new password (match)
   - ✅ Click "Change Password"
   - ✅ Should show loading spinner
   - ✅ Toast notification: "Password changed successfully!"
   - ✅ Form clears automatically
   - ✅ Success message displayed

4. **Security Checks**
   - ✅ New password hashed in database (not plain text)
   - ✅ Cannot reuse old password
   - ✅ Requires authentication

---

## 🔍 Error Handling Tests

### Network Errors

1. **Disconnect Backend**
   - Stop API server
   - Try any operation
   - ✅ Should show error toast
   - ✅ Should not crash app

2. **Invalid Requests**
   - ✅ Malformed data rejected
   - ✅ Proper error messages shown

### Loading States

- ✅ All operations show loading indicators
- ✅ Buttons disabled during loading
- ✅ Prevent double submissions

---

## 📝 API Endpoints to Verify

```bash
# Dashboard Stats
GET /api/analytics/dashboard

# Webinars
GET /api/webinars?page=1&limit=6
PATCH /api/webinars/:id
PATCH /api/webinars/:id/status
DELETE /api/webinars/:id

# Password Change
POST /api/users/change-password
Body: { "currentPassword": "...", "newPassword": "..." }
```

---

## 🐛 Common Issues & Solutions

### Issue: Stats not loading

**Solution:**

- Check backend API is running
- Verify `/api/analytics/dashboard` endpoint works
- Check browser console for errors

### Issue: Webinars not updating

**Solution:**

- Check authentication token is valid
- Verify webinar ID exists
- Check API response in Network tab

### Issue: Password change fails

**Solution:**

- Verify current password is correct
- Check minimum password length (8 chars)
- Ensure new password is different

### Issue: Toast notifications not showing

**Solution:**

- Verify Toaster component in layout.tsx
- Check closeButton prop is added
- Verify sonner is installed

---

## ✅ Success Criteria

All features should:

- ✅ Load data from backend API
- ✅ Show loading states
- ✅ Display error messages
- ✅ Show success notifications
- ✅ Update UI after operations
- ✅ Handle edge cases gracefully
- ✅ Work without compilation errors

---

## 📊 Performance Checks

- ✅ Dashboard loads in < 2 seconds
- ✅ Webinars list loads in < 2 seconds
- ✅ Modal opens instantly
- ✅ Search is responsive
- ✅ No memory leaks
- ✅ No unnecessary re-renders

---

## 🚀 Ready for Production?

Before deploying:

- [ ] All test cases pass
- [ ] No console errors
- [ ] No compilation errors
- [ ] API endpoints secured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] User feedback implemented

---

**Happy Testing! 🎉**
