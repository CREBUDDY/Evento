import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
        )}
      >
          <div className="relative flex min-h-screen flex-col overflow-hidden bg-brutalBg text-black">
            
            <Header />
            <main className="flex-1 z-10">{children}</main>
            <div className="border-t-4 border-black w-full" />
            <Footer />
          </div>
          <Toaster />
      </body>
    </html>
  );
}
