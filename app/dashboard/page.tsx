import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { hasAccess, type Tier } from "@/lib/tiers";
import { formatVnd } from "@/lib/pricing";
import DashboardNav from "@/components/DashboardNav";

const TIER_LABELS: Record<Tier, string> = {
  free: "Free member",
  mvp2: "Đã mua bộ công cụ (MVP2)",
  mvp3: "Lộ trình Full-stack Marketer (MVP3)",
  mvp4: "VIP",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.mustChangePassword) redirect("/change-password");

  const db = supabaseAdmin();
  const [{ data: items }, { data: pendingOrders }] = await Promise.all([
    db
      .from("content_items")
      .select("id, slug, title, content_type, required_tier, sort_order")
      .order("sort_order", { ascending: true }),
    db
      .from("orders")
      .select("order_code, product, amount, status, created_at")
      .eq("member_id", member.id)
      .eq("status", "pending_payment")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav fullName={member.fullName} tierLabel={TIER_LABELS[member.tier]} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1">Xin chào, {member.fullName}</h1>
        <p className="text-sm text-slate-500 mb-8">
          Hạng hiện tại:{" "}
          <span className="font-semibold text-slate-800">{TIER_LABELS[member.tier]}</span>
        </p>

        {pendingOrders && pendingOrders.length > 0 ? (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 mb-8">
            <div className="text-xs font-bold uppercase text-amber-700 mb-2">
              Đơn hàng đang chờ xác nhận
            </div>
            {pendingOrders.map((o) => (
              <div key={o.order_code} className="text-sm text-slate-700">
                {o.order_code} — {o.product.toUpperCase()} — {formatVnd(o.amount)} — đang chờ
                admin xác nhận thanh toán
              </div>
            ))}
          </div>
        ) : null}

        <div className="space-y-4">
          {(items ?? []).map((item) => {
            const unlocked = hasAccess(member.tier, item.required_tier as Tier);
            return (
              <div
                key={item.id}
                className={`rounded-xl border p-5 ${
                  unlocked ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold">{item.title}</h3>
                  {!unlocked ? (
                    <span className="shrink-0 text-xs bg-slate-900 text-white px-2 py-1 rounded-full">
                      Khoá — cần {item.required_tier.toUpperCase()}
                    </span>
                  ) : null}
                </div>
                {unlocked ? (
                  <Link
                    href={`/dashboard/content/${item.slug}`}
                    className="text-sm text-amber-600 font-semibold mt-2 inline-block"
                  >
                    Xem nội dung →
                  </Link>
                ) : (
                  <Link href="/upgrade" className="text-sm text-slate-500 mt-2 inline-block">
                    Nâng cấp để mở khoá →
                  </Link>
                )}
              </div>
            );
          })}
          {(items ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có nội dung nào được thêm vào hệ thống.</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
