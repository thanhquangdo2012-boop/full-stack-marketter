import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";
import { registerRateLimit, getClientIp } from "@/lib/rate-limit";
import { PRODUCT_INFO, getMvp3Price, generateOrderCode, formatVnd } from "@/lib/pricing";

// Mật khẩu mặc định giống nhau cho mọi tài khoản mới — điểm yếu đã biết,
// bắt buộc đi kèm must_change_password = true. Xem CLAUDE.md mục 4.
const DEFAULT_PASSWORD = "123456789";

const bodySchema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ"),
  email: z.string().trim().email("Email không hợp lệ"),
  product: z.enum(["mvp2", "mvp3", "mvp4"]),
});

export async function POST(req: Request) {
  try {
    return await handleRegister(req);
  } catch (err) {
    // TẠM THỜI để chẩn đoán lỗi 500 rỗng trên Vercel — xoá try/catch này
    // sau khi xác định nguyên nhân, khôi phục thông báo chung theo RULE-11.
    console.error("[api/register] unhandled", err);
    return NextResponse.json(
      { debugError: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

async function handleRegister(req: Request) {
  // RULE-08/RULE-09: rate limit bằng Redis trước khi xử lý bất kỳ logic nào.
  const ip = getClientIp(req);
  const { success } = await registerRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Quá nhiều lần thử. Vui lòng thử lại sau ít phút." },
      { status: 429 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." },
      { status: 400 }
    );
  }
  const { fullName, phone, email, product } = parsed.data;

  const db = supabaseAdmin();

  // Tra trùng theo phone rồi email riêng, tránh ghép chuỗi filter thủ công
  // (an toàn hơn khi build filter string từ input người dùng).
  const { data: existingByPhone } = await db
    .from("members")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  const existing =
    existingByPhone ??
    (await db.from("members").select("id").eq("email", email).maybeSingle()).data;

  let memberId: string;

  if (existing) {
    memberId = existing.id;
    await db
      .from("members")
      .update({ interested_product: product })
      .eq("id", memberId);
  } else {
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);
    const { data: created, error } = await db
      .from("members")
      .insert({
        full_name: fullName,
        phone,
        email,
        password_hash: passwordHash,
        tier: "free",
        must_change_password: true,
        interested_product: product,
      })
      .select("id")
      .single();

    if (error || !created) {
      console.error("[api/register] insert member failed", error); // RULE-11: chỉ log server
      return NextResponse.json(
        { error: "Đã xảy ra lỗi, vui lòng thử lại." },
        { status: 500 }
      );
    }
    memberId = created.id;
  }

  // Giá luôn tính lại ở server, không tin số liệu từ client — RULE-04.
  let amount = PRODUCT_INFO[product].defaultPrice;
  if (product === "mvp3") {
    const { count } = await db
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("product", "mvp3")
      .eq("status", "paid");
    amount = getMvp3Price(count ?? 0);
  }

  const orderCode = generateOrderCode();
  const { error: orderError } = await db.from("orders").insert({
    order_code: orderCode,
    member_id: memberId,
    product,
    amount,
    status: "pending_payment",
    bank_transfer_note: orderCode,
  });

  if (orderError) {
    console.error("[api/register] insert order failed", orderError);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi, vui lòng thử lại." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orderCode,
    amountFormatted: formatVnd(amount),
    productName: PRODUCT_INFO[product].name,
    loginId: phone,
    defaultPassword: DEFAULT_PASSWORD,
    bank: {
      accountName: process.env.BANK_ACCOUNT_NAME ?? "",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "",
      bankName: process.env.BANK_NAME ?? "",
    },
    zaloContact: process.env.NEXT_PUBLIC_ZALO_CONTACT ?? "",
  });
}
