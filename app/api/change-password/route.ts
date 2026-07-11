import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";
import { getMemberSession } from "@/lib/session";

const bodySchema = z.object({
  newPassword: z.string().min(8, "Mật khẩu mới cần ít nhất 8 ký tự"),
});

export async function POST(req: Request) {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Vui lòng đăng nhập lại." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Không hợp lệ." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  const db = supabaseAdmin();
  const { error } = await db
    .from("members")
    .update({ password_hash: passwordHash, must_change_password: false })
    .eq("id", session.memberId);

  if (error) {
    console.error("[api/change-password] update failed", error); // RULE-11
    return NextResponse.json({ error: "Đã xảy ra lỗi, vui lòng thử lại." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
