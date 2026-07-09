import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 border-l-8 border-brutalBlue pl-6">
        <div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-5xl text-black">
             Settings
          </h1>
          <p className="text-black font-bold text-lg mt-2">Manage your preferences and data.</p>
        </div>
      </div>
      
      <SettingsClient />
    </div>
  );
}
