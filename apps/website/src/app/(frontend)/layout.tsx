import type { Metadata } from 'next';
import './globals.css';
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

export const metadata: Metadata = {
  title: 'Skill Up',
  description: 'A Learning Platform, developed By devgenit',
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
