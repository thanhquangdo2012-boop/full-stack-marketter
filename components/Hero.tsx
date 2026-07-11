import { CONTAINER } from "@/lib/ui";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-[72px] pb-16">
      <div className={CONTAINER}>
        <span className="inline-block bg-amber-500/15 text-amber-500 px-3.5 py-1.5 rounded-full text-[13px] font-semibold mb-5">
          Dành cho người làm Content, Digital Ads, Marketing - Truyền thông đang bị &quot;ôm&quot;
          quá nhiều việc
        </span>
        <h1 className="text-[28px] sm:text-[38px] font-extrabold leading-[1.28] max-w-[720px] mb-[18px]">
          Không còn hoảng loạn mỗi khi bị giao việc{" "}
          <em className="not-italic text-amber-500">ngoài chuyên môn</em>
        </h1>
        <p className="text-[17px] text-slate-300 max-w-[600px] mb-8">
          Lộ trình Full-stack Marketer là hệ thống tư duy, tài liệu và checklist cho từng mảng
          việc bạn đang bị ép làm — dù JD chỉ ghi đúng một dòng. Không chỉ để đỡ sợ mỗi lần bị
          giao việc lạ, mà để mỗi việc đó trở thành một mảnh ghép năng lực đưa bạn tới vị trí nhìn
          toàn cục — không còn chỉ là người thực thi.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          <a
            href="#pricing"
            className="bg-amber-500 text-slate-900 px-7 py-[15px] rounded-[9px] font-bold text-base no-underline inline-block shadow-[0_8px_20px_rgba(245,158,11,0.25)]"
          >
            Nhận lộ trình ngay
          </a>
          <span className="text-[13px] text-slate-400">
            50 suất đầu tiên giá 399.000đ — hết suất giá tăng lên 499.000đ
          </span>
        </div>
      </div>
    </section>
  );
}
