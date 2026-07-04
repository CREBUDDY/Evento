
import ClientWrapper from "@/components/ClientWrapper";
import CreateClient from "./CreateClient";

export default function CreatePage() {
  return (
    <ClientWrapper>
      <CreateClient />
    </ClientWrapper>
  );
}

export const dynamic = "force-dynamic";
