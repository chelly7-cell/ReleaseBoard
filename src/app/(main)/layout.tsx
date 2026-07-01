import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/server-auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
