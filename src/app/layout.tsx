import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { SettingsProvider } from '@/contexts/SettingsContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-headline', display: 'swap' });

export const metadata: Metadata = {
  title: 'Evento - Your next-gen event platform',
  description: 'Create, host, discover, and manage events in real time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
        )}
      >
        <SettingsProvider>
          <div className="relative flex min-h-screen flex-col bg-brutalBg text-black">
            
            <Header />
            <main className="flex-1 z-10">{children}</main>
            <div className="border-t-4 border-black w-full" />
            <Footer />
          </div>
          <Toaster />
        </SettingsProvider>
      </body>
    </html>
  );
}
