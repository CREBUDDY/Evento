'use client';

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CopyCodeButton({ code }: { code: string }) {
    const { toast } = useToast();

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(code);
        toast({ title: "Copied!", description: "Verification code copied to clipboard." });
    };

    return (
        <Button variant="outline" size="icon" onClick={handleCopyToClipboard} className="rounded-none border-2 border-black bg-white hover:bg-brutalYellow text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <Copy className="h-4 w-4" strokeWidth={3}/>
        </Button>
    );
}
