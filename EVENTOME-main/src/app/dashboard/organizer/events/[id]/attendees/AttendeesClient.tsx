"use client";

import { useState } from "react";
import { removeAttendee } from "@/actions/attendee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Trash2, UserX } from "lucide-react";
import Link from "next/link";
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
import { format } from "date-fns";

export default function AttendeesClient({ event, initialAttendees }: { event: any, initialAttendees: any[] }) {
  const [attendees, setAttendees] = useState(initialAttendees);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleRemove = async (attendeeId: string) => {
    const result = await removeAttendee(attendeeId, event.id);
    if (result.success) {
      setAttendees(attendees.filter(a => a.id !== attendeeId));
      toast({
        title: "Attendee Removed",
        description: "The ticket has been cancelled and refunded successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to remove the attendee.",
        variant: "destructive",
      });
    }
  };

  const filteredAttendees = attendees.filter(a => {
    const nameMatch = a.user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = a.user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const codeMatch = a.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch || codeMatch;
  });

  return (
    <div className="container py-8 space-y-8">
      <Button variant="outline" asChild className="mb-8 rounded-none border-4 border-black bg-white text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-brutalYellow transition-all">
          <Link href="/dashboard/organizer">
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={3} />
              Back to Dashboard
          </Link>
      </Button>

      <div className="border-l-8 border-brutalPurple pl-6">
        <h1 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">Manage Attendees</h1>
        <p className="text-black font-bold text-lg mt-2">
          {event.title} • {attendees.length} / {event.capacity} Tickets Sold
        </p>
      </div>

      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black h-5 w-5" strokeWidth={3} />
              <Input 
                  placeholder="Search by name, email or code..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-none border-4 border-black bg-brutalBg font-bold text-black focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-brutalBg">
              <TableRow className="border-b-4 border-black">
                <TableHead className="font-black uppercase text-black">Attendee</TableHead>
                <TableHead className="font-black uppercase text-black">Email</TableHead>
                <TableHead className="font-black uppercase text-black">Ticket Code</TableHead>
                <TableHead className="font-black uppercase text-black">Status</TableHead>
                <TableHead className="font-black uppercase text-black">Joined At</TableHead>
                <TableHead className="text-right font-black uppercase text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id} className="border-b-2 border-black hover:bg-brutalYellow/50 transition-colors">
                  <TableCell className="font-black text-lg">{attendee.user.displayName}</TableCell>
                  <TableCell className="font-bold">{attendee.user.email || 'N/A'}</TableCell>
                  <TableCell>
                      <code className="bg-white border-2 border-black px-2 py-1 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{attendee.verificationCode.substring(0,8)}...</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={attendee.verified ? 'default' : 'secondary'} className={`rounded-none border-2 border-black font-black uppercase text-xs ${attendee.verified ? 'bg-brutalGreen text-black' : 'bg-brutalBg text-black'}`}>
                      {attendee.verified ? 'Checked In' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">{format(new Date(attendee.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="rounded-none border-2 border-black font-black uppercase hover:bg-brutalRed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                          <UserX className="h-4 w-4 mr-2" strokeWidth={3} />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-black uppercase text-2xl">Remove Attendee?</AlertDialogTitle>
                          <AlertDialogDescription className="font-bold text-black border-l-4 border-brutalRed pl-4 bg-brutalBg p-2">
                            This will cancel their ticket and issue a refund. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-none border-4 border-black font-black uppercase hover:bg-brutalBg transition-all">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemove(attendee.id)} className="rounded-none border-4 border-black bg-brutalRed text-black font-black uppercase hover:bg-brutalRed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                            Yes, Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAttendees.length === 0 && (
              <div className="text-center py-12">
                  <p className="text-black font-bold text-lg">No attendees found.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
