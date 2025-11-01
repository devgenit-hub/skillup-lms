import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">📊 Dashboard</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Skill Up Admin Dashboard</p>
          </div>

          {/* Shared UI Components Demo */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              title="Analytics"
              href="https://nextjs.org"
            >
              View your course analytics and student progress
            </Card>

            <Card
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              title="Courses"
              href="https://nextjs.org"
            >
              Manage your courses and content
            </Card>

            <Card
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              title="Students"
              href="https://nextjs.org"
            >
              Monitor student enrollment and activity
            </Card>

            <Card
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              title="Settings"
              href="https://nextjs.org"
            >
              Configure your dashboard preferences
            </Card>
          </div>

          {/* Button Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Shared UI Component
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This button is from{' '}
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">@repo/ui</code>{' '}
              package
            </p>
            <Button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              appName="Dashboard"
            >
              Click Me! 🚀
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
