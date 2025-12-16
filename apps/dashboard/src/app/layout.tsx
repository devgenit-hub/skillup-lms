import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '../providers/theme-provider';
import { LocaleProvider } from '../providers/locale-provider';
import { cookies } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SkillUp Admin - Learning Management System',
    template: '%s | SkillUp Admin',
  },
  description:
    'Comprehensive learning management system for students, teachers, and administrators. Manage courses, track progress, and enhance learning experiences.',
  keywords: [
    'learning management system',
    'LMS',
    'online courses',
    'education platform',
    'skill development',
    'e-learning',
  ],
  authors: [{ name: 'SkillUp Team' }],
  creator: 'SkillUp',
  publisher: 'SkillUp',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: 'https://skillup-admin.com',
    title: 'SkillUp Admin - Learning Management System',
    description:
      'Comprehensive learning management system for students, teachers, and administrators.',
    siteName: 'SkillUp Admin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillUp Admin - Learning Management System',
    description:
      'Comprehensive learning management system for students, teachers, and administrators.',
  },
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('skillup-dashboard-locale')?.value;
  const locale = (localeCookie === 'en' || localeCookie === 'bn' ? localeCookie : 'en') as
    | 'en'
    | 'bn';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('skillup-dashboard-theme') || 'dark';
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <LocaleProvider initialLocale={locale}>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
