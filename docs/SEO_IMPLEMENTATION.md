# SEO Configuration - Skillশিখো

## Overview

This document outlines the enterprise-level SEO optimizations implemented for both the website and dashboard applications.

## ✅ Implemented Features

### 1. **Brand Consistency**

- **Brand Name**: `Skillশিখো` (no space)
- Updated across all files:
  - Website components
  - Dashboard layouts
  - SEO metadata
  - Footer
  - Navigation

### 2. **Metadata Configuration**

#### **Website (Public)**

- **Base URL**: https://www.skillshikho.com
- **Title Format**: `Skillশিখো | Page Name`
- **Default Description**: Bengali and English optimized
- **Keywords**: Bilingual (Bengali + English)
- **OpenGraph**: Full configuration with 1200x630 images
- **Twitter Cards**: Summary large image format
- **Robots**: `index: true, follow: true`

#### **Dashboard (Private)**

- **Base URL**: https://manage.skillshikho.com
- **Title Format**: `Skillশিখো Dashboard | Page Name`
- **Robots**: `index: false, follow: false` (prevents indexing)

### 3. **Static Pages Metadata**

All static pages have optimized metadata:

| Page        | Title               | Status |
| ----------- | ------------------- | ------ |
| Home        | Skillশিখো           | ✅     |
| About       | আমাদের সম্পর্কে     | ✅     |
| All Courses | সকল কোর্স           | ✅     |
| Webinars    | সকল ওয়েবিনার       | ✅     |
| Career      | ক্যারিয়ার গাইডলাইন | ✅     |

### 4. **Dynamic Pages Metadata**

#### **Course Pages**

- URL Pattern: `/course/[course_id]`
- Title: `Skillশিখো | Course Name`
- Dynamic fetching from API
- Uses course hero image or fallback to metaBanner.png
- Includes course category, batch, level in keywords
- JSON-LD structured data (Schema.org Course type)

#### **Webinar Pages**

- URL Pattern: `/webinar/[webinar_id]`
- Title: `Skillশিখো | Webinar Name`
- Dynamic fetching from API
- Uses webinar image or fallback to metaBanner.png
- Includes schedule date in description
- JSON-LD structured data (Schema.org Event type)

### 5. **JSON-LD Structured Data**

Implemented for rich snippets in search results:

#### Course Schema

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: string,
  description: string,
  provider: Organization,
  image: string,
  courseCategory: string,
  educationalLevel: string,
  instructor: Person[]
}
```

#### Webinar/Event Schema

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: string,
  description: string,
  startDate: string,
  eventAttendanceMode: 'OnlineEventAttendanceMode',
  eventStatus: 'EventScheduled',
  location: VirtualLocation,
  organizer: Organization
}
```

### 6. **Image Optimization**

- **Meta Banner**: `/metaBanner.png` (1200x630 recommended)
- Location: `apps/website/public/metaBanner.png`
- Used for social media sharing
- Fallback for dynamic pages without custom images

### 7. **robots.txt**

File: `apps/website/src/app/robots.ts`

Configuration:

- Allow: All pages
- Disallow: `/api/`, `/auth/`, `/student/`, `/payment/`
- Sitemap: `https://www.skillshikho.com/sitemap.xml`

### 8. **Dynamic Sitemap**

File: `apps/website/src/app/sitemap.ts`

Features:

- **Static pages**: Home, About, Career, All Courses, Webinars
- **Dynamic pages**: Automatically fetches all courses and webinars from API
- **Cache**: 1 hour revalidation
- **Priority levels**:
  - Home: 1.0
  - Main pages: 0.8-0.9
  - Course/Webinar details: 0.7

### 9. **Next.js Configuration**

File: `apps/website/next.config.ts`

Image domains allowed:

- `lh3.googleusercontent.com` (Google)
- `*.supabase.co` (Supabase Storage)
- `t4.ftcdn.net` (External CDN)

### 10. **SEO Utility Library**

File: `apps/website/src/lib/seo.ts`

Central SEO configuration with:

- Site constants (URL, name, description)
- `generateMetadata()` function
- OpenGraph configuration
- Twitter Card configuration
- JSON-LD support
- Canonical URLs
- Format detection control

## 📋 SEO Checklist

- ✅ Unique titles for all pages
- ✅ Meta descriptions (max 160 characters)
- ✅ Keywords in Bengali and English
- ✅ OpenGraph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ robots.txt
- ✅ sitemap.xml (dynamic)
- ✅ JSON-LD structured data
- ✅ Image optimization
- ✅ Mobile-friendly (Next.js default)
- ✅ Fast loading (Next.js App Router)
- ✅ HTTPS (production)
- ✅ 404 pages (Next.js default)

## 🚀 Best Practices Implemented

1. **Server-Side Rendering**: All metadata generated server-side
2. **Dynamic Revalidation**: API calls cached for 1 hour
3. **Error Handling**: Fallback metadata on API failures
4. **TypeScript**: Type-safe metadata generation
5. **Bilingual Support**: Bengali and English keywords
6. **Social Media**: Optimized for Facebook, Twitter, LinkedIn
7. **Search Engines**: Structured data for rich snippets

## 📊 Testing

### Manual Testing

1. **Title Tags**: Check browser tab titles
2. **Meta Preview**: Use browser DevTools
3. **Social Media**: Test with:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Automated Testing

- Google Search Console
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)

## 🔧 Configuration Files

| File                                           | Purpose                |
| ---------------------------------------------- | ---------------------- |
| `apps/website/src/lib/seo.ts`                  | SEO utility library    |
| `apps/website/src/app/robots.ts`               | Robots.txt generation  |
| `apps/website/src/app/sitemap.ts`              | Dynamic sitemap        |
| `apps/website/src/app/(frontend)/layout.tsx`   | Root metadata          |
| `apps/website/src/app/(frontend)/*/layout.tsx` | Page-specific metadata |
| `apps/dashboard/src/app/layout.tsx`            | Dashboard metadata     |

## 📝 Notes

- Dashboard is configured with `noindex, nofollow` to prevent search engine indexing
- All dynamic pages have 1-hour cache revalidation
- Meta banner image should be 1200x630 pixels for optimal social sharing
- Google verification code needs to be updated in production

## 🔄 Future Enhancements

- [ ] Add blog section with article metadata
- [ ] Implement i18n for multiple languages
- [ ] Add video structured data for course videos
- [ ] Set up Google Analytics 4
- [ ] Configure Google Tag Manager
- [ ] Add FAQ schema for course pages
- [ ] Implement breadcrumb schema

## 📞 Contact

For SEO-related questions:

- Email: info@skillshikho.com
- Website: https://www.skillshikho.com
