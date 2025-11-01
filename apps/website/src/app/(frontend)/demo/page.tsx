'use client';

import { ThemeToggle } from '../../../components/utils/theme-toggle';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Theme Demo</h1>
          <ThemeToggle />
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Theme Toggle</h2>
          <p className="text-muted-foreground">
            Click the toggle button above to switch between light and dark themes. Your preference
            is automatically saved.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="w-full h-16 bg-background rounded mb-2"></div>
              <p className="text-sm font-mono">background</p>
            </div>
            <div className="bg-foreground border border-border rounded-lg p-4">
              <div className="w-full h-16 bg-foreground rounded mb-2"></div>
              <p className="text-sm font-mono text-background">foreground</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="w-full h-16 bg-card rounded mb-2"></div>
              <p className="text-sm font-mono">card</p>
            </div>
            <div className="bg-muted border border-border rounded-lg p-4">
              <div className="w-full h-16 bg-muted rounded mb-2"></div>
              <p className="text-sm font-mono">muted</p>
            </div>
            <div className="bg-primary border border-border rounded-lg p-4">
              <div className="w-full h-16 bg-primary rounded mb-2"></div>
              <p className="text-sm font-mono text-primary-foreground">primary</p>
            </div>
            <div className="bg-secondary border border-border rounded-lg p-4">
              <div className="w-full h-16 bg-secondary rounded mb-2"></div>
              <p className="text-sm font-mono">secondary</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Component Examples</h2>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Secondary Button
              </button>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                Outline Button
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Card Example</h3>
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold mb-2">Card Title</h4>
              <p className="text-muted-foreground">
                This is a card with muted background. The theme toggle button in the top right
                corner allows you to switch between dark and light themes seamlessly.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Form Elements</h3>
            <input
              type="text"
              placeholder="Type something..."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Enter a message..."
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">How to Use</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Click the theme toggle button in the top right to switch themes</li>
            <li>Your preference is saved to localStorage as 'airdreads-theme'</li>
            <li>The theme persists across page refreshes</li>
            <li>If no preference is saved, it defaults to your system preference</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
