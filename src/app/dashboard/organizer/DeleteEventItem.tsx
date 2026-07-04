'use client';

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/organizer";
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

export default function DeleteEventItem({ eventId }: { eventId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteEvent(eventId);
        setIsDeleting(false);

        if (result.success) {
            toast({ title: "Deleted Successfully", description: "Event has been deleted.", className: "bg-green-600 text-white" });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                    disabled={isDeleting} 
                    onSelect={(e) => e.preventDefault()}
                    className="rounded-none text-red-600 focus:bg-red-100 focus:text-red-700 font-bold cursor-pointer border-t-2 border-black flex items-center justify-between"
                >
                    Delete Event
                    {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white text-black">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-black uppercase text-2xl text-brutalRed">Delete this event?</AlertDialogTitle>
                    <AlertDialogDescription className="font-bold text-gray-700">
                        This action cannot be undone. This will permanently delete this event and all associated attendees from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="rounded-none border-2 border-black bg-brutalRed text-white hover:bg-red-700 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        Yes, delete it
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
