import { config } from 'dotenv';
import { resolve } from 'path';
import { prisma } from './index.js';

// Load environment variables from root .env file
config({ path: resolve(process.cwd(), '../../.env') });

async function main() {
  console.log('🌱 Seeding database...'); // Create test users
  const instructor = await prisma.user.upsert({
    where: { email: 'john.instructor@skillshikho.com' },
    update: {},
    create: {
      supabaseId: 'seed-instructor-supabase-id',
      email: 'john.instructor@skillshikho.com',
      name: 'John Instructor',
      role: 'INSTRUCTOR',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'jane.student@skillshikho.com' },
    update: {},
    create: {
      supabaseId: 'seed-student-supabase-id',
      email: 'jane.student@skillshikho.com',
      name: 'Jane Student',
      role: 'STUDENT',
    },
  }); // Create test courses
  const course1 = await prisma.course.upsert({
    where: { id: 'sample-course-1' },
    update: {},
    create: {
      id: 'sample-course-1',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      published: true,
    },
  });

  await prisma.course.upsert({
    where: { id: 'sample-course-2' },
    update: {},
    create: {
      id: 'sample-course-2',
      title: 'Advanced TypeScript',
      description: 'Master TypeScript with advanced patterns',
      published: true,
    },
  });

  // Create lessons
  await prisma.lesson.createMany({
    data: [
      {
        title: 'HTML Basics',
        content: 'Learn the fundamentals of HTML',
        order: 1,
        courseId: course1.id,
        published: true,
      },
      {
        title: 'CSS Styling',
        content: 'Master CSS for beautiful designs',
        order: 2,
        courseId: course1.id,
        published: true,
      },
      {
        title: 'JavaScript Fundamentals',
        content: 'Get started with JavaScript',
        order: 3,
        courseId: course1.id,
        published: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create enrollment
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course1.id,
      status: 'ACTIVE',
      progress: 33,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`   - Created instructor: ${instructor.email}`);
  console.log(`   - Created student: ${student.email}`);
  console.log(`   - Created ${2} courses`);
  console.log(`   - Created ${3} lessons`);
  console.log(`   - Created ${1} enrollment`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
