'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { bulkDeleteTickets } from "@/actions/organizer";

export default function TicketCleanupCard({ eventId, status, ticketCount }: { eventId: string, status: string, ticketCount: number }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    if (status !== 'completed' && status !== 'cancelled') {
        return null;
    }

    if (ticketCount === 0) {
        return null;
    }

    const handleCleanup = async () => {
        setIsDeleting(true);
        const result = await bulkDeleteTickets(eventId);
        setIsDeleting(false);

        if (result.success) {
            toast({ title: "Cleanup Successful", description: `Deleted ${result.count} tickets.`, className: "bg-green-600 text-white" });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    return (
        <Card className="rounded-none border-4 border-black bg-white shadow-brutal text-black mt-8">
            <CardHeader className="border-b-4 border-black bg-red-100 text-black flex flex-row items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-brutalRed" strokeWidth={3} />
                <div>
                    <CardTitle className="font-black uppercase text-xl text-brutalRed">Data Cleanup</CardTitle>
                    <CardDescription className="text-gray-800 font-bold">This event is {status}. You can delete all attendee tickets to save database space.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <p className="font-bold text-black">Total Tickets (Active & Pending): <span className="font-black">{ticketCount}</span></p>
                    <p className="text-sm text-gray-600 mt-1">Warning: Deleting tickets will remove them from attendee dashboards.</p>
                </div>
                <Button disabled={isDeleting} onClick={handleCleanup} variant="destructive" className="rounded-none border-4 border-black bg-black text-white font-black uppercase hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(255,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all h-12 px-8">
                    {isDeleting ? <Loader2 className="animate-spin mr-2" /> : <Trash2 className="mr-2 h-5 w-5" />} Delete All Tickets
                </Button>
            </CardContent>
        </Card>
    );
}
