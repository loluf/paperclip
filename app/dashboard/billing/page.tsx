import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/stripe";
import { BillingButtons } from "@/components/BillingButtons";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const sp = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing</h1>
      <p className="text-gray-500 mb-8">Manage your subscription.</p>

      {sp.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
          Subscription activated! Your plan is now live.
        </div>
      )}
      {sp.canceled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-yellow-800">
          Checkout canceled. No changes were made.
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-1">Current Plan</h2>
        <p className="text-3xl font-bold text-indigo-600 mb-1">{user?.plan}</p>
        {user?.stripeCurrentPeriodEnd && (
          <p className="text-sm text-gray-500">
            Renews {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString()}
          </p>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">Upgrade Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div key={key} className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
            <p className="text-2xl font-bold text-indigo-600 mb-4">
              ${plan.price / 100}<span className="text-sm text-gray-500 font-normal">/mo</span>
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-6">
              {plan.features.map(f => <li key={f}>✓ {f}</li>)}
            </ul>
            <BillingButtons plan={key} currentPlan={user?.plan || "FREE"} />
          </div>
        ))}
      </div>
    </div>
  );
}
