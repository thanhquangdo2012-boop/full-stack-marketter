"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_MEMBER_PASSWORD } from "@/lib/constants";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Đến từ /checkout khi SĐT/email đã có tài khoản — tự điền sẵn để khách
  // chỉ cần bấm Đăng nhập, đỡ phải gõ lại từ đầu.
  const [identifier, setIdentifier] = useState(() => searchParams.get("identifier") ?? "");
  const prefilled = Boolean(searchParams.get("identifier"));
  // Chỉ điền sẵn mật khẩu khi server đã xác nhận (qua DB, xem
  // app/api/register/route.ts) tài khoản này CHƯA từng đổi mật khẩu — nếu
  // khách đã đổi mật khẩu thật, ta không biết mật khẩu đó nên không điền.
  const suggestDefault = searchParams.get("suggestDefault") === "1";
  const [password, setPassword] = useState(() => (suggestDefault ? DEFAULT_MEMBER_PASSWORD : ""));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Không kết nối được, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8">
      <h1 className="text-xl font-bold mb-1">Đăng nhập</h1>
      <p className="text-sm text-slate-500 mb-6">
        Dùng số điện thoại hoặc email đã đăng ký khi mua sản phẩm.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="identifier">
            Số điện thoại hoặc email
          </label>
          <input
            id="identifier"
            name="username"
            autoComplete="username"
            placeholder="0987654321 hoặc email@vidu.com"
            required
            autoFocus={!prefilled}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            name="current-password"
            type="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            required
            autoFocus={prefilled && !suggestDefault}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        autoFocus={suggestDefault}
        className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Đang xử lý..." : "Đăng nhập"}
      </button>

      {suggestDefault ? (
        <p className="text-xs text-slate-500 mt-4 text-center">
          Đã tự điền mật khẩu mặc định vì tài khoản này chưa từng đổi mật khẩu — bấm{" "}
          <strong className="text-slate-700">Đăng nhập</strong> để tiếp tục.
        </p>
      ) : (
        <p className="text-xs text-slate-500 mt-4 text-center">
          Mới đăng ký lần đầu và chưa từng đổi mật khẩu? Dùng mật khẩu mặc định{" "}
          <strong className="text-slate-700">123456789</strong> — hệ thống sẽ bắt bạn đặt mật khẩu
          mới ngay sau khi đăng nhập.
        </p>
      )}
    </form>
  );
}
