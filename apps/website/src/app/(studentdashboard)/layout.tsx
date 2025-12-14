import '../(frontend)/globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/providers/locale-provider';
import { AppContextProvider } from '@/context/app-context';
import { cookies } from 'next/headers';
import type { Locale } from '@repo/locales';
import DashboardContent from '@/components/student/DashboardContent';

const userData = {
  imageUrl: '/test_images/avatar1.png',
  name: 'Mr. Meaow',
  email: 'meaow@taking.com',
  phone: '0123......',
};

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
        <AppContextProvider>
          <LocaleProvider initialLocale={locale}>
            <ThemeProvider>
              <DashboardContent userData={userData}>{children}</DashboardContent>
            </ThemeProvider>
          </LocaleProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
