"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CONTAINER } from "@/lib/ui";

type Props = {
  fullName: string;
  tierLabel: string;
};

export default function DashboardNav({ fullName, tierLabel }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className={`${CONTAINER} flex items-center justify-between py-4`}>
        <div className="flex items-center gap-6">
          <span className="font-extrabold">
            Full-stack <span className="text-amber-600">Marketer</span>
          </span>
          <div className="hidden sm:flex gap-4 text-sm text-slate-500">
            <Link href="/dashboard">Tổng quan</Link>
            <Link href="/upgrade">Nâng cấp gói</Link>
            <Link href="/change-password">Đổi mật khẩu</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600">
            {tierLabel}
          </span>
          <span className="text-sm text-slate-500 hidden sm:inline">{fullName}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}
