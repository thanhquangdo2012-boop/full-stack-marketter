import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { formatVnd } from "@/lib/pricing";
import { CONTAINER } from "@/lib/ui";
import OrderConfirmButton from "@/components/OrderConfirmButton";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  order_code: string;
  product: string;
  amount: number;
  status: string;
  bank_transfer_note: string | null;
  created_at: string;
  members: { full_name: string; phone: string; email: string } | null;
};

export default async function AdminOrdersPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const db = supabaseAdmin();
  const { data: orders } = await db
    .from("orders")
    .select("id, order_code, product, amount, status, bank_transfer_note, created_at, members(full_name, phone, email)")
    .order("created_at", { ascending: false });

  const rows = (orders ?? []) as unknown as OrderRow[];
  const pending = rows.filter((o) => o.status === "pending_payment");
  const paid = rows.filter((o) => o.status === "paid");

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 py-4">
        <div className={`${CONTAINER} flex items-center justify-between`}>
          <span className="font-extrabold">
            Full-stack <span className="text-amber-600">Marketer</span> — Admin
          </span>
          <span className="text-sm text-slate-500">{admin.email}</span>
        </div>
      </nav>

      <main className={`${CONTAINER} py-10`}>
        <h1 className="text-xl font-bold mb-6">
          Đơn hàng chờ xác nhận ({pending.length})
        </h1>
        <div className="space-y-3 mb-12">
          {pending.map((o) => (
            <div
              key={o.id}
              className="rounded-xl border border-amber-200 bg-amber-50 p-5 flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-semibold">
                  {o.order_code} — {o.product.toUpperCase()} — {formatVnd(o.amount)}
                </div>
                <div className="text-sm text-slate-600">
                  {o.members?.full_name} — {o.members?.phone} — {o.members?.email}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(o.created_at).toLocaleString("vi-VN")}
                </div>
              </div>
              <OrderConfirmButton orderId={o.id} />
            </div>
          ))}
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500">Không có đơn nào đang chờ.</p>
          ) : null}
        </div>

        <h2 className="text-lg font-bold mb-4">Đã xác nhận ({paid.length})</h2>
        <div className="space-y-2">
          {paid.map((o) => (
            <div
              key={o.id}
              className="rounded-lg border border-slate-200 bg-white p-4 text-sm flex justify-between"
            >
              <span>
                {o.order_code} — {o.product.toUpperCase()} — {formatVnd(o.amount)} —{" "}
                {o.members?.full_name}
              </span>
              <span className="text-green-700 font-semibold">Đã thanh toán</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
