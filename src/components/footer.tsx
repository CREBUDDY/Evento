"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import InteractiveBlock from "./interactive-block";

export default function Footer() {
  const letters = "EVENTO".split("");

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className="mt-auto border-t-8 border-black bg-brutalBg relative overflow-hidden flex flex-col pt-16 md:pt-24"
    >
      {/* Wireframe Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Floating Colored Blocks */}
      <InteractiveBlock initialColorClass="bg-brutalGreen" className="absolute top-[10%] left-[10%] w-[40px] h-[40px] z-0 hidden md:block" />
      <InteractiveBlock initialColorClass="bg-brutalPurple" className="absolute top-[20%] left-[35%] w-[40px] h-[40px] z-0 hidden md:block" />
      <InteractiveBlock initialColorClass="bg-brutalOrange" className="absolute top-[40%] right-[15%] w-[40px] h-[40px] z-0 hidden md:block" />
      <InteractiveBlock initialColorClass="bg-brutalBlue" className="absolute top-[25%] right-[30%] w-[40px] h-[40px] z-0 hidden md:block" />

      <div className="container relative z-10 flex flex-col items-center justify-between gap-8 md:gap-12 mb-12 md:mb-24">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 md:gap-8">
            <p className="text-center md:text-left text-base md:text-xl font-bold text-black bg-white border-4 border-black p-3 md:p-6 shadow-[4px_4px_0px_0px_var(--brutal-shadow)] max-w-[280px] md:max-w-sm">
                Built for creating Unforgettable memories.
            </p>
            <div className="flex flex-row w-full md:w-auto items-center justify-center gap-3 md:gap-4 text-black font-black uppercase">
                <Link href="/terms" className="bg-white border-4 border-black px-4 py-2 md:px-8 md:py-4 shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:bg-brutalYellow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex-1 md:flex-none text-center text-sm md:text-lg">Terms</Link>
                <Link href="/privacy" className="bg-white border-4 border-black px-4 py-2 md:px-8 md:py-4 shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:bg-brutalYellow hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex-1 md:flex-none text-center text-sm md:text-lg">Privacy</Link>
            </div>
        </div>
      </div>

      <div className="relative w-full flex flex-col justify-end px-4 md:px-8 overflow-hidden pointer-events-auto">
        
        {/* Bold Copyright Mark Above Heading */}
        <div className="flex justify-center w-full mb-4 md:mb-8 relative z-10">
          <span className="font-black text-lg md:text-4xl text-black bg-white border-4 border-black px-4 py-2 md:px-6 md:py-2 shadow-[4px_4px_0px_0px_var(--brutal-shadow)] uppercase tracking-tight">
            &copy; {new Date().getFullYear()} EVENTO
          </span>
        </div>

        {/* Giant EVENTO text */}
        <div className="flex relative items-start justify-center w-full cursor-default select-none pb-4 md:pb-8">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className="text-[16vw] md:text-[18vw] lg:text-[20vw] font-black uppercase leading-[0.75] tracking-tighter text-black inline-block cursor-pointer"
                whileHover={{ 
                    y: -40, 
                    rotate: index % 2 === 0 ? 6 : -6, 
                    color: '#FFC800',
                    textShadow: '8px 8px 0px var(--brutal-shadow)'
                }}
                whileTap={{ 
                    y: -40, 
                    rotate: index % 2 === 0 ? 6 : -6, 
                    color: '#FFC800',
                    textShadow: '8px 8px 0px var(--brutal-shadow)'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {letter}
              </motion.span>
            ))}
        </div>

        {/* Testing Mode explicitly at the bottom */}
        <div className="w-full border-t-4 border-black py-4 mt-4 md:mt-8 flex justify-center bg-brutalYellow">
            <span className="font-black uppercase text-sm md:text-base tracking-widest text-black bg-brutalRed border-2 border-black px-4 py-1 shadow-[2px_2px_0px_0px_var(--brutal-shadow)]">
              Currently in testing mode
            </span>
        </div>
      </div>
    </motion.footer>
  );
}
