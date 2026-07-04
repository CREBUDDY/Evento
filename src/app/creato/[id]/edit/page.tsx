import { getEventById } from "@/actions/events";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditClient from "./EditClient";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/creato/' + id + '/edit');
  }

  const event = await getEventById(id);

  if (!event) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-brutalBg">
            <h1 className="text-4xl font-black uppercase border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Event not found</h1>
        </div>
    );
  }

  if (event.organizerId !== user.id) {
     return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-brutalBg">
            <h1 className="text-4xl font-black uppercase border-4 border-black bg-brutalRed p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">Unauthorized</h1>
            <p className="mt-4 font-bold bg-white border-2 border-black p-2">You can only edit events that you have created.</p>
        </div>
    );
  }

  return (
      <EditClient initialEvent={event as any} />
  );
}
