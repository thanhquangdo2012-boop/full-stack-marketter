"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";

type Props = {
  product: "mvp2" | "mvp3" | "mvp4";
  productName: string;
  priceFormatted: string;
};

type RegisterResponse = {
  orderCode: string;
  amountFormatted: string;
  productName: string;
  loginId: string;
  defaultPassword: string;
  isNewMember: boolean;
  bank: { accountName: string; accountNumber: string; bankName: string };
  zaloContact: string;
};

export default function CheckoutForm({ product, productName, priceFormatted }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Chỉ dùng khi tài khoản ĐÃ TỒN TẠI từ trước (không auto-login được) —
  // trường hợp tài khoản mới sẽ chuyển thẳng sang /dashboard, không hiện gì
  // ở đây cả.
  const [existingAccountNotice, setExistingAccountNotice] = useState<RegisterResponse | null>(
    null
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^(0|\+84)\d{9,10}$/.test(phone.trim())) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Email không hợp lệ.");
      return;
    }
    if (fullName.trim().length < 2) {
      setError("Vui lòng nhập họ tên.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, email, product }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      const result = data as RegisterResponse;
      if (result.isNewMember) {
        // Server đã set session cookie — vào thẳng dashboard. Nếu chưa đổi
        // mật khẩu, /dashboard tự chuyển hướng sang /change-password trước.
        router.push("/dashboard");
        router.refresh();
      } else {
        // Tài khoản có sẵn — KHÔNG auto-login (xem ghi chú bảo mật trong
        // app/api/register/route.ts), mời họ tự đăng nhập bằng mật khẩu thật.
        setExistingAccountNotice(result);
      }
    } catch {
      setError("Không kết nối được, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (existingAccountNotice) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-bold mb-2">Số điện thoại/email này đã có tài khoản</h2>
        <p className="text-sm text-slate-500 mb-6">
          Đơn hàng mới <span className="font-semibold text-slate-800">
            {existingAccountNotice.orderCode}
          </span>{" "}
          — {existingAccountNotice.productName} — {existingAccountNotice.amountFormatted} đã được
          ghi nhận cho tài khoản này. Vui lòng đăng nhập bằng mật khẩu bạn đã đặt để xem thông tin
          chuyển khoản và theo dõi đơn hàng trong dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/login?identifier=${encodeURIComponent(existingAccountNotice.loginId)}`}
            className="flex-1 text-center bg-slate-900 text-white font-semibold py-3 rounded-lg"
          >
            Đăng nhập
          </Link>
          {existingAccountNotice.zaloContact ? (
            <a
              href={existingAccountNotice.zaloContact}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border border-slate-200 font-semibold py-3 rounded-lg"
            >
              Quên mật khẩu? Liên hệ Zalo
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8">
      <h2 className="text-xl font-bold mb-1">Giữ suất — {productName}</h2>
      <p className="text-sm text-slate-500 mb-6">Giá hiện tại: {priceFormatted}</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="fullName">
            Họ tên
          </label>
          <input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Số điện thoại
          </label>
          <input
            id="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Đang xử lý..." : "Giữ suất ngay"}
      </button>
    </form>
  );
}
