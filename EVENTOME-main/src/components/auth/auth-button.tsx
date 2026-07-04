"use client";

import Link from "next/link";
import { LogOut, LayoutDashboard, Ticket, User, ArrowRight, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (mounted) {
        setUser(user);
        setIsLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (isLoading) {
    return <Button variant="ghost" disabled>Loading...</Button>;
  }

  if (!user) {
    return (
        <Link 
            href="/login"
            className="relative group flex items-center gap-2 px-6 py-2 rounded-none border-4 border-black text-black font-black uppercase tracking-wider bg-brutalGreen shadow-brutal transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
        >
            <span className="relative z-10 flex items-center gap-2">
                Sign In
                <div className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-5 h-5 text-black group-hover:hidden transition-all" />
                    <Shield className="w-5 h-5 text-black hidden group-hover:inline-block transition-all" />
                </div>
            </span>
        </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-none border-2 border-black bg-brutalBlue hover:bg-brutalBlue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all p-0">
          <Avatar className="h-full w-full rounded-none">
            <AvatarFallback className="bg-transparent text-black font-black rounded-none">{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black uppercase text-black leading-none">User</p>
            <p className="text-xs leading-none text-black font-bold">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-black h-1 my-2" />
        <DropdownMenuItem asChild className="font-black uppercase text-black hover:bg-brutalYellow focus:bg-brutalYellow rounded-none cursor-pointer p-3 border-2 border-transparent focus:border-black transition-all">
          <Link href="/profile">
            <User className="mr-2 h-5 w-5" strokeWidth={3} />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="font-black uppercase text-black hover:bg-brutalBlue focus:bg-brutalBlue rounded-none cursor-pointer p-3 border-2 border-transparent focus:border-black transition-all mt-1">
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-5 w-5" strokeWidth={3} />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="font-black uppercase text-black hover:bg-brutalGreen focus:bg-brutalGreen rounded-none cursor-pointer p-3 border-2 border-transparent focus:border-black transition-all mt-1">
          <Link href="/dashboard/attendee">
            <Ticket className="mr-2 h-5 w-5" strokeWidth={3} />
            <span>My Tickets</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-black h-1 my-2" />
        <DropdownMenuItem onClick={handleSignOut} className="font-black uppercase text-black hover:bg-brutalRed focus:bg-brutalRed rounded-none cursor-pointer p-3 border-2 border-transparent focus:border-black transition-all">
          <LogOut className="mr-2 h-5 w-5" strokeWidth={3} />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
