"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push(redirectUrl);
      }
    };
    checkUser();
  }, [supabase.auth, router, redirectUrl]);

  useEffect(() => {
      if(searchParams.get('redirect')) {
          toast({
              title: "Authentication Required",
              description: "Please sign in to access this page.",
              variant: "destructive"
          })
      }
  }, [searchParams, toast])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      let error;
      if (isSignUp) {
        const res = await supabase.auth.signUp({
          email,
          password,
        });
        error = res.error;
      } else {
        const res = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = res.error;
      }

      if (error) throw error;

      if (isSignUp) {
         toast({
            title: "Success!",
            description: "Account created successfully.",
        });
      }
      
      router.push(redirectUrl);
      router.refresh();
    } catch (error: any) {
        console.error("Auth error", error);
        toast({
          title: "Authentication Error",
          description: error.message || "An error occurred. Please try again.",
          variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 relative overflow-hidden bg-brutalBg">
      {/* Wireframe Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      <div className="w-full max-w-md space-y-8 text-center relative z-10">
        <div className="flex justify-center items-center space-x-2 bg-white border-4 border-black p-4 shadow-brutal w-max mx-auto mb-8">
            <Logo className="text-4xl" />
        </div>
        
        <div className="rounded-none border-4 border-black bg-white p-8 shadow-brutal text-black">
          <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-black">
            {isSignUp ? "Create Account" : "Sign In"}
          </h1>
          <p className="mb-8 font-bold border-l-4 border-black pl-4 text-left">
            Join and host events, manage your tickets, and connect with the community.
          </p>

          <form onSubmit={handleAuth} className="space-y-6 text-left">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-black uppercase">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-black uppercase">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none border-4 border-black h-14 bg-brutalBg focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-black uppercase rounded-none border-4 border-black bg-brutalGreen hover:bg-brutalGreen text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-sm font-bold uppercase">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <button 
                  onClick={() => setIsSignUp(false)}
                  className="text-brutalBlue hover:bg-brutalBlue hover:text-white px-2 py-1 transition-colors border-2 border-transparent hover:border-black"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button 
                  onClick={() => setIsSignUp(true)}
                  className="text-brutalBlue hover:bg-brutalBlue hover:text-white px-2 py-1 transition-colors border-2 border-transparent hover:border-black"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>

           <p className="mt-8 text-xs font-bold uppercase border-t-4 border-black pt-4 text-left">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="hover:bg-brutalYellow px-1 transition-colors border-b-2 border-black">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:bg-brutalYellow px-1 transition-colors border-b-2 border-black">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
