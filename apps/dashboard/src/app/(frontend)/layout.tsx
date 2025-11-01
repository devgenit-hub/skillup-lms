import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../../providers/theme-provider';
import { LocaleProvider } from '../../providers/locale-provider';
import { AppContextProvider } from '../../context/app-context';
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dashboard - Skill Up',
  description: 'Admin dashboard for Skill Up LMS',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('airdreads-theme')?.value || 'light';
  const locale = cookieStore.get('airdreads-locale')?.value || 'en';

  return (
    <html lang={locale} data-theme={theme} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){const t=localStorage.getItem('airdreads-theme');if(t){document.documentElement.setAttribute('data-theme',t);document.cookie='airdreads-theme='+t+';path=/;max-age=31536000'}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppContextProvider>
          <LocaleProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LocaleProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
