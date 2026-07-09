'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { endEvent, cancelEvent } from "@/actions/organizer";
import { useToast } from "@/hooks/use-toast";
import { Loader2, StopCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EventControls({ eventId, status }: { eventId: string, status: string }) {
    const [isEnding, setIsEnding] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    if (status === 'completed' || status === 'cancelled') {
        return null;
    }

    const handleEndEvent = async () => {
        setIsEnding(true);
        const result = await endEvent(eventId);
        setIsEnding(false);
        if (result.success) {
            toast({ title: "Event Ended", description: "The event has been successfully completed. Reports are now available.", className: "bg-green-600 text-white" });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    const handleCancelEvent = async () => {
        setIsCancelling(true);
        const result = await cancelEvent(eventId);
        setIsCancelling(false);
        if (result.success) {
            toast({ title: "Event Cancelled", description: "The event has been cancelled and tickets invalidated." });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-none border-4 border-black bg-white text-black font-black uppercase hover:bg-brutalYellow shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                        <StopCircle className="mr-2 h-4 w-4" /> End Event
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_var(--brutal-shadow)]">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase text-xl">End Event?</DialogTitle>
                        <DialogDescription className="font-bold text-black">
                            This action will mark the event as completed. Reports and analytics will become available, but registrations and check-ins will be locked.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button disabled={isEnding} onClick={handleEndEvent} className="w-full rounded-none border-4 border-black bg-brutalGreen text-black font-black uppercase hover:bg-brutalGreen shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                            {isEnding ? <Loader2 className="animate-spin mr-2" /> : "Confirm & End"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-none border-4 border-black bg-brutalRed text-black font-black uppercase hover:bg-brutalRed shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                        <XCircle className="mr-2 h-4 w-4" /> Cancel Event
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_var(--brutal-shadow)]">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase text-xl">Cancel Event?</DialogTitle>
                        <DialogDescription className="font-bold text-black">
                            This event will be marked as cancelled. Attendees will be notified, and all tickets will become invalid. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button disabled={isCancelling} onClick={handleCancelEvent} className="w-full rounded-none border-4 border-black bg-brutalRed text-black font-black uppercase hover:bg-brutalRed shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                            {isCancelling ? <Loader2 className="animate-spin mr-2" /> : "Confirm Cancellation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
