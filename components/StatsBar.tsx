import { CONTAINER } from "@/lib/ui";

const STATS = [
  { number: "4", label: "nỗi sợ được giải quyết" },
  { number: "5", label: "mảnh ghép năng lực" },
  { number: "50", label: "suất đầu tiên giá 399k" },
  { number: "7", label: "ngày hoàn tiền" },
];

export default function StatsBar() {
  return (
    <div className="bg-slate-50 border-b border-slate-200 py-8">
      <div className={CONTAINER}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-slate-900">{s.number}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
