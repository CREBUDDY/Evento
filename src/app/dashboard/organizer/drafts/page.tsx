
'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FilePenLine } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "@/firebase";
import { Event } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function DraftsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const draftsQuery = useMemoFirebase(() => 
    (firestore && user) ? query(collection(firestore, 'creato'), where("organizerId", "==", user.uid), where("status", "==", "draft")) : null
  , [firestore, user]);
  
  const { data: draftEvents, isLoading } = useCollection<Event>(draftsQuery);


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-8 border-brutalPurple pl-6">
        <div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-4xl flex items-center gap-2 text-black"><FilePenLine strokeWidth={3}/> Drafts</h1>
          <p className="text-black font-bold text-lg mt-2">Events you have saved but not published yet.</p>
        </div>
      </div>

      <Card className="rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_var(--brutal-shadow)] text-black">
        <CardHeader className="border-b-4 border-black pb-4">
          <CardTitle className="font-black uppercase text-2xl">My Draft Events</CardTitle>
          <CardDescription className="font-bold text-black">A list of your saved event drafts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brutalBg">
              <TableRow className="border-b-4 border-black">
                <TableHead className="font-black uppercase text-black">Event</TableHead>
                <TableHead className="font-black uppercase text-black">Category</TableHead>
                <TableHead className="hidden md:table-cell font-black uppercase text-black">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftEvents && draftEvents.map((event) => (
                <TableRow key={event.id} className="border-b-2 border-black hover:bg-brutalYellow transition-colors">
                  <TableCell className="font-black text-lg">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-none border-2 border-black font-black uppercase text-xs">{event.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-bold">{format(new Date(event.dateTime), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="outline" className="rounded-none border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                          <MoreHorizontal className="h-5 w-5" strokeWidth={3} />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_var(--brutal-shadow)] p-0">
                        <DropdownMenuLabel className="font-black uppercase bg-brutalBg border-b-2 border-black text-black">Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-none focus:bg-brutalYellow font-bold cursor-pointer">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-none focus:bg-brutalYellow font-bold cursor-pointer">Publish</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-none focus:bg-brutalRed font-bold cursor-pointer text-black">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {!isLoading && draftEvents?.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-black font-bold text-lg">You have no saved drafts.</p>
                    <Button asChild variant="outline" className="mt-4 rounded-none border-4 border-black bg-brutalBlue text-black font-black uppercase hover:bg-brutalBlue shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                        <Link href="/creato">Create a new event</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
