export type ProductCode = "mvp2" | "mvp3" | "mvp4";

export const PRODUCT_INFO: Record<
  ProductCode,
  { name: string; defaultPrice: number; requiredTier: "mvp2" | "mvp3" | "mvp4" }
> = {
  mvp2: {
    name: "Bộ công cụ số nhỏ",
    defaultPrice: 149000,
    requiredTier: "mvp2",
  },
  mvp3: {
    name: "Lộ trình Full-stack Marketer",
    defaultPrice: 399000,
    requiredTier: "mvp3",
  },
  mvp4: {
    name: "Gói nâng cao / tư vấn 1-1 (VIP)",
    defaultPrice: 2000000,
    requiredTier: "mvp4",
  },
};

// Giá MVP3 tăng dần theo mốc số người đã mua — đúng cơ chế khan hiếm
// trong Grand Slam Offer, xem báo cáo ngách mục 8.2.
const MVP3_PRICE_TIERS = [
  { maxPaidCount: 50, price: 399000, label: "50 người đầu tiên" },
  { maxPaidCount: 150, price: 499000, label: "Từ người thứ 51 - 150" },
  { maxPaidCount: Infinity, price: 599000, label: "Sau mốc 150 người" },
];

export function getMvp3Price(paidCount: number): number {
  const tier = MVP3_PRICE_TIERS.find((t) => paidCount < t.maxPaidCount);
  return tier ? tier.price : 599000;
}

export function getMvp3PriceLadder() {
  return MVP3_PRICE_TIERS;
}

export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

export function generateOrderCode(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FSM-${rand}`;
}
