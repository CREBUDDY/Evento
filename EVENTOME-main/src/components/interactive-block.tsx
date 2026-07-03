"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const brutalColors = [
  'bg-brutalRed',
  'bg-brutalYellow',
  'bg-brutalBlue',
  'bg-brutalGreen',
  'bg-brutalPurple',
  'bg-brutalOrange'
];

interface InteractiveBlockProps {
  className?: string;
  initialColorClass?: string;
}

export default function InteractiveBlock({ className, initialColorClass = 'bg-brutalBlue' }: InteractiveBlockProps) {
  const [color, setColor] = useState(initialColorClass);

  const handleMouseEnter = () => {
    // Pick a random color that is not the current one
    const availableColors = brutalColors.filter(c => c !== color);
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setColor(randomColor);
  };

  return (
    <div 
      className={cn("border-2 border-black transition-colors duration-200 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]", color, className)}
      onMouseEnter={handleMouseEnter}
    ></div>
  );
}
