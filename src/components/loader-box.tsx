"use client";

import { useEffect, useState } from "react";

const brutalColors = [
    "bg-brutalYellow",
    "bg-brutalRed",
    "bg-brutalBlue",
    "bg-brutalGreen",
    "bg-brutalPurple",
    "bg-brutalOrange"
];

export default function LoaderBox() {
    const [color, setColor] = useState("bg-black");

    useEffect(() => {
        // Pick a random color on mount
        const randomColor = brutalColors[Math.floor(Math.random() * brutalColors.length)];
        setColor(randomColor);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
            <div className={`w-24 h-24 ${color} border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] brutal-spin`}></div>
            <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-headline text-3xl font-black uppercase text-black tracking-widest">Loading...</h2>
            </div>
        </div>
    );
}
