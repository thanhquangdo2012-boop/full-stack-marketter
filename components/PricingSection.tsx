import Link from "next/link";
import { CONTAINER } from "@/lib/ui";
import { formatVnd, getMvp3PriceLadder } from "@/lib/pricing";

type Props = {
  paidCount: number;
};

export default function PricingSection({ paidCount }: Props) {
  const ladder = getMvp3PriceLadder();
  const activeIndex = ladder.findIndex((r) => paidCount < r.maxPaidCount);
  const currentPrice = ladder[activeIndex]?.price ?? 599000;

  return (
    <section id="pricing" className="bg-slate-900 text-white py-14">
      <div className={CONTAINER}>
        <h2 className="text-[22px] sm:text-[26px] font-extrabold text-center mb-2.5 text-white">
          Nhận lộ trình hôm nay
        </h2>
        <p className="max-w-[560px] mx-auto mb-8 text-[15px] text-slate-400 text-center">
          Giá đợt đầu, tăng dần khi số lượng đăng ký tăng lên
        </p>

        <div className="max-w-[480px] mx-auto bg-slate-800 border border-white/10 rounded-2xl p-7 sm:p-9 text-center">
          <div className="text-[13px] text-amber-500 font-semibold mb-4">
            Vì tự vận hành và hỗ trợ nhóm kín một mình, mỗi đợt chỉ nhận đủ số lượng có thể trả lời
            hết — hết đợt thì giá tăng, không mở tràn lan
          </div>

          <div className="rounded-[10px] overflow-hidden bg-white/5 border border-white/10 mb-7">
            {ladder.map((row, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={row.label}
                  className={`flex justify-between px-[18px] py-3 text-[13px] ${
                    i !== ladder.length - 1 ? "border-b border-white/10" : ""
                  } ${isActive ? "bg-amber-500/10 text-white font-bold" : "text-slate-300"}`}
                >
                  <span>{row.label}</span>
                  <span className={isActive ? "text-amber-500" : ""}>
                    {formatVnd(row.price)}
                    {isActive ? " — đang mở" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[42px] font-extrabold text-white">{formatVnd(currentPrice)}</div>
          <div className="text-[13px] text-slate-400 mb-6 mt-2">
            Một lần duy nhất, dùng lại nhiều lần — không phải phí định kỳ
          </div>

          <ul className="text-left mb-6 space-y-1.5">
            {[
              "Quiz chẩn đoán lộ trình riêng theo công việc thực tế",
              "Danh sách nguồn học đã chọn lọc theo từng mảng việc",
              "Bộ tiêu chí tự đánh giá kết quả công việc",
              "Checklist kiểm tra trước khi nộp",
              "3 bonus đi kèm ở trên",
            ].map((li) => (
              <li key={li} className="flex gap-2 text-sm text-slate-200 py-1.5">
                <span className="text-amber-500 font-bold">✓</span>
                {li}
              </li>
            ))}
          </ul>

          <Link
            href="/checkout?product=mvp3"
            className="block text-center bg-amber-500 text-slate-900 font-bold py-[15px] rounded-[9px] no-underline"
          >
            Giữ suất giá {formatVnd(currentPrice)}
          </Link>

          <div className="text-xs text-slate-400 mt-4">
            Hoàn tiền trong 7 ngày nếu dùng thử mà không thấy rõ mình cần học gì tiếp theo — rủi ro
            duy nhất khi thử là 7 ngày chờ đợi, không phải mất tiền. Đã mua bộ công cụ số trước đó
            sẽ được trừ thẳng vào giá này.
          </div>
        </div>
      </div>
    </section>
  );
}
