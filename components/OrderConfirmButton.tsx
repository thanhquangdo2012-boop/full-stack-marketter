"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderConfirmButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/confirm-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Đã xảy ra lỗi.");
        return;
      }
      router.refresh();
    } catch {
      setError("Không kết nối được, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="shrink-0 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Đang xử lý..." : "Xác nhận đã nhận tiền"}
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
