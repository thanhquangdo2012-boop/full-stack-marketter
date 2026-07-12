import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { confirmOrder } from "@/lib/orders";
import { notifyAdminOrderAutoConfirmed, notifyAdminSepayMismatch } from "@/lib/email";

// Payload thật SePay gửi (tài liệu: developer.sepay.vn/en/sepay-webhooks).
// Chỉ khai báo các field ta dùng — payload thật còn nhiều field khác.
type SePayPayload = {
  id: number | string;
  content?: string;
  transferType?: "in" | "out";
  transferAmount?: number;
};

const ORDER_CODE_RE = /FSM-[A-Z0-9]+/i;

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// RULE-02/RULE-04: webhook này tự động mở khoá sản phẩm trả phí — PHẢI xác
// thực chặt (HMAC-SHA256 trên raw body, không phải API key đơn giản), theo
// đúng khuyến nghị "Recommended" trong tài liệu SePay. Không được parse
// JSON trước khi lấy raw body vì chữ ký ký trên bytes gốc, parse lại rồi
// serialize sẽ lệch (khác escape Unicode/khoảng trắng).
function verifySignature(rawBody: string, signatureHeader: string | null, timestampHeader: string | null): boolean {
  const secret = process.env.SEPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader || !timestampHeader) return false;

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) return false;
  const ageSeconds = Math.abs(Date.now() / 1000 - timestamp);
  if (ageSeconds > 5 * 60) return false; // chống replay — tài liệu SePay khuyến nghị 5 phút

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(`${timestampHeader}.${rawBody}`).digest("hex");

  return timingSafeEqualStr(expected, signatureHeader);
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-sepay-signature");
  const timestamp = req.headers.get("x-sepay-timestamp");

  if (!verifySignature(rawBody, signature, timestamp)) {
    console.error("[webhooks/sepay] chữ ký không hợp lệ — từ chối"); // RULE-11
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as SePayPayload;

  // Chỉ quan tâm tiền VÀO tài khoản, bỏ qua giao dịch ra.
  if (payload.transferType !== "in") {
    return NextResponse.json({ success: true });
  }

  const match = payload.content?.match(ORDER_CODE_RE);
  if (!match) {
    // Giao dịch vào tài khoản nhưng không khớp định dạng mã đơn — có thể là
    // tiền không liên quan tới hệ thống này. Không phải lỗi của SePay, trả
    // success để họ không retry vô ích.
    return NextResponse.json({ success: true });
  }
  const orderCode = match[0].toUpperCase();

  const db = supabaseAdmin();
  const { data: order } = await db
    .from("orders")
    .select("id, order_code, member_id, product, amount, status")
    .eq("order_code", orderCode)
    .maybeSingle();

  if (!order) {
    console.error(`[webhooks/sepay] không tìm thấy đơn hàng cho mã ${orderCode}`);
    return NextResponse.json({ success: true });
  }

  if (order.status === "paid") {
    // Đã xử lý trước đó (admin xác nhận tay, hoặc SePay gửi lại do retry) —
    // idempotent, không làm gì thêm.
    return NextResponse.json({ success: true });
  }

  // Không tự động xác nhận nếu số tiền không khớp — an toàn hơn để admin tự
  // kiểm tra tay qua /admin/orders thay vì rủi ro mở khoá sai giá.
  if (payload.transferAmount !== order.amount) {
    console.error(
      `[webhooks/sepay] số tiền không khớp cho đơn ${orderCode}: nhận ${payload.transferAmount}, cần ${order.amount}`
    );
    await notifyAdminSepayMismatch({
      orderCode,
      expectedAmount: order.amount,
      receivedAmount: payload.transferAmount ?? 0,
    });
    return NextResponse.json({ success: true });
  }

  const result = await confirmOrder(order.id, "sepay-webhook");
  if (result.ok) {
    await notifyAdminOrderAutoConfirmed({ orderCode });
  }

  return NextResponse.json({ success: true });
}
