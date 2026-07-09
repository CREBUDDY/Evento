'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Search, Loader2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { verifyAttendee } from "@/actions/organizer";
import { Event } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";

const Scanner = dynamic(() => import('@yudiel/react-qr-scanner').then(mod => mod.Scanner), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full w-full bg-black text-white font-bold"><Loader2 className="animate-spin mr-2" /> Loading Camera...</div>
});

const brutalColors = ['bg-brutalRed', 'bg-brutalBlue', 'bg-brutalGreen', 'bg-brutalYellow', 'bg-brutalPurple', 'bg-orange-400', 'bg-pink-400'];

export default function VerifyAttendeeForm({ events, organizerId }: { events: Event[], organizerId: string }) {
    const [verificationCode, setVerificationCode] = useState('');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
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
        const result = await verifyAttendee(selectedEventId, verificationCode.trim());
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
        <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--brutal-shadow)] md:shadow-[8px_8px_0px_0px_var(--brutal-shadow)] text-black">
            <CardHeader className="border-b-4 border-black pb-4">
                <CardTitle className="font-black uppercase text-xl">Verify Attendee</CardTitle>
                <CardDescription className="font-bold text-black">Enter the code from the attendee's ticket to check them in.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-4 pt-6 min-w-0">
                <div className="grid w-full md:w-1/3 items-center gap-1.5 min-w-0">
                     <Select value={selectedEventId || ''} onValueChange={(val) => setSelectedEventId(val)}>
                        <SelectTrigger className="flex h-12 w-full items-center justify-between rounded-none border-4 border-black bg-brutalBg px-3 py-2 text-sm font-bold ring-offset-background focus:outline-none focus-visible:shadow-[4px_4px_0px_0px_var(--brutal-shadow)] disabled:cursor-not-allowed disabled:opacity-50 transition-all text-black">
                            <SelectValue placeholder="Select an Event" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_var(--brutal-shadow)] bg-white text-black p-2">
                            {events.map((event, index) => {
                                const colorClass = brutalColors[index % brutalColors.length];
                                return (
                                <SelectItem 
                                    key={event.id} 
                                    value={event.id}
                                    className={`font-black text-base cursor-pointer rounded-none border-2 border-black mb-2 shadow-[2px_2px_0px_0px_var(--brutal-shadow)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all ${colorClass} text-black focus:bg-black focus:text-white`}
                                >
                                    {event.title}
                                </SelectItem>
                            )})}
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative w-full md:flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" strokeWidth={3} />
                    <Input 
                        placeholder="Ticket Code (e.g., A93KD8F1)" 
                        className="pl-10 h-12 rounded-none border-4 border-black bg-brutalBg font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_var(--brutal-shadow)] transition-all pr-12" 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-black hover:bg-brutalYellow rounded-none">
                                <QrCode className="h-5 w-5" strokeWidth={3} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_var(--brutal-shadow)] text-black">
                            <DialogHeader>
                                <DialogTitle className="font-black uppercase text-xl">Scan Ticket QR Code</DialogTitle>
                            </DialogHeader>
                            <div className="aspect-square w-full overflow-hidden border-4 border-black bg-black relative">
                                <Scanner 
                                    onScan={(result) => {
                                        if (result && result.length > 0) {
                                            const code = result[0].rawValue;
                                            setVerificationCode(code);
                                            setIsScannerOpen(false);
                                        }
                                    }} 
                                    components={{
                                        audio: false,
                                        finder: false
                                    }}
                                />
                            </div>
                            <p className="text-sm font-bold text-center mt-2">Point your camera at the QR code on the attendee's ticket.</p>
                        </DialogContent>
                    </Dialog>
                </div>
                <Button onClick={handleVerify} disabled={isLoading} className="w-full md:w-auto h-12 rounded-none border-4 border-black bg-brutalYellow text-black font-black uppercase hover:bg-brutalYellow shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Check className="mr-2" strokeWidth={3} />}
                    Verify
                </Button>
            </CardContent>
        </Card>
    )
}
