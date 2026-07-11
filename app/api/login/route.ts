import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyPassword, createMemberSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { loginRateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  identifier: z.string().trim().min(3), // số điện thoại hoặc email
  password: z.string().min(1),
});

export async function POST(req: Request) {
  // RULE-08: endpoint login PHẢI có rate limit.
  const ip = getClientIp(req);
  const { success } = await loginRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Quá nhiều lần thử. Vui lòng thử lại sau ít phút." },
      { status: 429 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin." }, { status: 400 });
  }
  const { identifier, password } = parsed.data;

  const db = supabaseAdmin();
  const isEmail = identifier.includes("@");
  const { data: member } = await db
    .from("members")
    .select("id, password_hash")
    .eq(isEmail ? "email" : "phone", identifier)
    .maybeSingle();

  // Thông báo lỗi giống nhau dù sai tài khoản hay sai mật khẩu, tránh lộ
  // việc tài khoản có tồn tại hay không — RULE-11.
  const genericError = () =>
    NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu." }, { status: 401 });

  if (!member) return genericError();

  const ok = await verifyPassword(password, member.password_hash);
  if (!ok) return genericError();

  const token = await createMemberSessionToken(member.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
