
import ClientWrapper from "@/components/ClientWrapper";
import LoginClient from "./LoginClient";

function LoginSkeleton() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 bg-brutalBg">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="rounded-none border-4 border-black bg-white p-8 shadow-brutal text-black">
                    <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-black">
                        Loading...
                    </h1>
                    <p className="mb-8 font-bold border-l-4 border-black pl-4 text-left">
                        Please wait while we prepare the login page.
                    </p>
                </div>
            </div>
        </div>
    );
}


export default function LoginPage() {
  return (
    <ClientWrapper fallback={<LoginSkeleton />}>
      <LoginClient />
    </ClientWrapper>
  );
}

export const dynamic = "force-dynamic";
