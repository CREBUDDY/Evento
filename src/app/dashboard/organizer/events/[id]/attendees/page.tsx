import { getEventAttendees } from "@/actions/attendee";
import { getEventById } from "@/actions/events";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AttendeesClient from "./AttendeesClient";

export const dynamic = 'force-dynamic';

export default async function EventAttendeesPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/organizer/events/' + id + '/attendees');
  }

  const event = await getEventById(id);

  if (!event || event.organizerId !== user.id) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-brutalBg">
            <h1 className="text-4xl font-black uppercase border-4 border-black bg-brutalRed p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">Unauthorized</h1>
            <p className="mt-4 font-bold bg-white border-2 border-black p-2">You can only view attendees for events you organize.</p>
        </div>
    );
  }

  const attendees = await getEventAttendees(id, user.id);

  return (
    <AttendeesClient event={event as any} initialAttendees={attendees as any} />
  );
}
