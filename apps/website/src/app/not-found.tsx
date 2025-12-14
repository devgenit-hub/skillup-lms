import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <html>
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center space-y-6 max-w-2xl">
            <div className="space-y-2">
              <h1 className="text-8xl font-bold text-primary">404</h1>
              <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
            </div>

            <p className="text-lg text-muted-foreground">
              Oops! The page you are looking for doesn&apos;t exist or has been moved.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/allcourse">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
