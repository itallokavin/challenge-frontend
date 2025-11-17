import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'HealthFlow - Dashboard'
}

export default async function DashboardLayout({children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {children}
    </div>
  );
}
