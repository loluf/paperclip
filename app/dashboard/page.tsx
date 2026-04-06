import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const [kbCount, convoCount] = await Promise.all([
    prisma.knowledgeBase.count({ where: { userId } }),
    prisma.conversation.count({ where: { userId } }),
  ]);

  const widgetId = userId;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app";

  const snippet = `<script>
  window.SupportBotConfig = { widgetId: "${widgetId}" };
</script>
<script src="${appUrl}/widget.js" async></script>`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.businessName}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Plan</p>
          <p className="text-2xl font-bold text-indigo-600">{user?.plan}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Knowledge Bases</p>
          <p className="text-2xl font-bold">{kbCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Conversations</p>
          <p className="text-2xl font-bold">{convoCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-2">Your Embed Snippet</h2>
        <p className="text-gray-500 text-sm mb-4">
          Add this code to your website, just before the closing <code>&lt;/body&gt;</code> tag.
        </p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">{snippet}</pre>
        <p className="mt-4 text-sm text-gray-500">
          Your Widget ID: <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-800">{widgetId}</code>
        </p>
      </div>
    </div>
  );
}
