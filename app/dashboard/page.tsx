import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { hasAccess, type Tier } from "@/lib/tiers";
import { formatVnd, PRODUCT_INFO, type ProductCode } from "@/lib/pricing";
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

  // Tier nào đang có đơn "pending_payment" — dùng để phân biệt nội dung
  // "chưa mua" (mời nâng cấp) với nội dung "đã đăng ký, đang chờ admin xác
  // nhận chuyển khoản" (không mời mua lại, chỉ báo trạng thái).
  const pendingProducts = new Set((pendingOrders ?? []).map((o) => o.product));

  const bank = {
    accountName: process.env.BANK_ACCOUNT_NAME ?? "",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "",
    bankName: process.env.BANK_NAME ?? "",
  };

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
              <div key={o.order_code} className="text-sm text-slate-700 mb-3 last:mb-0">
                <div className="font-semibold">
                  {o.order_code} — {PRODUCT_INFO[o.product as ProductCode]?.name ?? o.product.toUpperCase()} —{" "}
                  {formatVnd(o.amount)}
                </div>
                <div className="text-slate-500">
                  Nội dung sẽ tự mở khoá ngay khi admin xác nhận đã nhận tiền — không cần làm gì
                  thêm, chỉ cần quay lại trang này sau.
                </div>
              </div>
            ))}
            {bank.accountNumber ? (
              <dl className="text-sm space-y-1 mt-4 pt-4 border-t border-amber-200">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Chủ tài khoản</dt>
                  <dd className="font-medium">{bank.accountName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Số tài khoản</dt>
                  <dd className="font-medium">{bank.accountNumber}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Ngân hàng</dt>
                  <dd className="font-medium">{bank.bankName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Nội dung CK</dt>
                  <dd className="font-semibold">{pendingOrders[0].order_code}</dd>
                </div>
              </dl>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-4">
          {(items ?? []).map((item) => {
            const requiredTier = item.required_tier as Tier;
            const unlocked = hasAccess(member.tier, requiredTier);
            const awaitingConfirmation = !unlocked && pendingProducts.has(requiredTier);
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
                    <span
                      className={`shrink-0 text-xs px-2 py-1 rounded-full ${
                        awaitingConfirmation
                          ? "bg-amber-500 text-slate-900"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {awaitingConfirmation
                        ? "Đang chờ xác nhận thanh toán"
                        : `Khoá — cần ${requiredTier.toUpperCase()}`}
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
                ) : awaitingConfirmation ? (
                  <p className="text-sm text-slate-500 mt-2">
                    Đã ghi nhận đơn hàng — nội dung sẽ hiện ra ngay khi được xác nhận.
                  </p>
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
