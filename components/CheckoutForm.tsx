"use client";

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
  bank: { accountName: string; accountNumber: string; bankName: string };
  zaloContact: string;
};

export default function CheckoutForm({ product, productName, priceFormatted }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegisterResponse | null>(null);

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
      setResult(data as RegisterResponse);
    } catch {
      setError("Không kết nối được, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-bold mb-2">Cảm ơn bạn đã đăng ký!</h2>
        <p className="text-sm text-slate-500 mb-6">
          Mã đơn hàng <span className="font-semibold text-slate-800">{result.orderCode}</span>{" "}
          — {result.productName} — {result.amountFormatted}
        </p>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 mb-6">
          <div className="text-xs font-bold uppercase tracking-wide text-amber-600 mb-3">
            Thông tin chuyển khoản
          </div>
          {result.bank.accountNumber ? (
            <dl className="text-sm space-y-1.5">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Chủ tài khoản</dt>
                <dd className="font-medium">{result.bank.accountName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Số tài khoản</dt>
                <dd className="font-medium">{result.bank.accountNumber}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Ngân hàng</dt>
                <dd className="font-medium">{result.bank.bankName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Nội dung CK</dt>
                <dd className="font-semibold">{result.orderCode}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-500">
              Thông tin chuyển khoản đang được cập nhật — vui lòng liên hệ Zalo bên dưới để được
              hướng dẫn thanh toán.
            </p>
          )}
          <p className="text-xs text-slate-500 mt-3">
            Vui lòng chuyển khoản đúng nội dung <strong>{result.orderCode}</strong> để được xác
            nhận nhanh.
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 mb-6">
          <p className="text-sm text-slate-800 mb-1">
            Tài khoản đăng nhập: <strong>{result.loginId}</strong>
          </p>
          <p className="text-sm text-slate-800 mb-1">
            Mật khẩu mặc định: <strong>{result.defaultPassword}</strong>
          </p>
          <p className="text-xs text-amber-700 mt-2">
            Vui lòng đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/login"
            className="flex-1 text-center bg-slate-900 text-white font-semibold py-3 rounded-lg"
          >
            Đăng nhập ngay
          </Link>
          {result.zaloContact ? (
            <a
              href={result.zaloContact}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border border-slate-200 font-semibold py-3 rounded-lg"
            >
              Liên hệ Zalo hỗ trợ
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
