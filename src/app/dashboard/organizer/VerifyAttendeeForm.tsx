'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { verifyAttendee } from "@/actions/organizer";
import { Event } from "@prisma/client";

export default function VerifyAttendeeForm({ events, organizerId }: { events: Event[], organizerId: string }) {
    const [verificationCode, setVerificationCode] = useState('');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleVerify = async () => {
        if (!selectedEventId || !verificationCode.trim()) {
            toast({
                title: "Missing Information",
                description: "Please select an event and enter a verification code.",
                variant: "destructive"
            });
            return;
        }
        setIsLoading(true);
        const result = await verifyAttendee(selectedEventId, verificationCode.trim(), organizerId);
        if (result.success) {
            toast({
                title: "Success",
                description: `Attendee ${result.attendeeName} has been verified.`,
                className: "bg-green-600 text-white"
            });
            setVerificationCode(''); // Clear input on success
        } else {
            toast({
                title: "Verification Failed",
                description: result.error,
                variant: "destructive"
            });
        }
        setIsLoading(false);
    };

    return (
        <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <CardHeader className="border-b-4 border-black pb-4">
                <CardTitle className="font-black uppercase text-xl">Verify Attendee</CardTitle>
                <CardDescription className="font-bold text-black">Enter the code from the attendee's ticket to check them in.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-4 pt-6 min-w-0">
                <div className="grid w-full md:w-1/3 items-center gap-1.5 min-w-0">
                     <select
                        value={selectedEventId || ''}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="flex h-12 w-full items-center justify-between rounded-none border-4 border-black bg-brutalBg px-3 py-2 text-sm font-bold ring-offset-background focus:outline-none focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    >
                        <option value="" disabled>Select an Event</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
                <div className="relative w-full md:flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" strokeWidth={3} />
                    <Input 
                        placeholder="Ticket Code (e.g., clxk3...)" 
                        className="pl-10 h-12 rounded-none border-4 border-black bg-brutalBg font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                </div>
                <Button onClick={handleVerify} disabled={isLoading} className="w-full md:w-auto h-12 rounded-none border-4 border-black bg-brutalYellow text-black font-black uppercase hover:bg-brutalYellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Check className="mr-2" strokeWidth={3} />}
                    Verify
                </Button>
            </CardContent>
        </Card>
    )
}
