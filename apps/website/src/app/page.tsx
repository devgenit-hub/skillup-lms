import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Code } from '@repo/ui/code';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">🎓 Skill Up</h1>
            <p className="text-2xl text-gray-700 dark:text-gray-200 mb-2">
              Your Learning Management Platform
            </p>
            <Code className="inline-block px-4 py-2 bg-gray-800 text-green-400 rounded-lg text-sm">
              Powered by Turbo Monorepo
            </Code>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              title="Courses"
              href="https://nextjs.org"
            >
              Browse and enroll in courses
            </Card>

            <Card
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              title="Learning Paths"
              href="https://nextjs.org"
            >
              Follow structured learning journeys
            </Card>

            <Card
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              title="Certifications"
              href="https://nextjs.org"
            >
              Earn certificates upon completion
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning with our platform. This page uses shared
              components from{' '}
              <Code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">@repo/ui</Code>
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl text-lg"
                appName="Website"
              >
                Get Started 🚀
              </Button>
              <Button
                className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg text-lg"
                appName="Website"
              >
                Learn More 📚
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Running on <span className="font-semibold">localhost:3000</span> • Dashboard on{' '}
              <span className="font-semibold">localhost:3001</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
