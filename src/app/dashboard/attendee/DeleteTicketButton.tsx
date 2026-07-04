'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { deleteTicket } from "@/actions/attendee";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteTicketButton({ attendeeId }: { attendeeId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteTicket(attendeeId);
        setIsDeleting(false);
        
        if (result.success) {
            toast({ title: "Ticket Deleted", description: "The ticket has been successfully removed." });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-brutalRed hover:text-white hover:bg-brutalRed rounded-none border-2 border-transparent hover:border-black font-black uppercase text-xs">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
                <DialogHeader>
                    <DialogTitle className="font-black uppercase text-xl text-brutalRed">Delete Ticket?</DialogTitle>
                    <DialogDescription className="font-bold text-black">
                        Are you sure you want to delete this ticket? This action cannot be undone and you will lose access to the event.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex gap-2">
                    <Button disabled={isDeleting} onClick={handleDelete} className="w-full rounded-none border-4 border-black bg-brutalRed text-black font-black uppercase hover:bg-brutalRed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                        {isDeleting ? <Loader2 className="animate-spin mr-2" /> : "Confirm Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
