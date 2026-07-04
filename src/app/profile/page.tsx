
import ClientWrapper from "@/components/ClientWrapper";
import ProfileClient from "./ProfileClient";

export default function ProfilePage() {
  return (
    <ClientWrapper>
      <ProfileClient />
    </ClientWrapper>
  );
}

export const dynamic = "force-dynamic";
