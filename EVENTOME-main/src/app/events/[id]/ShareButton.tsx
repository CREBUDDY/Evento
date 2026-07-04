"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
    title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
    const { toast } = useToast();

    const handleShare = async () => {
        // The URL to share is the current page URL
        const url = window.location.href;

        // Try the native Web Share API first (mostly for mobile/supported browsers)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out ${title} on Eventome!`,
                    text: `I found this awesome event: ${title}. Let's go!`,
                    url: url,
                });
                return; // Successfully shared natively, exit
            } catch (error) {
                console.error("Error sharing:", error);
                // If it fails (e.g. user canceled), we can optionally fall through,
                // but usually we just log the error. We will fall through to copy if it's a specific error,
                // but let's just let it be. If they cancel, we don't want to show a toast.
                if ((error as any).name !== 'AbortError') {
                   fallbackCopy(url);
                }
                return;
            }
        }

        // Fallback: Copy to clipboard
        fallbackCopy(url);
    };

    const fallbackCopy = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: "Link Copied! 📋",
                description: "The event link has been copied to your clipboard. Share it anywhere!",
                className: "border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none bg-brutalGreen text-black font-bold",
            });
        }).catch((err) => {
            console.error('Failed to copy: ', err);
            toast({
                title: "Failed to copy",
                description: "There was an error copying the link.",
                variant: "destructive",
            });
        });
    };

    return (
        <Button 
            onClick={handleShare}
            variant="outline" 
            className="w-full rounded-none border-4 border-black bg-brutalBlue text-black font-black uppercase hover:bg-brutalBlue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all h-14 text-lg"
        >
            <Share2 className="mr-3 h-6 w-6" strokeWidth={3}/> Share Event
        </Button>
    );
}
