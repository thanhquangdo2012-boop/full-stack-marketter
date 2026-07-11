import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminCredentials } from "@/lib/admin-auth";
import { createAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { adminLoginRateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { success } = await adminLoginRateLimit.limit(ip);
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

  const ok = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!ok) {
    return NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu." }, { status: 401 });
  }

  const token = await createAdminSessionToken(parsed.data.email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
