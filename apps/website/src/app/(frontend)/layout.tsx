import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import NavBar from '@/components/shared/NavBar/NavBar';
import Footer from '@/components/shared/Footer';
import { LocaleProvider } from '@/providers/locale-provider';
import { AppContextProvider } from '@/context/app-context';
import { AuthProvider } from '@/context/auth-context';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import type { Locale } from '@repo/locales';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, META_BANNER } from '@/lib/seo';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Skillশিখো',
    'স্কিল শিখো',
    'অনলাইন কোর্স',
    'বাংলা কোর্স',
    'অনলাইন লার্নিং',
    'skill development',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: META_BANNER, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [META_BANNER],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('airdreads-locale')?.value;
  const locale = (localeCookie === 'en' || localeCookie === 'bn' ? localeCookie : 'bn') as Locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('skillup-theme') || 'dark';
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`subpixel-antialiased`}>
        <QueryProvider>
          <LocaleProvider initialLocale={locale}>
            <ThemeProvider>
              <AuthProvider>
                <AppContextProvider>
                  <Toaster position="top-right" richColors />
                  <NavBar />
                  <main className="px-4 pb-40 w-full">{children}</main>
                  <Footer />
                </AppContextProvider>
              </AuthProvider>
            </ThemeProvider>
          </LocaleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
