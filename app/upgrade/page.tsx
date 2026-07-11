import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/session";
import { getPaidMvp3Count } from "@/lib/mvp3-count";
import { PRODUCT_INFO, getMvp3Price, formatVnd } from "@/lib/pricing";
import { TIERS, type Tier } from "@/lib/tiers";

export const dynamic = "force-dynamic";

const UPGRADE_PRODUCTS: { tier: Tier; product: "mvp2" | "mvp3" | "mvp4" }[] = [
  { tier: "mvp2", product: "mvp2" },
  { tier: "mvp3", product: "mvp3" },
  { tier: "mvp4", product: "mvp4" },
];

export default async function UpgradePage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.mustChangePassword) redirect("/change-password");

  const paidCount = await getPaidMvp3Count();
  const currentIndex = TIERS.indexOf(member.tier);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-sm text-slate-500 mb-6 inline-block">
          ← Tổng quan
        </Link>
        <h1 className="text-xl font-bold mb-1">Nâng cấp gói</h1>
        <p className="text-sm text-slate-500 mb-8">
          Hạng hiện tại: <span className="font-semibold text-slate-800">{member.tier.toUpperCase()}</span>
        </p>

        <div className="space-y-4">
          {UPGRADE_PRODUCTS.map(({ tier, product }) => {
            const tierIndex = TIERS.indexOf(tier);
            const alreadyOwned = tierIndex <= currentIndex;
            const price = product === "mvp3" ? getMvp3Price(paidCount) : PRODUCT_INFO[product].defaultPrice;

            return (
              <div
                key={tier}
                className="rounded-xl border border-slate-200 bg-white p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold">{PRODUCT_INFO[product].name}</h3>
                  <p className="text-sm text-slate-500">{formatVnd(price)}</p>
                </div>
                {alreadyOwned ? (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold shrink-0">
                    Đã sở hữu
                  </span>
                ) : (
                  <Link
                    href={`/checkout?product=${product}`}
                    className="shrink-0 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    Nâng cấp
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
