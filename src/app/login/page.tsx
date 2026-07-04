
import ClientWrapper from "@/components/ClientWrapper";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <ClientWrapper>
      <LoginClient />
    </ClientWrapper>
  );
}

export const dynamic = "force-dynamic";
