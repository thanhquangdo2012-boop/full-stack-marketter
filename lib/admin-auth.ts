import "server-only";
import { verifyPassword } from "./auth";

/**
 * Chỉ một tài khoản admin duy nhất (Đỗ Thanh Quang), cấu hình qua env —
 * không lưu trong bảng members. ADMIN_PASSWORD_HASH tạo bằng bcrypt, xem
 * README.md phần thiết lập.
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminHash) return false;
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) return false;
  return verifyPassword(password, adminHash);
}
