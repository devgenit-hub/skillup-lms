import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error'],
});

interface CourseMetadata {
  category?: string;
  [key: string]: unknown;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

async function migrateCategories() {
  try {
    const courses = await prisma.course.findMany({
      select: { id: true, metadata: true },
    });

    const courseCategories = new Set<string>();
    const coursesByCategoryTitle = new Map<string, string[]>();

    for (const course of courses) {
      const metadata = course.metadata as CourseMetadata | null;
      if (metadata && metadata.category) {
        const categoryTitle = metadata.category.trim();
        courseCategories.add(categoryTitle);

        if (!coursesByCategoryTitle.has(categoryTitle)) {
          coursesByCategoryTitle.set(categoryTitle, []);
        }
        coursesByCategoryTitle.get(categoryTitle)!.push(course.id);
      }
    }

    const categoryMap = new Map<string, string>();

    for (const title of Array.from(courseCategories).sort()) {
      const slug = slugify(title);
      const courseCount = coursesByCategoryTitle.get(title)?.length || 0;

      const category = await prisma.category.upsert({
        where: { title },
        create: { title, slug, courseCount, webinarCount: 0 },
        update: { courseCount },
      });

      categoryMap.set(title, category.id);
    }

    for (const [categoryTitle, courseIds] of coursesByCategoryTitle) {
      const categoryId = categoryMap.get(categoryTitle);
      if (categoryId) {
        await prisma.course.updateMany({
          where: { id: { in: courseIds } },
          data: { categoryId },
        });
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateCategories();
