import { CONTAINER } from "@/lib/ui";

export default function Nav() {
  return (
    <nav className="border-b border-slate-200 py-[18px]">
      <div className={`${CONTAINER} flex justify-between items-center`}>
        <div className="font-extrabold text-lg tracking-tight">
          Full-stack <span className="text-amber-600">Marketer</span>
        </div>
        <a
          href="#pricing"
          className="bg-slate-900 text-white px-[18px] py-[9px] rounded-lg font-semibold text-sm no-underline"
        >
          Nhận lộ trình
        </a>
      </div>
    </nav>
  );
}
