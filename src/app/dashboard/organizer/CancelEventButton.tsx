'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cancelEvent } from "@/actions/organizer";
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
} from "@/components/ui/alert-dialog"

export default function CancelEventButton({ eventId, organizerId }: { eventId: string, organizerId: string }) {
    const [isCancelling, setIsCancelling] = useState(false);
    const { toast } = useToast();

    const handleCancelEvent = async () => {
        setIsCancelling(true);
        const result = await cancelEvent(eventId, organizerId);
        if (result.success) {
            toast({
                title: "Event Cancelled",
                description: "The event has been successfully cancelled.",
            });
        } else {
            toast({
                title: "Error",
                description: result.error || "Could not cancel the event.",
                variant: "destructive",
            });
        }
        setIsCancelling(false);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="w-full text-left text-red-500 hover:bg-muted p-2 text-sm rounded">Cancel Event</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently cancel your event
                        and remove it from public listings.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleCancelEvent}
                        disabled={isCancelling}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isCancelling ? 'Cancelling...' : 'Yes, Cancel Event'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
