'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateAttendeeStatus } from "@/actions/organizer";
import { CheckCircle, XCircle, UserMinus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ApprovalActions({ attendeeId, currentStatus }: { attendeeId: string, currentStatus: string }) {
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleUpdate = async (status: string, label: string) => {
        setLoadingAction(status);
        const result = await updateAttendeeStatus(attendeeId, status);
        setLoadingAction(null);
        if (result.success) {
            toast({ title: "Success", description: `Attendee marked as ${label}.` });
            router.refresh();
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };

    if (currentStatus === 'pending_registration') {
        return (
            <div className="flex items-center gap-2">
                <Button disabled={!!loadingAction} onClick={() => handleUpdate('approved', 'Approved')} size="sm" className="rounded-none border-2 border-black bg-brutalGreen text-black font-black uppercase hover:bg-brutalGreen shadow-[2px_2px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    {loadingAction === 'approved' ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle className="h-4 w-4 mr-1" />} Approve
                </Button>
                <Button disabled={!!loadingAction} onClick={() => handleUpdate('rejected', 'Rejected')} size="sm" variant="outline" className="rounded-none border-2 border-black bg-brutalRed text-black font-black uppercase hover:bg-brutalRed shadow-[2px_2px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    {loadingAction === 'rejected' ? <Loader2 className="animate-spin h-4 w-4" /> : <XCircle className="h-4 w-4 mr-1" />} Reject
                </Button>
            </div>
        );
    }

    if (currentStatus === 'approved') {
        return (
            <div className="flex items-center gap-2">
                <Button disabled={!!loadingAction} onClick={() => handleUpdate('checked_in', 'Checked In')} size="sm" className="rounded-none border-2 border-black bg-brutalBlue text-black font-black uppercase hover:bg-brutalBlue shadow-[2px_2px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    {loadingAction === 'checked_in' ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle className="h-4 w-4 mr-1" />} Verify Check-In
                </Button>
                <Button disabled={!!loadingAction} onClick={() => handleUpdate('absent', 'Absent')} size="sm" variant="outline" className="rounded-none border-2 border-black bg-white text-black font-black uppercase hover:bg-gray-100 shadow-[2px_2px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    {loadingAction === 'absent' ? <Loader2 className="animate-spin h-4 w-4" /> : <UserMinus className="h-4 w-4 mr-1" />} Mark Absent
                </Button>
            </div>
        );
    }

    return null;
}
