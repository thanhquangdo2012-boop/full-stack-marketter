"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Đã xảy ra lỗi, vui lòng thử lại.");
        return;
      }
      router.push("/admin/orders");
      router.refresh();
    } catch {
      setError("Không kết nối được, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8">
      <h1 className="text-xl font-bold mb-6">Đăng nhập Admin</h1>
      <div className="space-y-4 mb-6">
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
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          />
        </div>
      </div>
      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Đang xử lý..." : "Đăng nhập"}
      </button>
    </form>
  );
}
