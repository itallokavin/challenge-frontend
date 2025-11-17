import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'HealthFlow - Login'
}


export default async function DashboardLayout({children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
