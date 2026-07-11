import { CONTAINER } from "@/lib/ui";

export default function FinalPush() {
  return (
    <section className="bg-slate-50 text-center py-14">
      <div className={CONTAINER}>
        <p className="max-w-[600px] mx-auto mb-6 text-base">
          Mỗi tuần trì hoãn là một tuần bạn vẫn đang{" "}
          <strong className="text-amber-700">làm việc của bốn người</strong> mà không có hệ thống
          nào giúp bạn nhẹ hơn. 399.000đ chỉ bằng một buổi cà phê cuối tuần cùng đồng nghiệp — 50
          suất đầu tiên đang mở.
        </p>
        <a
          href="#pricing"
          className="inline-block bg-slate-900 text-white font-bold px-7 py-[15px] rounded-[9px] no-underline"
        >
          Xem lại lộ trình và giữ suất
        </a>
      </div>
    </section>
  );
}
