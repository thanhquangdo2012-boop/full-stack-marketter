export const TIERS = ["free", "mvp2", "mvp3", "mvp4"] as const;
export type Tier = (typeof TIERS)[number];

/**
 * RULE-04: kiểm tra quyền truy cập PHẢI chạy ở server (API route / Server
 * Component), không được chỉ dựa vào state ở client. Hàm này chỉ nên gọi
 * từ code chạy trên server.
 */
export function hasAccess(memberTier: Tier, requiredTier: Tier): boolean {
  return TIERS.indexOf(memberTier) >= TIERS.indexOf(requiredTier);
}

export function isValidTier(value: string): value is Tier {
  return (TIERS as readonly string[]).includes(value);
}
