import "server-only";
import { supabaseAdmin } from "./supabase";

/**
 * Số lượng MVP3 đã bán, dùng để xác định mốc giá hiện tại (RULE-04: tính ở
 * server). Chỉ ảnh hưởng tới hiển thị giá/mốc khan hiếm — nếu Supabase lỗi
 * tạm thời, trang bán hàng vẫn phải hiển thị được (fallback về 0, tức giá
 * thấp nhất) thay vì sập cả trang.
 */
export async function getPaidMvp3Count(): Promise<number> {
  try {
    const db = supabaseAdmin();
    const { count, error } = await db
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("product", "mvp3")
      .eq("status", "paid");

    if (error) {
      console.error("[getPaidMvp3Count] query error", error);
      return 0;
    }
    return count ?? 0;
  } catch (err) {
    console.error("[getPaidMvp3Count] unexpected error", err);
    return 0;
  }
}
