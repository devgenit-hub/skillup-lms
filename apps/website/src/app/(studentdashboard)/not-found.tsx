import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
        </div>

        <p className="text-lg text-muted-foreground">
          The student dashboard page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg">
            <Link href="/student/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/student/mycourse">My Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
