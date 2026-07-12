import "server-only";
import { supabaseAdmin } from "./supabase";
import { TIERS, type Tier } from "./tiers";

const PRODUCT_TIER: Record<string, Tier> = { mvp2: "mvp2", mvp3: "mvp3", mvp4: "mvp4" };

export type ConfirmOrderResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "already_paid" | "db_error" };

/**
 * Đánh dấu 1 đơn hàng là đã thanh toán + nâng tier thành viên tương ứng.
 * Dùng chung cho cả xác nhận thủ công (/api/admin/confirm-order) và tự
 * động qua webhook SePay — logic nghiệp vụ phải giống hệt nhau dù nguồn
 * xác nhận là ai (RULE-04: quyền/trạng thái luôn tính ở server).
 */
export async function confirmOrder(orderId: string, confirmedBy: string): Promise<ConfirmOrderResult> {
  const db = supabaseAdmin();
  const { data: order } = await db
    .from("orders")
    .select("id, member_id, product, status")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return { ok: false, reason: "not_found" };
  if (order.status === "paid") return { ok: false, reason: "already_paid" };

  const { error: orderError } = await db
    .from("orders")
    .update({
      status: "paid",
      confirmed_at: new Date().toISOString(),
      confirmed_by: confirmedBy,
    })
    .eq("id", order.id);

  if (orderError) {
    console.error("[confirmOrder] update order failed", orderError); // RULE-11
    return { ok: false, reason: "db_error" };
  }

  const targetTier = PRODUCT_TIER[order.product];
  const { data: member } = await db
    .from("members")
    .select("tier")
    .eq("id", order.member_id)
    .maybeSingle();

  // Tier chỉ tăng, không hạ — phòng trường hợp xác nhận nhầm thứ tự.
  if (member && TIERS.indexOf(targetTier) > TIERS.indexOf(member.tier as Tier)) {
    await db.from("members").update({ tier: targetTier }).eq("id", order.member_id);
  }

  return { ok: true };
}
