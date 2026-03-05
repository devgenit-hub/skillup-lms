import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '../providers/theme-provider';
import { LocaleProvider } from '../providers/locale-provider';
import AuthProvider from '../providers/auth-provider';
import { AppContextProvider } from '../context/app-context';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Skill শিখো Dashboard - Learning Management System',
    template: '%s | Skill শিখো Dashboard',
  },
  description:
    'Skill শিখো ড্যাশবোর্ড - শিক্ষার্থী, শিক্ষক এবং অ্যাডমিনিস্ট্রেটরদের জন্য সম্পূর্ণ লার্নিং ম্যানেজমেন্ট সিস্টেম। কোর্স পরিচালনা করুন, অগ্রগতি ট্র্যাক করুন এবং শিক্ষার অভিজ্ঞতা বাড়ান।',
  keywords: [
    'learning management system',
    'LMS',
    'online courses',
    'education platform',
    'skill development',
    'e-learning',
    'স্কিল শিখো',
    'অনলাইন কোর্স',
    'শিক্ষা প্ল্যাটফর্ম',
  ],
  authors: [{ name: 'Skill শিখো Team' }],
  creator: 'Skill শিখো',
  publisher: 'Skill শিখো',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: 'https://manage.skillshikho.com',
    title: 'Skill শিখো Dashboard - Learning Management System',
    description:
      'Skill শিখো ড্যাশবোর্ড - শিক্ষার্থী, শিক্ষক এবং অ্যাডমিনিস্ট্রেটরদের জন্য সম্পূর্ণ লার্নিং ম্যানেজমেন্ট সিস্টেম।',
    siteName: 'Skill শিখো Dashboard',
    images: [
      {
        url: 'https://www.skillshikho.com/metaBanner.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skill শিখো Dashboard - Learning Management System',
    description:
      'Skill শিখো ড্যাশবোর্ড - শিক্ষার্থী, শিক্ষক এবং অ্যাডমিনিস্ট্রেটরদের জন্য সম্পূর্ণ লার্নিং ম্যানেজমেন্ট সিস্টেম।',
    images: ['https://www.skillshikho.com/metaBanner.png'],
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
      <body
        className="antialiased min-h-screen bg-background text-foreground"
        suppressHydrationWarning
      >
        <LocaleProvider initialLocale={locale}>
          <ThemeProvider>
            <AuthProvider>
              <AppContextProvider>
                <div className="relative flex min-h-screen flex-col">
                  <div className="flex-1">{children}</div>
                </div>
                <Toaster position="top-right" richColors closeButton />
              </AppContextProvider>
            </AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
