import Link from "next/link";
import { Ticket } from "lucide-react";
import Logo from "./logo";
import InteractiveBlock from "./interactive-block";

export default function Footer() {
  return (
    <footer className="mt-auto border-t-8 border-black bg-brutalYellow relative overflow-hidden">
        {/* Wireframe Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Floating Colored Blocks */}
        <InteractiveBlock initialColorClass="bg-brutalGreen" className="absolute top-[20%] left-[10%] w-[40px] h-[40px] z-0 hidden md:block" />
        <InteractiveBlock initialColorClass="bg-brutalPurple" className="absolute bottom-[30%] left-[25%] w-[40px] h-[40px] z-0 hidden md:block" />
        <InteractiveBlock initialColorClass="bg-brutalOrange" className="absolute top-[40%] right-[15%] w-[40px] h-[40px] z-0 hidden md:block" />
        <InteractiveBlock initialColorClass="bg-brutalYellow" className="absolute bottom-[20%] right-[30%] w-[40px] h-[40px] z-0 hidden md:block" />

      <div className="container relative z-10 flex flex-col lg:flex-row flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between gap-8 py-16 md:py-24">
        <div className="flex flex-col items-center gap-4 w-full md:w-auto px-4 md:flex-row md:gap-6 md:px-0">
          <Link href="/" className="shrink-0 flex items-center justify-center space-x-2 bg-white p-3 md:p-4 border-4 border-black shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all w-full md:w-auto">
            <Logo className="text-3xl md:text-4xl" />
          </Link>
          <p className="shrink-0 text-center text-base md:text-lg font-bold text-black border-4 border-black bg-white p-3 md:p-4 shadow-brutal md:text-left w-full md:max-w-sm">
            Built for creating Unforgettable memories.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-4 text-black font-black uppercase">
            <Link href="/terms" className="bg-white border-4 border-black px-6 py-3 shadow-brutal hover:bg-brutalYellow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all w-full sm:w-auto text-center">Terms</Link>
            <Link href="/privacy" className="bg-white border-4 border-black px-6 py-3 shadow-brutal hover:bg-brutalYellow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all w-full sm:w-auto text-center">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
