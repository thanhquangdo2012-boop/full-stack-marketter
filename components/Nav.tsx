import Link from "next/link";
import { CONTAINER } from "@/lib/ui";

export default function Nav() {
  return (
    <nav className="border-b border-slate-200 py-[18px]">
      <div className={`${CONTAINER} flex justify-between items-center gap-4`}>
        <div className="font-extrabold text-lg tracking-tight">
          Full-stack <span className="text-amber-600">Marketer</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-slate-600 hover:text-slate-900 font-semibold text-sm no-underline"
          >
            Đăng nhập
          </Link>
          <a
            href="#pricing"
            className="bg-slate-900 text-white px-[18px] py-[9px] rounded-lg font-semibold text-sm no-underline whitespace-nowrap"
          >
            Nhận lộ trình
          </a>
        </div>
      </div>
    </nav>
  );
}
