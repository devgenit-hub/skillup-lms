import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/providers/locale-provider';
import { AppContextProvider } from '@/context/app-context';
import { AuthProvider } from '@/context/auth-context';
import { cookies } from 'next/headers';
import type { Locale } from '@repo/locales';
import DashboardContent from '@/components/student/DashboardContent';
import { Toaster } from 'sonner';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('airdreads-locale')?.value;
  const locale = (localeCookie === 'en' || localeCookie === 'bn' ? localeCookie : 'en') as Locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="subpixel-antialiased">
        <AuthProvider>
          <AppContextProvider>
            <LocaleProvider initialLocale={locale}>
              <ThemeProvider>
                <DashboardContent>{children}</DashboardContent>
                <Toaster position="top-right" richColors />
              </ThemeProvider>
            </LocaleProvider>
          </AppContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
