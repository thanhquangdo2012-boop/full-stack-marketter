"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Props = {
  forced: boolean;
};

export default function ChangePasswordForm({ forced }: Props) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Mật khẩu mới cần ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
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
      <h1 className="text-xl font-bold mb-1">Đổi mật khẩu</h1>
      <p className="text-sm text-slate-500 mb-6">
        {forced
          ? "Đây là lần đăng nhập đầu tiên bằng mật khẩu mặc định — bạn cần đổi mật khẩu trước khi tiếp tục."
          : "Đặt mật khẩu mới cho tài khoản của bạn."}
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="newPassword">
            Mật khẩu mới
          </label>
          <input
            id="newPassword"
            name="new-password"
            type="password"
            autoComplete="new-password"
            placeholder="Ít nhất 8 ký tự"
            required
            autoFocus
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
            Nhập lại mật khẩu mới
          </label>
          <input
            id="confirmPassword"
            name="new-password-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Gõ lại mật khẩu mới"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Đang xử lý..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
