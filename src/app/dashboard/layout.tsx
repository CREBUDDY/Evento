
import ClientWrapper from "@/components/ClientWrapper";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientWrapper>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </ClientWrapper>
  );
}

export const dynamic = "force-dynamic";
