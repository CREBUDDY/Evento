'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cleanUpTickets } from "@/actions/attendee";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AttendeeCleanupControls() {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleCleanup = async () => {
        setIsDeleting(true);
        const result = await cleanUpTickets();
        setIsDeleting(false);

        if (result.success) {
            toast({ title: "Cleanup Successful", description: `Removed ${result.count} inactive tickets.`, className: "bg-green-600 text-white" });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={isDeleting} variant="outline" className="w-full md:w-auto rounded-none border-2 border-black bg-red-100 text-black font-black uppercase hover:bg-red-200 transition-all flex items-center justify-center gap-2">
                    {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4 text-brutalRed" />} Clean Up Tickets
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white text-black">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-black uppercase text-2xl text-brutalRed">Clean Up Garbage Tickets?</AlertDialogTitle>
                    <AlertDialogDescription className="font-bold text-gray-700">
                        This will permanently delete all your tickets for events that were cancelled, completed, or where your registration was rejected. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCleanup} className="rounded-none border-2 border-black bg-brutalRed text-white hover:bg-red-700 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        Yes, clean up
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
