import "server-only";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "fsm_session";
const ADMIN_COOKIE = "fsm_admin_session";

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Thiếu AUTH_SECRET trong .env.local");
  return new TextEncoder().encode(secret);
}

// RULE-07: bcrypt, không dùng SHA-256/MD5 cho password.
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Session chỉ chứng minh DANH TÍNH (memberId đã ký, không thể giả mạo).
// KHÔNG lưu tier/must_change_password trong token — hai giá trị này có thể
// đổi bất kỳ lúc nào (admin xác nhận đơn, đổi mật khẩu) nên mỗi trang được
// bảo vệ phải tự đọc lại từ DB, không tin vào claim đã cache trong JWT
// (đúng tinh thần RULE-04: kiểm tra quyền PHẢI ở server, luôn mới nhất).
export type MemberSession = {
  kind: "member";
  memberId: string;
};

export type AdminSession = {
  kind: "admin";
  email: string;
};

export async function createMemberSessionToken(memberId: string) {
  return new SignJWT({ memberId, kind: "member" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(authSecret());
}

export async function createAdminSessionToken(email: string) {
  return new SignJWT({ email, kind: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(authSecret());
}

export async function verifySessionToken<T extends MemberSession | AdminSession>(
  token: string
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, authSecret());
    return payload as unknown as T;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
