import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/session";
import { confirmOrder } from "@/lib/orders";

const bodySchema = z.object({ orderId: z.string().uuid() });

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

  const result = await confirmOrder(parsed.data.orderId, admin.email);
  if (!result.ok) {
    const messages: Record<string, string> = {
      not_found: "Không tìm thấy đơn hàng.",
      already_paid: "Đơn hàng đã được xác nhận trước đó.",
      db_error: "Đã xảy ra lỗi, vui lòng thử lại.",
    };
    const status = result.reason === "not_found" ? 404 : result.reason === "db_error" ? 500 : 400;
    return NextResponse.json({ error: messages[result.reason] }, { status });
  }

  return NextResponse.json({ ok: true });
}
