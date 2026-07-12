import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword, createMemberSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { registerRateLimit, getClientIp } from "@/lib/rate-limit";
import { PRODUCT_INFO, getMvp3Price, generateOrderCode, formatVnd } from "@/lib/pricing";
import { DEFAULT_MEMBER_PASSWORD } from "@/lib/constants";
import { notifyAdminNewOrder } from "@/lib/email";

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
    // RULE-11: log chi tiết ở server, KHÔNG trả chi tiết lỗi (message/stack)
    // về client — tránh lộ cấu trúc hệ thống.
    console.error("[api/register] unhandled", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi, vui lòng thử lại." },
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
  let isNewMember: boolean;
  // true khi tài khoản (mới hoặc có sẵn) vẫn đang dùng mật khẩu mặc định
  // chưa đổi — dùng để quyết định có gợi ý điền sẵn mật khẩu ở /login hay
  // không. KHÔNG suy ra giá trị này từ input của request, luôn đọc lại từ
  // DB (RULE-04).
  let stillDefaultPassword: boolean;

  if (existing) {
    // Tài khoản đã tồn tại — KHÔNG auto-login ở đây. Ai đó chỉ cần biết một
    // SĐT/email đã đăng ký là có thể gõ vào form này; nếu tự động đăng nhập
    // luôn thì đây thành lỗ hổng chiếm quyền tài khoản người khác (RULE-02:
    // đổi trạng thái/đăng nhập phải qua xác thực thật, không phải qua form
    // công khai này). Người dùng thật phải tự /login bằng mật khẩu của họ —
    // ta chỉ được phép GỢI Ý điền sẵn mật khẩu mặc định (không tự đăng
    // nhập), và chỉ khi xác nhận qua DB rằng họ chưa từng đổi mật khẩu.
    memberId = existing.id;
    isNewMember = false;
    const { data: updated } = await db
      .from("members")
      .update({ interested_product: product })
      .eq("id", memberId)
      .select("must_change_password")
      .single();
    stillDefaultPassword = updated?.must_change_password ?? false;
  } else {
    const passwordHash = await hashPassword(DEFAULT_MEMBER_PASSWORD);
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
    isNewMember = true;
    stillDefaultPassword = true;
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

  // Best-effort — tự nuốt lỗi bên trong, không được làm hỏng response đăng
  // ký thật của khách nếu Resend lỗi/chưa cấu hình.
  await notifyAdminNewOrder({
    orderCode,
    productName: PRODUCT_INFO[product].name,
    amountFormatted: formatVnd(amount),
    customerName: fullName,
    customerPhone: phone,
    customerEmail: email,
    isNewMember,
  });

  const body = {
    orderCode,
    amountFormatted: formatVnd(amount),
    productName: PRODUCT_INFO[product].name,
    loginId: phone,
    defaultPassword: DEFAULT_MEMBER_PASSWORD,
    isNewMember,
    stillDefaultPassword,
    bank: {
      accountName: process.env.BANK_ACCOUNT_NAME ?? "",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "",
      bankName: process.env.BANK_NAME ?? "",
    },
    zaloContact: process.env.NEXT_PUBLIC_ZALO_CONTACT ?? "",
  };

  const res = NextResponse.json(body);

  // Chỉ auto-login tài khoản VỪA tạo (xem lý do ở nhánh existing/else phía
  // trên). Dashboard sẽ tự chuyển hướng qua /change-password trước vì
  // must_change_password = true, đúng luồng bảo mật hiện có.
  if (isNewMember) {
    const token = await createMemberSessionToken(memberId);
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return res;
}
