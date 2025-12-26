import { Request, Response } from 'express';
import { prisma } from '@repo/db';
import { z } from 'zod';

const createCategorySchema = z.object({
  title: z.string().min(1, 'Category title is required'),
});

export class CategoryController {
  static async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await prisma.category.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          courseCount: true,
          webinarCount: true,
        },
        orderBy: {
          title: 'asc',
        },
      });

      res.json({
        status: 'success',
        data: categories,
      });
    } catch {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch categories',
      });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const data = createCategorySchema.parse(req.body);

      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existingCategory = await prisma.category.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          courseCount: true,
          webinarCount: true,
        },
      });

      if (existingCategory) {
        res.status(200).json({
          status: 'success',
          data: existingCategory,
        });
        return;
      }

      const category = await prisma.category.create({
        data: {
          title: data.title,
          slug,
          courseCount: 0,
          webinarCount: 0,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          courseCount: true,
          webinarCount: true,
        },
      });

      res.status(201).json({
        status: 'success',
        data: category,
      });
    } catch {
      res.status(500).json({
        status: 'error',
        message: 'Failed to create category',
      });
    }
  }
}
