import type { Metadata } from 'next';
import './globals.css';
import { APP } from '@/lib/constants';
import Header from '@/components/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { FilterProvider } from '@/components/Context/FilterContext';
import { Toaster } from '@/components/ui/sonner';
import { CSPostHogProvider } from '@/components/posthog-provider';
import { Montserrat } from 'next/font/google';

const geistSans = Montserrat({
  variable: '--font-sans',
  weight: '400',
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: APP.NAME,
  description: APP.DESCRIPTION,

  icons: {
    icon: [
      { url: 'public/icons/icon.png' },
      { url: 'public/icons/favicon-16x16.png', sizes: '16x16' },
      { url: 'public/icons/favicon-32x32.png', sizes: '32x32' },
    ],
  },
  metadataBase: new URL(APP.URL),
  openGraph: {
    title: APP.NAME + ' - Luminarie Who Changed The World',
    description: APP.DESCRIPTION,
    images: [
      {
        url: `${APP.URL}/LinkPreview(1).png`,
        width: 1200,
        height: 630,
        alt: 'GreatMinds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: APP.URL + ' - Luminarie Who Changed The World',
    creator: APP.URL,
    title: APP.NAME,
    description: APP.DESCRIPTION,
    images: [
      {
        url: 'public/Images/LinkPreview(1).png',
        width: 1200,
        height: 630,
        alt: 'GreatMinds',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        {/* <script
          src='https://unpkg.com/react-scan/dist/auto.global.js'
          async
        ></script> */}
      </head>
      <CSPostHogProvider>
        <body className={`${geistSans.variable} font-sans antialiased`}>
          <div className='flex h-full w-full justify-center'>
            <SidebarProvider defaultOpen={false}>
              <FilterProvider>
                <Header />
                <AppSidebar />
                <div className='w-full'>{children}</div>
                <Toaster />
              </FilterProvider>
            </SidebarProvider>
          </div>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
