
import Link from 'next/link';
import { Menu } from 'lucide-react';
import Logo from './logo';
import { Button } from './ui/button';
import AuthButton from './auth/auth-button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Settings } from 'lucide-react';
import NotificationsBell from './NotificationsBell';

const navLinks = [
  { href: '/explore', label: 'Events' },
  { href: '/creato', label: 'Create Event' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-brutalBg text-black">
      <div className="container flex h-16 items-center justify-between">
        <div className="hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-black font-black uppercase tracking-wider border-2 border-transparent hover:border-black hover:bg-brutalYellow transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center md:hidden gap-2">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-brutalBg border-r-4 border-black text-black">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
              </SheetHeader>
              <Link href="/" className="flex items-center">
                <Logo />
              </Link>
              <div className="my-4 h-px w-full bg-border" />
              <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-black font-black uppercase tracking-wider border-2 border-transparent hover:border-black hover:bg-brutalYellow transition-all"
                >
                  {link.label}
                </Link>
              ))}
              </div>
            </SheetContent>
          </Sheet>
           <Link href="/" className="flex items-center shrink-0">
             <span className="md:hidden"><Logo className="text-2xl" /></span>
          </Link>
        </div>

        <div className="flex items-center shrink-0 gap-4">
          <NotificationsBell />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
