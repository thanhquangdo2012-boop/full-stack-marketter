import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client server-side dùng SERVICE_ROLE_KEY, bỏ qua RLS.
 * Đây là đường DUY NHẤT được phép đọc/ghi các bảng nhạy cảm
 * (members, orders, quiz_results) — xem RULE-01/RULE-03/RULE-10.
 * Import "server-only" chặn cứng việc file này lọt vào bundle client.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
