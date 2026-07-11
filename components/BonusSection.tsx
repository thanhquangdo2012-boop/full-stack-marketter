import { CONTAINER } from "@/lib/ui";

const BONUSES = [
  {
    badge: "Bonus 1",
    title: "Bộ mẫu tờ trình & kịch bản họp",
    desc: "Mẫu tờ trình xin nguồn lực và kịch bản họp với cấp trên, dùng được ngay.",
  },
  {
    badge: "Bonus 2",
    title: "Vé vào nhóm kín",
    desc: "Tham gia cộng đồng, có buổi hỏi đáp định kỳ cùng những người cùng hoàn cảnh.",
  },
  {
    badge: "Bonus 3",
    title: "Cập nhật 6 tháng",
    desc: "Tài liệu được cập nhật theo xu hướng mới trong 6 tháng kể từ ngày mua.",
  },
];

export default function BonusSection() {
  return (
    <section className="py-14">
      <div className={CONTAINER}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-center mb-8">
          Tặng kèm khi đăng ký
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {BONUSES.map((b) => (
            <div key={b.badge} className="border border-slate-200 rounded-xl p-5 text-center">
              <span className="inline-block bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md mb-2.5">
                {b.badge}
              </span>
              <h4 className="text-sm font-bold mb-1.5">{b.title}</h4>
              <p className="text-[13px] text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
