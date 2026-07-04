import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ApprovalActions from "./ApprovalActions";

export default async function ApprovalsPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const event = await prisma.event.findUnique({
    where: { id, organizerId: user.id },
    include: {
      attendees: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!event) {
    redirect('/dashboard/organizer');
  }

  const pendingRegistrations = event.attendees.filter(a => a.status === 'pending_registration');
  const otherAttendees = event.attendees.filter(a => a.status !== 'pending_registration');

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" className="mb-4 text-black hover:bg-brutalYellow rounded-none border-2 border-transparent hover:border-black transition-all">
          <Link href={`/dashboard/organizer/events/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {event.title}
          </Link>
        </Button>
        <div className="border-l-8 border-brutalYellow pl-6">
          <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-4xl text-black">Approvals & Verification</h1>
          <p className="text-black font-bold text-lg mt-2">Manage pending registrations and check-ins.</p>
        </div>
      </div>

      <Card className="rounded-none border-4 border-black bg-white shadow-brutal text-black">
        <CardHeader className="border-b-4 border-black pb-4 bg-brutalYellow">
          <CardTitle className="font-black uppercase text-xl">Action Required: Pending Registrations ({pendingRegistrations.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brutalBg">
              <TableRow className="border-b-4 border-black">
                <TableHead className="font-black uppercase text-black">Attendee</TableHead>
                <TableHead className="font-black uppercase text-black">Email</TableHead>
                <TableHead className="font-black uppercase text-black">Current Status</TableHead>
                <TableHead className="text-right font-black uppercase text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center font-bold py-8">No pending registrations.</TableCell>
                </TableRow>
              ) : (
                pendingRegistrations.map((attendee) => (
                  <TableRow key={attendee.id} className="border-b-2 border-black hover:bg-brutalBg transition-colors">
                    <TableCell className="font-bold flex items-center gap-2">
                        <UserCircle className="h-5 w-5" />
                        {attendee.user.displayName}
                    </TableCell>
                    <TableCell>{attendee.user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-none border-2 border-black font-black uppercase bg-brutalYellow text-black">Registration Pending</Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end">
                      <ApprovalActions attendeeId={attendee.id} currentStatus={attendee.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-none border-4 border-black bg-white shadow-brutal text-black">
        <CardHeader className="border-b-4 border-black pb-4">
          <CardTitle className="font-black uppercase text-xl">Approved & Processed</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brutalBg">
              <TableRow className="border-b-4 border-black">
                <TableHead className="font-black uppercase text-black">Attendee</TableHead>
                <TableHead className="font-black uppercase text-black">Status</TableHead>
                <TableHead className="text-right font-black uppercase text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherAttendees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center font-bold py-8">No attendees processed yet.</TableCell>
                </TableRow>
              ) : (
                otherAttendees.map((attendee) => (
                  <TableRow key={attendee.id} className="border-b-2 border-black hover:bg-gray-50 transition-colors">
                    <TableCell className="font-bold">
                        {attendee.user.displayName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-none border-2 border-black font-black uppercase ${
                          attendee.status === 'checked_in' ? 'bg-brutalGreen' :
                          attendee.status === 'absent' ? 'bg-brutalRed' :
                          attendee.status === 'rejected' ? 'bg-black text-white' : 'bg-brutalBlue'
                      }`}>
                        {attendee.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end">
                      <ApprovalActions attendeeId={attendee.id} currentStatus={attendee.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
