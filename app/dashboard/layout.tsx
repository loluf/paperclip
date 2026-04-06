import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="px-6 py-5 border-b">
          <Link href="/dashboard" className="text-indigo-600 font-bold text-lg">
            SupportBot
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            <span>📊</span> Dashboard
          </Link>
          <Link
            href="/dashboard/knowledge-base"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            <span>📚</span> Knowledge Base
          </Link>
          <Link
            href="/dashboard/conversations"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            <span>💬</span> Conversations
          </Link>
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            <span>💳</span> Billing
          </Link>
        </nav>
        <div className="px-3 py-4 border-t">
          <p className="text-xs text-gray-500 px-3 mb-2 truncate">{session.user?.email}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
