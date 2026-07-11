import "server-only";
import { cookies } from "next/headers";
import {
  verifySessionToken,
  SESSION_COOKIE_NAME,
  ADMIN_COOKIE_NAME,
  type MemberSession,
  type AdminSession,
} from "./auth";
import { supabaseAdmin } from "./supabase";
import { isValidTier, type Tier } from "./tiers";

export async function getMemberSession(): Promise<MemberSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken<MemberSession>(token);
  return session?.kind === "member" ? session : null;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken<AdminSession>(token);
  return session?.kind === "admin" ? session : null;
}

export type CurrentMember = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  tier: Tier;
  mustChangePassword: boolean;
  interestedProduct: string | null;
};

/**
 * Đọc thông tin thành viên TƯƠI từ DB dựa trên session đã xác thực.
 * Luôn dùng hàm này (không dùng payload trong JWT) để quyết định quyền
 * truy cập nội dung theo tier — RULE-04.
 */
export async function getCurrentMember(): Promise<CurrentMember | null> {
  const session = await getMemberSession();
  if (!session) return null;

  const db = supabaseAdmin();
  const { data } = await db
    .from("members")
    .select("id, full_name, phone, email, tier, must_change_password, interested_product")
    .eq("id", session.memberId)
    .maybeSingle();

  if (!data || !isValidTier(data.tier)) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    phone: data.phone,
    email: data.email,
    tier: data.tier,
    mustChangePassword: data.must_change_password,
    interestedProduct: data.interested_product,
  };
}
