import { User } from '@repo/db';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      teacher?: { id: string };
      courseId?: string;
    }
  }
}

export {};
