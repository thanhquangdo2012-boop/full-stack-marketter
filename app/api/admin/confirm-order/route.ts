import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/session";
import { TIERS, type Tier } from "@/lib/tiers";

const bodySchema = z.object({ orderId: z.string().uuid() });

const PRODUCT_TIER: Record<string, Tier> = { mvp2: "mvp2", mvp3: "mvp3", mvp4: "mvp4" };

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Vui lòng đăng nhập admin." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: order } = await db
    .from("orders")
    .select("id, member_id, product, status")
    .eq("id", parsed.data.orderId)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
  }
  if (order.status === "paid") {
    return NextResponse.json({ error: "Đơn hàng đã được xác nhận trước đó." }, { status: 400 });
  }

  const { error: orderError } = await db
    .from("orders")
    .update({
      status: "paid",
      confirmed_at: new Date().toISOString(),
      confirmed_by: admin.email,
    })
    .eq("id", order.id);

  if (orderError) {
    console.error("[api/admin/confirm-order] update order failed", orderError); // RULE-11
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }

  const targetTier = PRODUCT_TIER[order.product];
  const { data: member } = await db
    .from("members")
    .select("tier")
    .eq("id", order.member_id)
    .maybeSingle();

  // Tier chỉ tăng, không hạ — phòng trường hợp admin xác nhận nhầm thứ tự.
  if (member && TIERS.indexOf(targetTier) > TIERS.indexOf(member.tier as Tier)) {
    await db.from("members").update({ tier: targetTier }).eq("id", order.member_id);
  }

  return NextResponse.json({ ok: true });
}
